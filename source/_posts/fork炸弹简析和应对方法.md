---
title: fork炸弹简析和应对方法
id: 1
categories:
  - Linux
date: 2015-11-10 23:17:37
tags:
  - Linux
---

## 简述

第一次听到fork炸弹这种东西的时候以为是一个很神奇的破坏力惊人的高能脚本，然而稍微深入的了解了一下才发现这个玩意其实是个挺简单纯粹的东西，只是被一个叫Jaromil的家伙对他的精美包装给戏耍了。他在2002年给出了Linux下fork炸弹的最经典的形式：
`myths@myths-X450LD:~$ :(){ :|:& };:`
一段非常忽悠人的代码，只有１３个字母，乍一看完全看不懂。。但其实这个代码的思路非常简单，就是递归的开一个新的进程，不断的开不断的开，直到操作系统崩溃。中招后唯一的解决办法就是拔电源重启。

作为长期写Ｃ语言的我们来说，看这段代码有一个很大的坎，就是标识符。Ｃ语言里的标识符是不会包含" : "这个东西的，然而这里的函数名恰恰就是这个“ : ”。所谓的fork炸弹，其实就是声明了一个函数，这个函数的名字叫做" : "　他的函数体是调用它本身，并且用管道将他的输出重定向到另一个该函数，并在后台运行。最后调用这个函数。稍微清楚的写法是：
```
bomb(){
	bomb|bomb&
};
bomb
```
这样就清楚很多了，也就没啥神秘的了。

## 后果

这段代码执行的后果不用说，就是电脑死机。死机的原因就类似DDoS攻击一样，系统忙于处理这个垃圾程序生成的垃圾进程而无法分配给我们需要执行的程序。所以，一般没事做的话不要跑这个代码（话说我就无聊的跑了两遍）。

其实fork炸弹的危险性倒不是特别大，破坏力也不是特别强，毕竟重启一下就行了。Linux下也有其他拥有更强破坏力的命令，然而为什么都没有他有名呢？原因很简单，fork炸弹的执行不需要root权限！获取root权限实在不容易，而fork炸弹可以完全绕过这一点来对电脑进行破坏，所以这才厉害。

## 预防

预防fork命令的方法也很清楚，就是限制系统的最大进程数，这样就算运行了也不会死机了，就留给我们杀掉这个进程的机会了。

在这里我们可以通过ulimit命令来查看系统定义的最大进程数：
```
myths@myths-X450LD:~$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 15261
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 1024
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 15261
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```
注意倒数第三行，根据这一行我们就可以看到当前的最大进程数是15261，而且可以看到对应的参数是 -u，这样我们就可以进行修改了：
`myths@myths-X450LD:~$ ulimit -u 200`
这样下来最大进程数就是200了。

但是这样设置下来的数据只能在当前终端奏效，当关闭当前终端后，系统会重新调回默认值的。

所以最终的解决办法是修改配置文件。系统的配置文件是 /etc/security/limits.conf　：
```
myths@myths-X450LD:~$ cat /etc/security/limits.conf 
# /etc/security/limits.conf
#
#Each line describes a limit for a user in the form:
#
#<domain>        <type>  <item>  <value>
#
#Where:
#<domain> can be:
#        - a user name
#        - a group name, with @group syntax
#        - the wildcard *, for default entry
#        - the wildcard %, can be also used with %group syntax,
#                 for maxlogin limit
#        - NOTE: group and wildcard limits are not applied to root.
#          To apply a limit to the root user, <domain> must be
#          the literal username root.
#
#<type> can have the two values:
#        - "soft" for enforcing the soft limits
#        - "hard" for enforcing hard limits
#
#<item> can be one of the following:
#        - core - limits the core file size (KB)
#        - data - max data size (KB)
#        - fsize - maximum filesize (KB)
#        - memlock - max locked-in-memory address space (KB)
#        - nofile - max number of open files
#        - rss - max resident set size (KB)
#        - stack - max stack size (KB)
#        - cpu - max CPU time (MIN)
#        - nproc - max number of processes
#        - as - address space limit (KB)
#        - maxlogins - max number of logins for this user
#        - maxsyslogins - max number of logins on the system
#        - priority - the priority to run user process with
#        - locks - max number of file locks the user can hold
#        - sigpending - max number of pending signals
#        - msgqueue - max memory used by POSIX message queues (bytes)
#        - nice - max nice priority allowed to raise to values: [-20, 19]
#        - rtprio - max realtime priority
#        - chroot - change root to directory (Debian-specific)
#
#<domain>      <type>  <item>         <value>
#

#*               soft    core            0
#root            hard    core            100000
#*               hard    rss             10000
#@student        hard    nproc           20
#@faculty        soft    nproc           20
#@faculty        hard    nproc           50
#ftp             hard    nproc           0
#ftp             -       chroot          /ftp
#@student        -       maxlogins       4
# End of file
```
我们发现里面的说明注释还是很全的，照着弄就好了。这里我们一般是添加一句：
```
myths soft npro 200
myths hard npro 200
```
最后保存下文件并且注销下用户，重新登陆回来可以看到配置已经更改。

* * *

注：我在这里发现了一个问题，就是在我的ubuntu 14,04 上，用修改配置文件的方法修改后会导致系统崩溃。。原因不明，可能是进程数设置小了吧。