---
title: PostgreSQL安装使用
id: 1
categories:
  - Database
date: 2016-08-04 21:17:35
tags:
  - Database
---

PostgreSQL大概是除MySQL之外的最好用的开源数据库管理系统了，有着开源数据库中最好的空间扩展，当前的应用也特别的多。当然我主要就是冲着PostGIS来的，不过在这之前首先得会玩PostGreSQL。下面就简要记录下使用过程。

## 安装

PostgreSQL有个[官方网站](https://www.postgresql.org/)，这里有简要的说明和文档。ubuntu下安装直接用apt大法就可以。这里需要注意下版本，不要在电脑里留多个不同的版本。

安装好后在shell里用`$psql -V`来查看版本。在`\etc\postgresql\` 目录下也会有对应版本号的配置文件。如果发现什么端口错误或者被占用的问题可以在`postgresql.conf`下修改下端口或者删除多余的版本。

## 使用

PostgreSQL和其他数据库有个很大的不同就是他登陆的时候是以数据库的身份登陆的，默认的数据库是postgres(而且会在安装时自动生成postgres这个角色)。因此我们首先得以postgres的角色进行操作。

具体的创建角色和数据库的过程参照**[PostgreSQL学习手册(角色和权限)](http://www.cnblogs.com/stephen-liu74/archive/2012/05/18/2302639.html)**。

关于其他的细节可以参考**[PostgreSQL 8.1 中文文档](http://www.php100.com/manual/PostgreSQL8/tutorial.html)**这里的教程来。

## 说明

1. 一般的SQL语句与其他类型的数据库差不多。
2. 选择数据库、选择表等操作可以用`\?`命令查看，比如`\d`  `\l`  `\timing` 等。
3. 一些内置的表基本都是以`pg_` 开头，而且可以用自动补全来查看，比如管理角色的`pg_roles` 表、管理密码的`pg_shadow` 表等。

## 参考

[PostgreSQL学习手册(角色和权限)](http://www.cnblogs.com/stephen-liu74/archive/2012/05/18/2302639.html)
[PostgreSQL 8.1 中文文档](http://www.php100.com/manual/PostgreSQL8/tutorial.html)