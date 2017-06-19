---
title: Mysql常用操作
id: 1
categories:
  - Database
date: 2016-05-04 23:23:30
tags:
  - Database
---

第一次真正意义上使用数据库，当然是从简单方便的mysql开始了，咱们不好高骛远扯些有的没的。

对于mysql来说虽然可以用phpmyadmin这样的东西，但是这还是会略显臃肿，既然是程序员，还是尽量使用简单清楚的命令行来写吧～～

第一次系统的搞这个难免摸不着头脑，下面就一步一步开始学习吧。

## 登陆和退出

登陆时用如下命令即可：
```
mysql -h 主机地址 -u 用户名 －p
```
其中很明显-h是指host，-u是指user，-p是指passwd。

这时候命令行会等待我们输入密码，这时候输入密码即可（没有回显）。

需要注意的是，如果想在一条语句里面输密码的话，-p后面是要马上接密码，中间不能有空格（显然这时候输的密码是会被回显出来的）。

登陆后，shell的提示符就会变成mysql的提示符了：
```
mysql>
```
在这里输入适当的语句并以";"结尾即可。

退出时输入exit或者Ctrl+d都可以。

## 选择数据库和表

**显示数据库**
```
mysql> show databases;
```
**创建数据库**
```
mysql> create database mydatabase;
```
**使用该数据库**
```
mysql> use mydatabase;
```
**显示数据库中所有的表**
```
mysql> show tables;
```
**删除表**
```
mysql> drop table  mydatabase;
```
**显示表结构**
```
mysql> describe mytable;
```
or
```
mysql> desc mytable;
```
显示格式如下：
```
mysql> desc mytable;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int(11)     | NO   | PRI | NULL    | auto_increment |
| value | varchar(50) | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
2 rows in set (0.00 sec)
```

## 增删查改

增删查改的内容就是普通的sql语句了，这里不做解释，需要的时候再找也不迟。


## 批处理

**导入数据**

对于需要导入大量数据的时候，我们可以将需要的数据写成一个数据文件，数据文件中每一行就是一条记录；每条记录中的字段是按照表中的字段顺序排列，用TAB键进行分割。最后输入以下命令：
```
mysql> load data local infile "b.txt" into table mytable;
```
上面是将b.txt中的数据导入到mytable表中，这个文件名需要加引号。

需要注意的是数据文件中的字符串是不用加引号的，而且也可以直接写null。

**执行SQL命令**

对于现成的sql命令，我们可以在mysql提示符中直接这样加以执行。
```
mysql> source a.sql
```
这个文件名不用加引号。

或者也可以在bash中执行：
```
$mysql -h localhost -u root -p <a.sql> ans.txt
```
其中ans.txt是查询的结果，尖括号不可以省略，输出文件也不可以省略。通过这个方法我们就能把执行结果写入文件了。

## 存储过程

存储过程感觉就是一种函数，可以执行一些简单的逻辑，封装了零零散散的SQL语句。

**修改标志**

在创建过程之前我们需要修改下语句的结束标志，因为过程本身是一条SQL语句，但是过程又是由多条SQL语句组成的，这样我们就无法判断过程的结束标志了。因此我们需要修改下外层的结束标志，默认的结束标志是";"，我们可以如下修改成其他的标志：
```
mysql> delimiter $
```
这样SQL语句的结束标志就标称了"$"，这样我们就可以在过程内部仍然用";"作为单个语句的结束标志了。不过最后我们还是要记得把他修改回常用的标志“;”；


**创建过程**
```
mysql>create procedure mypro()
    ->begin
    ->select * from mytable;
    ->end$
```
这样我们就创建了一个简单的过程mypro。这个过程是数据库级的，因此他是归属于我们当前选择的数据库的。

**执行过程**
```
mysql> call mypro()
```
call下即可。


**操作语言**

过程中我们经常会用到选择或循环之类的控制语句，这些东西的语法类似pascal，具体用到的时候查下即可，这里不做解释。

**查看和删除过程**

当然，我们需要对过程进行管理：

查看当前数据库中的过程：
```
mysql> select `name` from mysql.proc where db = 'your_db_name' and `type` = 'PROCEDURE'；
```
把your_db_name换成自己的数据库名即可。

删除某个过程：
```
mysql> drop procedure mypro;
```
## 参考资料

[MySQL语法大全_自己整理的学习笔记](http://blog.csdn.net/sunxiaosunxiao/article/details/6437192)
[MySQL用文本方式将数据装入一个数据库表](http://blog.csdn.net/gs2351/article/details/7163123)
[MySQL存储过程详解 mysql 存储过程](http://blog.sina.com.cn/s/blog_52d20fbf0100ofd5.html)