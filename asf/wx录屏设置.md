海外用户反馈 Windows 系统上使用 ApowerMirror 录制视频时，生成的 H.264 文件缺少所有色彩空间元数据（包括 BT.709、BT.2020、sRGB 及全范围/有限范围标志）。导致下游应用（如 Windows 照片、After Effects、DaVinci Resolve、Premiere Pro）各自猜测色彩解析方式，结果不一致。最终录制视频与 iPhone 实际屏幕显示严重不符，表现为背景和白色区域过曝，整体亮度过高。

用户建议的解决方案如下，麻烦看看可行吗？：

用户希望我们在编码端明确写入以下色彩标记参数：

video_full_range_flag = 1（全范围）

色彩原色（color_primaries）= BT.709（值 1）

传输特性（transfer characteristics）= BT.709（值 1）

矩阵系数（matrix coefficients）= BT.709（值 1）

即输出应标记为 BT.709 全范围。用户指出，常见编码 API（如 iOS/macOS 的 VideoToolbox、Android 的 MediaCodec、libx264）均支持设置这些字段，只需主动赋值，避免留空或使用“未指定”默认值。

验证方式：
用户建议修复后，用 ffprobe 检查录制的视频，若流信息中显示 pc, bt709, bt709, bt709 四项，则表示修复成功，录制内容在各播放器和剪辑软件中色彩将保持一致，无需额外后期处理。


codec_ctx->codec_id = AV_CODEC_ID_MPEG4;

// 同样设置这些色彩元数据
codec_ctx->color_range     = AVCOL_RANGE_MPEG;
codec_ctx->color_primaries = AVCOL_PRI_BT709;
codec_ctx->color_trc       = AVCOL_TRC_BT709;
codec_ctx->colorspace      = AVCOL_SPC_BT709;


#include "libyuv/convert_from_argb.h"

// 补齐 libyuv 缺失的对称函数：BT.709 Limited Range (H420)
inline int ARGBToH420(const uint8_t* src_argb, int src_stride_argb,
                      uint8_t* dst_y, int dst_stride_y,
                      uint8_t* dst_u, int dst_stride_u,
                      uint8_t* dst_v, int dst_stride_v,
                      int width, int height) {
    return libyuv::ARGBToI420Matrix(
        src_argb, src_stride_argb,
        dst_y, dst_stride_y,
        dst_u, dst_stride_u,
        dst_v, dst_stride_v,
        width, height,
        &libyuv::kYuvH709Constants // 核心
    );
}

// 补齐 libyuv 缺失的对称函数：BT.709 Full Range (U420)
inline int ARGBToU420(const uint8_t* src_argb, int src_stride_argb,
                      uint8_t* dst_y, int dst_stride_y,
                      uint8_t* dst_u, int dst_stride_u,
                      uint8_t* dst_v, int dst_stride_v,
                      int width, int height) {
    return libyuv::ARGBToI420Matrix(
        src_argb, src_stride_argb,
        dst_y, dst_stride_y,
        dst_u, dst_stride_u,
        dst_v, dst_stride_v,
        width, height,
        &libyuv::kYuvU709Constants // 核心
    );
}