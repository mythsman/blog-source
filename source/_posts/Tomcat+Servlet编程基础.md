---
title: Tomcat Servlet编程基础
id: 1
categories:
  - Java
date: 2016-03-27 23:51:24
tags:
---

之前一直使用的是Apache服务器，对于Tomcat的工作方式反而不那么习惯。给我一个Java web程序源码我都不晓得他应该怎么连接到Tomcat上。于是趁着无聊的时候看了个J2EE的Servlet教程，终于对怎么把java部署到Tomcat上、以及Tomcat的基本工作流程有了简要的认识。当然，这里仅仅指的是简单的Servlet程序的部署方法，不过这点方法从理论上讲已经具备了写一个简单web 应用的能力了。


## Tomcat基本配置

Tomcat的配置文件是%TOMCAT_HOME%/conf/server.xml，这里配置了Tomcat的基本信息，最重要的是下面这两个：
```
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
```
```
<Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
```
第一个指定了Tomcat监听的端口，默认是8080，如果和其他应用冲突了可以在这里修改。

第二个指定了Tomcat映射的根目录，就像apache中的/var/www/html/的作用一样，但又不完全一样。因为这下面放的都应该是一套完整的应用而不是单一的html文件。

## HttpServlet类基本用法

Servlet程序就是服务器小程序，现在我们的目的是编写web服务器，那么自然就用到了HttpServlet类来实现一个Http服务器应用。它的基本框架是：
```java
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/MyServlet")
public class MyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.getWriter().append("<a href='http://www.baidu.com'>baidu</a>");
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
```
这里最常用的就是重载它的doGet和doPost方法，每个方法都传入Request和Response方法，可以从Request中读入用户传过来的数据，并且将需要显示的内容写在Response中，这样就可以达到简单的动态显示网页的效果了。（注意加@WebServlet标注）


## Webapps下项目基本配置

这个是Tomcat和Apache非常不同的东西，也是我花了半天才理清楚的。

把Servlet应用放在Webapps文件夹下必须要有web.xml配置文件，这个文件应该放在 项目根目录/WEB-INF/ 下，这是用来配置整个项目的配置文件。他一定要有如下格式：
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  version="3.1"
  metadata-complete="true">

</web-app>
```
实际上就是把`%TOMCAT_HOME%/conf/web.xml`文件的中间部分去掉，留下了外壳，以后需要在这里面慢慢添加配置文件。

当然， 为了让他能访问到一个特定的Servlet程序，我们还要的对他进行注册:

首先，我们要把编译过的MyServlet.class文件放在WEB-INF/下的classes/文件夹下；

然后，在上面的web.xml中间写入这样的内容:
```
<servlet>
      <servlet-name>MyServlet</servlet-name>
      <servlet-class>MyServlet</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>MyServlet</servlet-name>
        <url-pattern>/MyServlet</url-pattern>
    </servlet-mapping>
```
意思很清楚，就是对这个Servlet起个名字，然后把他映射到项目根目录下的MyServlet上，这样就能够通过浏览器访问到了。（事实上，上面的操作的目的就是之前那个类文件中的`@WebServlet("/MyServlet")` 。

上面是比较基础的操作方法，如果是用Eclipse的话就简单的很了，什么配置web.xml啊，新建文件夹啊都不用操心，只要新建动态网页应用，写个Servlet类，然后直接就能跑起来。不过有一个要注意的就是在用Eclipse查看浏览页面的时候是不用手动开启Tomcat服务器的，如果手动开了的话还会报错。