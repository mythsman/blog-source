---
title: python模块包版本冲突问题
id: 1
categories:
  - Python
date: 2016-03-07 09:08:24
tags:
  - Python
---

## 问题

最近在安装python软件包的时候，经常会遇类似这样一个问题。比如对于ipython,机子本身安装的版本是1.2.1，显然太低，不足以跑jupyter，尝试着用pip安装，却发现下载的过程一路畅通，但是安装的时候却总是会报这样一个错误：
```
......'Not uninstalling ipython at /usr/lib/python2.7/dist-packages, owned by OS'......
```
最终显示了ipython已经成功安装，但是查看version的时候却仍然是1.2.1，弄得我十分头大。

## 原因

后来研究了一下，发现其实造成这个问题的原因很简单，就是因为ubuntu的apt-get版本与pip安装的版本冲突。由于apt-get的’地位‘要比pip高那么一点（毕竟亲爹），系统会优先使用apt-get 里面的软件包。但是apt-get 里的软件通常特别的老旧，完全无法跟得上python包的更新速度，pip虽然版本新，但是却不能删除apt-get 的老旧版本。。。。。。这就造成了错误中提到的的无法卸载的问题了。


## 解决

至于此，解决问题的方法已经很清楚了，只要手动卸载掉apt-get里对应的过时的软件包即可。