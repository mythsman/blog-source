---
title: php5-mysql-phpmyadmin安装和配置
id: 2
categories:
  - Database
date: 2015-11-04 19:49:52
tags:
  - Linux
  - Database
---

php5和mysql的安装比较无脑，也基本无需配置，安装命令：
```
myths@myths-X450LD:~$ sudo apt-get install php5
```
```
myths@myths-X450LD:~$ sudo apt-get install mysql-server
```
唯一要注意的是mysql安装的时候需要输入密码，这就是数据库的密码，以后要用到的，需要记住。

接下来安装phpmyadmin，外行乍一看觉得这是个管理php的东西，其实php要个啥子管理啊，这个是用php写的用来管理mysql的小软件，通过这个可以方便的管理数据库。

安装命令：`myths@myths-X450LD:~$ sudo apt-get install phpmyadmin`

当然安装中会提示输一些东西，就是一种图形界面的配置，方便人用的。这当中需要输入之前安装mysql时的密码，照着弄就对了。

安装结束后，phpmyadmin被默认安装到了/usr/share/phpmyadmin中，软件的入口当然就是index.php了。不过为了访问的方便，还是加一个链接到我们的目录中：
```myths@myths-X450LD:sudo ln -s /usr/share/phpmyadmin /var/www/html/```
这样就可以通过本地访问该网页的形式打开这个小软件了。
