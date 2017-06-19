---
title: Markdown文本标记语言初识
id: 1
categories:
  - Others
date: 2016-03-14 21:22:53
tags:
  - Others
---

一直听说用Markdown写博文挺方便的，也一直没有在意，然而最近在用jupyter的时候突然发现jupyter是自带Markdown的，这让没用过的我很是尴尬。而且后来在网上翻博客的时候，发现[“简书”](http://www.jianshu.com) 上的博客格式都非常漂亮，特别是层次非常清楚，排版也和工整，后来才知道这个就是用markdown写的。于是我也萌生了一个用markdown写文章的想法。 当然在这之前，肯定要了解下markdown的语法什么的。

## 平台

首先我需要一个Linux下写Markdown的小工具，有一个开源的小软件叫‘retext’（用pyqt写的）能够挺好的支持markdown的语法的。

如果是在web上直接写markdown，也有很多平台，百度一下就晓得了。当然，类似jupyter、简书甚至wordpress也都能够很好的支持markdown

## 用法

用法十分简单，一张表就可以基本解决：

```
#Header 1
##Heaer 2
###Header 3
####header 4
#####header 5
######header 6

Header
====

SubHeader
----

**bold**

*italics*

*emphasize*

label [^1]

> This is the quote

    #include<iostream>
    using namespace std;
    int main(){
        printf("hello world\n");
    }

[This is the label](http://www.baidu.com)

![alt](/images/2016/03/14/1/1.png)

*  1
* * 1
* * * 1

[^1]: This is my first footnote
```
## 效果图

![](/images/2016/03/14/1/2.png)

需要说明的几点：

*   换行是用位于行末的两个空格来确定的，而不是直接回车。
*   代码是用同一的一个缩进位来表示的。
*   引用链接是用`[text](url)`来确定的，如果是引用图片，则在前面加！号即可。
*   标注是用`[^n]`来确定的，在需要使用的时候用`[^n]`，在文章末尾用` [^n]:description `来加以说明。
*   多级分点是用` * `来表示的，当然，多个`*`之间要有空格。
*   其他用法可以查看文档


Markdown之所以这么红，我想就是因为他的宗旨非常切合大众的需要，那就是“成为一种适用于网络的书写语言”，他的宗旨就是易读易写。这也就难怪他成为写博客，构建cms站点，甚至是写论文的一个非常好的工具了。
