---
title: python模块下载工具pip和easy_install
id: 1
categories:
  - Python
date: 2015-11-23 00:39:25
tags:
  - Python
---

在写python的时候，经常会用到一些扩展包，作为python新手，经常又不知道去哪里找这些包。而且就算是找到了，下载下来之后还需要进行繁琐的安装、配置等操作。有时候为了进行这些安装还要去安装能够安装这些程序的程序，比如setuptools等。而安装这些东西有可能还会有很多奇奇怪怪的问题，这样严重影响了编程的体验。还好，python有几个类似ubuntu中apt-get一样的东西，相当于一个包管理器，能够十分便捷的帮我们安装到自己需要的模块，这就是pip和easy_install。


## pip
### 安装
```
root@iZ28ntr2ej5Z:~# apt-get install python-pip
```
### 使用

比如想安装beautifulsoup包可以这样。
```
root@iZ28ntr2ej5Z:~# pip install beautifulsoup
```
这样基本就能将包安装好了。当然这里很多情况下是会报一些错的（比如包的名称不对），这些错通常都会输出到他的log文件中去，所有的问题都会在log中找到答案。

其实所有模块的安装方法都能在该模块的帮助文档中找到。比如beautifulsoup包也可以用apt-get来安装，但是作为一个更加专业的python软件，pip显然在python包的安装上更加有优势。而且，pip不仅可以下载，而且可以列举，更新和卸载包，使用的范围更加的广泛。

以下是一些常用参数：

### 更新
-U 或者 --upgrade
```
pip install -U SomePackage
```
可以用来更新其他模块，也可以更新pip自己。

### 查看更新
```
pip list --outdated
```
### 卸载
```
pip uninstall SomePackage
```
### 更新源

有时候经常会遇到他默认的下载点无法链接的情况，这就时候需要指定下载源了。

手动指定：

在pip后面跟-i 来指定源，比如用豆瓣的源来安装web.py框架：

pip install web.py -i http://pypi.douban.com/simple

自动指定：

修改~/.pip/pip.conf 文件的内容，类似与如下格式：
```
[global]
 index-url = http://pypi.douban.com/simple/
```
最后再更新下pip就行了。

！！！最新发现，更可靠的源：http://pypi.zenlogic.net/simple/

## easy_install
在实际中经常发现pip并不好用，因为牵涉到什么ssl的错误，经常会报一些奇奇怪怪的错。相比之下easy_install的表现就稳定许多了。

### 安装
```
root@iZ28ntr2ej5Z:~# apt-get install python-setuptools
```
没错，在setuptools里就有easy_install了。

### 使用

与pip的用法基本相同，只要把pip换成easy_install即可。包括指定源的方法，都一样。


* * *

2017年1月27日：

最近发现pip在使用自定义的源的时候需要添加--trusted-host参数才能从指定源下载，否则就会提示你需要安装的包找不到。其实这时候只要把在配置文件里写入的pypi源的url改成https即可。