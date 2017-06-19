---
title: Linux中group文件详解
id: 3
categories:
  - Linux
date: 2015-10-04 17:02:13
tags:
 - Linux
---

这个文件用处不是太大，记下来仅作了解。

## 文件样例
```
myths@myths-X450LD:~$ cat /etc/group
root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
adm:x:4:syslog
tty:x:5:
disk:x:6:
lp:x:7:
mail:x:8:
news:x:9:
uucp:x:10:
man:x:12:
proxy:x:13:
kmem:x:15:
dialout:x:20:
fax:x:21:
voice:x:22:
cdrom:x:24:
floppy:x:25:
tape:x:26:
sudo:x:27:
audio:x:29:pulse
dip:x:30:
www-data:x:33:
backup:x:34:
operator:x:37:
list:x:38:
irc:x:39:
src:x:40:
gnats:x:41:
shadow:x:42:
utmp:x:43:
video:x:44:
sasl:x:45:
plugdev:x:46:
staff:x:50:
games:x:60:
users:x:100:
nogroup:x:65534:
libuuid:x:101:
netdev:x:102:
crontab:x:103:
syslog:x:104:
fuse:x:105:
messagebus:x:106:
ssl-cert:x:107:
lpadmin:x:108:
scanner:x:109:saned
mlocate:x:110:
ssh:x:111:
utempter:x:112:
avahi-autoipd:x:113:
rtkit:x:114:
saned:x:115:
whoopsie:x:116:
avahi:x:117:
lightdm:x:118:
nopasswdlogin:x:119:
bluetooth:x:120:
colord:x:121:
pulse:x:122:
pulse-access:x:123:
myths:x:1000:
sambashare:x:124:
ftp:x:125:
postfix:x:126:
postdrop:x:127:
smmta:x:128:
smmsp:x:129:
guest-g1Jo1T:x:130:
```
跟/etc/passwd文件差不多，每行一个记录，每个记录由以下部分组成：
```
组名:口令:组标识号:组内用户列表
```

## 文件分析

### 组名
用户组的名称，由字母或数字构成。与/etc/passwd中的登录名一样，组名不应重复。

### 口令
就是密码，存放的是用户组加密后的口令字。一般Linux系统的用户组都没有口令，即这个字段一般为空，或者是*。

### 组标识号
与用户标识号类似，也是一个整数，被系统内部用来标识组。

### 组内用户列表
是属于这个组的所有用户的列表，不同用户之间用逗号(,)分隔。这个用户组可能是用户的主组，也可能是附加组。
将用户分组是Linux系统中对用户进行管理及控制访问权限的一种手段。每个用户都属于某个用户组；一个组中可以有多个用户，一个用户也可以属于不同的组。当一个用户同时是多个组中的成员时，在/etc/passwd文件中记录的是用户所属的主组，也就是登录时所属的默认组，而其他组称为附加组。

用户要访问属于附加组的文件时，必须首先使用newgrp命令使自己成为所要访问的组中的成员。直接加参数即可：
```
root@myths-X450LD:~# newgrp myths
```
