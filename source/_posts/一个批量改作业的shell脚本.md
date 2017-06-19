---
title: 一个批量改作业的shell脚本
id: 1
categories:
  - Linux
date: 2015-11-09 23:19:12
tags:
  - Linux
---

作为一名C语言助教，最恶心的事情莫过于改作业了，尤其是我们学校这种对输入输出都没有严格要求的题目，不能通过类似OJ的判题系统批量批改的，原则上是只能手动批改的。但是一直做着相同的简单的劳动真的很让人发疯，而作为一名程序员，对待这样的任务很自然就想到了编程。考虑了我现在略懂的语言，对于这种直接和文件达交道的事，我很自然的选择了使用shell脚本。虽然我对shell脚本其实是一窍不通的，然而正巧身边有一本关于这个的书，就花了一个晚上的时间倒腾了一下，有问题了就翻一下资料，差不多把这个小程序弄了个框架。

其实想想，实现的东西也很简单，但是还是花了我不少的功夫。毕竟，这是我写的第一个实用的shell脚本呢。

实现的功能很简单，就是在文件夹下处理一堆的源文件，把编译之后的输出结果与标准答案(146)比较，如果包含标准答案，就判Ａ，当然如果没有加注释，就只能判为Ｂ，如果编译通过了，就判Ｃ／Ｄ，否则判Ｅ。

源码：
```
find . -name "*.cpp">mulu
sort mulu>tmp;
cp tmp mulu
rm tmp
while read line
do
	g++ $line>log
	if [ ! -s log ];then
		touch tmp;
		( ./a.out <tmp )>ans
		(cat ans | egrep "146")>tmp
		if [ -s tmp ];then
			(cat $line|egrep "//")>t1
			(cat $line|egrep "/*")>t2
			if [ -s t1 ] || [ -s t2 ];then
				echo $line is A
			else
				echo $line is B
			fi
			rm t1 t2
		else
			echo $line is C/D
		fi
		rm ans a.out tmp
	else
		echo $line is E
	fi
	rm log
done < mulu
rm mulu
```
这里涉及到很多的用法，我们只介绍当前用到的，就不去拓展了。

1. find [地址] -name [正则表达式] 　该命令会搜索[地址]内符合[正则表达式]的文件名，并输出，这里我把输出重定向到mulu文件中。

2. sort [文件]　命令，就是把文件内容排序并显示出来(不会改变源文件)，这里重定向到tmp。

3. 重定向命令　> 表示删除写入　>>表示追加写入

4. cat [文件] | egrep [正则表达式]　表示在[文件]中查找能匹配[正则表达式]的行，并且输出。

5. [ -s file ]　表示判断file是否存在且非空。

逻辑还是很清楚的，写起来也很简单。