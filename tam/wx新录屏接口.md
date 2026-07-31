# reccloud.windows C++

输出文件为 src\native\output\Release\reccloud_native.dll

依赖库在 src\native\ffmpeg_sdk\bin\x64


//库的初始化，strLog表示日志路径，请使用者确保有效
LIBMEDIA_API int MediaInit(const wchar_t* strLog);


//获取当前扬声器设备信息列表，返回 UTF-8 JSON 字符串。
/*
返回值示例:
{"type":"system",
"count":2,
"devices":[{"name":"耳机 (BL25 Stereo)","guid":"{0.0.0.00000000}.{bbf45d68-a4b6-48c6-a709-af50f728c1cf}","isDefault":0,"isDefaultComm":1},
{"name":"扬声器 (Senary Audio)","guid":"{0.0.0.00000000}.{bfc47c72-a85a-4cc5-a613-f322e192a7dc}","isDefault":1,"isDefaultComm":0}]}

参数说明:
"type":"system" 扬声器
"count":2  扬声器个数
"devices":扬声器信息
"devices"的"name":对应扬声器显示名字
"devices"的"guid":对应扬声器设备ID
"devices"的""isDefault":0 是否默认设备
"devices"的""isDefaultComm":1 是否默认通信设备
*/
LIBMEDIA_API const char* GetSystemString();

//获取当前麦克风设备信息列表，返回 UTF-8 JSON 字符串。
/*
返回值示例:
{"type":"mic",
"count":1,
  "devices":[{"name":"麦克风阵列 (Senary Audio)","guid":"{0.0.1.00000000}.{5ca4dab1-a272-4821-a19b-13b566d47155}","isDefault":1,"isDefaultComm":1}]}
参数说明:
"type":"mic" 麦克风
"count":1  麦克风个数
"devices":麦克风信息
"devices"的"name":对应麦克风显示名字
"devices"的"guid":对应麦克风设备ID
"devices"的""isDefault":0 是否默认设备
"devices"的""isDefaultComm":1 是否默认通信设备
*/
LIBMEDIA_API const char* GetMicString();


//获取当前显示器信息列表，返回 UTF-8 JSON 字符串。
/*
返回值示例:
{"type":"display",
"count":1,
"displays":[{"name":"\\\\.\\DISPLAY1",
"isPrimary":1,
"left":0,"top":0,"width":1920,"height":1080,
"rotate":0,
"dpiX":96,
"dpiY":96}]}
参数说明: 
        "type":"display" 显示器信息类型
        "count":1 显示器个数
        "displays": 显示器信息数组
        "displays"的"name" 表示名字
        "displays"的"isPrimary" 表示是否主显示器
        "displays"的"left":0,"top":0,"width":1920,"height":1080 表示在虚拟屏幕上的坐标，如果left top都为0表示为主显示器
        "displays"的"rotate":0, 当前显示器旋转角度
        "displays"的"dpiX":96, "dpiY":96 显示器的DPI信息
*/
LIBMEDIA_API const char* GetDisplayString();


//获取当前摄像头设备信息列表，返回 UTF-8 JSON 字符串。
/*
返回值示例:
没有对应设备返回长度为空字符
有效返回例子如下:
{"type":"camera",
  "count":1,
  "cameras":[{"name":"HD Webcam",
              "guid":"\\\\?\\usb#vid_2b7e&pid_b743&mi_00#6&5f5aa4d&0&0000#{e5323777-f976-4f5b-9b55-b94699c46e44}\\global",
               "fmt":[{"width":640,"height":480,"fps":30},
               {"width":640,"height":480,"fps":15},
               {"width":1280,"height":720,"fps":30},
               {"width":1280,"height":720,"fps":15},
               {"width":640,"height":360,"fps":30},
               {"width":640,"height":360,"fps":15},
               {"width":320,"height":240,"fps":30},
               {"width":320,"height":240,"fps":15},
               {"width":176,"height":144,"fps":30},
               {"width":176,"height":144,"fps":15},
               {"width":160,"height":120,"fps":30},
               {"width":160,"height":120,"fps":15},
               {"width":1280,"height":720,"fps":10}]}]}
    其中:  "type":"camera"  表示摄像头信息
    "count":1 表示摄像头个数
    "cameras": 是json数组，表示每个摄像头的具体信息
    "cameras"的"name"表示显示名字，如果系统插入多个同型号的usb camera可能会显示一致
   "cameras"的 "guid"表示具体摄像头ID，和WXMedia使用的DirectShow获得的guid有类似之处但不完全相同
   "cameras"的 "fmt" 表示该摄像头的采集能力，数组里面表示采集能力对应的分辨率和帧率
*/
LIBMEDIA_API const char* GetCameraString();