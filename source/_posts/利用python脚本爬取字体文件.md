---
title: 利用python脚本爬取字体文件
id: 1
categories:
  - Python
date: 2016-03-10 19:30:21
tags:
  - Python
  - Crawler
---

为了提高验证码的识别准确率，我们当然要首先得到足够多的测试数据。验证码下载下来容易，但是需要人脑手工识别着实让人受不了，于是我就想了个折衷的办法------自己造验证码。

为了保证多样性，首先当然需要不同的字模了，直接用类似ttf格式的字体文件即可，网上有很多ttf格式的字体包供我们下载。当然，我不会傻到手动下载解压缩，果断要写个爬虫了。

### 网站一：fontsquirrel.com

这个网站的字体可以免费下载，但是有很多下载点都是外链连接到其他网站的，这部分得忽略掉。
```python
#coding:utf-8
import urllib2,cookielib,sys,re,os,zipfile
import numpy as np

#网站登陆
cj=cookielib.CookieJar()
opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders=[('User-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36))')]
urllib2.install_opener(opener)

#搜索可下载连接
def search(path):
    request=urllib2.Request(path)
    response=urllib2.urlopen(request)
    html=response.read()
    html=html.replace('\n',' ')#将所有的回车去掉，因为正则表达式是单行匹配。。。。。。
    urls=re.findall(r'<a href="(.*?)">(.*?)</a>',html)
    for i in urls:
        url,inner=i
        if not re.findall(r'Download ',inner)==[] and re.findall(r'offsite',inner)==[] and url not in items:
            items.append(url)

items=[]#保存下载地址

for i in xrange(15):
    host='http://www.fontsquirrel.com/fonts/list/find_fonts/'+str(i*50)+'?filter%5Bdownload%5D=local'
    search(host)

if not os.path.exists('ttf'):
    os.mkdir('ttf')
os.chdir('ttf')

def unzip(rawfile,outputdir):
    if zipfile.is_zipfile(rawfile):
        print 'yes'
        fz=zipfile.ZipFile(rawfile,'r')
        for files in fz.namelist():
            print(files)  #打印zip归档中目录
            fz.extract(files,outputdir)#解压缩文件
    else:
        print 'no'

for i in items: 
    print i
    request=urllib2.Request('http://www.fontsquirrel.com'+i)
    response=urllib2.urlopen(request)
    html=response.read()
    name=i.split('/')[-1]+'.zip'
    f=open(name,'w')
    f.write(html)
    f.close()#文件记得关闭，否则下面unzip会出错
    unzip(name,'./')
    os.remove(name)

os.listdir(os.getcwd())
os.chdir('../')

files=os.listdir('ttf/')
for i in files:#删除无用文件
    if not (i.split('.')[-1]=='ttf' or i.split('.')[-1]=='otf'):
        if os.path.isdir(i):
            os.removedirs('ttf/'+i)
        else:
            os.remove('ttf/'+i)

print  len(os.listdir('ttf/'))
```
搞到了2000+个字体，种类也挺多的，蛮好。


### 网站二：dafont.com

这个网站的字体花样比较多，下载起来也比较方便，恶心的是他的文件名的编码好像有点问题。
```python
#coding:utf-8
import urllib2,cookielib,sys,re,os,zipfile
import shutil
import numpy as np

cj=cookielib.CookieJar()
opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders=[('User-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36))')]
urllib2.install_opener(opener)

items=[]

def search(path):
    request=urllib2.Request(path)
    response=urllib2.urlopen(request)
    html=response.read()
    html=html.replace('\n',' ')
    urls=re.findall(r'href=\"(http://dl.dafont.com/dl/\?f=.*?)\" >',html)
    items.extend(urls)

for i in xrange(117):
    host='http://www.dafont.com/new.php?page='+str(i+1)
    search(host)
    print 'Page'+str(i+1)+'done'
    items=list(set(items))
    print len(items)

if not os.path.exists('ttf2'):
    os.mkdir('ttf2')
os.chdir('ttf2')

def unzip(rawfile,outputdir):
    if zipfile.is_zipfile(rawfile):
        print 'yes'
        fz=zipfile.ZipFile(rawfile,'r')
        for files in fz.namelist():
            print(files)  #打印zip归档中目录
            fz.extract(files,outputdir)
    else:
        print 'no'

for i in items: 
    print i
    request=urllib2.Request(i)
    response=urllib2.urlopen(request)
    html=response.read()
    name=i.split('=')[-1]+'.zip'
    f=open(name,'w')
    f.write(html)
    f.close()
    unzip(name,'./')
    os.remove(name)

print os.listdir(os.getcwd())

for root ,dire,fis in os.walk('./'):#递归遍历文件夹
    for i in fis:

        if not (i.split('.')[-1]=='ttf' or i.split('.')[-1]=='otf'):
            os.remove(root+i)
            print i

for i in os.listdir('./'):
    if os.path.isdir(i):
        os.rmdir(i)
os.chdir('../')

```
总体操作跟之前的差不多，跑了几十分钟下了4000多的字体。