 屏幕截图（屏幕采集）在一些办公、IM、远程登陆与控制、视频等软件中经常使用，通过屏幕截屏实现屏幕远程共享、抓拍成图像文件或视频文件。使用过GDI截屏与DfMirage，对两种屏幕截图方法做些比较和总结：

GDI截屏

 GDI（graphics device interface）是window提供的api函数，用于设备上下文绘制图形。sourceforge上有个屏幕录制开源程序Cam Studio，用的就是GDI截屏，可供参考。

使用步骤：

1、获取屏幕句柄

WINAPI函数::GetDesktopWindow()

2、获取屏幕DC

WINAPI函数：GetDC

3、通过BitBlt函数将屏幕图像复制到DC中

4、通过GetDIBits获取截图的位图数据

特点：简单易用，开发方便，但cpu占用率高、数据量大



DfMirage截屏

   开源项目TightVNC是应用DfMirage的一个例子，tightvnc-1.3.10支持DfMirage截屏，大家可以参考代码学习，最新版的tightvnc好像不支持DfMirage。

DfMirage是Windows NT操作系统家族的的视频驱动镜像技术，视频驱动镜像技术广泛采用于远程桌面应用程序，如NetMeeting, PC Anywhere, VNC, Webex等等。

相对于GDI屏幕抓取，镜像截屏是一个技术上很优越的方法，通过虚拟驱动，系统发往显卡的命令也发给虚拟驱动，在虚拟驱动中模拟出当前系统的显示内容。

DfMirage驱动程序将屏幕表面映射到的用户的应用程序的虚拟内存空间，DfMirage跟踪屏幕最小的更新区域和用户软件能直接检索到这些区域，也就是说虚拟驱动和应用软件共享屏幕内存。通常情况下，缓冲区的大小和格式完全对应的主屏幕表面的格式和大小。DfMirage能检索到只发生数据改变的区域，同时应用程序也能读取到整个屏幕缓冲区。可以使用DfMirage驱动程序解决需要高效率的检测屏幕变化区域的应用。

使用步骤

1、安装DfMirage驱动

2、应用程序通过Windows API函数:ExtEscape 与DfMirage驱动通信

DfMirage定义了一些私有escape编码。Escape函数代码和输入输出结构体在DfMirage提供的display-esc.h头文件里面声明（这是一个供驱动程序和应用程序之间共同使用的接口头文件）

特点：效率高，节省CPU使用率

​