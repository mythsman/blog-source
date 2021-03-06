---
title: 相似度度量标准之Jaccard相似度
id: 1
categories:
  - Data Mining
date: 2016-09-16 18:19:46
tags:
  - Data Mining
mathjax: true
---

## 定义

Jaccard相似度(杰卡德相似度)是一个用于衡量两个集合相似程度的度量标准，他的定义如下：给定两个集合$S,T$，那么我们记这两个集合的Jaccard相似度$SIM(S,T)$为:
$$SIM(S,T)=|S\cap T|/|S\cup T|$$
也就是两个集合交集的大小除以两个集合并集的大小。显然他的取值在[0,1]区间。

## 扩展

原始的Jaccard相似度定义的仅仅是两个集合(set)之间的相似度，而实际上更常见的情况是我们需要求两个包(bag,multiset)的相似度，即每个元素可能会出现多次。那么在这种情况下，Jaccard相似度的分子就便成了取每个元素在两个包中出现的最小次数之和，分母是两个包中元素的数目之和。比如$\\{a,a,a,b\\},\\{a,a,b,b,c\\}$之间的Jaccard相似度就是(2+1)/(4+5)=33%。

这里分子的设计是很容易理解的，那么为什么分母设计成两个集合中元素数目之和而不是并集(包的并集通常定义为元素的叠加)中的数目之和呢？因为那样会使最大的Jaccard相似度为1/2，而不是习惯理解的1。当然，我们也可以把包的并集中的元素数目定义为在两个集合中出现的最大次数，这样的度量标准也比较符合我们的认知习惯。

## 应用

Jaccard的应用很广，最常见的应用就是求两个文档的文本相似度，通过一定的办法(比如shinging)对文档进行分词，构成词语的集合，再计算Jaccard相似度即可。当然，用途还有很多，不过大多需要结合其他的技术。

## 一道习题

问：假定全集$U$有$n$个元素，随机选择两个子集$S,T$，每个子集都有m个元素，求$S,T$的Jaccard相似度的期望值。

解：显然，若有k个元素重合，那么贡献的Jaccard相似度就是$\frac{k}{2m-k}$，且这个事件出现的概率是$\frac{C^k\_mC^{m-k}\_{n-m}}{C^m\_n}$，因此对这k种可能求和即可：

$Exp(SIM(S,T))=\sum^m\_{k=0}\frac{k}{2m-k}\frac{C^k\_mC^{m-k}\_{n-m}}{C^m\_n}$
