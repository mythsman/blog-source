---
title: 教育网中简单利用ipv6上网
id: 1
categories:
  - Others
date: 2016-04-04 22:44:03
tags:
---

## 简述

之前一直没有注意过科学上网的问题，因为平常不怎么需要，改个hosts文件登个google也就够用了。直到最近才发现，其实在教育网中，本身就可以利用ipv6地址进行绕过GFW访问google,facebook,twitter,youtube等等，而且甚至还不需要登网关（当然，不登网关反而只能访问国外的IPv6网址，对于很多ipv4的网址反而无法访问）。当然，这种不登陆网关就访问其他网站的行为并不能算是作弊，这只能算是对ipv6资源的合理利用，这是学校鼓励并推荐使用的。但是可惜的是，很多同学并没有充分的利用这个资源，在[6rank](http://6rank.edu.cn/tongji2.php)中可以查看到这个资源使用的情况，基本上大部分的高校对ipv6的使用率都不到1%。。。

## 配置

ipv6的配置其实特别简单，只要你的网段给你的机子分配了ipv6的地址，就完全可以通过简单的修改ipv6的hosts达到访问国外ipv6网址的效果。


### 查看是否支持ipv6

尽管大部分的高校都接通了ipv6，但是有的高校还没有接入，而且接入ipv6的高校中在有些位置也并没有做到完全覆盖，因此还是要先确认下首先要支持ipv6再行折腾。

首先确认下电脑是否支持ipv6：windows下在cmd中输入`ipconfig` ，查看是否有Ipv6地址项；在Linux下输入`ifconfig` ，查看是否有inet6地址项，如果有，就说明你的电脑有ipv6的地址。

然后确认下网络是否支持ipv6：有一个项目叫kame.net，登陆进这里，如果能看到动态的小乌龟就说明网络是支持ipv6的。

### 修改hosts

ipv6说白了跟ipv4一样，对于国外的主机还是缺少dns解析这一步，因此我们还是需要通过各种手段找到ipv6的域名跟ip的对应关系，写在hosts文件里，这样才能直接通过域名来访问。

windows中在`c:\User\Administrator\system32\drivers\etc\hosts`下，Linux中在`/etc/hosts`下。

至于这个文件的内容从哪里找，我个人是在[https://serve.netsh.org/pub/ipv6-hosts/](https://serve.netsh.org/pub/ipv6-hosts/)中看的，这个应该算是比较官方的。

### 清除缓存

上面的操作基本就OK了，但是一般这时候还要清除下浏览器的缓存，因为为了提高效率，如果这次发送的http请求和之前发送的http请求一模一样，很多浏览器都会直接从缓存中提取内容而不去获取最新的消息。windows下还需要在cmd中输入`ipconfig/flushdns`，ubuntu下在shell下输入`sudo service networking restart`。


通过以上配置，我们就可以直接访问ipv6的地址了，由于普通的校园网关只对ipv4加以限制，因此ipv6的部分并不需要连接网关就可以登陆。而且ipv6的网络速度还格外的快，访问facebook甚至比访问百度还快！

## 相关信息

[CNGI高校驻地网IPv6用户数量测试](http://6rank.edu.cn/)
[为何Ipv6难以普及](http://pcedu.pconline.com.cn/671/6712896_2.html)
[奶齿网发布的ipv6信息](https://serve.netsh.org/pub/ipv6-hosts/)
[Ipv6测试网](http://ipv6-test.com/)

