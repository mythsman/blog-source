---
title: apache中的htaccess文件格式简析
id: 1
categories:
  - Apache
date: 2016-01-14 15:55:56
tags:
  - Apache
---

学apache 就必须要学下htaccess。这个在网站比较小的情况下看不出来，但是当网站结构复杂的时候，我们就需要对访问进来的域名进行分类处理了，比如构建二级域名、设置301重定向、404禁止访问的显示界面，设置权限、防止盗链等一系列工作，都需要有.htaccess文件的处理。

## 概述

.htaccess文件(或者"分布式配置文件"（[hypertext access](https://en.wikipedia.org/wiki/.htaccess)））提供了针对目录改变配置的方法， 即，在一个特定的文档目录中放置一个包含一个或多个指令的文件， 以作用于此目录及其所有子目录。

## 位置

理论上讲，.htaccess应该存在于站点能访问到的所有文件夹下，但是这样显然可能造成性能和安全上的问题。所以有时候不推荐直接以.htaccess文件的形式保存，而是将他写在apache的总配置文件中（<Directory> </Directory>标签内）。不过，为了稳定性，一般也不想随便修改配置文件，所以这里还是用.htaccess文件来设置。我就直接把.htaccess文件放在我网站的根目录下了(/var/www/html/.htaccess)，这样也方便以后的修改。

## 配置

首先需要给apache2引入rewrite模块，这个默认是没有开启的。输入`$sudo a2enmod` ，然后他会提示输入模块名，输入`rewrite` 即可。

然后还要做一个配置，就是在apache2的配置文件（/etc/apache2/apache2.conf）中先设置下，就是将<Directory>中的` AllowOverride None` 设置为`AllowOverride All` 。这也很好理解，因为.htaccess在某种程度上就是配置文件的扩展喽，所以要允许他来覆盖配置文件。

偶然见看下配置文件后面的内容：
```
# AccessFileName: The name of the file to look for in each directory
# for additional configuration directives.  See also the AllowOverride
# directive.
#
AccessFileName .htaccess

#
# The following lines prevent .htaccess and .htpasswd files from being
# viewed by Web clients.
#
<FilesMatch "^\.ht">
        Require all denied
</FilesMatch>
```
以前没有注意过，现在一看才发现，这都是套路啊。凭什么这个文件非得叫.htaccess文件呢？原来他是写在了apache2.conf中了！那么我是不是也可以把这个名字改一下呢～～

而且，为了保证这个文件不被非法访问到，他也预先设置了禁止访问的权限～～想的也是挺周到的。

OK，接下来来看看.htaccess的语法了（其实就是apache2配置文件的语法了）。

## 语法

举个例子：
```
RewriteEngine On                                   #这句话是方便我们开启下面的部分，可以设置为On 或 Off　这样就不用一句一句注释了。
RewriteBase /　　　　　　　　　                       #这句话是把当前的目录看成是网站的根，方便下面的书写。
RewriteCond %{HTTP_HOST} ^(www\.)?xxx\.com$ [NC]   #过滤主机名符合后面正则表达式的网址，满足后执行下一步。NC表示忽略大小写。
RewriteCond %{REQUEST_URI} !^/blog/                #过滤URI满足正则表达是的地址，满足后执行下一步。
RewriteCond %{REQUEST_FILENAME} !-f                #测试访问的文件是否存在，存在则执行下一步。
RewriteCond %{REQUEST_FILENAME} !-d                #测试访问的目录是否存在，存在则执行下一步。
RewriteRule ^(.*)$ blog/$1 [L]                     #将请求的地址改为blog/(原地址)　(301重定向),　L 表示条件终止。
```
从上面的解释也大概也应该晓得的差不多了，就是命令后面一般接两个参数或者再接一个用中括号引用的标签，其中第二个参数多是用正则写的,正则忘了看[这里](/2015/11/24/1)，最多加一个　!　表示否定。

这当中用到了一些类似%{HTTP_HOST}之类的貌似全局变量的东西，这些东西被称为CGI变量。


！！！这里还要注意一点，就是$1匹配的是RewriteRule里捕获的值，如果想要捕获RewriteCond里捕获的值就得用%1。。。。。。好坑。。。


下面着重讲解下RewriteCond的一些标签：

|标记|含义|描述|
|-|-|-|
|R|Redirect|发出一个HTTP重定向|
|F|Forbidden|禁止对URL地址的存取|
|G|Gone|标记URL地址不存在|
|P|Proxy|将URL地址传递给mod_proxy|
|L|Last|停止处理接下来的规则|
|N|Next|再次重第一个规则开始处理，但是使用当前重写后的URL地址|
|C|Chain|将当前的规则和紧随其后的规则链接起来|
|T|Type|强制执行指明的MIME类|
|NS|Nosubreq|只在没有任何内部子请求执行时运行本脚本|
|NC|Nocase|URL地址匹配对大小写不敏感|
|QSA|Qsappend|在新的URL地址后附加查询字符串部分，而不是替代|
|PT|Passthrough|将重写后的URL地址传递给另一个Apache模块进行进一步处理|
|S|Skip|忽略之后的规则|
|E|Env|设置环境变量|

这些参数是写在每行后面，用中括号扩起来，如果有多个，则中间用逗号隔开。

下面是RewriteCond的一些参数：

|参数|含义|解释|
|-|-|
|-d|目录|将TestString视为一个路径名并测试它是否为一个存在的目录。|
|-f|常规文件|将TestString视为一个路径名并测试它是否为一个存在的常规文件。|
|-s|非空的常规文件|将TestString视为一个路径名并测试它是否为一个存在的、尺寸大于0的常规文件。|
|-l|符号连接|将TestString视为一个路径名并测试它是否为一个存在的符号连接。|
|-x|可执行|将TestString视为一个路径名并测试它是否为一个存在的、具有可执行权限的文件。该权限由操作系统检测。|
|-F|对子请求存在的文件|检查TestString是否为一个有效的文件，而且可以在服务器当前的访问控制配置下被访问。它使用一个内部子请求来做检查，由于会降低服务器的性能，所以请谨慎使用！|
|-U|对子请求存在的URL|检查TestString是否为一个有效的URL，而且可以在服务器当前的访问控制配置下被访问。它使用一个内部子请求来做检查，由于会降低服务器的性能，所以请谨慎使用！|

以上就是常用的一些语法，当然，htaccess文件可以写的东西远不止这些。
