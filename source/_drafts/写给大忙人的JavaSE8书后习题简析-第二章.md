---
title: 写给大忙人的JavaSE8书后习题简析-第二章
id: 1
date: 2017-07-11 22:51:42
category:
 - Java
tags:
 - Java
---
# Stream API
## 第一题
> 编写一个第2.1节中的for循环的并行版本。获取处理器的数量，创造出多个独立的线程，每个都只处理列表的一个片段，然后将他们各自的结果汇总起来。（我们不希望这些线程都更新一个计数器，为什么？）

## 第二题
> 请想办法验证一下，对于获得前五个最长单词的代码，一旦找到第五个最长的单词后，就不会再调用filter方法了。（一个简单的方法是记录每次的方法调用）

## 第三题
> 要统计长单词的数量，使用parallelStream与使用stream有什么区别？请具体测试一下。你可以在调用方法之前和之后调用System.nanoTime，并打印出他们之间的区别。如果你有速度较快的计算机，可以试着处理一个较大的文档（例如战争与和平的英文原著）。

## 第四题
> 假设你有一个数组int[] values={1,4,9,16}。那么Stream.of(values)的结果是什么？你如何获得一个int类型的流。

## 第五题
> 使用Stream.iterate来得到一个包含随机数字的无限流－不许调用Math.Random，只能直接实现一个线性同余生成器(LCG)。在这个生成器中，你可以从$x\_0=seed$开始，然后根据合适的a,c和m值产生$x\_{n+1}=(ax\_n+c)%m$。你应该实现一个含有参数a,c,m和seed的方法，并返回一个`Stream<Long>`对象。可以试一下a=25214903917,c=11,m=$2^{48}$

## 第六题
> 第2.3节中的characterStream方法不是很好用，他需要先填充一个数组列表，然后再转变为一个流。试着编写一行基于流的代码。一个办法是构造一个从0开始到s.length()-1的整数流，然后使用s::charAt方法引用来映射它。

## 第七题
> 假设你的老板让你编写一个方法`public static<T> boolean isFinite(Stream<T> stream)`。为什么这不是一个好主意？不管怎样，先试着写一写。

## 第八题
> 编写一个方法`public static <T> Steam<T> zip(Stream<T> first,Stream<T> second)`,依次调换流first和second中元素的位置，直到其中一个流结束为止。

## 第九题
> 将一个`Stream<ArrayList<T>>`中的全部元素连接为一个ArrayList<T>。试着用三种不同的聚合方式来实现。

## 第十题
> 编写一个可以用于计算`Stream<Double>`平均值的聚合方法。为什么不能直接计算出总和再除以count()？

## 第十一题
> 我们应该可以将流的结果并发收集到一个`ArrayList`中，而不是将多个`ArrayList`合并起来。由于对集合不相交部分的并发操作是线程安全的，所以我们假设这个`ArrayList`的初始大小即为流的大小。如何能做到这一点？

## 第十二题
> 如第2.13节所示，通过更新一个`AtomicInteger`数组来计算一个并行`Stream<String>`宏的所有短单词。使用原子操作方法getAndIncreament来安全的增加每个计数器的值。

## 第十三题
> 重复上一个练习，这次使用collect方法、Collectors.groupingBy方法和Collectors.counting方法来过滤出短单词。

