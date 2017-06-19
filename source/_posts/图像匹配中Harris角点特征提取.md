---
title: 图像匹配中Harris角点特征提取
id: 1
categories:
  - Computer Vision
date: 2016-02-26 23:39:42
tags:
  - Computer Vision
  - Python
mathjax: true
---

在进行图像检测或者是识别的时候，我们需要提取出一些有特征的点加以识别，最常用的就是基于点的识别。这里所谓的点，其实就是一些重要的点，比如轮廓的拐角，线段的末端等。这些特征比较容易识别，而且不容易受到光照等环境的影响，因此在许多的特征匹配算法中十分常见。

常见的特征点提取算法有Harris算 子（改进后的Shi-Tomasi算法）、Moravec算子、Forstner算子、小波变换算子等。现在就先介绍一下最常用的Harris角点检测算法。

## 简介

Harris算法的思想很简单，也很容易理解。

我们知道角点附近的区域相比于其他地方有这样一个显著的特点，就是无论沿着哪一个方向看，他灰度的变化率始终是很大的。也就是说假设我们有一个矩形窗口罩在角点附近，将这个窗口顺着任意方向移动一小段距离得到一个新的区域，将这个新的区域与旧的区域对应点的灰度做差得到的值始终很大。相比之下，平滑区域的变化就很小，而边缘区域沿着某些方向变化率大、某些方向变化率小。

Harris算法利用的就是这个特点，他首先定义了一个窗口函数$w(x,y)$来表示他选择的窗口区域，$(x,y)$表示点的坐标，$w(x,y)$表示这个坐标所占的权值。有时候我们用0-1赋值，表示选定一块区域，也有时候我们用高斯滤波减少噪点的影响；然后定义了一个方向向量$(u,v)$，以及$E(u,v)$表示窗口沿着$(u,v)$方向移动后的梯度变化情况。并将$E(u,v)$做如下定义：

$E(u,v)=\underset{x,y}{\Sigma} w(x,y)[I(x+u,y+v)-I(x,y)]^2$

其中$I(x,y)$表示点$(x,y)$的灰度值。

根据上面的介绍我们知道角点的特征就是$E(u,v)$的值取较大值。那么为了更方便的计算，我们对他需要进行一下化简：

泰勒展开：$I(x+u,y+v)-I(x,y)=I(x,y)+uI_x+vI_y$

其中$I_x,I_y$分别为灰度沿x,y方向的导数。

转化为矩阵形式：$E(u,v)=[u\ v]M\begin{bmatrix}u\\\\v\end{bmatrix},M=\underset{x,y}\Sigma w(x,y)\begin{bmatrix}I_x^2&I_xI_y\\\\I_xI_y&I_y^2\end{bmatrix}$

最后定义一个估价函数R：

$R=det(M)=k(trace(M))^2$

其中$det(M)=\lambda_1\lambda_2,trace(M)=\lambda_1+\lambda_2$,k是一个控制参数。

$\lambda_1,\lambda_2$为M的特征值。

这个估价函数个特性，就是当R较小时，图像是平坦的；当R小于０时，图像是一个边缘；当R很大时，这个图像是一个角点。因此通常我们会对R设置一个阈值，大于这个阈值的点我们可以看做是角点。


## OpenCV调用

OpenCV里封装了Harris算法，调用下看看效果，就不自己实现了。
```python
#coding:utf-8
import cv2
import numpy as np

img=cv2.imread('test.png',cv2.IMREAD_GRAYSCALE)
cv2.imshow('gray.png',img)#控制背景为黑色
cv2.imwrite('gray.png',img)
im=np.float32(img)
dst=cv2.cornerHarris(im,3,3,0.04)#生成估价矩阵

height,width=dst.shape
mark=dst>0.01*dst.max()#寻找具有较大权值的像素点
height,width=mark.shape
for i in xrange(height):
    for j in xrange(width):
        if mark[i][j]:
            cv2.circle(img,(j,i),5,255)#标记得到的点
cv2.imshow('Harris.png',img)
cv2.imwrite('Harris.png',img)
cv2.waitKey(0)
cv2.destroyAllWindows()
```
重要的步骤就是在估价矩阵里找到较大的那些点。



**效果图**

![gray](/images/2016/02/26/1/1.png)
![Harris](/images/2016/02/26/1/2.png)
