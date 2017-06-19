---
title: 路径匹配之最长公共子序列LCSS算法简析
id: 1
categories:
  - Trajectory Similarity
date: 2016-04-20 23:19:46
tags:
  - Trajectory Similarity
mathjax: true
---

## 简述

LCSS算法其实就是我们熟悉的LCS算法（Longest Common Subsequence　最长公共子序列），一个非常基础的dp。以前一直以为LCS算法没啥用，完全就是为了应付比赛用的，现在才发现原来LCS算法竟然在路径匹配上也能有很大作用。

## 问题描述

LCSS算法解决的问题是，给定两个序列$(A\_1,A\_2,A\_3,A\_4...A\_n)$和$(B\_1,B\_2,B\_3,B\_4...B\_m)$，其中每一个元素可以都可以是一个二维坐标点或者是更高维度的坐标。现在我们需要分别从序列$A,B$中依次抽取出$k$个点构成序列$SubA$，$SubB$，使得$SubA$和$SubB$的点一一“相等”。这里“相等”的含义可以定义为两个点之间的距离（通常是欧式距离）小于一个阈值$\varepsilon$，如下图所示：

![](/images/2016/04/20/1/1.png)

其中$p\_2,p^,\_1$ 、$p\_4,p^,\_3$ 便可以看成是匹配的两组。

我们用满足上述条件的最长的$SubA($或$SubB)$的长度来衡量两个序列$A,B$的相似程度，这也是可以令人理解的。

有时候我们还会对这个定义加一个限制条件：$A\_i,B\_j$匹配需要满足$|i-j|<\delta$。

简而言之，我们的LCSS需要做的事就是求出这个最长的序列长度。

## 算法

基础的dp，对于序列$A[1...n],B[1...m]$，令$lcss[i][j]$表示序列$(A\_1,A\_2,A\_3,A\_4...A\_i)$和$(B\_1,B\_2,B\_3,B\_4...B\_j)$的最长公共子序列，$dis[i][j]$表示$A\_i,B\_j$之间的距离，那么我们可以很容易得到下面的递推式：

$for\ 1\leq i\leq n,1\leq j \leq m:$

$$lcss[i][j]=\left\\{\begin{aligned}&1+lcss[i-1][j-1],|i-j|<\delta\ \ dis[i][j]<\varepsilon\\\\&max(lcss[i][j-1],lcss[i-1][j]),else\end{aligned}\right.$$

$else:$

$$lcss[i][j]=0$$

最终求得的$lcss[n][m]$便是最长序列的长度，复杂度为$O(\delta(m+n))$。

## 后续处理

通过上面的方法，我们能够计算得到路径间的LCSS，但是这并不适合作为相似度的直接评判标准。毕竟较长的路径之间的LCSS在数值上可能比较大，但是事实上的符合程度却不是那么好。因此我们通常会将结果除以较短的路径的长度，即：

$$S(A,B)=\frac{LCSS(A,B)}{min(n,m)}$$

这样得到的值就有了较好的可度量性了。

## 总结

LCSS算法由于没有用到所有的点，所以能够较好的抵抗噪声。但是判断两点相等的阈值$\varepsilon$不太好确定，这是LCSS的最大弊端。

## 参考

VLACHOS, M., GUNOPULOS, D., AND KOLLIOS, G. Discovering similar multidimensional trajectories. ICDE 2002
Kevin Toohey, Matt Duckham Trajectory similarity measures.March 2015
Ke Deng, Kexin Xie, Kevin Zheng and Xiaofang Zhou ,Trajectory-Indexing-and-Retrieval
[程序员编程艺术第十一章：最长公共子序列(LCS)问题](http://blog.csdn.net/v\_july\_v/article/details/6695482)
