GPUImage 共 125 个滤镜, 分为四类



1、Color adjustments : 31 filters , 颜色处理相关

2、Image processing : 40 filters , 图像处理相关.

3、Blending modes : 29 filters , 混合模式相关.

4、Visual effects : 25 filters , 视觉效果相关.





一.颜色处理

GPUImageBrightnessFilter //亮度

GPUImageExposureFilter //曝光

GPUImageContrastFilter //对比度

GPUImageSaturationFilter //饱和度

GPUImageGammaFilter //伽马线

GPUImageColorInvertFilter //反色

GPUImageSepiaFilter //褐色（怀旧）

GPUImageLevelsFilter //色阶

GPUImageGrayscaleFilter //灰度

GPUImageHistogramFilter //色彩直方图，显示在图片上

GPUImageHistogramGenerator //色彩直方图

GPUImageRGBFilter //RGB

GPUImageToneCurveFilter //色调曲线

GPUImageMonochromeFilter //单色

GPUImageOpacityFilter //不透明度

GPUImageHighlightShadowFilter //提亮阴影

GPUImageFalseColorFilter //色彩替换（替换亮部和暗部色彩）

GPUImageHueFilter //色度

GPUImageChromaKeyFilter //色度键(指定颜色抠图)

GPUImageWhiteBalanceFilter //白平横/色温

GPUImageAverageColor //像素平均色值

GPUImageSolidColorGenerator //纯色

GPUImageLuminosity  //亮度平均

GPUImageAverageLuminanceThresholdFilter //像素色值亮度平均，图像黑白（有类似漫画效果）

GPUImageLookupFilter //lookup 色彩调整

GPUImageAmatorkaFilter //Amatorka lookup

GPUImageMissEtikateFilter //MissEtikate lookup

GPUImageSoftEleganceFilter //SoftElegance lookup



二.图像处理

GPUImageCrosshairGenerator //十字

GPUImageLineGenerator //线条

GPUImageTransformFilter //形状变化

OpenGL ES 图像平移

OpenGL ES 图像缩放

OpenGL ES 图像镜像

OpenGL ES 图像旋转

GPUImageCropFilter //剪裁

GPUImageSharpenFilter //锐化

GPUImageUnsharpMaskFilter //反遮罩锐化

GPUImageFastBlurFilter //模糊

GPUImageGaussianBlurFilter //高斯模糊

GPUImageGaussianSelectiveBlurFilter //高斯模糊，选择部分清晰

GPUImageBoxBlurFilter //盒状模糊

GPUImageTiltShiftFilter //条纹模糊，中间清晰，上下两端模糊

GPUImageMedianFilter  //中间值，有种稍微模糊边缘的效果

GPUImageBilateralFilter //双边模糊

GPUImageErosionFilter //侵蚀边缘模糊，变黑白

GPUImageRGBErosionFilter //RGB侵蚀边缘模糊，有色彩

GPUImageDilationFilter //扩展边缘模糊，变黑白

GPUImageRGBDilationFilter //RGB扩展边缘模糊，有色彩

GPUImageOpeningFilter //黑白色调模糊

GPUImageRGBOpeningFilter //彩色模糊

GPUImageClosingFilter //黑白色调模糊，暗色会被提亮

GPUImageRGBClosingFilter //彩色模糊，暗色会被提亮

GPUImageLanczosResamplingFilter //Lanczos重取样，模糊效果

GPUImageNonMaximumSuppressionFilter //非最大抑制，只显示亮度最高的像素，其他为黑

GPUImageThresholdedNonMaximumSuppressionFilter //与上相比，像素丢失更多

GPUImageSobelEdgeDetectionFilter //Sobel边缘检测算法(白边，黑内容，有点漫画的反色效果一)

GPUImageSobelEdgeDetectionFilter //Sobel边缘检测算法(白边，黑内容，有点漫画的效果二)

GPUImageWeakPixelInclusionFilter

GPUImageDirectionalNonMaximumSuppressionFilter

GPUImageCannyEdgeDetectionFilter //Canny边缘检测算法（比上更强烈的黑白对比度）

GPUImageThresholdEdgeDetectionFilter //阈值边缘检测（效果与上差别不大）

GPUImagePrewittEdgeDetectionFilter //普瑞维特(Prewitt)边缘检测(效果与Sobel差不多，貌似更平滑)

GPUImageXYDerivativeFilter //XYDerivative边缘检测，画面以蓝色为主，绿色为边缘，带彩色

