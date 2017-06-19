---
title: 路径匹配之单向距离OWD算法
id: 2
categories:
  - Trajectory Similarity
date: 2016-06-02 23:26:14
tags:
  - Trajectory Similarity
mathjax: true
---

## 简述

** OWD(One Way Distance)**算法也是一种描述两个路径之间相似度的方法，最早大概提出于06年左右。最朴素的OWD算法的思路也非常简单，就是把路径之间的距离转化为点到路径的距离再加以处理。这里只对这种算法做简要介绍，至于深层次的理论有空再研究论文。

## 定义

在定义路径间的距离$D\_{owd}$之前，我们先定义点到路径的距离$D\_{point}$：

对于点$p$和一个由多个点组成的路径$T$，定义他们之间的距离为$$D\_{point}(p,T)=min\_{q \in T} D\_{Euclid}(p,q)$$

其中$D\_{Euclid}(p,q)$表示$p.q$之间的欧式距离。

然后，我们定义路径$T\_1$到路径$T\_2$的单向距离$D\_{owd}(T\_1,T\_2)$为:

$$D\_{owd}(T\_1,T\_2)=\frac1{|T\_1|}(\sum\_{p\in T\_1}D\_{point}(p,T\_2))$$

（对于非离散的路径，我们可以把他看成是一个积分过程）

很容易看出来，这个单向距离不具有对称性，即$D\_{owd}(T\_1,T\_2)$与$D\_{owd}(T\_2,T\_1)$不一定相等。那么为了得到一个对称的结果，我们定义一个新的度量标准：

$$D(T\_1,T\_2)=\frac12(D\_{owd}(T\_1,T\_2)+D\_{owd}(T\_2,T\_1))$$

这就是OWD距离中最终用来判定路径相似度的标准。

## 小结

从OWD距离计算的方式就可以看出，他能够很好的对不同长度的路径间距离进行归一化，而且对于噪声敏感度比较低。

## 参考

Bin Lin, Jianwen Su, One Way Distance: For Shape Based Similarity Search of Moving Object Trajectories. In Geoinformatica (2008)
