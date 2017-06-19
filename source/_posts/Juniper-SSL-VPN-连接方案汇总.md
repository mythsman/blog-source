---
title: Juniper SSL VPN 连接方案汇总
id: 1
categories:
  - Others
date: 2017-01-28 18:19:30
tags:
---

## 前言

之前研究了用反向ssh外网连接内网的方法，但是具体使用的时候还是发现当需要连接的端口比较多的时候，一个端口一个端口进行反向映射是一个非常麻烦的过程，而且很容易出错，用起来十分的麻烦。况且当内部网络比较大的时候，点对点的反向映射又根本不现实。事实上，很多学校和公司为了方便学生和员工远程登录内部网络，都会自己部署一套VPN系统。显然，这套东西用处这么广，肯定有“成熟”的产品供大家使用，这套产品就是Juniper SSL VPN系统。

> Juniper的SSL VPN产品可针对个别使用者与使用者族群，严密控制其应用软件与完整网络资源存取，让企业能够以经济有效的方式，为移动工作者、合作伙伴以及客户提供安全存取。--baidu baike

网上随便试了试，附近的比如南大、东南、苏大、南师大用的都是这一套系统。但是呢，这套东西用户体验又特别的差，一般只能访问他指定的几个内网网站，如果想要真正像vpn一样使用的话就得用他下面提供的network connect ，但是这玩意打开后基本就卡着不动了，完全没有用处，真正想要享受VPN的体验还得自己去研究。对于不同的操作系统，他并没有提供一个统一的解决方案，甚至连他的官网上也没找到什么有参考价值的东西。。。（好像原则上是可以用java来搞得，但是我还真没搞清楚怎么弄。。。）

![](/images/2017/01/28/1/1.jpg)

下面就简要总结一下这套系统真正科学的使用方法。虽然真正操作起来十分简单，但是由于文档短缺，找到这些信息还是花了一些功夫的。

## Mac系统

屌丝买不起mac，想搞也没机会啊。。。参见大佬博客[sdwalker](http://www.sdwalker.com/archives/615)。
具体的思路就是在对应的URL中下载dmg文件，然后运行这个文件里的程序。

## Windows系统

windows下毕竟是大家主要的系统，因此Juniper提供了（貌似）官方的客户端，不过也是在网上找了半天在找到靠谱一点的版本。我找到的下载地址是在[updatestar](http://www.updatestar.com/directdownload/juniper-networks-network-connect/2325744)上。

下载下来再更新一下就可以用了，运行安装目录下的dsNetworkConnect.exe就能运行Juniper vpn的客户端：

![](/images/2017/01/28/1/2.png)

输入vpn地址、用户名、密码，就能成功登陆了。

![](/images/2017/01/28/1/3.png)

## Ubuntu系统

ubuntu系统下试了很多方法，网上也有很多利用ncLinuxApp.jar搞啊搞的，但是都比较麻烦，坑也很多，我搞了半天也没搞掂。后来也在github上找了各种版本的jnc或者msjnc来试也是不行，最后终于用openconnect工具非常方便的连上了VPN。工具文档也很清楚，链接在[这里](https://www.infradead.org/openconnect/juniper.html)。

openconnect工具也早就加进了apt软件包，用下面的命令就可以直接安装：
```bash
$ sudo apt install openconnect
```

链接方式也很简单，输入启动命令 ，然后按照提示输入用户名密码即可，最后就会在一大堆的log后提示链接成功：
```bash
$ sudo openconnect --juniper vpn.xxx.xxx.xx
......
Connected to HTTPS on vpn.suda.edu.cn
Connected tun0 as 10.10.2.9, using SSL
ESP session established with server
```
