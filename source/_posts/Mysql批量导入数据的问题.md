---
title: Mysql批量导入数据的问题
id: 1
categories:
  - Database
date: 2016-06-11 23:02:58
tags:
  - Database
---

## 问题

之前的文章讲过了，如果想向Mysql快速的批量导入数据的话，最好的方法就是使用`load data local in file "path" into table mytable` 。但是在最近的一次使用中，我发现，对于使用含有`auto_increment`字段的表，多次导入数据的时候，该字段的值会出现跳跃丢失。。。不知道是怎么一回事。下面是实验过程。

## 实验环境

mysql 5.7.12

## 实验步骤

一、创建一个简单的表：
```
mysql>  create table tmp(id int not null primary key auto_increment,value int not null);
Query OK, 0 rows affected (0.23 sec)

mysql> desc tmp ;
+-------+---------+------+-----+---------+----------------+
| Field | Type    | Null | Key | Default | Extra          |
+-------+---------+------+-----+---------+----------------+
| id    | int(11) | NO   | PRI | NULL    | auto_increment |
| value | int(11) | NO   |     | NULL    |                |
+-------+---------+------+-----+---------+----------------+
2 rows in set (0.00 sec)
```
注意到id字段设置为auto_increment。


二、创建一个数据文件in.txt：
```
null    1
null    2
null    3
```

三、导入数据

第一次：
```
mysql> load data local infile "in.txt" into table tmp;
Query OK, 4 rows affected, 5 warnings (0.06 sec)
Records: 4  Deleted: 0  Skipped: 0  Warnings: 5

mysql> select * from tmp;
+----+-------+
| id | value |
+----+-------+
|  1 |     1 |
|  2 |     2 |
|  3 |     3 |
|  4 |     0 |
+----+-------+
4 rows in set (0.00 sec)
```
第二次：
```
mysql> load data local infile "in.txt" into table tmp;
Query OK, 4 rows affected, 5 warnings (0.04 sec)
Records: 4  Deleted: 0  Skipped: 0  Warnings: 5

mysql> select * from tmp;
+----+-------+
| id | value |
+----+-------+
|  1 |     1 |
|  2 |     2 |
|  3 |     3 |
|  4 |     0 |
|  8 |     1 |
|  9 |     2 |
| 10 |     3 |
| 11 |     0 |
+----+-------+
8 rows in set (0.00 sec)
```
很明显可以看到，中间丢失了三个id，不知道是为什么。

## 问题解决

最后问了百度知道。。。知道上的同学说是数据最后加了个空行；本来我还不相信，以为每条数据之后都要加个回车，但是仔细一研究果然是这样。加了空行后，这一行数据的值会为默认值，而且自增Id的值也会出现问题，就像上面描述的这样；而把最后的回车删除之后，结果就没有问题了。。。