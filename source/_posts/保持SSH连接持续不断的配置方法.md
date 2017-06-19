---
title: 保持SSH连接持续不断的配置方法
id: 1
categories:
  - SSH
date: 2016-01-10 20:40:47
tags:
  - SSH
  - Linux
---

在修改服务器的一些文件的过程中，经常碰到的情况就是需要隔一段时间修改一下文件，然后需要去查阅相关的资料，等下一次想修改的时候发现ssh连接由于长时间未相应已经断开了。而且这时候终端会卡在那里，十分的不方便。所以在网上找了几个配置SSH的方法，能保证连接能够长时间不断开。
方法有两种，一般配置一种就可以。但是我为了效果更好，把他们同时配置一下：

## 客户端：

在`/etc/ssh/ssh_config` 配置文件中，将`Host *` 后面添加`ServerAliveInterval 30 ` ，再保存即可。

那么这个条目哪来的呢？其实在他配置文件本身早就有这个的说明了。

打开配置文件`/etc/ssh/ssh_config` ，我们大概会看到这样的样子：
```
# This is the ssh client system-wide configuration file.  See
# ssh_config(5) for more information.  This file provides defaults for
# users, and the values can be changed in per-user configuration files
# or on the command line.

# Configuration data is parsed as follows:
#  1\. command line options
#  2\. user-specific file
#  3\. system-wide file
# Any configuration value is only changed the first time it is set.
# Thus, host-specific definitions should be at the beginning of the
# configuration file, and defaults at the end.

# Site-wide defaults for some commonly used options.  For a comprehensive
# list of available options, their meanings and defaults, please see the
# ssh_config(5) man page.

Host *
#   ForwardAgent no
#   ForwardX11 no
#   ForwardX11Trusted yes
#   RhostsRSAAuthentication no
#   RSAAuthentication yes
#   PasswordAuthentication yes
#   HostbasedAuthentication no
。。。。。
```
注意到在最后有很多的注释掉的配置，很明显，这就是常用的可选条目。但是看了下并没有我们想配置的内容。

再仔细的看了下开头的说明，注意到有这样一句话：`# ssh_config(5) man page.` ，哦～，原来这个配置文件有man文档，OK，打开之后果然在当中找到了这样的配置：
```
ServerAliveInterval
             Sets a timeout interval in seconds after which if no
             data has been received from the server, ssh(1) will
             send a message through the encrypted channel to request
             a response from the server.  The default is 0, indicat‐
             ing that these messages will not be sent to the server,
             or 300 if the BatchMode option is set.  This option
             applies to protocol version 2 only.  ProtocolKeepAlives
             and SetupTimeOut are Debian-specific compatibility
             aliases for this option.
```
那么一切都清楚了～～～原理就是让客户端每隔一段时间向服务端发送信息来保持唤醒。

## 服务端：

服务段的原理和客户端一样，只不过由于是服务器，所以配置文件不一样。服务端的配置文件是`/etc/ssh/sshd_config` 。查看`man sshd_config` ，我们可以看到这样两个配置：
```
ClientAliveCountMax
             Sets the number of client alive messages (see below)
             which may be sent without sshd(8) receiving any mes‐
             sages back from the client.  If this threshold is
             reached while client alive messages are being sent,
             sshd will disconnect the client, terminating the ses‐
             sion.  It is important to note that the use of client
             alive messages is very different from TCPKeepAlive
             (below).  The client alive messages are sent through
             the encrypted channel and therefore will not be spoofa‐
             ble.  The TCP keepalive option enabled by TCPKeepAlive
             is spoofable.  The client alive mechanism is valuable
             when the client or server depend on knowing when a con‐
             nection has become inactive.

             The default value is 3\.  If ClientAliveInterval (see
             below) is set to 15, and ClientAliveCountMax is left at
             the default, unresponsive SSH clients will be discon‐
             nected after approximately 45 seconds.  This option
             applies to protocol version 2 only.
```
```
ClientAliveInterval
             Sets a timeout interval in seconds after which if no
             data has been received from the client, sshd(8) will
             send a message through the encrypted channel to request
             a response from the client.  The default is 0, indicat‐
             ing that these messages will not be sent to the client.
             This option applies to protocol version 2 only.
```
根据说明，添加如下两行即可：
```
ClientAliveInterval 60
ClientAliveCountMax 3
```
这样就可以保证连接始终唤醒了。
