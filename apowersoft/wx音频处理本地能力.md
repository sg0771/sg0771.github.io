降噪:
传统实时处理  
webrtc gips 算法,处理较平滑
RNNNoise ，可以优化大部分背景声音，但是有可能有点刺耳

高级处理:
可以实时处理:
spleetr: 快速人声伴奏分离,处理速度 1/40-1/50, 质量较差，可以大部分保留人声(可以用在本地实时ASR)

后期处理：
umx:  可以生成 人声、伴奏、鼓点、贝斯4个轨道(可以纯CPU处理)
demucs:可以生成 人声、伴奏、鼓点、贝斯4个轨道(可以使用vulkan加速)

语言识别和VAD
(需要转为16KHz 单声道)
如果使用 whisper sense-voice-main 可以使用Vulkan加速

语气词替换算法
0. 对原音频进行 转格式， 人声背景分离
1. 对人声用VAD切片,前后加30ms padding
2. 对切片长度小于200-300ms的片段进行asr
3. 输出对应的文字
4. 手动替换语气词为背景音，在交界处淡入淡出


美颜算法(基于OpenGL)
https://github.com/pixpark/gpupixel

背景抠像(基于TFLite+MediaPipe)(可以使用vulkan加速)
https://github.com/xintao222/virtual-background

图像优化
超分模型


