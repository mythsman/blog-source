---
title: 远程挂载服务器命令sshfs
id: 1
categories:
  - SSH
date: 2015-12-14 23:46:15
tags:
  - SSH
  - Linux
---

一直以为免密码登陆远程服务器已经是非常方便了，但是最近发现了一个更加方便的方法-------远程服务器居然可以挂载到本地！利用sshfs工具，使用基于ssh协议的ssh文件系统，我们可以像操作本地文件一样的执行、传输服务器的文件了。

当然，GNU的标准并没有包含sshfs，所以我们需要下载一下：
```
myths@myths-X450LD:~$ sudo apt-get install sshfs
```
下载好以后，我们只需要像ssh登陆一样的挂载远程服务器：

(当然我们需要管理员权限)
```
$ sshfs [username]@[remotehost]:[targetpath]  [localpath]
```
当然我们需要在本地的/mnt文件夹下mkdir创建一个挂载点文件夹，然后再执行挂载命令：
```
root@myths-X450LD:~$ mkdir /mnt/server
root@myths-X450LD:~$ sshfs root@mythsman.com:/ /mnt/server
```
这样就挂载好了，我们就可以完全的把/mnt/server文件夹看作是我的服务器的根目录了。

最后如果需要卸载，只需正常的步骤：
```
root@myths-X450LD:~# umount /mnt/server
```

当然，仅仅用上述的方法就会发现这个sshfs的链接总是会断，而且一断就会卡在那里动也动不了，只能强行kill这个ssh进程。因此通常情况下，我们会开启一个reconnect参数，即：
```
$ sshfs [username]@[remotehost]:[targetpath]  [localpath] -o reconnect
```