---
title: 配置apache把子目录设置为二级站点
id: 1
categories:
  - Apache
date: 2016-01-16 00:27:33
tags:
  - Apache
---

话说这个教程在网上找了半天硬是都不对，研究半天终于找到一个真正可行的方法，赶紧记一下。。

## 配置域名解析

这个不用多说了，其实在申请解析域名的时候一般都做好了。这里就是提醒一下，我们需要在域名解析服务商那里，把我们需要添加的所有二级站点作为A记录加进去。如果闲麻烦也可以把*作为A记录加进去，不过A记录只能记录IP，而不是URL，所以并不能实现二级站点的绑定。顺便说一下，其实有很多域名解析提供商或者主机提供商会提供将二级站点绑定到子目录的功能，这倒是挺方便的。然而我买的阿里云的主机配的万网的解析并没有提供这个功能，所以一切还得自己配置。虽然阿里云貌似提供了教程，可是他那个教程也就是教你怎么弄301重定向，然而301重定向只能实现网页的跳转，在浏览器的地址栏上还是会显示丑陋的子目录名，跟二级站点的功能还差得远呢。

## 设置虚拟主机

让我们重新审视一下apache的配置文件，打开`/etc/apache2/sites-enabled/000-default.conf` 文件（其实是一个指向`/etc/apache2/sites-avaliable/000-default.conf` 的软连接）,并且扒掉长长的注释，会的到下面的文件:
```
<VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html/
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
注意到头标签上的*:80，这就是问题的关键。apache2其实本来就是支持各种主机名的，要不然为什么会用通配符来通配所有80端口的web访问呢。于是就结合现有的资料试着改了下文件：
```
<VirtualHost www.mythsman.com:80>
        ServerName www.mythsman.com
        ServerAdmin dqz48548263@qq.com
        DocumentRoot /var/www/html/
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
把虚拟主机的通配符去掉，用我指定的主页面，然后加一个ServerName 字段告诉主机他自己的名字（有没有必要不晓得），然后将ServerAdmin字段设置为自己的邮箱（写着玩的，理论上讲会收到通知，然而并没有受到过），后面的文档根目录和log输出位置保持不变。

好，修改完成，重启服务，然后记得要清除一下浏览器的缓存，因为有时候服务器会为了效率，在网页没变的情况下把缓存的页面发过去（即304缓存命中无需更新）。结果发现网页果然没出毛病。很好，猜想是对的，接下来应该只要依葫芦画瓢把其他的子页面放进去，并把DocumentRoot字段改成实际的子目录就好了。

下面的文件是将网站根目录下的wordpress/站点、JudgeOnline/站点和/usr/share/下的phpmyadmin/管理站点设置为二级目录的配置方案（当然www站点也会保留为博客入口）：
```
<VirtualHost www.mythsman.com:80>
        ServerName www.mythsman.com
        ServerAdmin dqz48548263@qq.com
        DocumentRoot /var/www/html/
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<VirtualHost blog.mythsman.com:80>
        ServerName blog.mythsman.com
        ServerAdmin dqz48548263@qq.com
        DocumentRoot /var/www/html/wordpress
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<VirtualHost oj.mythsman.com:80>
        ServerName oj.mythsman.com
        ServerAdmin dqz48548263@qq.com
        DocumentRoot /var/www/html/JudgeOnline
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
<VirtualHost mysql.mythsman.com:80>
        ServerName mysql.mythsman.com
        ServerAdmin dqz48548263@qq.com
        DocumentRoot /usr/share/phpmyadmin
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
                                                                                                   1,1           Top
```
ok，试着登陆了一下，果然都是可以访问的，而且浏览器的地址栏都会保留着前面的域名不会变。

## 设置301跳转

按理说照着上面弄就可以了，但是这样也有一个小漏洞，就是如果仍然直接访问带子目录的地址，网站还是会以子目录的形式表示我的二级站点。也就是说他并不能把类似www,mythsman.com/JudgeOnline/的二级站点自动识别为oj.mythsman.com。解决的方法也很简单，就是利用.htaccess文件为他设置301重定向。这样无论以何种形式访问带子目录的地址都会转到最新的二级域名的形式上，这样良好的保证了域名的兼容性。将下面的文件命名为.htaccess保存在站点的根目录下：
```
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.mythsman.com$ [NC]
RewriteCond %{REQUEST_URI} ^/JudgeOnline/(.*)$ [NC]
RewriteRule ^(.*)$ http://oj.mythsman.com/%1 [R=301,L]

RewriteCond %{HTTP_HOST} ^www\.mythsman.com$ [NC]
RewriteCond %{REQUEST_URI} ^/wordpress/(.*)$ [NC]
RewriteRule ^(.*)$ http://blog.mythsman.com/%1 [R=301,L]

RewriteCond %{HTTP_HOST} ^www\.mythsman.com$ [NC]
RewriteCond %{REQUEST_URI} ^/phpmyadmin(/)?(.*)$ [NC]
RewriteRule ^(.*)$ http://mysql.mythsman.com/%1 [R=301,L]
```
文件的写法参照[《apache中的htaccess文件格式简析》](/2016/01/14/1/)。有一个注意点，就是由于我的phpmyadmin在网站的根目录下并不存在，所以要考虑下最后有没有/符号。对于其他的页面其实不用考虑，因为就算没有被识别，最终都会由于的确存在这个目录被apache自动识别而再被重定向。所以对于不在根目录下的文件要考虑最后的/符号。


ＯＫ，这样就算是成功弄好了二级站点了，域名果然比之前的清楚了许多。
