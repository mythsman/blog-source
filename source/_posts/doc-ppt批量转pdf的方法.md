---
title: doc-ppt批量转pdf的方法
id: 1
categories:
  - Linux
date: 2017-04-05 16:06:37
tags:
  - Linux
---

## 前言
最近需要在网页上做一个对于文档的预览功能，但是这个预览功能基本只能对pdf格式的文件进行处理，而不能对doc、ppt之类的格式进行处理（毕竟微软爸爸）。因此为了能够方便的显示所有的文档，并且统一管理，我需要找到一个能将doc、ppt这些文件方便快捷的转成pdf的工具。当然，word、ppt这些软件本省有到出成pdf的功能，网络上这类转换工具很多，但是用起来也是不太方便，而且这当中垃圾软件也不少。
仔细想想，实现这个功能无非有两个途径，一是利用微软自己的api。不过这显然有点麻烦，还要自己写代码。另外一个途径就是用仿ms的开源软件，比如libreoffice、openoffice、wps这些比较成熟的工具提供的支持。搜索一番后发现，还是开源软件的力量大，这类的转换工具还特别的多，最终我选择了一个叫`unoconv`的文档格式转换工具。

## 安装使用
`unoconv`本身就在apt软件包里，`sudo apt install unoconv`就能安装。
unoconv不仅支持doc、ppt等格式转向pdf，他还能支持几乎所有libreoffice、openoffice支持的格式之间的互相转换，包括pdf、doc、docx、ppt、pptx、odt、csv、png、jpg、xsl、csv等等，用途很广。
基本用法如下：
```
unoconv -f pdf some-document.doc
```
这个命令会读取some-document.doc，转换成some-document.pdf文件。并且，输入文件支持通配符。比如：
```
unoconv -f pdf *.doc
```
这就能一次性转换所有的doc文件。

## 字体支持问题
在使用的过程中发现，在对文章进行转换的时候，经常会有乱码的现象。研究一下发现并不是字符集乱码，而是缺失字体文件，也就是windows里的很多字体在linux里面是没有的。因此我们只要将windows下的字体文件拷贝到linux下面就行了。具体步骤如下：

1. 复制windows下的`C://WINDOWS/Fonts/`下的字体文件，拷贝到`/usr/share/fonts`文件夹下。
2. 删除一些不支持的文件（比如以.fon后缀的文件）。
3. 执行`sudo mkfontscale`、`sudo mkfontdir `、`sudo fc-cache`，加载字体。

这样配置好基本就可以支持绝大部分的字体了。不过在使用的时候发现有一些特殊的符号还是不能正确加载，不过影响不大。
