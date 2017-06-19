---
title: MD5算法应用
id: 1
categories:
  - Cryptography
date: 2015-11-30 23:54:26
tags:
  - Cryptography
  - Python
---

MD5（Message-Digest Algorithm 5）算法是一种非常常见的信息摘要hash算法，一般可以用来进行数字签名，或者理解成为一种压缩算法。他的本质是一种分组加密算法。百度上对MD5算法简要的叙述为：MD5以512位分组来处理输入的信息，且每一分组又被划分为16个32位子分组，经过了一系列的处理后，算法的输出由四个32位分组组成，将这四个32位分组级联后将生成一个128位散列值。用十六进制表示的话，每四位变成一个十六进制数，这样也就是生成了总共为32位的十六进制数，即MD5码。

这里不介绍MD5的加密和解密算法的细节。从应用的角度讲，我们完全暂且不需要理解算法的过程。我们可以直接利用现有的工具进行加密-------还有解密！事实上，MD5算法从他1991年由MIT发明以来，一直都在经受着解密高手们的攻击，这样，终于在2004年，由我们中国山东大学的王小云教授成功研究出了高效的寻找碰撞的算法（本质上就是一种高效的暴力破解，而且目前这种破解算法已经随处可见了）。

作为应用而言，比如解决[IDF实验室的第一题](http://ctf.idf.cn/index.php?g=game&m=article&a=index&id=29)，我们只需要一个能够为我们调用的加密解密的接口来方便我们编程。找了半天我终于找到了一个比较不错的免费的API:[http://tool.zzblo.com/](http://tool.zzblo.com/)，只需要简单的http请求就可以调用。

## 加密请求
```python
import urllib,urllib2,cookielib
path='http://tool.zzblo.com/Api/Md5/encrypt'
plaintext='12345678'
cj=cookielib.CookieJar()
post_data=urllib.urlencode({'text':plaintext})
opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders=[('User-agent','Opera/9.23')]
urllib2.install_opener(opener)
req=urllib2.Request(path,post_data)
response=urllib2.urlopen(req)
print response.read()
```
respose:
```
{"status":200,"text":"12345678","secret32":"25d55ad283aa400af464c76d713c07ad","secret16":"83aa400af464c76d"}
```
这里就看到了明文密文的对应关系。

## 解密请求
```python
import urllib,urllib2,cookielib
path='http://tool.zzblo.com/Api/Md5/decrypt'
cyphertext='25f9e794323b453885f5181f1b624d0b'
cj=cookielib.CookieJar()
post_data=urllib.urlencode({'secret':cypthertext})
opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders=[('User-agent','Opera/9.23')]
urllib2.install_opener(opener)
req=urllib2.Request(path,post_data)
response=urllib2.urlopen(req)
print response.read()
```
response：
```
{"status":200,"text":"123456789","secret32":"25f9e794323b453885f5181f1b624d0b","secret16":"323b453885f5181f"}
```
与上述结果一致。

当然这个API只能解决简单的MD5，对于一些复杂的还是要通过别的办法解决。