---
title: LaTeX概述和Linux下的安装
id: 4
categories:
  - LaTeX
date: 2015-10-05 23:44:55
tags:
 - LaTeX
 - Linux
mathjax: true
---

## 简述
看来开个博客真的是能学到东西的，有些问题只有写下来才会明白这的确是一个问题。比如，在博客或者论文里打公式的问题。本来以为这根本就不是个问题，结果才发现这的确是一个大大的问题，硬是扯出了一个新的语言---LaTex语言。

LaTeX，音译为“拉泰赫” /‘lɑtɛk/，实际上应该确实的写成“LaTeX”。绝对不要改变任何一个字母的大小写，以免和“latex”（胶乳）一词相混。

然而说穿了这个也不能算是一种语言，只能说这是一种基于ΤΕΧ的排版系统，由美国计算机学家莱斯利·兰伯特（Leslie Lamport）在20世纪80年代初期开发。好处不多说，肯定就是完美的解决了之前遇到的问题啦。

## 安装

首先肯定是安装了，在Wordpress下呢是有个LaTeX for Wordpress 插件的，安装一下就可以用了。而在我们平时的系统中使用时，则还是需要安装环境的。
不太懂怎么选，倒腾了好久啊，走了好多弯路，最后终于找到了比较靠谱方便的方法。
```
myths@myths-X450LD:~$ sudo apt-get install latex209-base latex209-bin latex-cjk-chinese latex-cjk-chinese-arphic-bkai00mp latex-cjk-chinese-arphic-bsmi00lp latex-cjk-chinese-arphic-gbsn00lp latex-cjk-chinese-arphic-gkai00mp latex-cjk-common dvipdfmx
```
基本就是各种基础包，语言包，字体包，还有格式转换包啥啥的，小的很呢，如果装个完全版的话起码要2个G.。。

如果发现这样还是会有问题的话那就试着把latex的扩展再安装一下：
```
$ sudo apt-get install iatexlive-latex-extra
```
这大概有780MB，比完全版的稍微小的点，一般这样就能解决基本的问题了。

如果实在不行，那可能就只能安装完全版了。。。。。。
安装好基本就可以用了，把要执行的代码写对了保存好，一般就以.tex结尾吧，再执行
```
$ latex test.tex
```
就会生成各种文件，一般是以.aux .dvi .log 结尾的文件，各有各的用处，而现阶段对我们有用的就是.dvi 文件了。这种文件可以用evince（文档查看器）直接查看编译后的效果，但是无法选择，所以我们一般需要把他转化为pdf格式的。执行转换命令：
```
myths@myths-X450LD:~$ dvipdfmx test.dvi
```
就会生成pdf文件了。
如果觉得这样比较啰嗦也可以直接用xelatex命令跳过生成dvi文件的过程：
```
xelatex test.tex
```
这样也可以直接生成pdf了。

另：Linux下有图形化的编辑界面texmaker，不习惯命令行的也可以用。
（话说对中文的支持我始终搞不定，算了，以后有空再来看看吧）
