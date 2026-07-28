NsHandle *nsHandle = WebRtcNs_Create();
WebRtcNs_Init(nsHandle, 16000);  // 初始化
WebRtcNs_set_policy(nsHandle, 2); // 降噪等级，0~3

int num_bands = 1;
int16_t *nsIn[1] = {pcm_buffer};        // 原始音频数据
int16_t *nsOut[1] = {denoised_buffer};  // 降噪之后的音频数据

WebRtcNs_Analyze(nsHandle, nsIn[0]);    // 音频分析

WebRtcNs_Process(nsHandle, (const int16_t *const *) nsIn, num_bands, nsOut); // 实际的降噪处理

......

WebRtcNs_Free(nsHandle);