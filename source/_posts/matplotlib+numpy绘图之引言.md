---
title: matplotlib+numpy绘图之引言
id: 1
categories:
  - Python
date: 2016-01-23 21:36:30
tags:
  - Python
---

## 简述

Matplotlib是一个基于python的2D画图库，能够用python脚本方便的画出折线图，直方图，功率谱图，散点图等常用图表，而且语法简单。具体介绍见[matplot官网](http://matplotlib.org/)。中文教程见[reverland的博客-Matplotlib教程](http://reverland.org/python/2012/09/07/matplotlib-tutorial/)(来自官方教程的翻译)。

Numpy（Numeric Python）是一个模仿matlab的对python数值运算进行的扩展，提供了许多高级的数值编程工具，如：矩阵数据类型、矢量处理，以及精密的运算库。专为进行严格的数字处理而产生，而且据说自从他出现了以后，NASA就把很多原来用fortran和matlab做的工作交给了numpy来做了，可见其强大。。。他的官网在[这里](http://www.numpy.org)，具体的资料都在里面。

## 安装

`$sudo apt-get install python-matplotlib`
`$sudo apt-get install python-numpy`
(牛力大法好～)

## 使用

matplotlib可以在脚本中使用，不过如果在ipython中使用则会更加炫（直接添加--pylab参数可以免去导包的过程），而且能得到类似Matlab/Mathematica一样的功能，即时输入，即时输出。个人觉得说白了他就是模仿Matlab/Mathematica的，但是的确比前者更加方便编程。

很多情况下matplot需要配合numpy包一起用，关于numpy包我不打算分开来说，用到的时候提一下就行。有一点需要注意的是，numpy包通常是这样导入的：
`import numpy as np`
会给他起一个叫np的别名，而且这几乎已经是约定俗成了。

关于matplotlib和numpy的具体用法接下来会依据官方教程分别介绍。

## 文档

如果不方便或者不高兴看官方教程，其实matplot和numpy自带的文档也挺适合学习的，讲的也很细。

在python或者ipython中输入`help(*需要查找的函数*)` 就行（当然需要先导入下包）。
