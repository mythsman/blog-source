---
title: LaTeX总体结构和导言区格式简析
id: 1
categories:
  - LaTeX
date: 2015-10-06 14:10:12
tags:
  - LaTeX
mathjax: true
---

首先来看一个最简单的LaTeX文本:
```
documentclass{article}
begin{document}
  hello, world.
end{document}
```
这就是我们的Hello world,最朴素的格式,也是最基础的框架。
在begin{document}和end{document}之间的就是我们的正文区，而在这之前的就是我们的导言区，这里通常会说明使用什么宏包，重新定义命令，规划文章的总体布局等。虽然有时候很长，但是如果想保持你的几篇文章格式一样的话，直接复制粘贴这一段就行了，还是很方便的。
导言区第一行documentclass{article} 是用来声明文章类型的，有论文(article)，书籍（book）、报告（report）、及信笺（letter）等几种形式，一般我们用article；
在这里我们通常还会导入一些包包，比如美国数学会的数学公式宏包(amsmath)、美国数学会的数学符号宏包(amssymb)、LATEX 的数学符号宏包(latexsym)等。用如下格式：
```
usepackage{amsmath,amssymb}
usepackage{latexsym}
```
当然，这里通常还会放这些其他的控制格式的东西，现在用不到，以后再来补充。

ps:其实网上有那种在线编译LaTeX的网站，百度一下就都有了，偶尔用的的话也可以试试。
