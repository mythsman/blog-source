---
title: Eclipse下WebService的发布和使用
id: 1
categories:
  - Java
date: 2016-05-26 22:47:37
tags:
  - Java
---

## 前言

书上和网上有很多介绍WebService、WSDL、SOAP、UDDI概念的内容，大都说的云里雾里。尤其是书上介绍了WSDL、SOAP、UDDI的写法规范，写的天花乱坠，更是让人光看看就不想去了解这个东西了。我觉得这种东西还得实践一下才能知道WebService真正的意义以及WSDL等规范的存在价值。

OK，下面就是本人参照网上各种版本的教程捣鼓出来的WebService的编写和使用方法，不过由于我服务器上没有配置Tomcat、本机又没有域名，所以就没有在UDDI中进行注册。

## 开发环境

JDK1.8、Tomcat v8.0、Eclipse J2EE  Mars.2

## 服务端

WebService的服务端其实就是一个普通的Java程序，不过需要注意的是新建项目的时候一定要选择Dynamic Web Project，文档树如下图所示：

![](/images/2016/05/26/1/1.png)

我新建的项目名叫MyService，只有一个类，写了如下内容：
```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class MyService {
	public String getTime(){
		return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	}
	public static void main(String[] args) {
		MyService ms=new MyService();
		System.out.println(ms.getTime());
	}
}
```
输出：`2016-05-25 21:47:49`

应作业要求我就写了一个显示本机时间的方法，这都不重要了。

到现在，整个项目就是一个简单的网页项目，下面我们就要用他来生成WebService。

新建项目，找到WebService：
![](/images/2016/05/26/1/2.png)

点击Next弹出下面的选框：

![](/images/2016/05/26/1/3.png)

注意左边这两个滚动条，第一个滑动条表示我要启动这个服务；第二个滑动条表示我要顺便生成一个与他对应的客户端（当然也可以暂时不生成而是等会用WSDL文件来生成）。然后在上面的Service Implementation里选择想要发布的类的名称，我这里就用上面的那个MyService类，最后下面勾上public the Web Service的选框表示我要用UDDI把它发布出去。

然后一路Next，最后选择Start Server。最后他就会弹出UDDI的注册界面让我们来注册这个服务：

![](/images/2016/05/26/1/4.png)

先不管了，反正知道有这么个东西，等部署到服务器上的时候再来弄。

这样子我们的服务端的配置就算搞定了，那么问题来了，其他人该怎么来调用我写的这个类呢？

其实在上一步配置完WebService后，我们可以看到在WEB-INF目录下会生成一个子目录叫wsdl/，这个文件夹下有一个文件叫MyService.wsdl。没错，这个就是WSDL。用Eclipse打开会默认在Design界面显示成类似UML的东西（不知道是不是）:

![](/images/2016/05/26/1/5.png)
当然也可以在Source界面显示成xml代码的形式：

![](/images/2016/05/26/1/6.png)

没错，这个就是书上介绍的恶心的WSDL文档，其实这东西完全不用自己写，都是可以由eclipse 帮我们生成。

最后，我们也可以中浏览器中打开这个文件："http://localhost:8080/MyService/services/MyService?wsdl"。这就意味这只要本机能作为服务器，那么因特网上的任何一台主机都可以访问这个url，并且利用这个内容调用服务器中的服务。

下面就来介绍怎么远程调用这个服务。

## 客户端

新建项目，选择Web Service Client项目：

![](/images/2016/05/26/1/7.png)

在框框中输入需要调用的WSDL文件。我这里调用的就是上面生成的那个URL。

不过需要注意的是我们需要新建一个Dynamic web project，并用他来替换箭头中指向的项目，即把客户端安装到这个项目中。

一路next就可以在目标项目中生成下面的一堆文件：
![](/images/2016/05/26/1/8.png)

这就是我们获得的客户端文件了，打开看看才知道，这些东西其实是用RMI写的。。。。。。

然后我们在这个项目中新建一个测试类Test：
```java
package test;
import java.rmi.RemoteException;
import DefaultNamespace.MyService;
import DefaultNamespace.MyServiceProxy;
public class Test {
	public static void main(String[] args) throws RemoteException {
		MyService ms=new MyServiceProxy();
		System.out.println(ms.getTime());
	}
}
```
这样就可以像在本机调用MyService类一样的调用那个getTime函数了，最终也返回了正确的结果。

## 参考资料

[使用eclipse开发webService很简单](http://blog.csdn.net/guo_rui22/article/details/6253745)
[Java WebService 简单实例](http://www.cnblogs.com/yisheng163/p/4524808.html?utm_source=tuicool)
