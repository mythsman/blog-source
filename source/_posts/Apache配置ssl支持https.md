
---
title: Apache配置ssl支持https
id: 1
categories:
  - Apache
date: 2016-08-27 21:38:01
tags:
  - Apache
---

## 前言

很明显apache原生是不支持https的，无论是用https访问自身的站点，还是代理来自其他网站的https的站点。毕竟人家https走的端口是443，都不是默认的80。

那么如何让apache支持https呢，其实只要添加下ssl模块再修改下配置就好了。

## 准备工作

首先要导入apache的ssl模块，即`$sudo a2enmod ssl` ，保证`/etc/apache2/mods-enabled/` 目录下有对应的ssl模块文件。

然后利用openssl命令，生成必要的密钥文件等：
```
【生成一个自签名证书】
$ openssl genrsa -out ca.key 2048

【生成证书签名请求(CSR)】
$ openssl req -new -key ca.key -out ca.csr

【生成X509自签名证书】
$ openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt
```
三条命令各生成三个文件，把这三个文件保存好，这里我把他全部放在了`/etc/apache2/key`文件夹下了。

## 配置https正向代理

对于https的正向代理，在[http的正向代理配置](/2016/08/26/1/)的基础上，只要额外添加下面的配置即可：
```
SSLProxyEngine on
SSLCertificateFile /etc/apache2/key/ca.crt
SSLCertificateKeyFile /etc/apache2/key/ca.key
```
文件路径分别对应上面的密钥文件。

重启服务器即可代理https协议了。


## 配置https站点

我们知道对于通常的http站点，他的配置路径是在`/etc/apache2/sites-enabled/000-default.conf`上，但是我发现如果直接在这里配置https站点则会不起效果。一番捣鼓之后发现，其实为了区分http和https站点并加以分别配置，apache2还特地给了另外一份配置文件，这份配置文件的模板需要我们用下面的命令得到：
```
$ sudo a2ensite
Your choices are: 000-default default-ssl
Which site(s) do you want to enable (wildcards ok)?
default-ssl
```
之后我们就会发现，出现了一个`/etc/apache2/sites-enabled/default-ssl.conf`文件，没错，我们就可以在这里配置对应的站点了。
在这个配置文件里，主要是要修改四项：
```
DocumentRoot /var/www/html/wordpress
SSLEngine on
SSLCertificateFile  /etc/apache2/ssl/cert_chain.crt
SSLCertificateKeyFile /etc/apache2/ssl/private.key
```
修改好后，重启服务即可。
最后我们可以将利用htaccess文件将80端口的请求转发到443端口，这样更加漂亮。

## 关于证书
当然，我们自己生成的证书是不被浏览器认可的，通常访问的用户都会被告知这是一个不安全的链接，尤其是chrome，那个红色背景格外的吓人，因此如果是真的想让自己的网站能用https，要么去花钱买证书，要么去用人家免费的，我这里用的是[sslforfree](https://www.sslforfree.com/)的证书，不过麻烦的是这个东西得每隔三个月更换一次。。。
具体的使用方法可以参考[这篇文章](https://itjh.net/2016/11/03/free-ssl/)。

## 参考资料
[CentOS中Apache服务器HTTPS配置方法](http://freessl.wosign.com/centos-https.html)
[Apache + WordPress + SSL 完全指南](https://ttt.tt/9/)
[申请免费的SSL证书](https://itjh.net/2016/11/03/free-ssl/)
