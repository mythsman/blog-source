---
title: Django框架基础
id: 1
categories:
  - Web
date: 2016-07-11 00:33:03
tags:
  - Python
  - Web
---

Django框架大概是python web框架中最有名的一个了，由于学习需要得用python搞个网页出来，那就学学这个喽。

入门级的介绍我是参考[自强学堂](http://www.ziqiangxuetang.com/django/)的简单教程，总的来说讲的还是蛮清楚的。

下面简单记录下搭建过程，其实也是非常容易上手。

## 安装

当然可以去[django官网](https://www.djangoproject.com/download/)下载源码直接`$sudo pip install Django`，而且版本也比较新。

相比下源码直接用来说，用pip安装能自动的把常用的命令对应的放在/usr/local/bin/等里面而不是扎堆放在一起，因此非常方便随处使用。

安装完成后在python命令行里输入
```
>>> import django
>>> django.VERSION
(1, 9, 7, 'final', 0)
```
即可查询当前版本了，这个还是要十分清楚的，因为1.7、1.8、1.9各个版本的使用差别还是很大的。

## 文件结构

django工程首先用`django-admin.py startproject project-name`来创建，这会生成一个项目文件夹。然后进入文件夹，输入`python manage.py startapp app-name`命令来生成一个应用。不过新建的app要手动在项目文件里注册，即在Test/Test/settings.py里的INSTALLED_APPS的字典里加上'app-name'字段来帮助项目找到属于他的应用。

文件树大概是这样的：
```
Test/
├── manage.py
├── MyApp
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
└── Test
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── wsgi.py
```
大的Test文件就是整个项目，MyApp就是一个项目(网站)，小的Test就是项目的配置文件，包括项目的基本配置(setting.py)，以及url映射文件(urls.py)。

## HelloWorld

下面就显示一个HelloWorld。

既然要显示网页，就肯定得有url到文件的映射，这个就是由项目里的urls.py文件设置：
```python
#coding:urf-8
from django.conf.urls import url
from django.contrib import admin
from MyApp import views as MyAppViews  # 添加

urlpatterns = [
    url(r'^$', MyAppViews.index),  # 添加
    url(r'^admin/', admin.site.urls),
]
```
首先得导入项目的views，然后用正则来匹配网页，r'^$'很明显就是匹配根目录。而MyAppViews.index就是对应调用的函数，这个函数就写在app/views.py下：
```python
#coding:utf-8
from django.http import HttpResponse

def index(request):
    return HttpResponse(u"HelloWorld")
```
很好理解，就是直接打印。

最后启动服务，在项目根目录下输入
```
python manage.py runserver 8000
```
当然，端口号8000可以省略或者指定其他的端口。

这样就能在本地访问8000端口的http服务了。
理论上，这点东西就足以搞搞静态页面了，不过事实上，他的功能更加强大。