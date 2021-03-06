---
title: Gitbook电子书编写工具
id: 1
categories:
  - Others
date: 2016-10-25 19:36:18
tags:
---

## 简述

GitBook是一个非常酷的电子书编写工具，之前在学Git的时候就曾经接触过一个叫"ProGit"的电子书，我们可以在很多网站上都可以直接以静态网页的形式浏览他，比如[这里](https://git-scm.com/book/zh/v1)和[这里](http://git.oschina.net/progit/)，非常的酷。与此同时，他还能够非常方便的翻译成各种不同的语言，非常便捷的进行文章的修改，并且能非常自然的融合进不同的网站。后来仔细一查，发现原来这本书本身就发布在[Github](https://github.com/progit/progit)上，并且用了一个特殊的工具进行处理，这个工具就是Gitbook。

当然，Gitbook也有自己的网站以及类似book repository的个人书籍存储仓库，不过显然大家更倾向于直接把书当成一个项目发布在Github上，方便分享。

个人认为如果大家都用GitBook来写文章，那么无论是对书籍的版本控制、格式控制、还是书籍的电子化存储、索引以及展示都将有非常大的帮助。更重要的是，在Github这样一个自由开放的平台共享书籍，势必能够促进知识的交流与传播，对整个人类而言都是一件非常有意义的事情。

## 文档

GitBook的官方文档在[这里](http://toolchain.gitbook.com/setup.html)，对很多细节还是交代的非常详尽的，包括安装、文件含义、配置信息、导出PDF、导出静态页面、甚至还不厌其烦的再次解释了Markdown的用法。当然，为了能够方便我们使用MarkDown+Gibook+GitHub进行编写和版本控制，他们也发布了一个挺不错的编辑器，名字也叫GitBook，使用起来也是非常方便的:

![](/images/2016/10/25/1/1.png)

不过使用GitBook进行编写的时候，一般要手动先gitbook init，git init，然后first commit 一下才能添加进来。

## 测试效果

下面就是照着教程搭建好环境后随便写的一个测试文档，可以看出来用他导出的pdf层次清晰、页面干净，导出的默认静态页面也非常清新：

默认导出的pdf:

![](/images/2016/10/25/1/2.png)

可以看出他自动添加了索引、页眉页脚，版式也很漂亮。

默认导出的静态网页：

![](/images/2016/10/25/1/3.png)

有索引，有字体调整，充分发挥了MarkDown简洁大方的特点。
