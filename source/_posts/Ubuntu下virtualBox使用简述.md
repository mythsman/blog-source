---
title: Ubuntu下virtualBox使用简述
id: 1
categories:
  - Linux
date: 2016-09-26 19:22:54
tags:
  - Linux
---

曾经一直由于windows太卡，导致在windows下安装的虚拟机性能都很不好，这就导致我曾经一直以为虚拟机都是巨卡无比。不过这次在ubuntu下面用了虚拟机才发现原来虚拟机技术本身并不会对系统本身带来太多的负面影响，至少在我的ubuntu下面用起来还是挺流畅的。

## VirtualBox

virtualBox是一个非常有名的开源虚拟机软件，曾经由Sun公司用Qt开发，当然现在归Oracle了。他据说被称为最强的免费虚拟机软件，支持现存绝大多数操作系统，支持快照、共享文件、承载不同系统架构等等很不错的特性。

## 安装使用

在使用virtualbox之前，首先得确认你的电脑支持cpu虚拟化技术(其实就是提高硬件支持)。在BIOS里面可以看到类似的选项，默认是关闭的，我们把他开开就好。

![](/images/2016/09/26/1/1.png)

当然，并不是所有的虚拟机软件都必须要开启cpu虚拟化的，只是开启了这个选项后会使虚拟机运行更流畅。

对于具体的安装而言，ubuntu下安装当然是很简单的了，`$sudo apt install virtualbox` 即可。

然后打开他，按照要求选择需要的操作系统和版本，然后开启虚拟机，选择下载好的镜像。
![](/images/2016/09/26/1/2.png)

这样就会进入镜像的安装程序，跟普通U盘启动装机差不多，如下图所示：

![](/images/2016/09/26/1/3.png)

接下来就是很傻瓜的操作了，完成后就会显示我们熟悉的界面了。

![](/images/2016/09/26/1/4.png)

这样就可以正常使用虚拟机了。

## 共享文件

虽然有了虚拟机，但是如果需要主机能够和虚拟机进行通信的话则还要另外下载一个iso扩展包。不过好在这个东西也可以很方便的用`$ sudo apt install virtualbox-guest-additions-iso`来下载。

我们来看看他把东西放在哪里了：
```
$ dpkg -L virtualbox-guest-additions-iso 
/.
/usr
/usr/share
/usr/share/virtualbox
/usr/share/virtualbox/VBoxGuestAdditions.iso
/usr/share/doc
/usr/share/doc/virtualbox-guest-additions-iso
/usr/share/doc/virtualbox-guest-additions-iso/copyright
/usr/share/doc/virtualbox-guest-additions-iso/changelog.Debian.gz
```
找到那个VBoxGuestAdditions.iso文件，这就是我们需要的。

接着，对于需要进行文件共享的虚拟机系统，我们在他的Storage设置里添加上面这个镜像文件，替代之前安装时的镜像文件：

![](/images/2016/09/26/1/5.png)

然后我们在Shared Folders设置里添加一个本机中的文件夹作为共享文件夹，设置为自动挂载（共享文件分为Transient Folder和Permanent Folder，一般用永远共享就好）。

接着打开虚拟机，如果是windows虚拟机的话，他会提示你安装下驱动程序，然后他会提示你有新媒体被发现，也就是以一个网络位置的形式呈现在下面，而这个其实就是和主系统公用的共享文件夹。

![](/images/2016/09/26/1/6.png)

如果是ubuntu虚拟机的话，他会默认把共享文件夹挂载在/media下，其实我们可以直接把他看成个文件夹了。

![](/images/2016/09/26/1/7.png)

## 关于Android虚拟机

其实virtualbox也能支持模拟安卓机子，不过一般的ROM是不能直接用的。不过还好，有个叫[android-x86](http://www.android-x86.org/)的项目，把很多安卓ROM搞成了适合电脑直接安装的iso镜像，这样就可以直接装了。镜像的下载地址在[这里](http://www.android-x86.org/download)。

有两个具体介绍的[博客1](http://blog.csdn.net/roland_sun/article/details/49659351)，[博客2](http://blog.csdn.net/roland_sun/article/details/49659351)，详细介绍了安卓虚拟机的安装细节，讲的还是不错的，照着弄基本就没问题了。
