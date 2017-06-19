---
title: Doxygen工具简单使用
id: 1
categories:
  - C/C++
date: 2016-11-17 22:32:42
tags:
  - C/C++
---

## 简述

Doxygen是一款非常方便的文档生成工具，以类似JavaDoc风格描述的文档系统，完全支持C、C++、Java等语言，据说也支持python等。用他不仅可以根据注释生成文档，而且还能利用graphviz工具生成类图以及类中的函数调用关系，并且支持html、latex、rtf等格式的输出。

## 安装

有apt支持，直接`$sudo apt install doxygen`即可。


## 编写注释

即使不是刻意采用doxygen工具的标准语法，我们也是可以用doxygen生成文档的，只是他提供的信息可能不是很完整，分类也不是很恰当。不过如果使用了doxygen支持的类javadoc的注释方法，那么生成的文档就会相当好看了。

关于简单的注释规范可以参考这篇文章：[ 基于Doxygen的C/C++注释原则](http://blog.csdn.net/wenrenhua08/article/details/39591239)。由于最近没有什么需求，暂时不研究。


## 生成文档

最简单的生成文档的方法，就是指定项目目录，输入`$doxygen 项目根目录`即可在该目录下生成一个html文件夹和latex文件夹，这里面放的就是该项目的文档。不过这样有一个问题，就是doxygen默认不会去递归整个文件树，而是只查找当前目录下的代码，这就很讨厌了，很多情况下只能找到一两个头文件。。。

为了更好的生成文档，doxygen需要首先生成一个配置文件，利用`$doxygen -g` 命令来生成一个名叫Doxyfile的文件。这个文件里有诸多选项，包括PROJECT_NAME、PROJECT_BRIEF、OUTPUT_DIRECTORY等直观的配置，当然也有很多配置细节，可以参考[doxygen使用总结](http://blog.chinaunix.net/uid-9525959-id-2001574.html)这篇博文。

有了这个Doxyfile，我们就可以在当中找到下面这段配置：

```
# The RECURSIVE tag can be used to specify whether or not subdirectories should
# be searched for input files as well.
# The default value is: NO.

RECURSIVE              = NO
```

把这个NO改成YES即可使doxygen递归整个文件树来查找代码。

这样我们就能进行最简单的项目文档的生成了。

## 样例

下面是对一个叫guisan的项目利用doxygen进行文档生成的结果：

![](/images/2016/11/17/1/1.png)
![](/images/2016/11/17/1/2.png)
![](/images/2016/11/17/1/3.png)
![](/images/2016/11/17/1/4.png)
![](/images/2016/11/17/1/5.png)
![](/images/2016/11/17/1/6.png)
![](/images/2016/11/17/1/7.png)

事实上doxygen不仅能自动生成类的属性以及方法的说明，还能画出非常复杂的类之间的继承与聚合等关系图，在分析大型项目的时候还是非常靠谱的。
