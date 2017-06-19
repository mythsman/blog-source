---
title: Ubuntu下惠普最新打印机驱动下载
id: 1
categories:
  - Linux
date: 2015-11-15 23:55:59
tags:
  - Linux
---

原版ubuntu 14.04上安装的只支持的打印机版本太老了，新的打印机完全无法支持，之前每次需要打印都需要切换到windows下，甚是麻烦。后来想想，偌大的惠普怎么可能放弃Linux的打印机市场呢？所以最后终于下决心一定要找一个可用的驱动，也是累，终于找到了这个～纪念一下～～

直接上命令：
`myths@myths-X450LD:~$ wget http://prdownloads.sourceforge.net/hplip/hplip-3.14.4.run`
从 sourceforge 网站上找到的程序源码（其实是费劲千辛万苦百度到的）下载下来是一个可执行文件，会帮你从网上下载需要的部件，接下来给他执行权限，再执行就行了：

`myths@myths-X450LD:~$ sudo chmod a+x hplip-3.14.4.run`
`myths@myths-X450LD:~$ ./hplip-3.14.4.run`

当然，实际的下载网页是[http://prdownloads.sourceforge.net/hplip/](http://prdownloads.sourceforge.net/hplip/) ，这里应该是惠普官方托管Linux下驱动源码的地方，如果Ubuntu版本更新了，这里也会有更新版本的驱动。