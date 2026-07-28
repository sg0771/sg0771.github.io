#  运行环境问题

## 显卡驱动
360驱动大师/驱动精灵

https://dm.weishi.360.cn/home.html

https://www.drivergenius.com/

## .Net 运行时

4/.5/4.6.4.7

https://dotnet.microsoft.com/en-us/download/dotnet-framework/thank-you/net46-chs



## (C++ 运行时)

Visual C++ Redistributable Packages

https://aka.ms/vs/17/release/vc_redist.x86.exe

https://aka.ms/vs/17/release/vc_redist.x64.exe


## DirectX Runtime（DX运行时）

https://download.microsoft.com/download/8/4/A/84A35BF1-DAFE-4AE8-82AF-AD2AE20B6B14/directx_Jun2010_redist.exe

## 运行时错误

WPF程序无法启动，或者出现图标后一闪而过
Windows系统日志提示 Automation.Peer 时检查是是否存在更新 kb:5011048， 卸载重启就可以了

## FIPS 错误

### C#日志提示

~~~cpp
    2025-12-30 09:29:02,741 ERROR [27] [0] - LoadFile:System.TypeInitializationException: XXXXXXX.VideoEditor.Infrastructure.Extension.FileExt”的类型初始值设定项引发异常。 ---> System.InvalidOperationException: 此实现不是 Windows 平台 FIPS 验证的加密算法的一部分。
~~~

### 该错误核心原因
Windows 启用了 FIPS（联邦信息处理标准）模式，而程序中使用了MD5CryptoServiceProvider（MD5 算法）—— 该算法未通过 FIPS 认证，在 FIPS 模式下会被系统禁止调用，进而导致FileExt类的静态构造函数（.cctor()）执行失败，触发TypeInitializationException类型初始化异常。

### 解决方案（按优先级 / 可行性排序）

#### 方案 1：修改程序代码（根本解决，需源码）

替换非 FIPS 合规的 MD5 算法为合规算法（如 SHA-1、SHA-256），或使用兼容 FIPS 的实现方式：

~~~csharp
// 原错误代码（使用MD5CryptoServiceProvider）
using (var md5 = new MD5CryptoServiceProvider()) { /* ... */ }

// 替换方案1：使用FIPS合规的SHA256
using (var sha256 = new SHA256CryptoServiceProvider()) { /* ... */ }
~~~

若必须用MD5（仅哈希，非加密），使用兼容实现
// .NET 4.7+ 推荐方式（自动适配FIPS）
using (var md5 = MD5.Create()) { /* ... */ }
注意：若无法修改源码（如使用第三方程序），需用方案 2/3。

### 方案 2：
禁用 Windows FIPS 模式（系统级，快速生效）

通过系统设置关闭 FIPS 验证，允许非合规算法运行：

组策略编辑器（推荐）

按下Win+R，输入gpedit.msc打开组策略；

导航到：计算机配置 > Windows 设置 > 安全设置 > 本地策略 > 安全选项；

找到并双击：系统加密：使用FIPS兼容的算法进行加密、哈希和签名；

选择已禁用，点击确定，重启电脑生效。

注册表修改（备用）

按下Win+R，输入regedit打开注册表编辑器；

定位到：
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\FipsAlgorithmPolicy；

修改Enabled键值：1（启用 FIPS）→ 0（禁用 FIPS）；

重启电脑生效。


### 方案 3：
程序兼容性配置（仅.NET 框架程序）
若程序基于.NET Framework，可在app.config/web.config中添加 FIPS 兼容配置：
~~~xml
<configuration>
  <runtime>
    <!-- 禁用FIPS运行时检查（.NET Framework 2.0+） -->
    <enforceFIPSPolicy enabled="false"/>
  </runtime>
</configuration>
~~~

### 补充说明
FIPS 模式的影响：FIPS 模式是 Windows 的安全策略，强制使用 NIST 认证的加密算法，MD5、RC4 等弱算法会被禁用；

