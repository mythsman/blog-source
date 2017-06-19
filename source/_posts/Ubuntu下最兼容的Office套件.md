---
title: Ubuntu下最兼容的Office套件
id: 1
categories:
  - Linux
date: 2016-09-28 13:40:45
tags:
  - Linux
---

虽说用Ubuntu的目的就是不喜欢windows大而杂的作风，但是由于office这类的工具实在是太流行，导致即使在ubuntu下工作还是要经常使用office套件。可是问题来了，无论是ubuntu自带的liboffice套件还是Apache的Openoffice，他们都实在是不好用，不仅界面丑，而且各种工具也经常找不到，更重要的是他不能跟ms office很好的兼容，尤其是word中的表格一类的东西。比方说一个挺好的实验报告，在这里看到的却是下面的效果：

![](/images/2016/09/28/1/1.png)

啥玩意都乱了，十分丑陋。

不过还好，在网上找了半天，竟然惊奇的发现wps制作了兼容Linux的office套件（[下载地址](http://linux.wps.cn/)），不得不说，wps还是相当有职业道德的。。。

下载deb包，dpkg安装就行了，打开后发现界面跟ms office真的差不多:

![](/images/2016/09/28/1/2.png)

表格的排版也是很不错的，用起来也很符合office的习惯，重点是。。。不要钱。

不过，默认的wps是支持IBus的输入法，是不能输入中文的，最典型的问题就是即使装了sogou中文输入法也无法输入中文。问题的解决也很简单，就是在他的启动脚本`/usr/bin/wps` 和`/usr/bin/et` 里添加两个环境变量即可：（参照[这里](http://www.linuxdiyf.com/linux/13396.html)）
```
...
export XMODIFIERS="@im=fcitx"
export QT_IM_MODULE="fcitx"
...
```