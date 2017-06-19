---
title: Eclipse+Tomcat平台搭建心得
id: 1
categories:
  - Java
date: 2016-03-23 23:56:49
tags:
  - Java
---

突然被要求搭建个Java 动态网页开发环境，好久不用eclipse的我着实懵逼好久。这当中遇到了好多好多的坑，姑且记录下一些注意事项，加深下对Eclipse和Tomcat的理解。

*   java环境和Tomcat的环境一定要搭建正确，windows下注意配置下环境变量即可，ubuntu下还要注意尽量要自己下载源码编译，不要用apt-get里面的包。。。apt-get里的东西满满的都是坑，懒人化操作固然方便，但是这就导致了我们对他的路径、环境变量的存储位置都不清楚，这对接下来的配置会带来极大的困难。

*   eclipse的版本一定要看准了，不一定要是最新的，但是尽量用eclipse for j2ee 版本的。虽说理论上任何的eclipse版本之间都可以通过安装插件来达到同样的效果，但是这还是有很多不一样的地方。当你对着教程学习的时候，发现自己的菜单选项和人家的选项不一样的时候还是非常的蛋疼的。

*   eclipse在配置Server的时候一定要选择到我们下载的Tomcat路径。因为无论我们是否安装了Tomcat，在preference->server->runtime environment 选项中eclipse总会提供所有的Tomcat版本供我们选择，然而这些并没有卵用，如果想让eclipse连接本机的Tomcat，必须在search选项中选择Tomcat安装路径。这样选择的server才能用。

*   一定要添加全所有需要的jar包，在build path里添加需要的包（这里通常有很多很多，比如struts，spring，javax，json之类的），尤其是Tomcat的包（即javax之类的包，如果不是eclipse for j2ee的话是很难找到的）。而且还要注意选择jre包，选择不对的话是会报错的，而且很难看出来。

*   一定要记得，要在WEB-INF/lib/文件夹下把之前build path中添加的包通通添加进来， 否则会迷之报错，最典型的就是在Tomcat启动时报类似“Error configuring application listener of class org.springframework.web.context.ContextLoaderListener”的错误。。。话说报这个错的时候谁会想到是因为jar包没有加对地方造成的。。。另外提一句，如果是绕过eclipse直接在Tomcat中启动项目的话，还得会看日志，日志文件是在`%TOMCAT_HOME%/logs/catalina.out`文件中。如果不会看日志文件，你看到的只能是404 not found，并不能研究错误是什么。。。

*   通常情况下，第一次在Tomcat里跑自己的项目肯定会报类似这样的错误`“The Apache Tomcat Native library which allows optimal performance in production environments was not found...”`这是因为我们缺少APR（Apache Portable Runtime）这个东西，在windows下可以直接下tcnative-1.dll文件，并放在c:/windows/system32/下（注意选择架构）。如果是在ubuntu下就有点麻烦了，还得去下apr和apr-util文件来配置编译。。。甚是麻烦以至于我到现在都没弄好。。。

差不多上面就是我搭建Eclipse+Tomcat服务器遇到的问题和解决的方法。以后遇到问题还是要善于去找日志文件，并勤于利用搜索引擎，这样才能将问题进行有针对性的解决。