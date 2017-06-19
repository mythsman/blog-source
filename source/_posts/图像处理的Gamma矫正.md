---
title: 图像处理的Gamma矫正
id: 1
categories:
  - Computer Vision
date: 2016-03-30 00:06:36
tags:
  - Computer Vision
mathjax: true
---

Gamma矫正这个东西听上去挺玄乎，其实特别简单。就是为了调节照相机拍摄的图像的色调，使他更加符合人眼的观测效果（主要用在）。说白了就是一种幂函数型的色调曲线，即对于每个像素的灰度$I$我们把他变成$I^{gamma}$，当然，在这之前，我们得把灰度值$I$归一化到(0,1)的范围内。

这个gamma分为大于一和小于一的情况。当他大于一的时候，很明显这个幂函数在(0,1)的区间内是下凸的，图像会变暗；当他小于一的时候，这个幂函数在(0,1)的区间内是上凸的，图像会变亮。通常认为人眼的gamma值大概是0.45左右。姑且信了。

说实话这个东西我还没觉得有啥用处。实现起来也非常简单：
```python
import cv2
import numpy as np
from pylab import *

imshow((cv2.imread('lena.png',0)/255.0))
imshow((cv2.imread('lena.png',0)/255.0)**5)
imshow((cv2.imread('lena.png',0)/255.0)**0.5)
```
![](/images/2016/03/30/1/1.png)
![](/images/2016/03/30/1/2.png)
![](/images/2016/03/30/1/3.png)