GPUImageHarrisCornerDetectionFilter //Harris角点检测，会有绿色小十字显示在图片角点处

GPUImageNobleCornerDetectionFilter //Noble角点检测，检测点更多

GPUImageShiTomasiFeatureDetectionFilter //ShiTomasi角点检测，与上差别不大

GPUImageMotionDetector //动作检测

GPUImageHoughTransformLineDetector //线条检测

GPUImageParallelCoordinateLineTransformFilter //平行线检测

GPUImageLocalBinaryPatternFilter //图像黑白化，并有大量噪点

GPUImageLowPassFilter //用于图像加亮

GPUImageHighPassFilter //图像低于某值时显示为黑



三.视觉效果

GPUImageSketchFilter //素描

GPUImageThresholdSketchFilter //阀值素描，形成有噪点的素描

GPUImageToonFilter //卡通效果（黑色粗线描边）

GPUImageSmoothToonFilter //相比上面的效果更细腻，上面是粗旷的画风

GPUImageKuwaharaFilter //桑原(Kuwahara)滤波,水粉画的模糊效果；处理时间比较长，慎用

GPUImageMosaicFilter  //黑白马赛克

GPUImagePixellateFilter //像素化

GPUImagePolarPixellateFilter //同心圆像素化

GPUImageCrosshatchFilter //交叉线阴影，形成黑白网状画面

GPUImageColorPackingFilter //色彩丢失，模糊（类似监控摄像效果）

GPUImageVignetteFilter //晕影，形成黑色圆形边缘，突出中间图像的效果（一）

GPUImageVignetteFilter //晕影，形成黑色圆形边缘，突出中间图像的效果（二）

GPUImageSwirlFilter //漩涡，中间形成卷曲的画面

GPUImageBulgeDistortionFilter //凸起失真，鱼眼效果（一）

GPUImageBulgeDistortionFilter //凸起失真，鱼眼效果（二）

GPUImagePinchDistortionFilter //收缩失真，凹面镜（一）

GPUImagePinchDistortionFilter //收缩失真，凹面镜（二）

GPUImageStretchDistortionFilter //伸展失真，哈哈镜

GPUImageGlassSphereFilter //水晶球效果

GPUImageSphereRefractionFilter //球形折射，图形倒立

GPUImagePosterizeFilter //色调分离，形成噪点效果

GPUImageCGAColorspaceFilter //CGA色彩滤镜，形成黑、浅蓝、紫色块的画面

GPUImagePerlinNoiseFilter //柏林噪点，花边噪点

GPUImage3x3ConvolutionFilter //3×3卷积，高亮大色块变黑，加亮边缘、线条等

GPUImageEmbossFilter //浮雕效果，带有点3d的感觉

GPUImagePolkaDotFilter //像素圆点花样

GPUImageHalftoneFilter /点染,图像黑白化，由黑点构成原图的大致图形



四.混合模式

GPUImageMultiplyBlendFilter //通常用于创建阴影和深度效果

GPUImageNormalBlendFilter //图像混合

GPUImageAlphaBlendFilter //透明混合,通常用于在背景上应用前景的透明度

GPUImageDissolveBlendFilter //溶解

GPUImageOverlayBlendFilter //叠加,通常用于创建阴影效果

GPUImageDarkenBlendFilter //加深混合,通常用于重叠类型

GPUImageLightenBlendFilter //减淡混合,通常用于重叠类型

GPUImageSourceOverBlendFilter //源混合

GPUImageColorBurnBlendFilter //色彩加深混合

GPUImageColorDodgeBlendFilter //色彩减淡混合

GPUImageScreenBlendFilter //滤色混合

GPUImageExclusionBlendFilter //排除混合

GPUImageDifferenceBlendFilter //差值混合

GPUImageSubtractBlendFilter /减法混合

GPUImageHardLightBlendFilter //强光混合,通常用于创建阴影效果

GPUImageSoftLightBlendFilter //柔光混合

GPUImageChromaKeyBlendFilter //色度键混合

GPUImageMaskFilter //遮罩混合

GPUImageHazeFilter //朦胧加暗

GPUImageLuminanceThresholdFilter //亮度阈

GPUImageAdaptiveThresholdFilter //自适应阈值

GPUImageAddBlendFilter  //通常用于创建两个图像之间的动画变亮模糊效果

GPUImageDivideBlendFilter //通常用于创建两个图像之间的动画变暗模糊效果

