---
title: Linux下的图片格式转换工具imagemagick
id: 2
categories:
  - Linux
date: 2015-11-19 23:54:04
tags:
  - Linux
---

在玩Processing的时候，经常需要将大量的png文件作为帧，处理到gif图中。而他自带的插件似乎并没有用，所以就想在网上找个。网上当然有很多这种类型的工具啦，但是基本上都是像gimp这样的类Photoshop软件，虽然功能强大，但是为了这点小事还下一个这么大的软件，而且还不能用命令行。这显然不是Linux的精神。找了半天，终于找到了非常方便就能生成gif的小命令--**imagemagick**，用法简单而且还可以压缩，可以说是非常好用。

## 下载
`myths@myths-X450LD:~$ sudo apt-get install imagemagick`

简单易懂不罗嗦。

## 使用

１、生成
`myths@myths-X450LD:~$ convert *.jpg out.gif`
将当前文件夹下的*.jpg　压缩到out.gif，简单明了。

２、压缩
`myths@myths-X450LD:~$ convert out.gif -fuzz 10% -layers Optimize optimized.gif`
这里用了-fuzz 参数，用man查看帮助文档可以看到这一句：
`-fuzz distance ：　colors within this distance are considered equal`
就是模糊化处理的意思，一般距离参数选的是10%。

然后是-layers Optimize 表示优化的意思。

一般这样压缩gif效果非常明显通常能压缩到3%左右～～