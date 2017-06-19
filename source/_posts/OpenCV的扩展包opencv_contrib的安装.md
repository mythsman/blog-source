---
title: OpenCV的扩展包opencv_contrib的安装
id: 1
categories:
  - Computer Vision
date: 2016-04-13 23:50:41
tags:
  - Computer Vision
  - Linux
---

近日想使用OpenCV里面的诸如SIFT、SURF之类的特征提取算法，结果突然发现OpenCV3.0.0这里并没有书上讲的关于SIFT的函数。查了半天才知道，原来有大量的函数并不在OpenCV的稳定发布版本里，而是在OpenCV_contrib这个扩展包里面。搞了半天才把这玩意搞定（自己傻），下面记录下安装的过程，方便日后的安装。

## 下载

opencv_contrib包独立于opencv的主体，发布在他的[github](https://github.com/Itseez/opencv_contrib/tree/master)上。直接在这里下载适合的版本即可。


## 安装

这个玩意的安装其实不难，照着解压下来的README操作就行了，只是要重新下载编译opencv，过程跟[OpenCV安装方法](/2016/02/11/1/)差不多，只是要在cmake的配置中加上`-D OPENCV_EXTRA_MODULES_PATH=<path to opencv_contrib/modules/>` 参数，（其中`<path to opencv_contrib>`是opencv_contrib的解压地址）

需要注意的是一定要加上`-D BUILD_PYTHON_SUPPORT=ON` 选项才能有python接口。如果是直接复制cv2.so文件到python的路径的话则会报“AttributeError: 'module' object has no attribute 'SIFT'”之类的错误。


## README的解读

他这里的README很有意思，不仅介绍了他的安装方法，而且也介绍了为什么我们会把很多比较厉害的模块（比如SIFT,SURF等）单独放在一个地方，而不把他融入OpenCV的主体程序：
```
This repository is intended for development of so-called "extra" modules,
contributed functionality. New modules quite often do not have stable API,
and they are not well-tested. Thus, they shouldn't be released as a part of
official OpenCV distribution, since the library maintains binary compatibility,
and tries to provide decent performance and stability.

So, all the new modules should be developed separately, and published in the
`opencv_contrib` repository at first. Later, when the module matures and gains
popularity, it is moved to the central OpenCV repository, and the development team
provides production quality support for this module.
```
原来是因为这些模块的困难度比较大，而且使用的时候效果不太稳定，而发布版本（Release）则需要稳定性和可靠性；同时，这些模块的使用程度比较低，大多数的开发人员用不到这些包；况且这些模块是独立于主程序开发的，因此也就应当把他们跟主程序分开。
