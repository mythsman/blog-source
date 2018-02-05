---
title: Slf4j框架理解与分析
id: 1
date: 2018-02-04 15:57:48
category:
 - Java
tags:
 - Java
 - Log
---

# 前言
这两天在看设计模式相关的书，正好看到了门面模式，感觉不太能领悟它的精髓，就想找一些例子来看，突然发现这个slf4j框架不就是一个门面(facade /fəˈsɑ:d/)么，干脆就直接拿来看一看了，正好也把java的日志系统也了解了解。

# 日志系统
不谈那些比较复杂的分布式日志系统，这里主要讨论的是单机常用的那些日志框架。现在在Java生态中存在的日志框架也是挺多的了，初来乍到看起来有点懵，其实所谓的日志框架主要分两种：
* 一种是日志框架门面(facade)，用来统一一个共同的接口，方便我们用相同的代码支持不同的实现方法。主要包括commons-logging和slf4j两套规范。
* 另一种就是日志框架的实现了，主要包括log4j、log4j2、logback、slf4j-simple和java.util.logging包。

这两类东西当然要一起用，显然属于apache的东西一般放在一起用(log4j log4j2 commons-logging)，属于QOS的东西也一般放在一起用(logback slf4j)。不过话也不是绝对的，既然是门面嘛，肯定要支持的全一点了，如果门面跟实现的api不同的话呢，那就用适配器模式写一个adapter层做适配就好了。比如slf4j支持jul跟log4j就是通过适配器来做的。

这种通过门面来统一日志框架的好处是显而易见的，那就是我们在写代码的时候只需要知道门面的api就行了(这通常是比较简单而且一致的)，不需要知道不同框架的实现细节。我们完全可以在运行时再指定我们使用哪一套日志框架，这样就做到了业务逻辑与日志系统的解耦。如果是从依赖关系的角度来讲就是，比如对与slf4j，我们只需要在编译时依赖`slf4j-api.jar`(编译依赖)，这个jar里几乎只是定义了接口跟一些通用的工具；然后我们可以在运行时再去指定各种不同的实现，比如`slf4j-simple.jar`(运行依赖)。

这种使用方式与我们使用sql绑定驱动挺像的，其实他们都是采用的类似的思想。

但是这就带来一个问题，这种运行时进行服务发现的功能是怎么实现的呢？其实这种实现方法也挺多的，可以用Class.forName来指定加载(sql就是这么干的)，也可以自定义classLoader来指定加载(据说commons-logging是这么干的)，也可以用spi来动态加载(slf4j就是这么干的)。当然，我这里主要研究slf4j的加载方法。

# SPI
## 概述
SPI 就是(Service Provider Interface)，字面意思就是服务提供接口，这套规范其实我在之前的[Lombok原理分析](/2017/12/19/1/)中提到过，只是当时还不知道这个就是这么一个玩意。。。他的用法其实很简单，就是在服务调用者跟服务提供者之间商定了一个协议：
1. 服务发现者需要定义一个接口。
2. 服务提供者要实现之前的接口，然后在 classpath 里的 META-INF/services 文件夹下新建一个文件，文件名是之前的接口的全类名，文件内容是实现类的全类名。
3. 服务发现者保证会通过 ServiceLoader 在类路径内的所有jar包中搜索指定接口的实现类，进行实例化。

显然，一般来讲服务发现者一般就不能直接通过构造函数来构造这个接口的实现类，而是通过静态工厂方式封装实例化的过程。

## 例子
举一个简单的例子，首先定义一个没有实现的接口Ispi.java:
```java
package com.mythsman.test;

public interface Ispi {
    void say();
}
```
我们的目的是最终能够在场景类中通过这样的方法来调用Test.java:
```java
package com.mythsman.test;

public class Test {
    public static void main(String[] args) {
        Ispi ispi = SpiFactory.getSpi();
        ispi.say();
    }
}
```
那么首先我们需要写一个实现类SpiImpl.java:
```java
package com.mythsman.test;

public class SpiImpl implements Ispi {
    @Override
    public void say() {
        System.out.println("Hey , I'm an implement");
    }
}

```
然后创建resources/META-INF/services文件夹(resources文件夹已写入类路径)，在文件夹下写入创建一个文件名为`com.mythsman.test.Ispi`，内容为`com.mythsman.test.SpiImpl`，用以注册这个服务。

当然，上面这两步既可以在同一个项目中，也可以在另外一个项目中，只需要打包后将jar包放入类路径即可。

