---
title: Hustoj系统的安装搭建
id: 1
categories:
  - Web
date: 2016-01-06 23:32:46
tags:
  - Web
---

本来一直觉得没什么事情做，最近想了想还是学着写些网页吧，于是就打算用一些平台来学习web开发。想来想去还是研究一下OnlineJudge系统之类的网页。一方面自己之前经常使用，另一方面，觉得以后或许在当助教的过程中能用的到。于是找到了华中科技大学开源的一个OJ系统，据说很出名，但是搭建果断还是费了一点功夫的。

首先得找到正确的渠道，本来一直是在github上找的，然而找到后安装好了发现效果并不好，运行也特别的慢。后来发现了作者的博客 [zhblue的博客](http://blog.csdn.net/zhblue/article/details/9125387)，才知道原来github上的是个beta版的，稳定版的在[googleCode](https://code.google.com/p/hustoj/downloads/list)上。（然而据说googlecode 就要关了，估计就要下不到了。。。）

把下载的文件包解压缩会的到这么多的文件：
```
myths@Business:~/下载/install$ ls
db.sql            install-interactive.sh  java0.policy  judged
hustoj-read-only  install.sh              judge.conf    README
```
老规矩先看README，晓得文件的结构，然后看先install.sh（不要手残直接执行，，很多东西都要事先配置下的）

我们打开install.sh会看到开头的一段话：
```
myths@Business:~/下载/install$ head install.sh
#!/bin/bash
#before install check DB setting in
#	judge.conf
#	hustoj-read-only/web/include/db_info.inc.php
#	and down here
#and run this with root

#CENTOS/REDHAT/FEDORA WEBBASE=/var/www/html APACHEUSER=apache
WEBBASE=/var/www
APACHEUSER=www-data
```
这样我们就知道了，我们需要配置下judge.conf等的文件，来确保网页能访问到数据库，主要就是提供下数据库的用户名和密码。

还有就是默认的站点的位置，apache2默认应该是要放在/var/www/html下，改下就好了。

然后还要注意一点，就是我们会发现install.sh脚本里会执行其他的脚本，而执行的命令是:`sudo ./make.sh` 这样的。而事实上这谢文件又没有可执行的权限。想直接执行的需要用：`sudo bash ./make.sh`才行。那么我们要做的就是要么修改脚本，要么给所有的.sh文件都赋予x权限。（之前没有注意到这个脚本没有得到执行，结果导致无法进行判题，后来手动执行了一下就好了）

最后直接install.sh即可，完美不报错，打开/JudgeOnline 目录可以看到已经搭建的网站了。

搭建完成后发现并不能直接用，因为没有设置管理员的权限，回头看下README，发现原来第一个管理员账户是要手动敲进数据库的：
```
注册用户
	http://127.0.0.1/JudgeOnline/registerpage.php
	注册一个普通帐号
创建管理员
    insert into privilege(user_id,rightstr) values('zhblue','administrator');
    zhblue 为需要加管理员权限的帐号
```
照着弄就好了，最后就可以进入/JudgeOnline/admin看到后台了。

另：这里还有一个坑，不知道什么原因，实验室的电脑能用svn下载评测机的内核，而服务器的电脑不能下载（日了狗了，明明hosts什么的都是一样的而且都是用的校园网）。。。而在install.sh中需要下载最新版本的内核，这导致了服务器上搭建的网站不能进行编译。。。这个问题最后通过将本地下载的最新内核上传上去解决的。。。也是醉了。。
