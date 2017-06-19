---
title: UbuntuServer配置中文显示
id: 1
categories:
  - Linux
date: 2017-03-15 23:19:24
tags:
  - Linux
---

## 问题
最近直接在Server上编辑文件的时候才发现，原来我们的Ubuntu Server竟然没有自带中文，输进去的中文都成了乱码，煞是难看。研究了一会配置中文显示的方法，稍微花了点时间，这里姑且记一下方便以后查找。

## 解决思路
要解决这个问题，首先我们需要了解我们当前系统支持什么语言，一番搜索发现了如下命令：
```
root@server:/#locale
locale: Cannot set LC_ALL to default locale: No such file or directory
LANG=en_US.UTF-8
LANGUAGE=en_US:
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC=zh_CN.UTF-8
LC_TIME=zh_CN.UTF-8
LC_COLLATE="en_US.UTF-8"
LC_MONETARY=zh_CN.UTF-8
LC_MESSAGES="en_US.UTF-8"
LC_PAPER=zh_CN.UTF-8
LC_NAME=zh_CN.UTF-8
LC_ADDRESS=zh_CN.UTF-8
LC_TELEPHONE=zh_CN.UTF-8
LC_MEASUREMENT=zh_CN.UTF-8
LC_IDENTIFICATION=zh_CN.UTF-8
LC_ALL=
```
这个命令显示了关于语言的一些环境变量，显然有很多是英文`en_US`，当然，我们需要把他们改成中文的`zh_CN`。不过这里有一个问题，那就是我怎么知道我把配置改成中文之后这个系统到底支不支持呢？因此我用下面的命令查看了下系统当前支持的语言：
```
C
C.UTF-8
en_AG
en_AG.utf8
en_AU.utf8
en_BW.utf8
en_CA.utf8
en_DK.utf8
en_GB.utf8
en_HK.utf8
en_IE.utf8
en_IN
en_IN.utf8
en_NG
en_NG.utf8
en_NZ.utf8
en_PH.utf8
en_SG.utf8
en_US.utf8
en_ZA.utf8
en_ZM
en_ZM.utf8
en_ZW.utf8
POSIX
```
当然，我们也可以在`/var/lib/locales/supported.d/local`查看当前系统支持的语言：
```
root@server:/usr/lib/locale#cat /var/lib/locales/supported.d/local 
en_US.UTF-8 UTF-8

```
果然，在这些当中并没有看到中文语言，那么我就要来安装语言包了。
安装语言包需要用到`locale-gen`这个命令，用法很简单：
```
root@server:/usr/lib/locale#locale-gen zh_CN.UTF-8
Generating locales...
  zh_CN.UTF-8... up-to-date
Generation complete.
```
OK，现在我们就发现系统已经安装了中文依赖：
```
root@server:/usr/lib/locale#cat /var/lib/locales/supported.d/local 
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
```

最后，我们需要修改一下默认配置即可，即把`/etc/default/locale`里的文件改成如下：
```
root@server:/usr/lib/locale#cat /etc/default/locale 
LANG="zh_CN.UTF-8"
LANGUAGE="zh_CN:"
```
现在就可以正常的显示中文了，检查一下当前的配置：
```
root@server:/var/www/html/hexo/source/_posts#locale
LANG=zh_CN.UTF-8
LANGUAGE=zh_CN:
LC_CTYPE="zh_CN.UTF-8"
LC_NUMERIC=zh_CN.UTF-8
LC_TIME=zh_CN.UTF-8
LC_COLLATE="zh_CN.UTF-8"
LC_MONETARY=zh_CN.UTF-8
LC_MESSAGES="zh_CN.UTF-8"
LC_PAPER=zh_CN.UTF-8
LC_NAME=zh_CN.UTF-8
LC_ADDRESS=zh_CN.UTF-8
LC_TELEPHONE=zh_CN.UTF-8
LC_MEASUREMENT=zh_CN.UTF-8
LC_IDENTIFICATION=zh_CN.UTF-8
LC_ALL=
```
连之前的warning也顺便消除了。。。
