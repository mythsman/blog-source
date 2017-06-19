---
title: SpringBoot环境熟悉
id: 1
categories:
  - Java
date: 2017-05-12 22:34:12
tags:
  - Java
  - Web
---


## 前言

就个人而言，我曾经比较畏惧JAVA，我们都知道JAVA这个东西是相当成熟了，各种框架特别复杂，名词也特别的多。我还记得我第一次想学struts的时候折腾了半天硬是没有找到头绪，面对各种眼花缭乱的包、眼花缭乱的配置文件、眼花缭乱的框架版本、眼花缭乱的报错信息，还有眼花缭乱的各种名词，硬是停留在了servlet的层面上，完全失去了在短时间内学下去的动力。因此很久都没有碰过JAVA。不过一个机缘巧合，我突然发现其实这些东西都是很有套路的，每一个东西其实都是为了解决某一个小问题，只是刚入门的时候面对庞大的体系一下子懵了。而且，在JAVA发展到当今的程度，之前冗杂的事情也被简化了很多，框架的封装度更加的高，我们学起来也轻松很多了。

## SpringBoot
Springboot就是当前火热起来的用于JAVA Web开发的微框架，配置十分方便，结合Intellij IDEA用起来十分的顺手，非常适合快速上手。同时他的文档也清楚,[官方文档](http://spring.io)里写的也很细致。

## 快速上手
曾经最烦人的配置问题在这里都不是问题，当我们需要创建项目的时候，可以去[start.spring.io](http://start.spring.io/)上选择相应的配置，下载一个空的项目包，然后用IDE打开即可。

通常情况下，除了指定包信息以及各种版本信息之外，我们在开发Springboot的时候一般会加上下面的依赖：

* Thymeleaf
* AOP
* MySQL
* MyBatis
* Redis
* DevTools

Thymeleaf是SpringBoot1.5版本后推荐的模板引擎，取代了曾经的velocity以及更加古老的jsp，左右后台渲染前台页面的控制器；
AOP则是对面向切面编程思想的支持，他给我们提供了面向切面编程的接口；
MySQL则是非常主流的数据库驱动；
Mybatis则为我们在数据库与函数之间建立了一个DAO(Data Access Object)层，方便我们不用写jdbc的代码就能访问数据；
Redis则是非常流行的NOSQL数据库，适合对一些数据做缓存处理以及快速的读取写入；
DevTools则提供了很多方便我们编程的特性，让IDE反应更快。。。

事实上这个网站做的事情也很简单，就是构建了下面的文件结构:

    ├── mvnw
    ├── mvnw.cmd
    ├── pom.xml
    └── src
        ├── main
        │   ├── java
        │   │   └── com
        │   │       └── example
        │   │           └── demo
        │   │               └── DemoApplication.java
        │   └── resources
        │       ├── application.properties
        │       ├── static
        │       └── templates
        └── test
            └── java
                └── com
                    └── example
                        └── demo
                            └── DemoApplicationTests.java

说白了其实就是配置了maven的包管理系统，以及推荐的文件结构，仅此而已。

## 什么是maven
maven其实就是一个包管理工具，就像是python的pip，ubuntu的apt,js的npm，在[www.maven.org](https://www.maven.org/)里集成了绝大多数大家常用的包信息，类似于webservice的注册中心。maven将本项目所有的包依赖全都写进了pom.xml文件中，免得我们一个一个下载再一个一个放进build path里，免去了很多的麻烦。
上面的配置形成的pom.xml如下:
```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.example</groupId>
	<artifactId>demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>jar</packaging>
	<name>demo</name>
	<description>Demo project for Spring Boot</description>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.3.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-aop</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-redis</artifactId>
		</dependency>
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>1.3.0</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
        </build>
</project>
```
如果我们想重新加入一个包，只要在maven的管理中心找到这个包的groupId以及artifactId然后写在这里的dependency里就行了。最后利用IDE提供的自动导入maven包即可。

## 配置文件
相比于曾经写项目每个组件都有一个xml配置文件，SpringBoot都帮我们封装成了一个统一的配置文件application.properties，比如在某一个项目中我的配置是这样的:
```
#tomcat start
server.compression.enabled=true

#tomcat end

#redis start
spring.redis.database=0
spring.redis.host=localhost
spring.redis.port=6379
#redis end

#multipart start
spring.http.multipart.enabled=true
spring.http.multipart.max-file-size=10MB
spring.http.multipart.max-request-size=10MB
#multipart end

#thymeleaf start
spring.thymeleaf.mode=HTML5
spring.thymeleaf.encoding=UTF-8
spring.thymeleaf.content-type=text/html
spring.thymeleaf.cache=true
#thymeleaf end

#mysql start
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=123456
#mysql start

#mybatis start
mybatis.configuration.cache-enabled=true
mybatis.configuration.lazy-loading-enabled=true
mybatis.configuration.multipleResultSetsEnabled=true
#mybatis end
```
这其实就是对传统的配置方法做了一层封装，使得项目更加简洁清楚，所有的配置项也都能由IDE自动补全，不要太爽。

## 最后
由于这个框架比较新，因此很多组建都需要java8的支持，并且如果以后发布到服务器上，也需要Tomcat8的支持，这一点需要尤其的注意。
