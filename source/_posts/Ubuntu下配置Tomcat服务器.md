---
title: Ubuntu下配置Tomcat服务器
id: 1
categories:
  - Java
date: 2016-01-21 20:50:57
tags:
  - Java
---

本来以为安装了apache之后就可以万事大吉了，没想到在用java的时候发现apache并不能执行servlet服务，也不能解析jsp。想实现这些功能就得安装Apache的一个拓展服务器－－Tomcat。

## 与apache的差别

这个Tomcat其实可以看成是apache的一个拓展，他能实现上述apache服务器实现不了的东西。但是他也有不足，那就是他不能解析php，而且据说解析网页的速度也没有apache快，也没有apache稳定。所以说他并不能代替apache，apache也不能代替他。事实上他和apache虽说是两个服务器，但却是能很好的兼容的，因为apache的默认端口是80，而Tomcat的默认端口是8080（当然这是可以修改的），所以并不冲突。

## 下载安装

首先从[apache的Tomcat官网](http://tomcat.apache.org/)上找到需要下载的源码。这里注意搭配环境，8.０的版本是要支持JDK1.7的，而9.0的版本是要支持JDK1.8的。这里我是JDK1.7所以只能用8.0的。

（这里需要注意一下，我们最好下Core版本，而不要下src源码版本。因为src版本里面缺少一些必要的jar包，在启动服务的时候会报错，还得回官网来下载/bint/extra里面的包。。。）

下载下来后按理说应该找README文件，但是这里没有。最后浏览了下找到了RUNNING.txt文件，打开一看，大概就是我需要的安装向导了。

根据安装向导做出了以下配置：

１、设置CATALINA_HOME环境变量：

这个变量是给系统寻找tomcat文件目录用的，会在他的脚本里面调用，所以有必要设置成环境变量，在/etc/envirenment里面根据格式加上他的文件地址就可以了。这里还有一个CATALINA_BASE变量可以写，不过既然默认是和CATALINA_HOME一样，那就暂且忽略他吧。

２、设置配置文件：

根据提示找到了`$CATALINA_HOME/bin/catalina.sh`文件，里面讲了一大堆可以设置的变量，但是必选的只有两个，一个是上面提到的，另一个就是`$JAVA_HOME`变量了。不过他建议我们把这些用户写的变量统一写到setenv.sh下面便于管理，那我们就照做吧。在同文件下新建setenv.sh文件并写入`$JAVA_HOME`变量的地址（`/usr/lib/jvm/java-7-openjdk-amd64/`）。

设置之后记得`source /etc/envirenment`执行一下文件。

３、执行安装文件：

找到start.sh，给予执行权限然后执行。我这里报了一个错，说找不到logs文件夹。。。。不晓得那个启动脚本怎么都没考虑到这一点。。找不到新建一个不就好了么。。。

执行成功后他显示了`Tomcat started.` 。


４、启动脚本：

事实上tomcat的启动脚本是catalina.sh，所以我们可以通过./catalina.sh  start 和　./catalina.sh stop 来启动和关闭服务。既然如此，那么我们何不把他移到/etc/init.d里面去用service命令来操作呢？用一个软链接加进去就好了`sudo ln -s /usr/local/tomcat/ibn/catalina.sh tomcat ` 。

这样就可以方便的进行管理了。

## 测试

打开浏览器访问`localhost:8080`即可看到测试页面了。