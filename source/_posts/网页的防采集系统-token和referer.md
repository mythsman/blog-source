---
title: 网页的防采集系统-token和referer
id: 1
categories:
  - Web
date: 2015-12-07 20:34:55
tags:
  - Web
  - Crawler
  - Python
---

今天在写模拟登陆的时候遇到了一点问题，一个是在post数据中有许多随机串，让人摸不着头脑；另一个问题是明明已经post了正确的数据，然而还是莫名其妙的无法登陆。倒腾了半天终于发现了这原来是很多网站为了防止一些攻击所进行的安全保护措施，分别是token 和 referer防护。

## Token

Token实际上就是一个随机串，在含有input表单的页面内以一个‘hidden’表单实现。通常是以以下的形式：
```
<input type='hidden' name="sand" value="1449492667"/>
<input type='hidden' name="token" value="9e9f4a4fbab97b3e17c299768f55ee99"/>
```
这个信息会在post常规数据的时候被连带着post给服务器，服务器会判断token值是否合法来确定是否对我们提交的信息进行处理。因此我们如果要模拟登陆，就要连带这把这些信息post过去。

那么网站这么设计有什么用呢?（很明显不是用来防止模拟登陆的）

1)防止表单重复提交

服务器端第一次验证相同过后，会将session中的Token值更新下，若用户重复提交，第二次的验证判断将失败，因为用户提交的表单中的Token没变，但服务器端session中Token已经改变了。但是当多页面多请求时，必须采用多Token同时生成的方法，这样占用更多资源，执行效率会降低。因此，也可用cookie存储验证信息的方法来代替session Token。比如，应对“重复提交”时，当第一次提交后便把已经提交的信息写到cookie中，当第二次提交时，由于cookie已经有提交记录，因此第二次提交会失败。

2)anti csrf攻击（跨站点请求伪造）。

如果应用于“anti csrf攻击”，则服务器端会对Token值进行验证，判断是否和session中的Token值相等，若相等，则可以证明请求有效，不是伪造的。

## Referer

首先referer其实应该拼成referrer，这是一个古老的问题了，不解释。

然后referer的作用其实非常的纯粹，就是告诉服务器这个链接是从哪个站点链接而来的。很多站点会偷偷进行http-referer检查，来保证链接的来源合法，一定程度上起到了安全上的作用(其实主要是为了防止CSRF攻击)。

## 示例

模拟登陆一个破解md5的网页，用正则获取token值，并且加入referer头进行登陆。
```python
import urllib,urllib2,cookielib,json,re
from bs4 import BeautifulSoup
def md5Decode(cyphertext):
	path1='http://www.md5.com.cn/'
	path2='http://www.md5.com.cn/md5reverse'
	cj=cookielib.CookieJar()
	opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
	opener.addheaders=[('User-agent','Opera/9.23'),('Connection','keep-alive')]
	urllib2.install_opener(opener)
	html1=urllib2.urlopen(path1).read()
	sand=re.findall(r'(?<=name=\"sand\" value=\").*?(?=\"/>)',html1)[0]
	token=re.findall(r'(?<=name=\"token\" value=\").*?(?=\"/>)',html1)[0]
	post_data=urllib.urlencode({'md':cyphertext,'sand':sand,'token':token,'submit':'MD5 Crack'})	
	req=urllib2.Request(path2,post_data)
	opener.addheaders=[('Referer',path1),('Origin',path1)]
	urllib2.install_opener(opener)
	response=urllib2.urlopen(req)
	html=response.read()
	soup=BeautifulSoup(html,'lxml')
	print re.findall(r'(?<=Result:</label><span class=\"res green\">).*?(?=</span>)',html)[0]
md5Decode('cca9cc444e64c8116a30a00559c042b4')
```