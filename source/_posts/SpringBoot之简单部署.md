---
title: SpringBoot之简单部署
id: 1
categories:
  - Java
date: 2017-05-20 23:28:59
tags:
  - Web
  - Java
---

## 命令行测试运行
有些时候我们需要将项目部署在服务器上进行简单测试，但是直接部署到Tomcat里又十分慢，这时候我们可以用maven工具的一个命令来模拟本地启动项目:
```
./mvnw spring-boot:run
```
这里用到了一个叫`spring-boot-starter-parent`的包，只要pom.xml里加了这个就能执行。
这样我们就可以在服务器的8080端口访问到这个临时的项目。

## 简单部署
通常情况下，我们会把SpringBoot生成的项目打包成war放在Tomcat服务器中运行，不过这当中也有一些需要注意的地方，下面就简单罗列一下，作为总结。

## 修改项目配置
参考SpringBoot的一篇文档[Traditional deployment](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-traditional-deployment.html)。为了能让项目支持在Tomcat中启动，我们首先要修改一下启动配置。
修改项目中的`XXXApplication.java`这个启动文件，使他继承`SpringBootServletInitializer`，并重载`configure`方法:
```
@SpringBootApplication
public class OnlineLibraryApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(OnlineLibraryApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(OnlineLibraryApplication.class, args);
	}
}

```
这样这样就可以让项目在Tomcat中启动了。

## 修改导出的包类型
由于默认使用的包管理工具是maven，我们要修改下pom.xml中的导出方式，在该文件的开头将`packaging`标签修改为`war`。
```
	<packaging>war</packaging>
```
## 运行Maven命令导出包
为了保证项目能够在服务器中运行，最好将编译的过程放在服务器上，这样可以提早发现服务器版本落后的等的问题。因为很多情况下，Java Tomcat版本落后会导致很多奇怪的问题，有时候还不容易发现。
在项目根目录中有一个`mvnw`文件，我们通过下面命令执行他：
```shell
./mvnw clean package 
```
这样，程序就会编译并且测试这个项目，以保证该项目能够在当前环境中运行。
编译并测试通过后，会在项目的`target/`文件夹下生成一个war包，我们把这个包放到Tomcat的webapps目录下并且重启项目，稍等片刻后即可在8080端口下与项目名相对应的路径中访问到该项目。

## 配置反向代理
上面的项目在很多情况下会加载不了静态文件，因为项目中访问静态文件通常是直接在`xxx.xxx.xxx/css`之类的路径中，而Tomcat简单部署后项目的根路径会变成`xxx.xxx.xxx/projectName/`，这样实际的静态文件路径就是`xxx.xxx.xxx/projectName/css/`，显然就会找不到了。
当然，我们可以配置Tomcat将项目映射到`/`下，但是为了保证项目的并发性更好，我们一般都采用nginx进行反向代理。

一般在`/etc/nginx/sites-enabled/default`文件中，修改出一个类似下面的配置:
```
server {
    listen 80;
    server_name 127.0.0.1:8080;
    location / {
        proxy_pass  http://127.0.0.1:8080/projectName/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
   }
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 8k;
    gzip_http_version 1.1;
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml image/png image/jpeg;
}
```
主要就是添加一个反向代理并开启Gzip加速。
很多情况下对服务性能的提高还是非常有帮助的，尤其是Gzip，如果发现某些mime-type没有加速可以把这个类型添加到`gzip_types`中。

## 查看Log日志
很多情况下，我们会在程序里打上Log，那么在Tomcat里这些Log都写在了哪里呢？
这个主要是Tomcat的设置了，在Tomcat的logs文件夹下有很多log文件，主要是下面三类:

### 项目启动类日志
这类日志一般名字会类似`catalina.2017-05-19.log`这样。
这些日志主要记录了项目启动以及关闭时可能报的错，主要是Tomcat在启动服务的时候写的。

### Web访问类日志
这类日志一般名字会类似`localhost_access_log.2017-05-19.txt`这样。
这些日志主要记录了每一个Web访问的历史，跟Apache的日志类似：
```
127.0.0.1 - - [19/May/2017:15:03:28 +0800] "GET /onlinelibrary-0.0.1-SNAPSHOT/js/swiper.min.js HTTP/1.1" 200 96826
127.0.0.1 - - [19/May/2017:15:03:28 +0800] "GET /onlinelibrary-0.0.1-SNAPSHOT/images/pic1.jpg HTTP/1.1" 200 123242
127.0.0.1 - - [19/May/2017:15:03:28 +0800] "GET /onlinelibrary-0.0.1-SNAPSHOT/images/pic2.jpg HTTP/1.1" 200 24962
```

### SpringBoot日志
这类日志一般名字会类似`catalina.out`这样。
这些日志主要记录了SpringBoot的启动日志，以及程序员在程序中写的logger的日志，方便我们进行监控。
