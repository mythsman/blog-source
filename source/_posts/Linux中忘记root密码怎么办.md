---
title: Linux中忘记root密码怎么办
id: 1
categories:
  - Linux
date: 2015-10-05 01:51:12
tags:
 - Linux
---

白天倒腾权限系统的，结果不知道怎么就把主用户的sudo权限给弄没了，结果是各种用不了root权限。sudoers文件打不开，usermod命令也用不了，sudo -i就不提了，而且ubuntu是无法直接以root身份登陆的，简直无解。没办法，只有倒腾起了之前不敢动的recovery模式。

## 方法
开机进入grub，选ubuntu高级选项，进去后选recovery模式的版本。进入后选root选项进入root终端。然而进入终端后才发现，还是几乎什么文件也不能改，输入passwd命令会提示passwd: Authentication token manipulation error，输入usermod命令会提示usermod：cannot lock /etc/passwd; try again，什么sudoers文件也是无法写入。。。网上问了下发现原来是因为root界面默认是以只读方式挂载的，所以只需要以读写的方式重新挂载下就行了：
```
root@myths-X450LD:~# mount -rw -o remount
```

这样一弄好，就真的是想怎么搞就怎么搞了。

这样一看下来，其实recovery模式也没什么深奥的地方，就是时时刻刻获得了最高权限的shell。