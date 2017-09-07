---
title: Linux下定时任务配置深入理解
id: 1
date: 2017-09-07 21:39:33
category:
 - Linux
tags:
 - Shell
 - Linux
---

# 前言
关于定时任务的配置其实是一个老掉牙的问题了，为什么我又要总结一遍呢？我想大概有以下几点原因。首先，大多数文章都聚焦于cron语法，而比较忽视具体的操作步骤。其次，很多文章都介绍的比较凌乱，层次不是很清楚。而且，当我理清楚linux下定时任务配置的一套流程之后，深刻的觉得他的设计真的是很周到的。不过最重要的一点大概就是我非常不喜欢那种堆砌命令用法的文章，好像Linux就是他写的一样，东一块说明，西一块说明，谁都不知道这些说明是谁说的，从哪里来的，是不是以讹传讹，可信度有多少，是不是已经不被支持，等等。尤其是在当前这种版本飞速迭代的年代，对于一些重要配置只知其然不知其所以然是非常可怕的一件事。
其实关于定时任务配置这一块没有任何技术含量，重要的就是细心一点，理清配置文件之间的关系即可。

# 概述
在linux里配置定时任务主要是靠cron和crontab两个程序来控制。这两个命令各司其职而又互相联系，cron是执行定时任务的守护进程，负责配置的解析跟处理；而crontab则是方便用户进行直接配置的命令，相当于是方便用户直接进行管理的工具。

## Cron
查阅Ubuntu14.04系统的cron的man文档，我们可以发现，cron其实是一个存放在`/etc/init.d/`下的一个脚本，随着系统开机自动启动，可以由service命令调度控制开启和关闭。

### Step1
首先，cron会搜索`/var/spool/cron/crontabs`文件夹，这个文件夹下有多个以用户名命名的文件，每个文件就是属于各个用户的独立的cron配置文件。我们可以将定时任务项按照类似下面的规则配置在这些文件里：
```
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
# 
# For more information see the manual pages of crontab(5) and cron(8)
# 
# m h  dom mon dow   command
```
其实就是基础的cron配置项加上需要执行的命令。需要注意的是与下面两个不同，这里的配置**不需要**指定用户名，而下面的配置是需要指定用户名的。

### Step2
然后，cron会去搜索`/etc/crontab`文件，并且解析里面的cron配置。比如在Debian里，默认的配置是这样的:
```
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
```
他首先定义了一些基本的环境变量，然后配置了四条任务。显然，这四条任务就是配置了定时调度` /etc/cron.hourly`，`/etc/cron.daily`,`/etc/cron.weekly`,`/etc/cron.monthly`这四个文件夹，通过run-parts命令来递归调度文件夹下的所有可执行文件。
这个配置可能在不同的linux版本下写法不一样，但是最终的结果基本差不多，都是默认配置了定时调度文件夹的任务。比如在SUSE12中，这个配置就变成了这样:
```
SHELL=/bin/sh
PATH=/usr/bin:/usr/sbin:/sbin:/bin:/usr/lib/news/bin
MAILTO=root
#
# check scripts in cron.hourly, cron.daily, cron.weekly, and cron.monthly
#
-*/15 * * * *   root  test -x /usr/lib/cron/run-crons && /usr/lib/cron/run-crons >/dev/null 2>&1
```
看上去好像不一样，但其实这个`run-crons`脚本做的事情也是定时调度那四个文件夹。
事实上，很多系统内置的定时脚本都是存放在这四个文件夹下进行自动调度的。

### Step3
最后，cron会去执行`/etc/cron.d/`这个文件夹下的东西，不过我们通常不建议在这里进行修改，虽然这个文件夹下的变化也会被监视，但是我们更习惯将这种不通用的定时任务配置在`/etc/crontab/`里。

