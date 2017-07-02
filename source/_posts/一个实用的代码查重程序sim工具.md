---
title: 一个实用的代码查重程序sim工具
id: 2
categories:
  - Linux
date: 2016-01-08 15:19:55
tags:
  - Linux
---

sim工具是在搭建hustoj的过程中发现的一个小玩意。毕竟作为一个OJ，hust的人肯定也考虑到了网络比赛中代码复制粘贴的现象。所以一个代码判重的工具肯定是必不可少的。然而这个工具在网站的前后台中并没有体现，而是作为一个附带的工具一起打包下来的。而且事实上他打包的版本有点老了，所以我去了作者的博客上找了最新的版本－－[Dick grune](https://dickgrune.com/)。

额，是的没错，他就叫 Dick~~，大概看了下博客，真是个挺厉害的人，写了不少的书，都是关于编译方面的东西，好像还搞了LaTeX的解释器啥的。。。我现在要用的是他的一个小工具，在[这里](https://dickgrune.com/Programs/similarity_tester/)下载。

下下来解包之后还要细心的配置下路径，主要是要研究下他的　README　和　Makeile 文件，配置下当前系统和二进制文件和man 文档的路径，二进制文件放在`/usr/bin／`下，man文档放在`/usr/share/man` 下就行。

安装并配置好以后就能够直接输入sim命令，并且通过man 查看帮助文档了。
需要注意的是，他的MakeFile是不能直接用的，必须要做一下两步：
1. 选择操作系统。里面集成了两类操作系统的配置，因此我们首先要删除不属于自己操作系统的内容。。。
2. 填写Locations里的相关配置，修改自己希望存放的文件夹。

## 用法

1. 选择语言： sim 支持多种语言：C, Java, Pascal, Modula-2, Lisp , Miranda, or text files，对应的命令分别是： sim\_c ，sim\_java，sim\_pasc ，sim\_m2，sim\_lisp ，sim\_mira，sim\_text 。

2. 选择参数： 常用的参数有三个：

|参数|含义|
|-|-|
|-p |表示以“F consists for x % of G material”的形式输出相似度|
|-t N|表示只显示相似度大于N%的条目（除text 默认为20%外，其余默认为1%);|
|-o file|表示将结果输出到file中|

	最后可以输入文件名，支持通配符。

## 示意

如下两个文件：
```cpp
//a.cpp
#include<stdio.h>
typedef struct //定义一个新的数据类型
{
	int yue;//月份
	int tian;//天
}Date;
void f(Date x, Date y);//函数声明
int main()
{
	Date date1, date2;
	//类型赋值
	printf("输入一个日期（mm/dd）：\n");
	scanf_s("%d/%d", &date1.yue, &date1.tian);
	printf("再输入一个日期（在上一个日期之后）（mm/dd）：\n");
	scanf_s("%d/%d", &date2.yue, &date2.tian);
	//调用函数
	f(date1, date2);
	return 0;
}
void f(Date x, Date y)
{
	int m, n;
	int t;
	//计算两个日期的天数
	switch (x.yue)
	{
	case 1:m = x.tian; break;
	case 2:m = x.tian + 31; break;
	case 3:m = x.tian + 59; break;
	case 4:m = x.tian + 90; break;
	case 5:m = x.tian + 120; break;
	case 6:m = x.tian + 151; break;
	case 7:m = x.tian + 181; break;
	case 8:m = x.tian + 212; break;
	case 9:m = x.tian + 243; break;
	case 10:m = x.tian + 273; break;
	case 11:m = x.tian + 304; break;
	case 12:m = x.tian + 334; break;
	}
	switch (y.yue)
	{
	case 1:n = y.tian; break;
	case 2:n = y.tian + 31; break;
	case 3:n = y.tian + 59; break;
	case 4:n = y.tian + 90; break;
	case 5:n = y.tian + 120; break;
	case 6:n = y.tian + 151; break;
	case 7:n = y.tian + 181; break;
	case 8:n = y.tian + 212; break;
	case 9:n = y.tian + 243; break;
	case 10:n = y.tian + 273; break;
	case 11:n = y.tian + 304; break;
	case 12:n = y.tian + 334; break;
	}
	//求相差天数
	t = n - m;
	printf("相差的天数：%d\n", t);
}

```
```cpp
//b.cpp
#include<stdio.h>
typedef struct //使用结构体
{
	int month;
	int day;
}date;
int f(date d1, date d2);//函数声明
int main(void)
{
	date d1, d2;
	printf("输入第一个日期:\n");
	scanf_s("%d,%d", &d1.month, &d1.day);//输入第一个日期
	printf("输入第一个日期:\n");
	scanf_s("%d,%d", &d2.month, &d2.day);//输入第二个日期
	printf("相差%d天", f(d1, d2));//调用函数并输出相差天数
	return 0;
}
int f(date d1, date d2)//函数定义
{
	int x, m, n;
	switch (d1.month)//计算第一个日期是一年的第几天
	{
	case 1:
		m = d1.day;break;
	case 2:
		m = d1.day + 31;break;
	case 3:
		m = d1.day + 59;break;
	case 4:
		m = d1.day + 90;break;
	case 5:
		m = d1.day + 120;break;
	case 6:
		m = d1.day + 151;break;
	case 7:
		m = d1.day + 181;break;
	case 8:
		m = d1.day + 212;break;
	case 9:
		m = d1.day + 243;break;
	case 10:
		m = d1.day + 273;break;
	case 11:
		m = d1.day + 304;break;
	case 12:
		m = d1.day + 334;break;
	}
	switch (d2.month)//计算第二个日期是一年的第几天
	{
	case 1:
		n = d2.day;break;
	case 2:
		n = d2.day + 31;break;
	case 3:
		n = d2.day + 59;break;
	case 4:
		n = d2.day + 90;break;
	case 5:
		n = d2.day + 120;break;
	case 6:
		n = d2.day + 151;break;
	case 7:
		n = d2.day + 181;break;
	case 8:
		n = d2.day + 212;break;
	case 9:
		n = d2.day + 243;break;
	case 10:
		n = d2.day + 273;break;
	case 11:
		n = d2.day + 304;break;
	case 12:
		n = d2.day + 334;break;
	}
	x = m - n;//计算日期差
	if (x >= 0)//返回非负值
		return x;
	else
		return -x;
}
```

这两个是用来计算日期只差的cpp文件（学生提交的作业，对不对另说），看上去还是有点差别的，至少很多变量名都经过了替换，修改了注释，而且也改了缩进的风格，但是经过sim程序判别之后，可以发现他们的相似度还是极高的：
```
myths@Business:~/桌面$ sim_c -p a.cpp b.cpp
File a.cpp: 374 tokens, 82 lines
File b.cpp: 388 tokens, 81 lines
Total: 762 tokens

a.cpp consists for 89 % of b.cpp material
b.cpp consists for 86 % of a.cpp material
```
相似度仍然达到了90%左右，所以我们可以确定的认为这两份作业是抄袭的。可以证明这个程序的识别率还是非常高的～
