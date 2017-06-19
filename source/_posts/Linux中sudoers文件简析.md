---
title: Linux中sudoers文件简析
id: 5
categories:
  - Linux
date: 2015-10-04 18:06:46
tags:
 - Linux
---

这是在调节sudo使用权限时要用到的很重要的文件。以下是本机配置：
```
root@myths-X450LD:/etc/sudoers.d# cat /etc/sudoers
#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
# See the man page for details on how to write a sudoers file.
#
Defaults env_reset
Defaults mail_badpass
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Host alias specification

# User alias specification

# Cmnd alias specification

# User privilege specification
root ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "#include" directives:

#includedir /etc/sudoers.d
```
注释啥的不去管他，Defaults啥的暂时还用不到，主要是中间的部分。
默认情况我们会看到有"%admin ALL=(ALL) ALL"一句话，就是允许admin组在所有主机上执行所有命令。

1. 如果想把admin组的用户都sudo不用密码那么可以将这一行换为："%admin ALL=(ALL) NOPASSWD: NOPASSWD ALL"即可。
2. 如果仅仅想让test用户sudo不需密码，则可添加"test ALL = NOPASSWD: ALL"这样一行。
3. 如果让test用户sudo不用密码即可执行某几个命令，可这样写"test ALL = NOPASSWD: /usr/bin/abc.sh, /usr/sbin/adduser"

不过这个文件的权限是-r--r-----，所以只能是以root身份登陆然后x！强行保存或者按照系统提供的方法，用visudo命令进入nano修改。
关于sudoers文件还有一个好玩的彩蛋,就是在开头加入一行"Defaults insults",就是开启嘲讽模式,你在sudo时如果密码输入错误,那么他就会来嘲讽你,比如:
```
myths@myths-X450LD:~$ sudo vim test
[sudo] password for myths:
There must be cure for it!
[sudo] password for myths:
And with that remarks folks, the case of the Crown vs yourself was proven.
[sudo] password for myths:
You silly, twisted boy you.
```
无聊的时候可以玩玩0.0.
简单用法就这些，以后有新发现再来补充。