接着来写工厂SpiFactory.java:
```java
package com.mythsman.test;

import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;

public class SpiFactory {

    public static Ispi getSpi() {
        ServiceLoader<Ispi> loader = ServiceLoader.load(Ispi.class);
        List<Ispi> ispiList = new ArrayList<>();
        for (Ispi ispi : loader) {
            ispiList.add(ispi);
        }
        if (ispiList.size() > 2) {
            System.err.println("Mutiple implements found.");
            return new SubstituteSpi();
        } else if (ispiList.size() < 1) {
            System.err.println("No implements found.");
            return new SubstituteSpi();
        } else {
            return ispiList.get(0);
        }
    }
}
```
这里的ServiceLoader会去类路径中查找所有支持了Ispi接口的实现类，并返回一个迭代器，这个迭代器会实例化所有的实现类。当然我们可能会发现多个实现类或者没有发现实现类，这时为了保证代码的健壮我们通常会写一个默认的实现SubstituteSpi.java:
```java
package com.mythsman.test;

public class SubstituteSpi implements Ispi {
    @Override
    public void say() {
        System.out.println("Well I'm a backburner implement");
    }
}
```
如果能成功发现一个，那么我们就可以返回这一个实例了。

这种方法应该是一种比较清楚的服务动态发现的方法了。

# SLF4J
## 成员
slf4j通过上述的方法构建了自己的生态圈，在slf4j-api-xxx.jar的统一管理下容纳了多种实现：
* slf4j-log4j12-xxx.jar
* slf4j-jdk14-xxx.jar
* slf4j-nop-xxx.jar
* slf4j-simple-xxx.jar
* slf4j-jcl-xxx.jar
* logback-classic-xxx.jar
其中slf4j-nop比较无聊，其实就是什么都没有实现，所有的log都不会处理；slf4j-simple比较小巧，基本能满足简单的使用，配置也很少；logback-classic是slf4j相同作者的作品；剩下其他的则都是相当于一个适配层，将slf4j与其他实现进行适配。

## 接口
那么如果我们想写一个支持slf4j规范的框架应该怎么写呢，其实很简单，只需要实现 org.slf4j.spi.SLF4JServiceProvider 这个接口即可。比如slf4j-jdk14就是这么写的:
```java
package org.slf4j.jul;

import org.slf4j.ILoggerFactory;
import org.slf4j.IMarkerFactory;
import org.slf4j.helpers.BasicMDCAdapter;
import org.slf4j.helpers.BasicMarkerFactory;
import org.slf4j.spi.MDCAdapter;
import org.slf4j.spi.SLF4JServiceProvider;

public class JULServiceProvider implements SLF4JServiceProvider {

	public static String REQUESTED_API_VERSION = "1.8.99"; // !final

	private ILoggerFactory loggerFactory;
	private IMarkerFactory markerFactory;
	private MDCAdapter mdcAdapter;

	public ILoggerFactory getLoggerFactory() {
		return loggerFactory;
	}

	public IMarkerFactory getMarkerFactory() {
		return markerFactory;
	}

	public MDCAdapter getMDCAdapter() {
		return mdcAdapter;
	}

	public String getRequesteApiVersion() {
		return REQUESTED_API_VERSION;
	}

	public void initialize() {
		loggerFactory = new JDK14LoggerFactory();
		markerFactory = new BasicMarkerFactory();
		mdcAdapter = new BasicMDCAdapter();
	}
}

```
对于简单的日志系统，我们其实只需要实现一下ILoggerFactory接口就行了，IMarkerFactory 跟 MDCAdapter用默认的就可以了。

## 使用
用起来很方便，用LoggerFactory创建logger即可：
```java
package com.mythsman.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Test {
    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(Test.class);
        logger.info("this is an info");
    }
}
```
getLogger传入的其实就是一个名字而已，方便我们定位而且这些log默认会写到System.err里。

## 配置
那么如果我们想对日志进行配置该怎么弄呢，比如设置日志级别，日志输出文件？遗憾的是，日志门面并没有对这个进行统一，而是将这个功能交给了不同的日志实现自己去做（毕竟这东西也不太好统一）。比如logback和log4j，我们就要写长长的xml;比如slf4j-simple,我们就要去看他源码，找到他定义的日志文件和配置项（查看SimpleLoggerConfiguration类就很清楚了）。

## MDC
记得slf4j的接口里有一个MDC,这个东西是做什么的呢？其实从他的名字就可以猜到(Mapped Diagnostic Context)，其实就是一个类似Map的上下文。他解决了我们可能会希望进行一些即时数据的保存与计算：
```java
package com.mythsman.test;

import org.slf4j.MDC;

public class Test {
    public static void main(String[] args) {
        MDC.put("key", "value");
        System.out.println(MDC.get("key"));
    }
}
```
其实说白了也就是一个ThreadLocal的ConcurrentHashMap。。。。


# 参考文章
[Java常用日志框架介绍](https://www.cnblogs.com/chenhongliang/p/5312517.html)
[Slf4j user manual](https://www.slf4j.org/manual.html)
[Java 规范 SPI](http://blog.csdn.net/u012410733/article/details/52475039)
[slf4j log4j logback关系详解和相关用法](https://www.cnblogs.com/Sinte-Beuve/p/5758971.html)
