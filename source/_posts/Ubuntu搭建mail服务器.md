---
title: Ubuntu搭建mail服务器
id: 1
categories:
  - Linux
date: 2016-05-18 14:38:22
tags:
  - Linux
---

有了自己的网站当然也想弄个自己的邮箱了，虽然不一定用得上，但是搞一个自己域名的邮件系统还是很酷的。（前提是已经购买了域名）

一些复杂的文件配置和指令操作就不细研究了，毕竟现在也用不上，下面就简单搭建一个能够首发邮件的服务器。

## 安装PostFix

postfix就是我们的邮件服务器了，用`$sudo apt install postfix` 即可安装。

安装好了我们的服务就算是启动了，下面我们就用他来发邮件。

（注意，此时的本机的邮箱地址就是当前的”用户名@域名“，因此注册自己的邮箱的过程其实就是添加用户的过程）

## 发邮件

bash中输入 `$telnet localhost 25` ，即登陆本机的邮件服务端口，进入postfix提示符：
```
myths@Business:~$ telnet localhost 25
Trying ::1...
Connected to localhost.
Escape character is '^]'.
220 Business ESMTP Postfix (Ubuntu)
```
然后就按照下面的格式输入正文：
```
ehlo localhost
mail from: myths@localhost
rcpt to: test@localhost
data
Subjet: My first mail on Postfix
Hi,
Are you there?
regards,
Admin
.
quit
```
即，在ehlo后输入名称，mail from: 后输入自己的邮件地址，rcpt to: 后面输入目的的邮件地址，data后输入正文并以"<回车><点><回车>"作为正文结束标志。

最后再输入quit关闭终端。

## 安装mailutils

用`$sudo apt install mailtuils`安装，然后就可以用这个工具查看邮件了。

## 收邮件

登陆到需要收邮件的用户，输入mail，即可进入mail的终端。这里会提示类似下面的信息：
```
myths@Business:~$ mail
"/var/mail/myths": 1 message 1 new
>N   1 myths@localhost     三 5月 18 14:2  16/393
?
```
这样告诉了我们未读的邮件。我们可以输入邮件前面的序号”１“来查看信息。

当然还有其他很多的命令和配置，不过既然一时半会用不到，我们暂时也就不研究了。

用上面的方法我们基本上可以把这个邮件服务器当成商业邮箱来用了，不过在跟qq邮箱进行互发的时候发现qq的文本还得先用base64解码才行。。。也是麻烦。。