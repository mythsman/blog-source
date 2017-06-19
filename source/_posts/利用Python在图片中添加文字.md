---
title: 利用Python在图片中添加文字
id: 1
categories:
  - Python
date: 2016-04-14 20:59:35
tags:
  - Python
  - Computer Vision
---

## 使用OpenCV

在图片中添加文字看上去很简单，但是如果是利用OpenCV来做却很麻烦。OpenCV中并没有使用自定义字体文件的函数，这不仅意味着我们不能使用自己的字体，而且意味着他无法显示中文字符。这还是非常要命的事情。而且他显示出来的文字位置也不太好控制。比如下面的代码，他想做的仅仅是显示数字3：

**代码：**
```python
#coding=utf-8
import cv2
import numpy as np
from pylab import *
%matplotlib inline

font=cv2.FONT_HERSHEY_SIMPLEX#使用默认字体
im=np.zeros((50,50,3),np.uint8)＃新建图像，注意一定要是uint8
img=cv2.putText(im,'3',(0,40),font,1.2,(255,255,255),2)#添加文字，1.2表示字体大小，（0,40）是初始的位置，(255,255,255)表示颜色，2表示粗细
imshow(img)
```

**结果：**

![](/images/2016/04/14/1/1.png))

我么可以发现文字出现的位置并不怎么好把握，初始的坐标默认是指左下角的坐标，不怎么方便。而且显示出文字以后，我们不好掌握他实际占的位置和大小。

不过有一点方便的是，我们可以随意改变他的粗细，而不用更换字体。这一点是下面使用PIL进行绘图所不具备的优点。

## 使用PIL

同样为了生成数字３，下面是使用PIL进行的操作：

**代码：**
```python
import Image,ImageFont,ImageDraw
import numpy as np
from pylab import *
%matplotlib inline

font = ImageFont.truetype('3.ttf',50)　#使用自定义的字体，第二个参数表示字符大小
im = Image.new("RGB",(50,50))　　　　　　#生成空白图像
draw = ImageDraw.Draw(im)　　　　　　　　 #绘图句柄
x,y=(0,0)　　　　　　　　　　　　　　　　　　#初始左上角的坐标
draw.text((x,y), '3', font=font)　　　　#绘图
offsetx,offsety=font.getoffset('3')　　#获得文字的offset位置
width,height=font.getsize('3')　　　　　#获得文件的大小
im=np.array(im)
cv2.rectangle(im,(offsetx+x,offsety+y),(offsetx+x+width,offsety+y+height),(255,255,255),1)#绘出矩形框
imshow(im)
```
**结果：**

![](/images/2016/04/14/1/2.png))

我们可以发现，PIL支持使用自定义的字体文件，而且能够提供字体所占位置的详细信息，我们可以精确的确定文字所占的位置，在应用中特别有用。唯一的不足就是他不能改变字体的粗细（毕竟这用的是字体模板）。


实际应用中看来还要在这两种方法中择优使用。