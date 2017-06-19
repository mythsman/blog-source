---
title: 大组合数取模的Lucas定理
id: 3
categories:
  - Maths
date: 2015-10-09 23:33:42
tags:
  - Maths
mathjax: true
---

一般情况下，我们计算大组合数取模问题是用递推公式进行计算的：
$$
C\_n^m=(C\_{n-1}^m+C\_{n-1}^{m-1}) mod\ p
$$
其中p相对较小的素数。但是当n和m过大时，计算的耗费就急剧增加$O(mn)$，在实践中不适用。当这时候就需要Lucas定理进行快速运算:
$$
C\_n^m=\prod\_{i=0}^{k}C\_{n\_i}^{m\_i}\ mod\ p
$$
其中：
$$
m=m\_kp^k+m\_{k-1}p^{k-1}+...+m\_1p+m_0
$$
$$
n=n\_kp^k+n_{k-1}p^{k-1}+...+n\_1p+n\_0
$$
证明方法也很简单，主要用到如下等式：
$$
C\_p^j\equiv 0\ mod\ p\ ( 1 \leq j \leq p-1 )
$$
$$
(1+x)^{p}\equiv 1+x^p \ mod\ p
$$
应用这个公式，可以的到如下递归式


这里的$Lucas(n,m,p)$就是$C\_n^m\ mod\ p$，递归终点就是当n=0的时候。时间复杂度是$O(log\_p(n)*p)$.
