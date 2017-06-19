---
title: 苏大Mooc系统的刷课脚本的制作（3/3）
id: 1
categories:
  - Web
date: 2015-12-26 23:36:09
tags:
  - Web
  - Python
---

最后决定用最简单的python脚本进行实现。具体过程部分析了，不过值得一提的是，在登陆获取用户的cookie的时候，他也发送了一个挺长的“随机”串，研究了半天才发现他是使用了md5摘要算法，将密码和密码的摘要一同发给了服务器。。。。。。

以下是源码：
```python
#cheat.py

import urllib,urllib2,cookielib,md5,re,json,sys

def login(name,pwd):
	url_login="http://ids1.suda.edu.cn/amserver/UI/Login?goto=http://myauth.suda.edu.cn/default.aspx?app=kczx"
	m=md5.new()
	m.update(pwd)
	pwd_md5=m.hexdigest()
	cj=cookielib.CookieJar()
	post_data=urllib.urlencode({
		'IDButton':'Submit',
		'encoded':'false',
		'goto':'',
		'gx_charset':'UTF-8',
		'IDToken0':'',
		'IDToken1':name,
		'IDToken9':pwd,
		'IDToken2':pwd_md5,
	})
	opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
	opener.addheaders=[('User-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36))')]
	urllib2.install_opener(opener)
	req=urllib2.Request(url_login,post_data)
	urllib2.urlopen(req)
	return opener

def watch(PlainId,fPartName,fPartId,fSecond,fVideoSecond,fVideoFileId,opener):
	if fVideoFileId==u'0':
		return
	url='http://kczx.suda.edu.cn/G2S/Learning/StudentLearning.ashx?action=GetG2SSetStageLearnPartStudent&fPlanID='+PlainId+'&fPartID='+fPartId+'&fSecond='+fVideoSecond
	urllib2.install_opener(opener)
	urllib2.urlopen(url)
	print fPartName+'has been watched'
	return

if __name__=='__main__':
	#url_lecture='http://kczx.suda.edu.cn/G2S/Learning/Learning.htm?Part=&Plan=34&type=2'
	if len(sys.argv)!=4:
		print 'Please enter <number> <pwd> <url>'
		sys.exit();
	name=sys.argv[1]
	pwd=sys.argv[2]
	url_lecture=sys.argv[3]
	opener=login(name,pwd)
	urllib2.install_opener(opener)
	PlainId=re.findall(r'(?<=Plan=).*?(?=&)',url_lecture)[0]
	url_ajax='http://kczx.suda.edu.cn/G2S/Learning/StudentLearning.ashx?action=GetG2SStageLearnGetChapter&fPlanID='+PlainId
	ajax_text=urllib2.urlopen(url_ajax).read()
	ajax_text=ajax_text.replace('RowCount','"RowCount"')
	ajax_text=ajax_text.replace('Rows','"Rows"')
	s=json.loads(ajax_text)
	fPartName=[]
	fPartId=[]
	fSecond=[]
	fVideoFileId=[]
	fVideoSecond=[]
	for k in s['Rows']:
		fPartName.append(k['fPartName'])
		fPartId.append(k['fPartID'])
		fSecond.append(k['fSecond'])
		fVideoSecond.append(k['fvideoSecond'])
		fVideoFileId.append(k['fVideoFileID'])
	for k in range(len(fPartName)):
		watch(PlainId,fPartName[k],fPartId[k],fSecond[k],fVideoSecond[k],fVideoFileId[k],opener)
```
当然，为了省事，没有任何的容错处理和用户界面。。。使用时，输入：
```
myths@myths-X450LD:~$ python cheat.py <学号> <密码> <课程网址>
```
而且在Linux下，课程网址中的“&”符号需要转义为"\&"才能用。。。。。。

基本就是这些了，按理说如果管理员有心，是可以查出我们提交的数据其实是有问题的，不过目测应该是没人看的吧～～～
