---
title: Linux中利用ssh传输文件的方法
id: 3
categories:
  - SSH
date: 2015-10-05 15:54:06
tags:
 - SSH
 - Linux
---

本来打算倒腾vsftp的，结果在搞完ssh之后发现他有个sftp，据说比ftp更安全而且更方便，更重要的是完全不用重新配置啦～～

使用的前提当然是在ssh的配置文件里不把sftp的那一行注释掉。

登录的的方法与ssh一样（因为sftp就是ssh 的一个程式。）：
```
myths@myths-X450LD:~$ sftp root@myserver
sftp>
```
我这里是以root身份登陆我的myserver服务器。

sftp通常有下面的命令：
*   get 命令:get 目标文件 本地路径（get 文件夹 加 -r参数）

*   put 命令:put 本地文件 目标路径（put 文件夹 加 -r参数）

*   其他命令：比如ls cd rm rmdir pw mkdir啥啥啥的，不过为了区别，对本地进行操作的时候命令变成了lls lcd lpwd lmkdir，也是有道理。（经检验并没有lrm lrmdir这些命令）

*   退出命令：exit quit bye均可。

实际上基于ssh登陆的文件传输工作还可以由scp命令完成，方法是：
* 上传文件：scp [本地用户名 @IP 地址 : ]文件名 1 远程用户名 @IP 地址 : 文件名 2
```
myths@myths-X450LD:~$ scp test root@myserver:~/
```


* 下载文件：scp 远程用户名 @IP 地址 : 文件名 1 [本地用户名 @IP 地址 : ]文件名 2
```
myths@myths-X450LD:~$ scp  root@myserver:~/  test
```

可以通过加-r参数表示传文件夹，或者通过-v参数显示细节。