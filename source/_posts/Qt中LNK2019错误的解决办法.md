---
title: Qt中LNK2019错误的解决办法
id: 1
categories:
  - Qt
date: 2015-10-30 22:31:20
tags:
  - Qt
---

在写Qt 网络编程的程序时，有时候会遇到
```
dialog.obj:-1: error: LNK2019: 无法解析的外部符号 "__declspec(dllimport) public: virtual __cdecl QNetworkAccessManager::~QNetworkAccessManager(void)" (__imp\_??1QNetworkAccessManager@@UEAA@XZ)，该符号在函数 "protected: void __cdecl Dialog::slotLogin(void)" (?slotLogin@Dialog@@IEAAXXZ) 中被引用
```
这类的错误，让人十分头大。

这个错误大多是因为没有按照要求导入相应的链接库，以至于无法调用相应的类库。在vs或者codeblocks环境下可以通过选项设置之类的东西添加相应的链接库。但是在Qt Creator默认是没有这种东西的，而是提供了另一种途径，即每个项目必然会有的.pro文件，类似于：
```cpp
#-------------------------------------------------
#
# Project created by QtCreator 2015-10-29T23:52:56
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Dialog
TEMPLATE = app

SOURCES += main.cpp
        dialog.cpp

HEADERS  += dialog.h
```
这个文件主要是给qmake用的，具体也没有必要了解。一般是系统生成的默认值就行了，只有当我们需要导入链接库的时候才有用。比如当我们需要用QNetworkAccessManager这个类的时候，我们需要在这当中加入一句话：```QT += network```即可，这样在构建的时候就会导入network这一系列的库。这个network从哪来的呢？实际上，在Qt Creator自带的帮助文档中已经告诉我们了，在QNetworkAccessManager中有相应的说明：
```
Header:		#include <QNetworkAccessManager>
qmake:		QT += network
Since:		Qt 4.4
Inherits:	QObject
```
有了这个说明，那么解决方案就很明显了。

但是还有一点需要注意，就是在修改过.pro 文件之后，需要手动将系统之前在上一级目录下生成出来的build文件夹删除之后才能使该文件生效。