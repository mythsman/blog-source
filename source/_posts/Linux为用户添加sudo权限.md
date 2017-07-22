---
title: Linux为用户添加sudo权限
id: 6
categories:
  - Linux
date: 2015-10-04 18:29:52
tags:
 - Linux
---

## 前言
我们知道root用户可以直接执行所有命令，主用户可以通过sudo命令假装自己是root用户，而一般用户连sudo都用不了。现在我们的目的就是让这个一般用户也能像正常用户一样使用sudo命令。

## 方法
这里方法至少有两种。

### 将用户添加进sudo组
<pre>root@myths-X450LD:/home# usermod -G sudo test</pre>
一句话ok。（为了这句话不晓得倒腾了多久0.0）

### 将用户注册到/etc/sudoers文件中
按照[/etc/sudoers文件](/2015/10/04/5/)的规格添加一行就行比如：
```
%test ALL=(ALL:ALL) ALL
```
个人不太推荐直接改配置文件的行为0.0。
