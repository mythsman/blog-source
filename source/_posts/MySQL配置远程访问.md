---
title: MySQL配置远程访问
id: 1
categories:
  - Database
date: 2016-08-28 01:19:44
tags:
  - Database
---

## 前言

在使用MySQL数据库的时候，有时候需要客户机直接远程登陆服务器的数据库 ，而不是将请求发给数据库服务器。这时候就需要配置下MySQL的远程访问权限了。具体的配置方法也很简单，随便找个搜索引擎基本都能找到搜索到一堆配置MySQL数据库远程登陆的教程了。

## 步骤

网上介绍的步骤基本分为两步：

### 修改my.cnf配置文件

mysql的配置文件一般在`/etc/mysql/my.cnf` 里，打开查看其配置，其中有这么一段：
```
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address		= 127.0.0.1
```
这个bind-address就是绑定IP，也就是默认只允许本机登陆。为了能够实现远程登陆，显然需要把这句话注释掉。修改完重启mysql服务。

### 添加用户权限

按照需要，为指定用户、IP设置对应的权限即可
```
mysql>GRANT ALL PRIVILEGES ON A.B TO 'user'@'%'IDENTIFIED BY ‘password' WITH GRANT OPTION;
mysql>FLUSH PRIVILEGES
```
这里把数据库A的B表的所有权限都授予来自任意主机('%')的user以密码'password'登陆。

或者直接修改mysql数据库中的user表使其满足要求。

上面就是理论上需要做的了，然而我照着这个弄完了发现还是连接不上。折腾了半天，终于发现原来服务器的提供商为了保证服务器的安全性，还额外对端口的开放进行了限制。比如腾讯服务器就设置了一个安全组，额外限制了开放的端口，默认是禁止开放mysql的3306端口的，因此要打开控制台，配置好权限：

![](/images/2016/08/28/1/1.png)

其他都是默认的，只要额外添加倒数第二行的就行了。。。

## 参考资料

[打开MySQL数据库远程访问的权限](http://www.cnblogs.com/ycsfwhh/archive/2012/08/07/2626597.html)
[腾讯服务器安全组](https://www.qcloud.com/doc/product/213/%E5%AE%89%E5%85%A8%E7%BB%84)

&nbsp;