## Crontab
查阅Ubuntu14.04系统的crontab的man文档，我们可以发现，crontab其实是方便用户来维护crontab配置文件的工具。
通过`crontab -l`可以显示属于当前用户的`/var/spool/cron/craontabs/`文件夹下的配置。通过`crontab -e`可以安全的进行编辑，如果语法不对他会进行提示，保证安全。就像`visudo`命令一样，本质就是"修改配置文件+语法检测"。
同时，crontab还提供了两个配置文件来控制用户的权限--`/etc/cron.allow`跟`/etc/cron.deny`。只有用户名在白名单里的用户才能使用crontab命令，用户名在黑名单里的用户是无法使用crontab命令的。显然，原则上这两个配置文件不能同时存在，如果同时存在，那么出于保守原则考虑，只有白名单有效，黑名单无效。如果这两个配置不存在，那么根据linux版本的不同，有的系统默认所有用户都有权限，有的系统默认只有root才有权限。


# 配置选择
以上大概就是最基本的配置文件了。看上去好像很繁琐，到处都有配置，其实我觉得设计者考虑的还是十分周到的。事实上这一系列的命令跟配置文件充分考虑了各种实际场景，并且给我们提供了很好的选择。

## 固定用户的定时任务
有时候，我们的服务器可能是多个用户在用，这时候如果所有人都把自己的定时任务配置在一个文件里显然不方便处理。这时候我们就可以使用crontab命令去修改位于`/var/spool/cron/crontabs/`下的属于当前用户的配置文件。这样就能够非常方便的区分不同用户的配置，保护了数据的安全。

## 固定时间的定时任务
很多情况下，作为系统管理员，我们需求的任务模式大都是每小时触发，每日触发，每周触发，每月触发之类的。那么这时我们就可以不用配置cron项，只需要把脚本放在对应的`/etc/cron.daily`,`/etc/cron.hourly`之类的文件夹下即可，方便省事。而且事实上，很多系统自身需要的定时任务就是这么办的。这种方式也是我们最**推荐**的方式，因为我们只要把需要定时执行的脚本放在规定的路径下即可，无需配置cron，毕竟cron配置文件用起来还是比shell脚本麻烦很多。

## 固定程序的定时任务
有时候，某些处理特定任务的进程也希望能够创建定时任务，比如我们编写或者安装的第三方任务。这些任务不希望依附于某一个用户，而希望拥有独立的配置文件，方便修改和卸载等等。这时候我们就可以新建一个cron配置文件，放置于`/etc/cron.d/`文件夹下，进行统一管理。像csf,lfd这类的进程就是这么做的，通过这样的配置保证服务定时重启。


# 配置脚本注意点
所谓的配置脚本其实也有两种，一种是**cron配置文件**，我们可以在这些文件的后面写一些简单的命令；还有一种是放在`/etc/cron.daily`中的**shell脚本**，或者由cron配置文件调用的shell脚本，这些脚本写起来就更加灵活了。

## cron配置文件
cron配置文件主要由两部分组成，一部分是环境变量的定义，另一部分就是符合cron语法的配置项。

### 环境变量
默认情况下，cron配置文件里是没有绝大多数的环境变量的，就连`$PATH`跟`$SHELL`这两个变量也都是用的最基础的版本。因此我们在写命令的时候要注意要么全部使用命令的绝对路径，要么就定义下重要的环境变量。。。不过一般来说还是写绝对路径方便。

### 输出日志
默认情况下cron命令的输出是会输出到邮件池里，然后发送给定时任务所属的用户。显然如果定时任务比较频繁就会给用户发送很多的"垃圾邮件"。因此我们一般都会将输出进行重定向，包括标准输出和错误输出，将其全部重定向到指定的文件夹内。
有时候我们可能希望查看定时任务到底有没有执行，这时候我们其实只需要查看下syslog的位置，通常是在`/var/log/`下。他会输出类似下面的定时日志:
```
Sep  6 23:41:52 pc crontab[8420]: (myths) BEGIN EDIT (myths)
Sep  6 23:42:01 pc CRON[8452]: (myths) CMD (echo 233)
Sep  6 23:42:02 pc postfix/pickup[3547]: 04AD93A0124: uid=1000 from=<myths>
```

## Shell脚本
写Shell脚本相比些cron配置文件就自由很多了，毕竟只需要关注业务逻辑即可。不过我们仍然需要关注环境变量和当前路径，因为这里的shell脚本中很多环境变量仍然是最基础的配置。通常我们会在脚本开头手动导入默认的配置:
```
source /etc/profile
```
为了安全起见我们仍然尽量采用绝对路径，或者cd进入想要的路径进行操作，避免不必要的问题。


