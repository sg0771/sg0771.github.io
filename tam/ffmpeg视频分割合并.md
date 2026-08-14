原因：TS 切片的 PES 头中通常带有各自独立的时间戳（PTS/DTS）。直接二进位拼接会导致连接处的时间戳断层或不连续。如果不加 -fflags +genpts 强制 FFmpeg 重新生成 PTS，输出的 MP4 文件极易出现音视频不同步、画面卡顿、进度条无法拖动或报 Non-monotonous DTS in output stream 错误。

建议搭配参数：加上 -avoid_negative_ts make_zero，确保首帧时间戳归零。

ffmpeg -fflags +genpts -i "concat:1.ts|2.ts" -c copy -avoid_negative_ts make_zero output.mp4