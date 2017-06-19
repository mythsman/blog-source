---
title: Python在线编写以及文档查看工具jupyter
id: 1
categories:
  - Python
date: 2016-03-06 00:49:30
tags:
  - Python
---

jupyter其实就是ipython notebook的另一个版本，是一个很强大的基于ipython的python代码编辑器，python文档查看器。他可以部署在网页上，可以非常方便的对文件进行查看、下载，并且对python文件进行在线编译，甚至是远程连接。。。。。。用他编写的python文件本身就是一个强大的开发文档。更重要的是很多基于python开发的开源程序都热衷于用.ipynb格式的文件作为文档（比如caffe）。因此掌握jupyter的使用也尤为重要。

## Ipython notebook
### 简介

首先我们来探讨下jupyter的前身，ipython notebook。直接输入命令`$ipython notebook` 即可在浏览器中自动打开一个界面，显示了当前路径下的文件树。在这当中我们可以自由的编辑、处理文件，编写运行python文件等等。我们一方面可以用它来编程，另一方面也可以把他当成一个远程文件管理器，界面好看，用起来也十分的方便。

既然如此，我们就试着在服务器上搭建一个ipython notebook服务。

### 服务器配置

详细的文档可见[ipython官方文档](https://ipython.org/ipython-doc/2/notebook/public_server.html)，这里是结合文档进行的配置。

#### 配置文件

配置文件默认在~/.ipython/profile_default/文件夹中，这里default是profile 的用户名，也是我们打开notebook的默认用户。但是有时候我们会发现这里面的东西并不像配置文件。其实我们只需要输入如下命令即可把默认的配置文件给显示出来：
`$ipython profile create default`
很好理解，就是显式的创建一个default用户（当然我们还可以创建其他名字的用户）。

现在，打开~/.ipython/profile_default/ipython_notebook_config.py文件，这个就是我们的配置文件了。


#### 设置密码

由于ipython notebook 远程登陆的话权限很大，因此还是设置一个密码来保证安全。

1、首先我们要得到密码的哈希值，在ipython 中进行如下操作:
```
In [1]: from IPython.lib import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:7467b7351f12:79fc6599f863a8daf048c655f60adf03003b87f3'
```
在这里输入密码，就可以得到他的hash值了。记住Out[2]中的字符串。

2、然后在配置文件ipython_notebook_config.py中写如入下面的信息：
```
c = get_config()
c.NotebookApp.password =u'sha1:7467b7351f12:79fc6599f863a8daf048c655f60adf03003b87f3'
```
这样就可以了。


#### 配置接入点

这是稍微麻烦的地方，因为ipython的端口默认是8888而且不能跟apache2的冲突，所以在配置的时候需要想办法用一个优雅的姿势来用apache2访问到8888端口。

1、首先对配置文件进行一下设置，打开ipython_notebook_config.py，加入下面的信息：
```
c.IPKernelApp.pylab = 'inline'  # if you want plotting support always
c.NotebookApp.ip = '*'
c.NotebookApp.open_browser = False
# It is a good idea to put it on a known, fixed port
c.NotebookApp.port = 8888
````
很明显，我们可以自由的配置端口。由于ipython notebook会默认打开一个浏览器窗口，而服务器是打不开浏览器的，所以我么会把c.NotebookApp.open_browser设置为false防止warning。

c.NotebookApp.ip经检测还是设置为*好。。。否则会出现很多莫名的错误。

2、为了让apache2能自然的访问到8888端口，我们配置下.htaccess文件。打开网站根目录下的.htaccess文件，添加下面的语句：
```
RewriteCond %{HTTP_HOST} ^ipython\.mythsman.com$ [NC]
RewriteCond %{REQUEST_URI} ^/(.*)$ [NC]
RewriteRule ^(.*)$ http://ipython.mythsman.com:8888/%1 [R=301,L]
```
意思很简单，就是把ipython.mythsman.com的80端口重定向到8888端口。而这个站点的根目录其实就是我们打开ipython notebook 服务的那个目录。

事实上，我们可以在当前站点的任何子域名下输入8888端口进入这里。

## Jupyter

不知道为什么ipython notebook对于文件的同步性并不好。相比之下Jupyter做的就好多了，而且界面也更加漂亮。其实我个人觉得Jupyter就是ipython notebook的一种更新。

详细信息参见[官方文档](http://jupyter.readthedocs.org/en/latest/)。

### 安装

用`$pip install jupyter`等一系列类似手段，不解释了。



### 配置

#### 配置文件

其实jupyter本身的配置还是有点麻烦的，不过我们可以把ipython notebook的配置文件移植过来～～参考下面的映射表：

|ipython notebook | jupyter|
|-|-|
|~/.ipython/profile_default/ipython_notebook_config.py|~/.jupyter/jupyter_notebook_config.py|
|~/.ipython/profile_default/static/custom|~/.jupyter/custom|
|~/.ipython/profile_default/ipython_nbconvert_config.py|~/.jupyter/jupyter_nbconvert_config.py|
|~/.ipython/profile_default/ipython_qtconsole_config.py|~/.jupyter/jupyter_qtconsole_config.py|
|~/.ipython/profile_default/ipython_console_config.py|~/.jupyter/jupyter_console_config.py|

主要是第一个配置文件了，参照ipython的配置文件的写法照着搬过来就可以了，懒得去看他的配置命令。。


#### 配置服务器

与ipython一样配置下.htaccess即可。
```
RewriteCond %{HTTP_HOST} ^jupyter\.mythsman.com$ [NC]
RewriteCond %{REQUEST_URI} ^/(.*)$ [NC]
RewriteRule ^(.*)$ http://jupyter.mythsman.com:8888/%1 [R=301,L]
```
在想要显示的文件夹处输入jupyter notebook，即可在jupyter.mythsman.com处访问到jupyter。