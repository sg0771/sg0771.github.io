# 分享一个windows的抓屏方式

最近两周一直在测试windows下的各种抓屏方式。刚开始用了GDI的抓屏，但是出现了bug。抓屏一段时间后，出现了问题。MFC程序卡死，抓不到时实的屏幕数据了，回来的数据是同一帧数据。最后只有放弃换另一种抓屏方式。

在此推荐几篇文章表示感谢！

1.全面介绍了几种抓屏的方式：

http://www.cppblog.com/weiym/archive/2013/12/01/204536.aspx

2.仔细的介绍了几种抓屏的方式：

http://blog.csdn.net/henry19850318/article/details/5732106

最后一种，实验没有成功。

3.开发屏幕截图 mirror driver

http://blog.csdn.net/mergerly/article/details/5874100

很遗憾也没能成功，只是编译通过了。安装失败，我使用的是win7 64位的系统。有成功的朋友可以私信我，共同交流学习（dzhw0314@163.com）。在此表示感谢。

--------------------------------------  分割线  ---------------------------------------

以下是正文

--------------------------------------  分割线  ---------------------------------------

在上述方法都尝试失败后，开始了新的尝试。依然是mirror driver。在一片文章中看到了可以依赖 RDP Encoder Mirror Driver。具体哪一篇文章提起的实在是忘记了。表示歉意。

百度搜索 “RDP Encoder Mirror Driver” 找到了这个连接：

http://www.codeproject.com/Articles/716128/Using-RDP-Encoder-Mirror-Driver-to-Capture-Screen

在此大概解释一下网页内容。后续会上传测试通过的源码。



背景：

如果我们需要抓屏的话，我们可以采用GDI的API轻松的截取屏幕，但是它的性能很差。使用Mirror Driver开发我们自己的虚拟显卡驱动是一个好办法。当我的测试程序列出所有的显示设备时我发现了“RDP Encoder Mirror Driver”。  经过测试我发现"RDP Encoder Mirror Driver"工作的很好。

使用代码：

        首先我们要测试“RDP Encoder Mirror Driver”是否存在。


~~~cpp

int Detect_MirrorDriver(vector<DISPLAY_DEVICE>& devices,map<int,DEVMODE>& settings) { CString all_mirror_divers[2] = { _T("RDP Encoder Mirror Driver"),//included in windows 7  _T("LEDXXX Mirror Driver")//my own mirror driver, used in Windows XP  }; DISPLAY_DEVICE dd; ZeroMemory(&dd, sizeof(dd)); dd.cb = sizeof(dd); int n = 0; while(EnumDisplayDevices(NULL, n, &dd, EDD_GET_DEVICE_INTERFACE_NAME)) { n++; devices.push_back(dd); } for(int i=0;i<(int)devices.size();i++) { DEVMODE dm; ZeroMemory(&dm, sizeof(DEVMODE)); dm.dmSize = sizeof(DEVMODE); dm.dmDriverExtra = 0; if(EnumDisplaySettingsEx(devices[i].DeviceName,ENUM_CURRENT_SETTINGS,&dm,EDS_ROTATEDMODE)) { settings.insert(map<int,DEVMODE>::value_type(i,dm)); } } for(int m =0;m<2;m++) { for(int i=0;i<(int)devices.size();i++) { CString drv(devices[i].DeviceString); if(drv == all_mirror_divers[m]) { return m; } } } return -1;//can not use any mirror driver }
~~~

如果测试通过抓屏就很简单了。



~~~cpp
class RDPCapture { int mw; int mh; int mx0; int my0; DEVMODE myDM; DISPLAY_DEVICE myDev; HDC m_driverDC; CDC m_cdc; BITMAPINFO m_BmpInfo; HBITMAP m_Bitmap; HBITMAP Old_bitmap; DEVMODE oldDM; public: RDPCapture(){} RDPCapture(DISPLAY_DEVICE dev,DEVMODE dm) { myDev = dev; myDM = dm; oldDM = dm; m_driverDC = NULL; } ~RDPCapture() { SelectObject(m_cdc,Old_bitmap); DeleteObject(m_Bitmap); m_cdc.DeleteDC(); if(m_driverDC != NULL) DeleteDC(m_driverDC); oldDM.dmDeviceName[0] = 0; ChangeDisplaySettingsEx(myDev.DeviceName,&oldDM, 0, 0, 0); } virtual bool Init(int x0,int y0,int width,int height) { mx0 = x0; my0 = y0; mw = (width + 3)&0xFFFC; mh = height; DEVMODE dm; dm = myDM; WORD drvExtraSaved = dm.dmDriverExtra; memset(&dm, 0, sizeof(DEVMODE)); dm.dmSize = sizeof(DEVMODE); dm.dmDriverExtra = drvExtraSaved; dm.dmPelsWidth = 2048; dm.dmPelsHeight = 1280; dm.dmBitsPerPel = 24; dm.dmPosition.x = 0; dm.dmPosition.y = 0; dm.dmDeviceName[0] = '\0'; dm.dmFields = DM_BITSPERPEL | DM_PELSWIDTH |                       DM_PELSHEIGHT | DM_POSITION; if(ChangeDisplaySettingsEx(myDev.DeviceName, &dm, 0, CDS_UPDATEREGISTRY, 0)) { ChangeDisplaySettingsEx(myDev.DeviceName, &dm, 0, 0, 0); } //------------------------------------------------ 
 ZeroMemory(&m_BmpInfo, sizeof(BITMAPINFO)); m_BmpInfo.bmiHeader.biSize = sizeof(BITMAPINFOHEADER); m_BmpInfo.bmiHeader.biBitCount = 24; m_BmpInfo.bmiHeader.biCompression = BI_RGB; m_BmpInfo.bmiHeader.biPlanes = 1; m_BmpInfo.bmiHeader.biWidth = mw; m_BmpInfo.bmiHeader.biHeight = -mh; m_BmpInfo.bmiHeader.biSizeImage= mw*mh*3; HDC Top = ::GetDC(GetDesktopWindow()); m_cdc.CreateCompatibleDC(NULL);//兼容设备上下文环境  m_Bitmap = CreateCompatibleBitmap(Top, mw,mh);//Bitmap,画布  Old_bitmap = (HBITMAP)SelectObject(m_cdc, m_Bitmap);//画布与设备上下文环境关联  ::ReleaseDC(GetDesktopWindow(),Top); m_driverDC = CreateDC(myDev.DeviceName, 0, 0, 0); return true; }; virtual bool GetData(unsigned char *buf) { BitBlt(m_cdc,0,0,mw,mh,m_driverDC,mx0,my0,SRCCOPY|CAPTUREBLT); GetDIBits(m_cdc,m_Bitmap,0,mh,buf, &m_BmpInfo, DIB_RGB_COLORS); return true; }; };

~~~

然后在main函数中初始化调用如下：





~~~cpp
RDPCapture* rdp_capture = NULL; 
vector<DISPLAY_DEVICE> devices; 
map<int,DEVMODE>& settings; 
int res = Detect_MirrorDriver(devices,settings); 
if(res ==0) { 
        rdp_capture = new RDPCapture(devices[0],settings[0]); 
}
~~~

抓图代码如下：


~~~cpp
rdp_capture->Init(0,0,1440,900);
rdp_capture->GetData(vbuf);
~~~

保存vbuf的数据就可以了是RGB24的格式。
