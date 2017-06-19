---
title: Ubuntu中修改主机名的方法
id: 1
categories:
  - Linux
date: 2016-01-05 21:58:37
tags:
  - Linux
---

在实验室的电脑上安装了Ubuntu，安装的时候填写主机名时没注意，使用的时候才发现命令行是这样的：
```
myths@myths-HP-ProDesk-498-G3-MT-Business-PC:~$
```

名字长的很蛋疼，本来挺小的命令行硬是被占满了一行，使用的时候怪怪的。

其实修改的方法也很简单，打开/etc/hostname 文件，填写一个新的主机名就好了。

别急，修改完成后还要再修改一下hosts文件的配置，因为hosts里有这样的开头：
```
myths@myths-HP-ProDesk-498-G3-MT-Business-PC:~$ head /etc/hosts
127.0.0.1	localhost
127.0.1.1	myths-HP-ProDesk-498-G3-MT-Business-PC

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```
我们还得把本地的主机名也改过来，否则在运行sudo 命令的时候会报一个"无法解析主机名"的错误，而且会特别的慢。

最后重启一下电脑，更新下配置就好了。

配置完成后：
```
myths@Business:~$
```
干净了好多～～
