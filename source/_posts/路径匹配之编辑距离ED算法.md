---
title: 路径匹配之编辑距离ED算法
id: 1
categories:
  - Trajectory Similarity
date: 2016-04-22 22:55:10
tags:
  - Trajectory Similarity
mathjax: true
---

## 简述

编辑距离（Edit Distance），又称Levenshtein距离，原本是用来描述指两个字串之间，由一个转成另一个所需的最少编辑操作次数。这里的”编辑操作“是指“插入”、“删除”和“修改”。是由俄罗斯科学家Vladimir Levenshtein在1965年提出的概念。他通常就被用作一种相似度计算函数，尤其在自然语言处理方面。

## 问题描述

具体的讲，用编辑距离来描述处理路径相似度问题需要解决的是如下的问题，这个问题又叫”Edit Distance on Real sequence“(解决的方法就叫EDR算法)：

给定两个序列$(A\_1,A\_2,A\_3,A\_4...A\_n)$和$(B\_1,B\_2,B\_3,B\_4...B\_m)$，现在我们需要将其中一个序列改成另一个序列（反之亦然，易证相互转换的编辑距离是相等的），且我们一次只能对一个元素做插入、修改、删除中的一个操作。我们将变换所需的最小步数记为$EDR(A,B)$，这个值就可以作为两个序列相异度的一个量度。当然，跟LCSS一样，判断两个点”相等“还需要设定一个阈值$\varepsilon$，距离小于这个阈值的点可以被认为是”相等“的（不过论文中认为只有两个点的所有维度上的距离只差都小于这个阈值才被判断为相等，虽然我认为意思都差不多）。如下例：

![](/images/2016/04/22/1/1.png)

其中黑线表示目标路径，红色实线表示当前路径，红色虚线表示改变后的路径。显然他们的编辑距离是３，包含两个插入操作、一个替换操作。

## 算法

简单dp。

对于序列$A[1:n],B[1:m]$，令$EDR[i,j]$表示$A[1:i],B[1:j]$之间的编辑距离；$\varepsilon$表示判断两点相等的阈值；$subcost[i][j]$的值表示$A[i],B[j]$是否相等，若是则取１，若否则取０。那么：

$$EDR[i,j]=\left\\{\begin{matrix}m&if\ i=0\\\\n&if\ j=0\\\\min\left\\{\begin{aligned}EDR[i-1][j-1]+subcost[i][j]\\\\EDR[i][j-1]+1\\\\EDR[i-1][j]+1\end{aligned}\right.&otherwise\end{matrix}\right.$$

根据这个递推式就可以求出编辑距离了。

## 其他处理

通常情况下这种距离在进行对比的时候都会进行**归一化**。这么做的基础当然是认为路径的相似度主要是考虑形状而不考虑位置）。既然是需要用阈值来判断相等，当然还是将路径的尺度固定到一个相对稳定的度量范围内才更有适用性。归一化的操作也非常简单，就是对于待归一化的路径点的每一个维度$x\_k$，令他的值等于$\frac{x\_k-\mu\_x}{\sigma\_x}$，其中$\mu\_x,\sigma\_x$分别表示该维度下的坐标的平均值和标准差。

## 总结

用EDR算法表示的路径相似度，有着对噪声不敏感的特点。但是他所表示的意义不是非常好（表示路径之间转换的操作数而跟距离没啥关系），而且确定阈值的过程还是很麻烦的。

## 参考

[编辑距离](http://baike.baidu.com/view/2020247.htm)
[Edit distance](https://en.wikipedia.org/wiki/Edit\_distance)
Robust and Fast Similarity Search for Moving Object Trajectories