风险提示：禁用 FIPS 模式可能降低系统加密安全性（仅影响非合规算法），若为企业环境，需确认安全策略允许；

第三方程序场景：若无法修改程序 / 系统设置，可联系软件厂商获取 FIPS 兼容版本。

### 验证方法
修改后重新运行程序，若不再抛出TypeInitializationException且FileExt类能正常加载，说明问题解决。

## 组策略修改
 1.按WIN+R（或点击开始-运行），并输入gpedit.msc后确定，启动组策略编辑器。
2.左侧列表中找到 计算机配置 - Windows设置 - 安全设置 - 本地策略 - 安全选项，并在右侧找到“系统加密：将FIPS兼容算法用于加密、哈希和签名”
3.双击上述策略，在弹出的选项中，将状态改为已禁用。
https://blog.csdn.net/song_jiang_long/article/details/54172711


# 中文路径问题

日志和配置文件依赖于 %appdata% 路径
如果含有非ASCII字符(如中日韩名字),可能会造成错误
或者软件所在目录带有中文也可能会错误

可以修改为纯英文用户名

Win10/11 可以尝试

 如果是系统用户名带有中文的 Win10/11 ,可以尝试
在系统 的  设置-语言-相关设置-管理语言设置-区域-非Unicode-更改系统区域设置-区域设置里面
在 Beta版：使用Unicode UTF-8 提供全球语言设置(U) 前面打勾重启电脑


# 蓝牙设备问题

Win11 比较新的版本 蓝牙的立体声模式和免提模式已经融合，在使用免提模式时，扬声器自动从立体声的48000Hz降低到免提模式的16000Hz，但是旧版本两者是冲突的，如果使用了蓝牙免提模式，则蓝牙立体声模式会无声，需要禁用其中一种

# 微软更新问题

KB5083631 导致摄像头属性不能缩放

kB5011048 和.net 运行环境冲突

卸载bat命令
~~~bat
@echo off
SETLOCAL
echo uninstall...
wusa /uninstall /kb:5011048
echo finished!
pause
ENDLOCAL
~~~

# WPS 日志提前
~~~bat
@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title WPS日志收集工具

echo.
echo ========================================
echo            WPS日志收集工具
echo ========================================
echo.

for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set "fdate=%%c-%%a-%%b"
set "ftime=%time:~0,2%-%time:~3,2%"
set "ftime=%ftime: =0%"
set "dst_folder=WPS_Logs_%username%_%fdate%_%ftime%"
set "dst=%userprofile%\Desktop\%dst_folder%"

echo [信息] 正在准备收集WPS日志...
echo       目标目录: %dst%
echo.

set "log[0]=%appdata%\kingsoft\office6\log"
set "log[1]=%appdata%\kingsoft\office6\update\log"
set "log[2]=%temp%\klog"
set "log[3]=%appdata%\kingsoft\klog"
set "log[4]=%userprofile%\AppData\Local\Kingsoft\WPS Office\logs"

echo [信息] 正在创建目标目录...
if exist "%dst%" (
    rmdir /s /q "%dst%" 2>nul
)
mkdir "%dst%" 2>nul
if not exist "%dst%" (
    echo [错误] 无法创建目标目录 "%dst%"，请检查权限或路径。
    pause
    exit /b 1
)
set /a total_count=0
set /a success_count=0
echo [信息] 开始扫描并复制日志文件...
for /l %%i in (0,1,4) do (
    set /a total_count+=1
    set "source_path=!log[%%i]!"
    set "display_path=!source_path:%username%=%username%!"
    if exist "!source_path!" (
        for %%F in ("!source_path!") do set "folder_name=%%~nxF"
        xcopy "!source_path!" "%dst%\!folder_name!\" /s /q /y /i 2>nul
    )
)
echo ============ 收集完成 ============
echo 文件已保存至: %dst%
echo ==================================
echo 按任意键退出本程序...
pause >nul
endlocal
~~~



