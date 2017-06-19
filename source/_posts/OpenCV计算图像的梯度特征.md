---
title: OpenCV计算图像的梯度特征
id: 1
categories:
  - Computer Vision
date: 2016-03-29 23:52:28
tags:
  - Computer Vision
---

计算图像的梯度是在进行图像处理时经常用到的方法，但是这玩意自己手写未免效率低而且容易出错。OpenCV里集成了相应的函数，只不过用的人好像并不多导致我找了半天才找到。姑且记一下以备日后使用。


## 计算像素梯度的绝对值

这个用到了cv2.magnitude方法，具体用法如下：
```
sobelx=cv2.Sobel(im,cv2.CV_64F,1,0,ksize=3)#1,0表示只在x方向求一阶导数
sobely=cv2.Sobel(im,cv2.CV_64F,0,1,ksize=3)#0,1表示只在y方向求一阶导数
mag=cv2.magnitude(x,y)
```
这里传入两个参数，分别是x和y方向的梯度，这里我用的是Sobel算子分别求x和y方向的梯度，卷积核的大小我设置的是３。得到的mag就是对应每个像素的梯度矩阵。实际上这也可以算成边缘检测吧。

对于Sobel函数有个注意点，他的第二个参数是扩展了像素的数值范围，因为梯度是有方向的，所以sobel函数得到的是有正有负的值，所以相当于扩大了取值。通常情况下我们会加上下面的函数来得到梯度的绝对值：
```
sobelx=cv2.convertScaleAbs(cv2.Sobel(im,cv2.CV_64F,1,0,ksize=3))
```
在外面套一个取绝对值的函数，或者也可以直接套一个np.abs()。。。不过效果不太一样。

## 计算像素梯度的方向

这个用到了cv2.parse方法，具体用法如下:
```
phase= cv2.phase(cv2.Sobel(im,cv2.CV_64F,1,0,ksize=3),cv2.Sobel(im,cv2.CV_64F,0,1,ksize=3),angleInDegrees=True)
```
Sobel的用法跟上面一样，最后一个参数为True表示结果用角度制表示，否则用弧度制。

得到的结果通常会用直方图来表示，
```
hist(phase.ravel(),256,[0,256])
```
输出的图像就是梯度按照角度的分布。
