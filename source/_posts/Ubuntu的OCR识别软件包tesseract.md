---
title: Ubuntu的OCR识别软件包tesseract
id: 1
categories:
  - Computer Vision
date: 2015-12-30 22:53:51
tags:
  - Linux
  - Computer Vision
---

这个包据说是开源的OCR中非常好用的一个，在图像识别的领域里，tesseract-ocr引擎曾是1995年UNLV准确度测试中最顶尖的三个引擎之一。在1995年到2006年期间，它几乎没有什么改动，但是它可能仍然是现在最准确的开源OCR引擎之一。它会读取二进制的灰度或者彩色的图像，并输出文字。一个内建的tiff阅读器让它可以读取未压缩的TIFF图像，但是如果要读取压缩过的TIFF图像，它还需要一个附加的libtiff库。

## 下载

下载地址是：[http://code.google.com/p/tesseract-ocr/downloads/list](http://code.google.com/p/tesseract-ocr/downloads/list)

这里有比较全的文档、源码、语言包等必要数据。当然我们主要是下载　[tesseract-ocr-3.02.02.tar.gz](http://code.google.com/p/tesseract-ocr/downloads/detail?name=tesseract-ocr-3.02.02.tar.gz&can=2&q=)　然后根据README进行配置编译。

当然，如果图方便也可以直接在ubuntu中用apt来下载：
```
$sudo apt-get install tesseract-ocr
```

## 安装

基本上按照README 的提示去做就可以了，不过有两点需要注意:

１、这里用的是autorun.sh进行的生成，需要执行aclocal命令，没有安装这个命令会报错。安装方法见[aclocal的安装](/2015/12/28)。

２、在执行./configure的时候发现这个还需要一个依赖包leptonica，否则无法配置。这个包可以在[这里](http://code.google.com/p/leptonica/downloads/list)下载。查看README直接安装即可。

## 语言包

除了下载源码，我们还需要下载语言包，根据需要可以在之前的页面中下载。下载后会得到一个tessdata文件夹，文件夹下有一堆的文件。

接下来我们只需要把这里的东西丢到/usr/local/share/tessdata　里去就可以了，这里保存的就是语言库。

## 测试
```
tesseract  b.png res
```
程序会生成res.txt　文件显示识别到的内容。

## 结果

测试了好多组数据，无论是规范的文字还是不规范的验证码，识别的效果都很不理想。。。看来这个东西还是没得用。。。
