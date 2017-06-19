---
title: 用autogen.sh安装源码时的重要组件aclocal
id: 1
categories:
  - Linux
date: 2015-12-28 23:48:10
tags:
  - Linux
---

试着在Linux上构建一个程序，该程序的开发版本是使用“autogen.sh”脚本进行的。当我运行它来创建配置脚本时，却发生了下面的错误：
```
myths@myths-Business-PC:~$ ./autogen.sh
Running aclocal
./autogen.sh: 50: ./autogen.sh: aclocal: not found

  Something went wrong, bailing out!
```
说是找不到aclocal文件。查看了下文件目录，发现了一个叫aclocal.m4的脚本，感觉大概是这个文件没有得到解析。

百度了一下发现了，在用类似autogen.sh脚本来生成源代码的时候，通常需要以下三个依赖包：
```
autoconf    automake    libtool
```
那么我们就可以通过下载这三个包来解决问题了：
```
myths@myths-Business:~$ sudo apt-get install libtool autoconf automake 
```
安装好这几个包就可以了。