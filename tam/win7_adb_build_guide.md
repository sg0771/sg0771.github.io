# Windows 7 适配与编译新版 ADB.exe 完全指南

本指南提供了针对 Windows 7 系统的最新版 Android Debug Bridge (`adb.exe`) 编译与兼容性适配方案。由于 Google 官方从 Android SDK Platform-Tools 29+ 逐步放弃了对 Windows 7 的原生支持并引入了 Windows 8/10+ 专属 API（如 `GetSystemTimePreciseAsFileTime`、UCRT 依赖、新版 WinUSB 特性），可以通过以下两种主要方案进行构建与落地。

---

## 目录
- [方案对比与选型建议](#方案对比与选型建议)
- [选项 A：基于 MinGW-w64 交叉编译独立 CMake 构建（推荐）](#选项-a基于-mingw-w64-交叉编译独立-cmake-构建推荐)
  - [1. 原理与适用场景](#1-原理与适用场景)
  - [2. 构建环境准备](#2-构建环境准备)
  - [3. 源码获取与子模块更新](#3-源码获取与子模块更新)
  - [4. Win7 兼容性配置与宏定义](#4-win7-兼容性配置与宏定义)
  - [5. 编译与构建步骤](#5-编译与构建步骤)
  - [6. 产物提取与验证](#6-产物提取与验证)
- [选项 B：基于 MSVC + VxKex / 源码 API 降级 Hook 方案](#选项-b基于-msvc--vxkex--源码-api-降级-hook-方案)
  - [1. 原理与适用场景](#1-原理与适用场景-1)
  - [2. 关键缺失 API 分析与 Fallback 实现](#2-关键缺失-api-分析与-fallback-实现)
  - [3. 使用 MinGW / MSVC 构建并注入 API 包装层](#3-使用-mingw--msvc-构建并注入-api-包装层)
  - [4. 替代实现：二进制层补丁与 VxKex 兼容运行时](#4-替代实现二进制层补丁与-vxkex-兼容运行时)
- [Windows 7 运行环境必备前置依赖](#windows-7-运行环境必备前置依赖)
- [常见故障排除与调试](#常见故障排除与调试)

---

## 方案对比与选型建议

| 评估维度 | 选项 A：MinGW 静态交叉编译 | 选项 B：源码 API 降级与兼容层 Hook |
| :--- | :--- | :--- |
| **构建复杂度** | 较低（环境搭建快，CMake 流程清晰） | 中等（需修改或 Hook 若干 Win32 底层 API） |
| **体积与依赖** | 纯静态链接（不依赖额外运行时 DLL） | 依赖已补丁的 UCRT 或引入兼容 Shim DLL |
| **系统稳定性** | 极高，原生调用 Win7 兼容函数 | 高，但需注意 API 行为细微差异（如高精度时钟降级） |
| **推荐适用场景** | 需要快速产出独立、免安装的 `adb.exe` | 需要追踪 AOSP 最新特性且深度定制 ADB 功能 |

---

## 选项 A：基于 MinGW-w64 交叉编译独立 CMake 构建（推荐）

### 1. 原理与适用场景
Google AOSP 源码树体积达数十 GB，单独编译其中的 SDK Platform-Tools 极耗时。选项 A 采用社区维护的高质量独立构建仓库（如 `lzhiyong/android-sdk-tools` 或 `nmeum/android-tools`），提取出 `adb`、`fastboot` 所需的全部依赖库（`libbase`、`libcrypto`、`libdiagnose_usb`、`libziparchive` 等），并在 Linux/WSL2 环境中使用 `x86_64-w64-mingw32` 进行针对 Windows 7（`_WIN32_WINNT=0x0601`）的静态编译。

### 2. 构建环境准备
推荐使用 Ubuntu 22.04 / 24.04 LTS 或 Debian 12：

```bash
# 更新包列表并安装基础构建依赖
sudo apt update && sudo apt install -y \
    build-essential \
    cmake \
    ninja-build \
    gcc-mingw-w64-x86-64 \
    g++-mingw-w64-x86-64 \
    pkg-config \
    libz-dev \
    git
```

### 3. 源码获取与子模块更新
克隆支持独立 CMake 构建的 ADB 仓库：

```bash
# 克隆仓库及其所有依赖子模块（包含 boringssl、libbase、adb 等）
git clone --recursive https://github.com/lzhiyong/android-sdk-tools.git
cd android-sdk-tools
```

### 4. Win7 兼容性配置与宏定义
为了保证生成的二进制代码仅引用 Windows 7 支持的 API，并防止动态依赖 `msvcp140.dll` 或 `libstdc++-6.dll`，必须在编译标志中明确：
- `-D_WIN32_WINNT=0x0601`（强制目标系统为 Windows 7）
- `-DWINVER=0x0601`
- `-static -static-libgcc -static-libstdc++`（完全静态链接）

### 5. 编译与构建步骤

```bash
# 创建独立构建目录
mkdir build && cd build

# 运行 CMake 配置（指定 MinGW 交叉工具链及 Win7 宏）
cmake .. -G Ninja \
    -DCMAKE_SYSTEM_NAME=Windows \
    -DCMAKE_C_COMPILER=x86_64-w64-mingw32-gcc \
    -DCMAKE_CXX_COMPILER=x86_64-w64-mingw32-g++ \
    -DCMAKE_C_FLAGS="-O3 -D_WIN32_WINNT=0x0601 -DWINVER=0x0601 -static-libgcc" \
    -DCMAKE_CXX_FLAGS="-O3 -D_WIN32_WINNT=0x0601 -DWINVER=0x0601 -static-libgcc -static-libstdc++" \
    -DCMAKE_EXE_LINKER_FLAGS="-static -s" \
    -DANDROID_SDK_TOOLS_BUILD_ADB=ON \
    -DANDROID_SDK_TOOLS_BUILD_FASTBOOT=OFF

# 开始并行构建 ADB
ninja adb
```

### 6. 产物提取与验证
编译完成后，会在构建目录下生成独立的 `adb.exe`。
可以通过 `file` 或 `x86_64-w64-mingw32-objdump` 检查依赖：

```bash
file adb.exe
# 输出示例：adb.exe: PE32+ executable (console) x86-64, for MS Windows, 6 sections

# 检查引用的系统 DLL（应仅包含 kernel32, user32, ws2_32, advapi32 等 Win7 原生 DLL）
x86_64-w64-mingw32-objdump -p adb.exe | grep "DLL Name"
```

---

## 选项 B：基于 MSVC + VxKex / 源码 API 降级 Hook 方案

### 1. 原理与适用场景
当直接使用较新的 AOSP 主线源码、或必须使用 MSVC (Visual Studio) 构建，亦或希望直接运行官方最新发布的预编译二进制时，会遭遇以下 Win8/Win10 专有 API 缺失导致的运行崩溃：
1. `GetSystemTimePreciseAsFileTime`（用于高精度计时，Win8+）
2. `CreateFile2`（Win8+）
3. `SetFileInformationByHandle` 部分新增参数枚举
4. `Universal C Runtime (UCRT)` 缺少 `api-ms-win-crt-*`

选项 B 提供了在源码层面降级替代 API 以及在二进制层面使用兼容 Shim 的完整实现。

### 2. 关键缺失 API 分析与 Fallback 实现

#### (1) `GetSystemTimePreciseAsFileTime` 降级为 `GetSystemTimeAsFileTime`
在涉及时钟计时的源文件（如 `system/core/base/chrono_utils.cpp` 或 BoringSSL 计时模块）中，若遇到 `GetSystemTimePreciseAsFileTime` 报错，可用如下降级封装替代：

```c
#include <windows.h>

// 针对 Win7 进行 API 动态加载与 Fallback 处理
static void WINAPI My_GetSystemTimePreciseAsFileTime(LPFILETIME lpSystemTimeAsFileTime) {
    typedef void (WINAPI *FnGetSystemTimePrecise)(LPFILETIME);
    static FnGetSystemTimePrecise pfnGetSystemTimePrecise = NULL;
    static BOOL initialized = FALSE;

    if (!initialized) {
        HMODULE hKernel32 = GetModuleHandleW(L"kernel32.dll");
        if (hKernel32) {
            pfnGetSystemTimePrecise = (FnGetSystemTimePrecise)GetProcAddress(hKernel32, "GetSystemTimePreciseAsFileTime");
        }
        initialized = TRUE;
    }

    if (pfnGetSystemTimePrecise) {
        pfnGetSystemTimePrecise(lpSystemTimeAsFileTime);
    } else {
        // Windows 7 降级调用常规毫秒级时钟
        GetSystemTimeAsFileTime(lpSystemTimeAsFileTime);
    }
}
```

#### (2) `CreateFile2` 降级为 `CreateFileW`
若源码中使用了 `CreateFile2`，可实现映射转换：

```c
#include <windows.h>

HANDLE WINAPI My_CreateFile2(
    LPCWSTR lpFileName,
    DWORD dwDesiredAccess,
    DWORD dwShareMode,
    DWORD dwCreationDisposition,
    LPCREATEFILE2_EXTENDED_PARAMETERS pCreateExParams
) {
    DWORD dwFlagsAndAttributes = 0;
    DWORD dwSecurityFlags = 0;
    LPSECURITY_ATTRIBUTES lpSecurityAttributes = NULL;
    HANDLE hTemplateFile = NULL;

    if (pCreateExParams) {
        dwFlagsAndAttributes = pCreateExParams->dwFileFlags | pCreateExParams->dwFileAttributes;
        dwSecurityFlags = pCreateExParams->dwSecurityQosFlags;
        lpSecurityAttributes = pCreateExParams->lpSecurityAttributes;
        hTemplateFile = pCreateExParams->hTemplateFile;
    }

    return CreateFileW(
        lpFileName,
        dwDesiredAccess,
        dwShareMode,
        lpSecurityAttributes,
        dwCreationDisposition,
        dwFlagsAndAttributes | dwSecurityFlags,
        hTemplateFile
    );
}
```

### 3. 使用 MinGW / MSVC 构建并注入 API 包装层
如果通过 MSVC (Visual C++) 编译：
1. 安装 **Visual Studio 2022** / **2019**，勾选 C++ 桌面开发环境。
2. 安装 **Windows 7 SDK (v7.1A / v8.1)**，或在项目属性中设置：
   - 目标 Windows 版本：`WINVER=0x0601`，`_WIN32_WINNT=0x0601`
   - C/C++ -> 代码生成 -> 运行库：设置为 **多线程 (/MT)**（静态链接 CRT，避免依赖高版本 VC Redist）。
3. 如果项目直接使用了 C++20 `std::chrono` 引入了不可关闭的 `GetSystemTimePreciseAsFileTime`，可以通过连接器参数 `/FORCE:MULTIPLE` 并在工程中提供上述同名 Wrapper 函数进行符号强行替换。

### 4. 替代实现：二进制层补丁与 VxKex 兼容运行时
如果不想自行重编译、仅想运行官方最新版的 `adb.exe`：
1. **使用 VxKex (Windows 7 API 扩展层)**：
   - 下载并安装 [VxKex](https://github.com/vxiiduu/VxKex) 内核及 API 兼容增强层。
   - 右键点击官方 `adb.exe` -> **属性** -> 切换至 **VxKex** 标签页。
   - 勾选 **Enable VxKex for this program**，系统版本伪装选择 **Windows 10**。
2. **使用 CFF Explorer / ImportPatcher 进行 DLL 劫持**：
   - 编写一个微型 `version.dll` 或 `win7shim.dll` 导出上述缺失函数。
   - 将 `adb.exe` 导入表中的 `GetSystemTimePreciseAsFileTime` 重定向至 Shim DLL。

---

## Windows 7 运行环境必备前置依赖

在 Windows 7 客户端运行编译出的 `adb.exe` 前，建议确保目标机已具备以下环境支持：

1. **Universal C Runtime 补丁**：
   - 安装微软官方补丁 **KB2999226**（Windows 6.1-KB2999226-x64.msu）。
2. **SHA-2 签名支持补丁**：
   - 必须安装 **KB4474419** 与 **KB4490628**，以支持现代驱动与已签名的二进制。
3. **USB 驱动 (WinUSB)**：
   - Windows 7 默认不自带高版本设备通用的 Google USB 驱动。
   - 使用 [Zadig](https://zadig.akeo.ie/) 工具，将手机的 `ADB Interface` 驱动直接切换为 **WinUSB** 或 **libusbK** 驱动。

---

## 常见故障排除与调试

### Q1: 运行提示 `无法定位程序输入点 GetSystemTimePreciseAsFileTime 于动态链接库 KERNEL32.dll 上`
* **原因**：二进制文件直接链接了 Win8+ 专有 API。
* **解决**：改用 **选项 A** 重新编译，并在编译参数中严格加入 `-D_WIN32_WINNT=0x0601`；或按照 **选项 B** 引入 Fallback 函数。

### Q2: 运行提示 `由于找不到 api-ms-win-crt-runtime-l1-1-0.dll，无法继续执行代码`
* **原因**：使用了动态 UCRT 构建，而 Win7 系统未打 UCRT 补丁。
* **解决**：
  1. 编译时加上 `-static`（MinGW）或 `/MT`（MSVC）。
  2. 在 Win7 目标机器上安装 **KB2999226** 补丁。

### Q3: `adb devices` 识别不到设备，提示 `unauthorized` 或无反应
* **原因**：Win7 默认的 USB 栈对新设备协议响应不完全，或 RSA 秘钥生成失败。
* **解决**：
  1. 检查 `%USERPROFILE%\.android\` 下是否成功生成 `adbkey` 与 `adbkey.pub`。
  2. 打开设备管理器，确认 ADB 驱动已由 Zadig 替换为标准 WinUSB。
  3. 执行 `adb kill-server` 后以管理员权限重启 `adb start-server`。
