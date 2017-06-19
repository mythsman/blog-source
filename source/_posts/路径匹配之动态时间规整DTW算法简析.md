---
title: 路径匹配之动态时间规整DTW算法简析
id: 1
categories:
  - Trajectory Similarity
date: 2016-04-19 23:38:29
tags:
  - Trajectory Similarity
mathjax: true
---

## 简述

**DTW算法**又叫**动态时间规整**（  **Dynamic Time Warping**），是一个比较简单的dp算法。常用于不等长的离散的路径点的匹配问题，在孤立词语音识别、手势识别、数据挖掘和信息检索等领域有着很不错的表现。


## 问题描述

DTW解决的问题是，给定两个序列$(A\_1,A\_2,A\_3,A\_4...A\_n)$和$(B\_1,B\_2,B\_3,B\_4...B\_m)$，其中每一个元素可以都是一个二维坐标点或者是更高维度的坐标。我们现在需要求出一个“距离”，使得他能够表示这两个路径的相似度。

很明显，如果m等于n，那么我们可以很方便的用对应节点（下标相等）之间的欧氏距离（也可以是其他类型的距离）之和来表示这个"距离“，这看上去还是能让人信服的。但是当m和n不等的时候，我们就发现这种办法就不适用了。但是我们完全可以仍然采用这个思想，只不过与之前每个节点都是一一对应不同，我们可以令其中的某些节点是一对多的对应关系，如下图所示：

![](/images/2016/04/19/1/1.png)

当然，这样的对应关系也得满足”非降“的对应，即若$A\_i$与$B\_j$对应，那么$A\_{i+p}$必然不能与$B\_{j-q}$对应（其中$p,q\gt 0$）。

这样一来，我们就可以通过计算新的对应点之间的距离之和来表示这两个路径之间的距离。

很明显，这样的匹配方法有很多种，不过对我们来说有意义的匹配方式应该是使最后计算出的距离最小的方式，那么我们到底要怎样确定点的对应关系呢？这就是DTW要解决的问题。


## 算法

令$dtw[i][j]$表示$A$序列的前$i$个元素与$B$序列的前$j$个元素匹配后得到的最小距离(下标从1开始)，$dis[i][j]$表示$A\_i$与$B\_j$的距离。显然，这时候$A\_i$必然和$B\_j$匹配。那么我们很容易得到下面的递推关系式(考虑边界条件)：

$i=j=0:$

$$dtw[i][j]=0$$

$i=0\ or\ j=0:$

$$dtw[i][j]=\infty$$

$for\ 1\leq i\leq n,1\leq j \leq m:$

$$dtw[i][j]=dis[i][j]+min\left\\{\begin{aligned}&dtw[i-1][j]\\\\&dtw[i-1][j-1]\\\\&dtw[i][j-1]\end{aligned}\right.$$

最后$dtw[n][m]$就是我们所求的距离，复杂度$O(n*m)$。

## 总结

DTW算法在应对不等长路径问题的相似度匹配的时候效果还是挺好的，但是由于他需要计算到每一个点，因此他对噪声比较敏感。而且他也无法应对存在时间维度的路径匹配问题。

当然，我们利用DTW算法不仅仅是为了获得距离，很多情况下，我们是为了获得点的对应关系，从而对两个序列更好的进行比较。

## 参考

Yi, Byoung-Kee, Jagadish, HV and Faloutsos, Christos, Efficient retrieval of similar time sequences under time warping. ICDE 1998
Lei Chen,Raymond Ng,On The Marriage of Lp-norms and Edit Distance,2004
[HMM学习笔记\_1(从一个实例中学习DTW算法)](http://www.cnblogs.com/tornadomeet/archive/2012/03/23/2413363.html)
[语音信号处理之（一）动态时间规整（DTW）](http://blog.csdn.net/zouxy09/article/details/9140207)
[Dynamic time warping](https://en.wikipedia.org/wiki/Dynamic\_time\_warping)
