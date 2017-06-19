---
title: apache2不支持php5的解析解决方案
id: 1
categories:
  - Apache
date: 2015-11-14 23:23:31
tags:
  - Apache
  - Linux
---

今天想写个php玩玩的结果突然发现我的apache2突然挂掉了，也不晓得怎么回事，于是就用彻底删除的命令`apt-get remove --purge apache2` 将他卸载然后重装。重装上去之后发现localhost可以打开了，但是php解析不了了。不光自己写的php无法解析，就连打开phpmyadmin也都变成了源码，十分的蛋疼。找了半天才发现原因是我在彻底卸载apache2的时候，--purge 参数把apache2对php5支持的模块也删掉了。。。。。所以，理所应当的死也登不上喽。

以下是解决方案，非常简单，就是安装那个迷失的模块：
`myths@myths-X450LD:/etc/apache2$ sudo apt-get install libapache2-mod-php5`
这个提供了apache2对php5支持的接口，有时候好像是在安装php5或者apache2的时候会默认附带的，所以很多情况下并不需要手动的去安装。但是当出了问题的时候，不晓得这个模块的存在可是非常恶心的事。。。