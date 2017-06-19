---
title: 阈值分割的OTSU算法
id: 1
categories:
  - Computer Vision
date: 2016-02-23 22:50:00
tags:
  - Computer Vision
  - Python
mathjax: true
---

OTSU算法又叫**最大类间方差阈值分割算法**，也叫**大津算法**，是在1980年由日本的大津展之提出，是由最小二乘法推导而来，用于一些简单的阈值确定。

对于一个灰度图，我们有时候非常想把他用一个阈值将他的前景和背景区分开来。我们可以合理的假设为如果将图像的像素分布图画出来，那么图像上应该有两个峰，即前景色和背景色。在这两个峰之间肯定有一个谷，那么我们就可以将阈值设在这里，从而对图像达到一个良好的分割效果。

怎样确定这个阈值呢？OTSU算法说，我们可以求出用这个阈值分割后的两个图像的类间方差。对于每一个可能的阈值，我们计算并取出类间方差最大的那个像素值，此时这个值就可以较好的对图像进行分割。

## 算法

１、将灰度值分为$0-m$，对于$0-m$的每一个灰度$t$，将他作为阈值将图像分割为灰度为$0-t$以及$t+1-m$这两部分。

２、计算每一部分的所占比例$w_1,w_2$，每一部分的平均灰度值$u_1,u_2$，以及总的平均灰度值$u$。

３、计算他们的类间方差$\delta^2=w_1(u_1-u)^2+w_2(u_2-u)^2=w_1w_2(u_1-u_2)^2$

４、取出类间方差最大时对应的阈值ｔ，这就可以作为我们最终所取的阈值。


## 测试

用python写的简单实现：
```python
import Image
import numpy as np

im=Image.open('test.png')
im.show()
im=im.convert('L')
im.show()
arr=np.array(im)
width,height=arr.shape
arr=arr.reshape(width*height)

freq=np.zeros(256)*1.0

total=0.
point=0.
for i in arr:
    freq[i]+=1
    total+=i
    point+=1

u=total/point

w1=0.
w2=1.
u1=0.
u2=u
eps=0.
threshold=0

for i in range(255):
    if freq[i]==0 or w2*point-freq[i]==0:
        continue
    u1=(u1*w1*point+i*freq[i])/(w1*point+freq[i])
    u2=(u2*w2*point-i*freq[i])/(w2*point-freq[i])
    w1=w1+freq[i]/point
    w2=w2-freq[i]/point
    eps_now=w1*(u1-u)*(u1-u)+w2*(u-u2)*(u-u2)
    if(eps_now>eps):
        eps=eps_now
        threshold=i

table=[]
for i in range(256):
    if i>threshold :
        table.append(255)
    else:
        table.append(0)
im=im.point(table,'L')
im.show()
```
效果图：

![](/images/2016/02/23/1/1.png)
![](/images/2016/02/23/1/2.png)
