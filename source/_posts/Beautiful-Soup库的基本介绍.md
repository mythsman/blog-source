---
title: Beautiful Soup库的基本介绍
id: 1
categories:
  - Python
date: 2015-11-23 01:08:29
tags:
  - Python
---

beautiful soup库是python中用来解析html文件的一个工具，他能做到将html文件依据他的标签的特征来取出相应的标签块，比如取出网页的title啊，body啊，或者是某个id对应的东西啊，等等。从而为进一步的加工处理创造条件。从某种程度上讲是替代了正则的作用，但是比正则表达式使用的更加方便。

现在的beautiful soup库已经是第4.2版本了，所以我们通常叫他bs4。bs4作为一个库，其实是有很多的用法的。至于其具体用法，我是参考以下的文档的：

[http://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/](http://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/)

这里讲的比较详细，查阅起来也很方便。至于安装，我一般是用来[pip](/2015/11/23/1/5)进行的，这个比较方便快捷，也便于管理。

这里权且记录下一些基本的用法：
```python
html_doc = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title"><b>The Dormouse's story</b></p>

<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>

<p class="story">...</p>
"""
from bs4 import BeautifulSoup  #导入模块

soup = BeautifulSoup(html_doc，“lxml”)  #生成对象soup(这里不加第二个参数有时候会报warning)

print soup.prettify()    #prettify()方法将源码格式化并返回
# <html>
#  <head>
#   <title>
#    The Dormouse's story
#   </title>
#  </head>
#  <body>
#   <p class="title">
#    <b>
#     The Dormouse's story
#    </b>
#   </p>
#   <p class="story">
#    Once upon a time there were three little sisters; and their names were
#    <a class="sister" href="http://example.com/elsie" id="link1">
#     Elsie
#    </a>
#    ,
#    <a class="sister" href="http://example.com/lacie" id="link2">
#     Lacie
#    </a>
#    and
#    <a class="sister" href="http://example.com/tillie" id="link2">
#     Tillie
#    </a>
#    ; and they lived at the bottom of a well.
#   </p>
#   <p class="story">
#    ...
#   </p>
#  </body>
# </html>

#以下的方法都很浅显易懂
print soup.title    
# <title>The Dormouse's story</title>

print soup.title.name
# u'title'

print soup.title.string
# u'The Dormouse's story'

print soup.title.parent.name
# u'head'

print soup.p
# <p class="title"><b>The Dormouse's story</b></p>

print soup.p['class']
# u'title'

print soup.a
# <a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>

print soup.find_all('a')
# [<a class="sister" href="http://example.com/elsie" id="link1">Elsie</a>,
#  <a class="sister" href="http://example.com/lacie" id="link2">Lacie</a>,
#  <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>]

print soup.find(id="link3")
# <a class="sister" href="http://example.com/tillie" id="link3">Tillie</a>

for link in soup.find_all('a'):
    print(link.get('href'))

# http://example.com/elsie
# http://example.com/lacie
# http://example.com/tillie

print soup.get_text()
# The Dormouse's story
#
# The Dormouse's story
#
# Once upon a time there were three little sisters; and their names were
# Elsie,
# Lacie and
# Tillie;
# and they lived at the bottom of a well.
#
# ...

```