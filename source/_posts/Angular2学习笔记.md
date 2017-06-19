---
title: Angular2学习笔记
id: 1
categories:
  - Web
date: 2017-04-26 23:23:27
tags:
  - Web
---


## 前言
阴差阳错，当初在选择写网站的时候选择了使用Angular2+RESTfuｌ，现在想起来，这个选择可能有点轻率了。虽然这套框架我个人觉得可能的确比较适合做移动端Web的开发，但是由于网站开发的经验明显不足，加上这套技术还不是相当的成熟，在学习的过程中走了很多的弯路。而且，功利一点的讲，对于找工作的帮助可能并不是很大，很多Web相关的职务招的都是Java方向的，而我直接跳过这种传统框架直接接触新知识难免会发现基础不牢的情况。不过还好，经过这一段时间的倒腾，好歹把Angular2的东西稍微消化了一点，相比啥都不会，也算是有点收获吧。

## 基础配置
刚学习Angular2的时候，是照着他的[中文文档](https://angular.cn/docs/ts/latest/)上来的。虽然这上面对框架解释的非常细致，讲的也很清晰，例子也很典型，但是这个文档还是有点偏旧了。文档中介绍的example中用的结构还是用的基于github源码的较早前的版本，现在用起来十分的不方便。现在基本上都是用angular-cli来组织文件，这个项目对Angular2提供了强大的支持，我们用起来也比以前方便了很多。
具体的过程就不细说了，可以参考angular-cli的[wiki](https://github.com/angular/angular-cli/wiki)，主要是以下步骤：

1. 安装新版本的node。(注意node的版本一定要是6以上的，否则会报奇奇怪怪的错);
2. 安装angular-cli (`npm install -g @angular/cli`);
3. 新建项目 (ng new PROJECTNAME);
4. 选择一个合适的IDE，我选择的是WebStorm;

这样基本上就算是搭好了Angular2简单的开发环境。

## 开发细节
Angular2这类MVVM架构的框架跟传统的MVC框架有很大的不同，不过主要需要考虑的就是下面这几个部分：

1. 模板。主要是模板语言部分以及在模板中使用组件的变量等等。
2. 数据绑定。包括属性绑定、事件绑定、插值绑定以及双向绑定，主要用于组件内的变量在页面中的显示以及页面等。
3. 服务。这包括两方面，一个是访问RESTFUL的服务，另一个是用来保存本地变量的。访问RESTFUL的服务通常是使用Promise来进行异步回调使用的，访问本地变量的服务则要注意不要写成全局的变量，否则就会出现类似所有同时访问网站的用户都共享同一个变量的尴尬场面。。。
4. 依赖注入。依赖注入做的就是控制变量的传递关系，防止数据混乱的调用关系等等。

具体的使用方法等到需要的时候查看文档即可。

## 项目发布
如果是测试环境，直接`ng serve`就可以用node服务器在本地的默认4200端口显示页面了。
但是，用测试环境你会发现项目非常的巨大，一个啥依赖都没有的'Hello world'就足足有3MB的大小，这显然是用户无法接受的。

那么为什么他会有这么大呢？这是由于Angular2默认使用的是JIT(Just-in-Time - JIT)编译。这个JIT编译有他的好处，他意味这我们的代码是在客户端解释的，那么他编译的效率会比较高，编译的结果会更好。但是他也有很多的缺点，Angular2文档中列举了下面几点：

1. 渲染得更快;
2. 需要的异步请求更少;
3. 需要下载的Angular框架体积更小;
4. 提早检测模板错误;
5. 更安全;

于是，Angular2又提出了一个新的编译方法叫AOT(Ahead of Time - AOT)。这个编译方法就是相当于静态编译，这样就可以提前筛掉没有使用过的组建，并且减轻了客户端的压力。显然这很棒棒喽，但是文档中介绍的转换方法实在是麻烦，弄了半天报了一堆错也没弄成，最后还是用了angular-cli才算搞定。

对于开发环境，可以使用`ng serve --prod --aot`来进行简单的优化。不过对于真正的生产环境我们显然不能用node服务器，我这里用的是nginx来部署，具体步骤如下：

1. 使用命令`ng build --prod --aot`来生成`dist/`文件夹。
2. 将上面的文件夹配置成nginx站点的根目录
3. 配置gzip压缩，进一步减少文件传输量
4. 使用try\_files选项配置跳转的启动路径，否则直接输入二级路由是会报错的。

具体的配置应当是下面这样：

    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /var/www/html/dist;
        index index.html index.htm;

        # Make site accessible from http://localhost/
        server_name localhost;

        location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            try_files $uri $uri /index.html;
            # Uncomment to enable naxsi on this location
            # include /etc/nginx/naxsi.rules
        }
        gzip on;
        gzip_min_length 1k;
        gzip_buffers 4 8k;
        gzip_http_version 1.1;
        gzip_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml;
    }
    
这基本就是Angular2项目开发的基本过程了。

## 参考文章

[angular-cli](https://github.com/angular/angular-cli/wiki)
[angular中文文档](https://angular.cn/docs/ts/latest/)
[nginx发布Angular2](https://my.oschina.net/syscde/blog/790763)
