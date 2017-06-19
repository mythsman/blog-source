---
title: 苏大Mooc系统的刷课脚本的制作（1/3）
id: 1
categories:
  - Web 
date: 2015-12-22 23:56:38
tags:
  - Web
  - Python
---

闲话不说，其实写这个目的大家都懂，懒得看那些无聊的网路课。但是由于课程的要求，这些课程必须要看，而且由于技术原因，又不能跳着看，视频的播放条不能拖动，只能硬着头皮的刷时间。很多同学都是开着视频开着静音做其他的事，想想也是悲哀。

当然，我写这个程序的初衷并不是为了偷懒，而是纯粹的学习。用技术手段做出一些别人难以实现的事情可是很有成就感的。为了实现这样一个简单的目的其实也不是那么简单的（至少对我这个前几天刚接触web的人而言）。。。

## 课程首页

![](/images/2015/12/22/1/1.png)

从右边点击课程名字就会打开视频，学习完的视频前面会有绿色的钩钩；每个视频下面有播放条，播放条只能在已经看过的部分任意拖动，不能向前拖动。

这就是课程首页的情况，接下来就是想查看源码。结果发现网页是动态生成的，而不是之前学习的静态网页。这两者最直观的感受就是源代码和审查元素得到的代码不一样，也就是用javascript之类的语言根据即时的情况生成的网页。这时候就需要细致的分析js代码了。

&nbsp;

## 封包分析

很自然的想法就是查看下封包，弄清楚在观看视频的时候到底是发送了什么东西给后台让后台标记当前视频为已看。经过一番查找（需要细心的找），在用chrome找到了这样的一个包：
```
General：

Request URL:http://kczx.suda.edu.cn/G2S/Learning/StudentLearning.ashx?action=GetG2SSetStageLearnPartStudent&fPlanID=34&fPartID=359&fSecond=550&_=1451308953409
Request Method:GET
Status Code:200 OK
Remote Address:42.244.42.191:80

Request Headers：

Accept:*/*
Accept-Encoding:gzip, deflate, sdch
Accept-Language:zh-CN,zh;q=0.8
Connection:keep-alive
Cookie:ASP.NET_SessionId=zh4ifl55q521xx45bmbjwa45; amlbcookie=01; iPlanetDirectoryPro=AQIC5wM2LY4SfcxX1vREajjp5zIi4s9GtkPT1Ivxjw%2BJfo4%3D%40AAJTSQACMDE%3D%23
Host:kczx.suda.edu.cn
Referer:http://kczx.suda.edu.cn/G2S/Learning/Learning.htm?Part=&Plan=34&type=2
User-Agent:Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36
X-Requested-With:XMLHttpRequest

Query String Parameters：

action:GetG2SSetStageLearnPartStudent
fPlanID:34
fPartID:359
fSecond:550
_:1451308953409
```
看到了顿时就豁然开朗了，原来每隔一段时间，网页会通过一个get请求，将当前看的视频的名称、看到的时间发送给后台，让后台加以记录，确认已经看到的地方。fPlanID很明显是课程的编号，fPartID应该是视频的编号，而fSecond应该是当前看到的时间了（最后哪个_:的值，可能是token值，然而翻遍代码，并没有找到对应的值，我想应该是一个随机数，暂时不去管他，应该也无妨）。所以，“作弊”的方法也就很简单了，就是根据这个信息，将描述视频的信息和当前看到（伪造）的时间发送给后台就可以了。

经过一番尝试，这样做果断是合理的。那么，通过这个手段，我们就可以手动的通过输入地址发送get请求来“刷课”了。虽然这显然不够帅，然而对那些没有编程基础的人来说，这种方法倒也是简单快捷的（总比挂着视频方便）。

&nbsp;
