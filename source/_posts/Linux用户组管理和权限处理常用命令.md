---
title: Linux用户组管理和权限处理常用命令
id: 1
categories:
  - Linux
date: 2015-10-04 14:45:15
tags:
  - Linux
---

# 前言
ubuntu的用户管理和权限控制本来应该是这种自由系统的精髓，然而由于一直用的是图形化的客户端界面，用的傻瓜安装盘，用户系统都是建的好好的，导致对它的作用理解不足。本来也没啥事，sudo神马的用的也是挺爽的，但是当用到ubuntu的服务器的时候，才发现这玩意真的不懂不行。。。。。。

## who
```bash
myths@myths-X450LD:~$ who
myths :0 2015-10-02 12:58 (:0)
myths pts/7 2015-10-04 00:30 (:0)
```

这里的“myths”很明显是用户名，第一行指的是我们登陆的图形界面，“pts/7”指的是我们当前的console，也就是说如果开多个console，就会有各种的"pts/x"。最后是登陆的时间。还有一种很萌的用法：
```bash
myths@myths-X450LD:~$ who am I
myths pts/7 2015-10-04 00:39 (:0)
```
意思很简单，一看就晓得是怎么回事了。通过这个命令就能够看到当前登陆的用户信息，尤其是当有很多用户共用这台服务器的时候。。。

类似的还有w命令
```bash
myths@myths-X450LD:~$ w
 00:52:55 up 1 day, 11:54, 3 users, load average: 0.40, 0.57, 0.50
USER TTY FROM LOGIN@ IDLE JCPU PCPU WHAT
myths :0 :0 五12 ?xdm? 2:39m 1.54s init --user
myths pts/7 :0 00:39 0.00s 0.03s 0.00s w
myths pts/11 :0 00:46 22.00s 0.05s 0.05s bash
```
还可以接用户名参数，意思差不多。

## adduser（需要root权限）
这是正统的添加用户的指令，用法简单，直接上图
```bash
root@myths-X450LD:~# adduser test
正在添加用户"test"...
正在添加新组"test" (1001)...
正在添加新用户"test" (1001) 到组"test"...
创建主目录"/home/test"...
正在从"/etc/skel"复制文件...
输入新的 UNIX 密码：
重新输入新的 UNIX 密码：
passwd：已成功更新密码
正在改变 test 的用户信息
请输入新值，或直接敲回车键以使用默认值
 全名 []:
 房间号码 []:
 工作电话 []:
 家庭电话 []:
 其它 []:
这些信息是否正确？ [Y/n] y
```
adduser <用户名> 即可，按照提示填写后会创建好用户和密码并创建用户名同名的组，而且会创建相应的家目录，ok，就是这么简单。

但是还有另一个命令useradd，这个命令也可以实现添加用户,但是直接执行：
```bash
root@myths-X450LD:/home# useradd test
```
则只会创建一个用户和和相应的组，这个用户只注册了一个默认的家目录（但是没有创建实际的文件夹）而且没有密码所以根本没法登陆，要想实现真正的注册必须这样
```bash
root@myths-X450LD:/home# useradd -m test
root@myths-X450LD:/home# passwd test
输入新的 UNIX 密码：
重新输入新的 UNIX 密码：
passwd：已成功更新密码
```
可以加 -m （--create-home）选项以创建家目录，并且需要用passwd命令设置密码。恩，比较麻烦，这个据说是因为adduser命令实际是一个perl脚本，是useradd等类似底层命令的更友好的前端。adduser面向用户，方便好用。

要注意的是尽量记得要加上这个参数，因为他不仅会新建一个家目录，而且也会新建默认的.bashrc文件之类的相关配置。如果是自己后来手动mkdir的话，则会出现配置丢失等问题，比如提示符变成了"-bash-4.2$" 之类的问题。

## userdel（需要root权限）
简单方便的删除用户命令
```bash
root@myths-X450LD:/home# userdel -r test
userdel: test 邮件池 (/var/mail/test) 未找到
```
就是直接删除一个用户，加上-r 参数还会删除用户目录和用户账户，所以一般当然要加-r啦。

## passwd（需要root权限）
简单易懂，之前用过。

## usermod(需要root权限）
这个命令比较复杂，当然也非常有用，在需要具体调节用户的权限时必不可少。我们一个一个看。

* -d（--home HOME_DIR） [directory]
这个参数用来设置用户的家目录，也就是修改/etc/passwd  文件里对应的值。要注意的是一定要用完整的路径名，而且要手动的创建文件夹，否则是没有用的。而且在用userdel -r删除用户的时候，这个目录也是要手动删除的。
用法：
root@myths-X450LD:/home# usermod -d /home/newtest test

*  -m （--move-home）
这个参数用来修改家目录的名字，只能跟-d一起用。
用法:
root@myths-X450LD:/home# usermod -md /home/newtest test

* -s（--shell）
用来指定用户使用的shell文件一般是/bin/bash（绝对路径），有时候发现其他什么的都对然而还是无法登陆的话，有可能就是因为没有指定bash。
用法：
root@myths-X450LD:/home# usermod -s /bin/bash test

* -l （--login）
用来修改用户名，这个只是改了用户名，家目录的名字啥的都不变，这里注意一下，用法简单。
用法:
root@myths-X450LD:/home# usermod -l newname test

* -g & -G
 这两个命令用来修改组，-g是通过修改/etc/passwd文件来改变用户所属的组，-G是通过修改/etc/group文件来改变添加用户能支持的组，这些组必须已经存在。
用法:
root@myths-X450LD:/home# usermod -g myths test
root@myths-X450LD:/home# usermod -G myths test

usermod 命令常用参数基本就这些，还有一些不常用的以后遇到再说，就这样吧。

## groupadd groupdel  这两个命令用来创建和删除组，比较常用
root@myths-X450LD:/home# groupadd test
root@myths-X450LD:/home# groupdel test
有时候删除用户不完全，会遗留默认创建的组信息，提示烦人的信息，可以用这个命令删掉。
