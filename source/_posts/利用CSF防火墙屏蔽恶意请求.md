---
title: 利用CSF防火墙屏蔽恶意请求
id: 1
categories:
  - Linux
date: 2017-03-20 15:40:32
tags:
  - Linux
---


## 问题
最近不知道为什么，恶意代理的请求数越来越多，明明我返回的都是403Forbidden，但是由于数量实在庞大，还是消耗了我大量的带宽和资源。之前的方法已经没有用了，想了半天还是研究研究防火墙吧，虽然仅仅靠Apache也能对某些IP进行黑名单设置，但是感觉还是有点麻烦的。比如最常见的用iptables，或者是ufw，虽然都能很好的做到管理，但是他们基本都需要一条一条的加，十分麻烦。
网上搜索了下，找到了一个挺方便的小工具--CSF（ConfigServer & Security Firewall），这个工具据说除了能够方便的管理IP blacklist，而且也能稍加配置抵御一定量的DDOS攻击。

## 安装
工具本身可以在csf工具的[官网](https://configserver.com/cp/csf.html)上下载。
下载并解压后可以参考其中的`install.txt`的说明进行安装，讲的简洁而且详细，注意给权限就行。需要说明的是，这个工具其实也是基于iptables，只是简化了命令而已。

## 关于ddos的防护
根据readme.txt的描述，进行ddos防护的功能主要是靠`/etc/csf/csf.conf`中的配置进行控制的，尤其是当中的`PORTFLOOD`参数，一般都进行如下设置：
```
#Syntax for the PORTFLOOD setting:
#PORTFLOOD is a comma separated list of:

port;protocol;hit count*;interval seconds

#So, a setting of PORTFLOOD = "22;tcp;5;300,80;tcp;20;5" means:
#1. If more than 5 connections to tcp port 22 within 300 seconds, then block
#that IP address from port 22 for at least 300 seconds after the last packet is
#seen, i.e. there must be a "quiet" period of 300 seconds before the block is
#lifted

#2. If more than 20 connections to tcp port 80 within 5 seconds, then block
#that IP address from port 80 for at least 5 seconds after the last packet is
#seen, i.e. there must be a "quiet" period of 5 seconds before the block is
#lifted
```
这个可以根据个人需要修改。

## 关于black list
blacklist 就在`/etc/csf/csf.deny`里，可以有多种书写方式，在该文件的顶部描述的十分清楚：
```
###############################################################################
# Copyright 2006-2017, Way to the Web Limited
# URL: http://www.configserver.com
# Email: sales@waytotheweb.com
###############################################################################
# The following IP addresses will be blocked in iptables
# One IP address per line
# CIDR addressing allowed with a quaded IP (e.g. 192.168.254.0/24)
# Only list IP addresses, not domain names (they will be ignored)
#
# Note: If you add the text "do not delete" to the comments of an entry then
# DENY_IP_LIMIT will ignore those entries and not remove them
#
# Advanced port+ip filtering allowed with the following format
# tcp/udp|in/out|s/d=port|s/d=ip
#
# See readme.txt for more information regarding advanced port filtering
#
```
简要概括就是每一行代表一个ip，也可以代表一个ip段(CIDR)，而且我们也可以加注释，甚至可以指定端口和协议。
最后，在做出修改后想要生效记得用`csf -r`命令。

## 针对恶意代理请求的防护方案
当然，我用这个的目的是为了根本解决之前的恶意代理占用带宽的问题。有了这个工具，就可以十分轻松的进行控制了，思路如下：

1. 首先，搜索Apache的log(`/var/log/apache2/access.log`)，查找所有应被屏蔽的log条目(我这里指的是所有被403的请求)。
2. 然后，提取每条Log记录对应的ip地址。
3. 对结果进行排序去重，生成black list。
4. blacklist 写入csf.deny
5. 重启csf防护服务。

实现起来超级简单：
```
root@server:~# cat /var/log/apache2/access.log |grep \ 403\ |awk '{print $1}'|sort|uniq >> /etc/csf/csf.deny
```
可以手动查看下结果是否正确，确认之后既可以`csf -r`重启服务了。
