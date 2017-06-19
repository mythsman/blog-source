---
title: Apache配置代理服务器
id: 1
categories:
  - Apache
date: 2016-08-26 19:28:30
tags:
  - Apache
---

## 前言

最近在搞爬虫，单机的爬虫如果请求速度过快很容易导致服务器拒绝服务(403)，搞不好还可能被封IP，因此通常都需要大量的代理服务器来分散请求的来源，提高爬取效率。网上虽然有些免费的代理IP资源的发布平台，比如国内的[西剌免费代理](http://www.xicidaili.com/)，国外的[免费代理列表](http://www.freeproxylists.net/)(需翻墙)，这里的代理虽然多，但是毕竟是大家都在用，速度和稳定性都特别差，不到万不得已还是不用为好。因此，比较保险的做法就是自己搞些或者借些服务器，自己搭建代理。当然，这里所说的代理就是“正向代理”了。

鉴于之前一直在弄Apache，这里就用Apache来配置正向代理服务器。

## 正向代理

所谓”正向代理(forward proxy)“，apache文档里的解释是：
```
An ordinary <dfn>forward proxy</dfn> is an intermediate server that sits between the client and the _origin server_. In order to get content from the origin server, the client sends a request to the proxy naming the origin server as the target. The proxy then requests the content from the origin server and returns it to the client. The client must be specially configured to use the forward proxy to access other sites.

A typical usage of a forward proxy is to provide Internet access to internal clients that are otherwise restricted by a firewall.
```
就是用户主动的将自己对目标的请求转发给代理服务器，让代理服务器真正的请求目标，并将结果返回过来。这通常就是用于科学上网、共享网关等讨巧的事了。。。。。


## Apache配置

关于Apache的安装和配置文件的简介可以看[《apache2服务器的搭建与配置》](/2015/11/04/1/)。

#### 加载模块

配置代理服务器需要用到proxy_http和proxy模块，首先查看`/etc/apache2/mods-enabled/` 目录下有没有`proxy_http.load proxy.load proxy.conf` 这些东西，如果没有，就得先激活下这两个模块：
```
$sudo a2enmod proxy_http
$sudo a2enmod proxy
```
如果显示proxy_http无法激活，就先把本地的proxy.conf删掉，再激活即可。

#### 配置代理

事实上，下面的配置可以写在配置主文件(apache2.conf)包含的任何文件中，但是为了方便管理和区分，我们把代理服务器的配置信息写在`/etc/apache2/mods-enabled/proxy.conf`里。

打开这个文件，默认内容如下：
```
<IfModule mod_proxy.c>

	# If you want to use apache2 as a forward proxy, uncomment the
	# 'ProxyRequests On' line and the <Proxy *> block below.
	# WARNING: Be careful to restrict access inside the <Proxy *> block.
	# Open proxy servers are dangerous both to your network and to the
	# Internet at large.
	#
	# If you only want to use apache2 as a reverse proxy/gateway in
	# front of some web application server, you DON'T need
	# 'ProxyRequests On'.

	#ProxyRequests On
	#<Proxy *>
	#   AddDefaultCharset off
	#   Require all denied
	#   #Require local
	#</Proxy>

	# Enable/disable the handling of HTTP/1.1 "Via:" headers.
	# ("Full" adds the server version; "Block" removes all outgoing Via: headers)
	# Set to one of: Off | On | Full | Block
	#ProxyVia Off

</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```
现在我们要对他加以修改，我这里的配置是这样的：
```
<IfModule mod_proxy.c>

	# If you want to use apache2 as a forward proxy, uncomment the
	# 'ProxyRequests On' line and the <Proxy *> block below.
	# WARNING: Be careful to restrict access inside the <Proxy *> block.
	# Open proxy servers are dangerous both to your network and to the
	# Internet at large.
	#
	# If you only want to use apache2 as a reverse proxy/gateway in
	# front of some web application server, you DON'T need
	# 'ProxyRequests On'.

	#ProxyRequests On
	#<Proxy *>
	#   AddDefaultCharset off
	#   Require all denied
	#   #Require local
	#</Proxy>

	Listen 1234
	<VirtualHost proxy.mythsman.com:1234>
		ServerAdmin dqz48548263@qq.com
		DocumentRoot /var/www/html/proxy
		ServerName proxy.mythsman.com
	    	ErrorLog ${APACHE_LOG_DIR}/error.log
		CustomLog ${APACHE_LOG_DIR}/access.log combined

		ProxyRequests On
		ProxyVia On

	    <Proxy *>
		Order deny,allow
		deny from all
		Allow from 115.159.127.117 
	    </Proxy>
	</VirtualHost> 
	# Enable/disable the handling of HTTP/1.1 "Via:" headers.
	# ("Full" adds the server version; "Block" removes all outgoing Via: headers)
	# Set to one of: Off | On | Full | Block
	#ProxyVia Off

</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
```
这算是综合了网上各种奇奇怪怪的博客到腾出来的能用的配置。

首先要监听端口号，然后创建一个虚拟主机，响应本机的端口，接着开启代理模式，控制入网的IP(先deny 后allow，只允许特定的IP使用代理服务)。

最后重启服务即可。

## 测试

配置完成后，现在就能代理http协议了(https协议以后再说)。将符合allow条件的主机使用该服务器进行代理，打开网页抓包今后就能发现Remote Address已经变成了代理的IP，而且也多了几个proxy-开头的头信息，这就说明代理已经完成了。

当然也可以用python脚本进行代理测试，代码就不贴了，很简单。


## 参考资料

[StackOverflow------proxy: No protocol handler was valid for the URL ](http://stackoverflow.com/questions/26228727/proxy-no-protocol-handler-was-valid-for-the-url-if-you-are-using-a-dso-versi)
[Apache Module mod_proxy](https://httpd.apache.org/docs/current/mod/mod_proxy.html)
