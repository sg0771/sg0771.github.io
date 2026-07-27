# 降噪:
传统实时处理  
webrtc gips 算法,处理较平滑
RNNNoise ，可以优化大部分背景声音，但是有可能有点刺耳

# 高级处理:
可以实时处理:
spleetr: 快速人声伴奏分离,处理速度 1/40-1/50, 质量较差，可以大部分保留人声(可以用在本地实时ASR)

# 后期处理：
umx:  可以生成 人声、伴奏、鼓点、贝斯4个轨道(可以纯CPU处理)
demucs:可以生成 人声、伴奏、鼓点、贝斯4个轨道(可以使用vulkan加速)

# 语言识别和VAD
(需要转为16KHz 单声道)
如果使用 whisper sense-voice-main 可以使用Vulkan加速

# 语气词替换算法
0. 对原音频进行 转格式， 人声背景分离
1. 对人声用VAD切片,前后加30ms padding
2. 对切片长度小于200-300ms的片段进行asr
3. 输出对应的文字
4. 手动替换语气词为背景音，在交界处淡入淡出


# 美颜算法(基于OpenGL)
https://github.com/pixpark/gpupixel

# 背景抠像(基于TFLite+MediaPipe)(可以使用vulkan加速)
https://github.com/xintao222/virtual-background

# 图像优化
# 超分模型



1. 开始录制
设置输出目录，设置录制帧率，  主视频(显示器、窗口、区域)+[副视频(摄像头)] + {扬声器+麦克风}

2. 结束录制， 按预设规则生成混合后的视频 (处理时间大约是原录制时间的  50% -- 200% )

3. AI 及 其它 处理

视频包括 摄像头 美颜+虚拟背景替换 (后期可能有数字人)
音频是对 声音做 降噪、人声分离、ASR等，生成新的 扬声器、麦克风音频，生成静音过滤区间  

按预设规则生成混合后的视频 [排除静音过滤区间]   (处理时间大约是原录制时间的  50% -- 200% )


ffmpeg 混音命令

ffmpeg -i input1.mp3 -i input2.mp3 -filter_complex "amix=inputs=2:normalize=0,dynaudnorm" -c:a aac output.m4a


# 录制视频Merge规则
如果只有 MainVideo， 就直接返回MainVideo
如何存在subVideo， 就以叠加方式(可以指定在目标区域的RECT，一般是正方形) 生成新的 MixVideo 
如果不存在音频直接返回
只有一路音频，也不用处理
两路音频时，使用 ffmpeg命令或者其它方式合成新的 MixAudio
然后如果同时存在音视频返回，使用ffmpeg的MixAV 方式合成新的 MP4

# AI 视频Merge

MainVideo，可以支持设置背景图片/背景颜色，内边距，圆角半径，阴影等属性，指定缩放json文件，按照规则进行实时缩放运镜处理
subVideo 设置Rect，还支持美颜和虚拟背景，数字人待定
生成新的NewVideo

# 可能没有音频
也可能有一路或者两路音频
音频降噪美化后
如果存在两路音频，使用ffmpeg 合并音频，生成NewAudio
(音频处理可能会过滤一些无用的时间片段，返回一个json数据，对应的时间音视频输出不参与导出)

# 执行MixAV
