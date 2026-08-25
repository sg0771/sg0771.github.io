# 使用 MSYS2 编译 Android Debug Bridge (adb) 完整实战指南

本指南详细介绍如何在 Windows 环境下基于 **MSYS2** 工具链（UCRT64 / MINGW64）从源码交叉/原生编译生成独立的 `adb.exe` 可执行文件。指南涵盖环境准备、依赖项安装、源码拉取、CMake 工程配置、静态链接打包以及常见编译错误排查。

---

## 目录
1. [环境准备与 MSYS2 配置](#1-环境准备与-msys2-配置)
2. [安装编译工具链与必要依赖](#2-安装编译工具链与必要依赖)
3. [源码获取与工程结构](#3-源码获取与工程结构)
4. [CMake 构建与编译流程](#4-cmake-构建与编译流程)
5. [静态链接与独立运行打包](#5-静态链接与独立运行打包)
6. [功能验证与测试](#6-功能验证与测试)
7. [常见问题与踩坑排查 (FAQ)](#7-常见问题与踩坑排查-faq)

---

## 1. 环境准备与 MSYS2 配置

### 1.1 选择适用的 MSYS2 环境子系统
MSYS2 提供了多种运行环境，建议优先选用 **UCRT64**（基于现代 Windows Universal C Runtime）或 **CLANG64**：

- **UCRT64**（推荐）：链接到 `ucrtbase.dll`，与现代 MSVC 运行时 ABI 兼容性最佳，性能优秀。
- **MINGW64**：链接到传统的 `msvcrt.dll`，兼容旧版 Windows。
- **CLANG64**：使用 LLVM/Clang 工具链，编译速度快，支持高级 LTO。

> 启动对应的终端，如 **MSYS2 UCRT64**。

### 1.2 系统更新
在终端中执行全量包更新：

```bash
pacman -Syu
```
*如提示重启终端，关闭终端重新打开后再次运行 `pacman -Syu` 直至无更新项。*

---

## 2. 安装编译工具链与必要依赖

以 **UCRT64** 环境为例，安装基础编译工具、CMake、Ninja 以及 adb 所需的第三方依赖库：

```bash
pacman -S --needed \
    base-devel \
    mingw-w64-ucrt-x86_64-toolchain \
    mingw-w64-ucrt-x86_64-cmake \
    mingw-w64-ucrt-x86_64-ninja \
    mingw-w64-ucrt-x86_64-git \
    mingw-w64-ucrt-x86_64-protobuf \
    mingw-w64-ucrt-x86_64-brotli \
    mingw-w64-ucrt-x86_64-zstd \
    mingw-w64-ucrt-x86_64-openssl \
    mingw-w64-ucrt-x86_64-lz4 \
    mingw-w64-ucrt-x86_64-libusb
```

> **注意**：如果使用 **MINGW64** 环境，请将包名前缀 `mingw-w64-ucrt-x86_64-` 替换为 `mingw-w64-x86_64-`。

---

## 3. 源码获取与工程结构

由于 Google AOSP 原生构建系统依赖 `Soong` / `Blueprint`（仅原生支持 Linux/macOS 构建），社区维护了通过现代 **CMake** 构建的 `android-tools` 独立工程（移植自 Debian/Arch Linux 及 AOSP 核心模块）。

### 3.1 克隆构建工程

推荐使用经过 Windows/MSYS2 良好适配的 `android-tools` 开源构建树：

```bash
mkdir -p ~/adb-build && cd ~/adb-build
git clone --depth 1 --recursive https://github.com/nmeum/android-tools.git
cd android-tools
```

如果网络受限，可单独配置子模块镜像源拉取：
- `core` (libbase, libdiagnose_usb, etc.)
- `adb` (client, server, adb_utils)
- `boringssl` / `openssl`
- `libusb`

---

## 4. CMake 构建与编译流程

### 4.1 创建构建目录

```bash
mkdir build && cd build
```

### 4.2 执行 CMake 配置

在 MSYS2 UCRT64 终端内，使用 Ninja 生成器进行配置。配置时建议开启 LTO（链接时优化）并指定为 Release 模式：

```bash
cmake -G Ninja .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=./install \
    -DANDROID_TOOLS_BUILD_FASTBOOT=OFF \
    -DANDROID_TOOLS_BUILD_ADB=ON \
    -DANDROID_TOOLS_BUILD_MKBOOTIMG=OFF \
    -DANDROID_TOOLS_BUILD_REPACKBOOTIMG=OFF \
    -DANDROID_TOOLS_BUILD_AVBTOOL=OFF \
    -DBUILD_SHARED_LIBS=OFF
```

#### 核心参数说明：
| 参数 | 说明 |
| :--- | :--- |
| `-G Ninja` | 使用高速并行构建系统 Ninja |
| `-DCMAKE_BUILD_TYPE=Release` | 生成优化版二进制（启用 `-O3` / `-DNDEBUG`） |
| `-DANDROID_TOOLS_BUILD_ADB=ON` | 仅开启 ADB 核心客户端/服务端构建 |
| `-DBUILD_SHARED_LIBS=OFF` | 强制优先编译静态依赖 |

### 4.3 启动多线程编译

```bash
ninja -j$(nproc)
```

编译完成后，构建产物 `adb.exe` 将输出在 `build/` 根目录或 `build/vendor/adb/` 目录下。

---

## 5. 静态链接与独立运行打包

为了脱离 MSYS2 环境并在纯净的 Windows 系统上独立运行 `adb.exe`，需要处理 DLL 依赖。

### 5.1 方案 A：完全静态链接（推荐）

在 CMake 配置中追加 MinGW 静态链接编译标志，避免依赖 `libwinpthread-1.dll`、`libgcc_s_seh-1.dll` 和 `libstdc++-6.dll`：

```bash
cmake -G Ninja .. \
    -DCMAKE_BUILD_TYPE=Release \
    -DANDROID_TOOLS_BUILD_ADB=ON \
    -DCMAKE_EXE_LINKER_FLAGS="-static -static-libgcc -static-libstdc++ -Wl,--as-needed"
ninja
```

### 5.2 方案 B：依赖项动态打包

若采用动态链接，可通过 `ldd` 工具查找并提取所需 DLL：

```bash
# 查看依赖的所有 DLL
ntldd -R adb.exe

# 自动复制所需动态库到输出目录
mkdir -p dist
cp adb.exe dist/
for dll in $(ntldd -R adb.exe | grep -i ucrt64 | awk '{print $3}'); do
    cp "$dll" dist/
done
```

---

## 6. 功能验证与测试

在终端或 Windows 原生 CMD/PowerShell 下验证编译出的 `adb.exe`：

```cmd
:: 1. 检查版本与构建信息
./adb.exe --version

:: 预期输出：
:: Android Debug Bridge version 35.x.x
:: Version <git-commit-hash>
:: Installed as C:\path	odb.exe

:: 2. 启动 adb server
./adb.exe start-server

:: 3. 检查已连接设备
./adb.exe devices

:: 4. 退出 server
./adb.exe kill-server
```

---

## 7. 常见问题与踩坑排查 (FAQ)

### Q1: 编译提示 `undefined reference to WSAStartup` 或 `getaddrinfo`
- **原因**：缺少 Windows Winsock 网络库。
- **解决方案**：在 CMake 的链接目标中追加 `ws2_32` 与 `iphlpapi`：
  ```cmake
  target_link_libraries(adb PRIVATE ws2_32 iphlpapi)
  ```

### Q2: 提示 `_O_BINARY` 未声明或 POSIX API 报错
- **原因**：MinGW 头文件中某些 POSIX 宏由 `<fcntl.h>` 或 Windows 特有的 `_setmode` 提供。
- **解决方案**：检查 `compat.h` 或在编译参数中添加 `-D_GNU_SOURCE -D_POSIX_C_SOURCE=200809L`。

### Q3: 运行 `adb.exe` 报 `0xc000007b` 应用程序无法正常启动
- **原因**：32 位与 64 位 DLL 混用，或 UCRT/MSVCRT 运行时库缺失。
- **解决方案**：确保统一在 **UCRT64** 环境内构建，并使用静态链接标志 `-static -static-libgcc -static-libstdc++`。

### Q4: 中文路径乱码或 UTF-8 支持问题
- **原因**：Windows 控制台默认代码页非 UTF-8。
- **解决方案**：AOSP `adb` 在 Windows 上原生调用了 `SetConsoleCP(CP_UTF8)`，确保终端字体支持 Unicode 即可正常显示。

---
*文档生成日期：2026年*
