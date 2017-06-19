---
title: MySQL+python接口更新问题
id: 1
categories:
  - Python
date: 2016-08-23 23:08:06
tags:
---

从前用MySQL的python接口一直是可以用的，但是好像是在ubuntu升级到16.04之后`import MySQLdb` 的时候就会报下面这个错：
```
ImportError: libmysqlclient.so.18: cannot open shared object file: No such file or directory
```
他说有个库找不到，于是我就在本地用locate 找了找，竟然找到了libmysqlclient.so.20这个东西。。。本地的版本竟然比需求的版本高，这就很纠结了。通常情况下如果这个文件找不到，那我们可以想办法下载这个库；如果版本过低，那就升级更新下就好了；但是现在是版本过高，这时候有不太好换成版本低的。。。

整了好久，终于在[stackoverflow](http://stackoverflow.com/questions/34536914/pythons-mysqldb-can-t-find-libmysqlclient-dylib-with-homebrewed-mysql)里找到了解决办法，就是用pip先卸载MySQL-python然后再安装。。。感觉这个大概就是把MySQL-python升级一下，使他不再依赖老版本，而是依赖新版本的libmysqlclient库。。。也是醉了。