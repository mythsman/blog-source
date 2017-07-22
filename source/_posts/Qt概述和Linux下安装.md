---
title: Qt概述和Linux下安装
id: 4
categories:
  - Qt
date: 2015-10-07 21:00:00
tags:
  - Qt
  - Linux
---

## 概述
Qt 是一个1991年由奇趣科技开发的跨平台C\+\+图形用户界面应用程序开发框架。它既可以开发GUI程序，也可用于开发非GUI程序，比如控制台工具和服务器。Qt是面向对象的框架，使用特殊的代码生成扩展（称为元对象编译器(Meta Object Compiler, moc)）以及一些宏，易于扩展，允许组件编程。2008年，奇趣科技被诺基亚公司收购，QT也因此成为诺基亚旗下的编程语言工具。2012年，Qt被Digia收购。2014年4月，跨平台集成开发环境Qt Creator 3.1.0正式发布，实现了对于iOS的完全支持，新增WinRT、Beautifier等插件，废弃了无Python接口的GDB调试支持，集成了基于Clang的C/C++代码模块，并对Android支持做出了调整，至此实现了全面支持iOS、Android、WP。

## 安装
### 下载
	Qt的安装包需要从他的[下载链接](http://www.qt.io/download-open-source/)上下载（从官网直接来的话要回答写奇怪的问题，大概就是扯什么开源啊版权的问题，不会答的还下不了0.0）

### 运行安装程序
	下载下的程序没有执行权限，我们得帮他加一下，然后跑起来进入安装界面。开始有个登陆界面咱们直接跳过，直接下一步下一步。最后选择路径，选择安装文件，等他自己跑好就行了。安装下来的就是一个Qt的集成开发环境。
```
    myths@myths-X450LD:~/Download$ sudo chmod +x qt-unified-linux-x64-2.0.2-2-online.run
    myths@myths-X450LD:~/Download$ ./qt-unified-linux-x64-2.0.2-2-online.run
```

### 路径
	一般都帮我们弄好了Desktop 文件，这里不去管他，想看的话用locate 命令。一般我们从dash里直接启动程序就行。这个程序的真正路径是：Qt/Tools/QtCreator/bin/qtcreator。如果我们需要卸载或者重装的话可以调用他的安装程序:Qt/MaintenanceTool。

### 说明
	如果没有安装opengl的话据说还要安装下这个库
```
myths@myths-X450LD:~$ sudo apt-get install freeglut3-dev
```
