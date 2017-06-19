---
title: Mysql插入效率比较
id: 1
categories:
  - Database
date: 2016-05-05 23:41:05
tags:
  - Database
---

现在我需要在Mysql里插入大量的数据大约1000w，目测会比较耗时。所以现在就像测试一下到底用什么插入数据的方法比较快捷高效。

下面就针对每一种方法分别测试不同数据量下的插入效率。测试数据库的基本与操作如下：
```
mysql> create database test;
Query OK, 1 row affected (0.02 sec)
mysql> use test;
Database changed
mysql> create table mytable(id int primary key auto_increment ,value varchar(50));
Query OK, 0 rows affected (0.35 sec)
mysql> desc mytable;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id    | int(11)     | NO   | PRI | NULL    | auto_increment |
| value | varchar(50) | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
2 rows in set (0.02 sec)
```
方便测试，这里建了一个表，两个字段，一个是自增的id，另一个是字符串表示内容。

测试时每次实验结束都要`mysql> truncate mytable`，来清空已存在的表。


## 方法一：逐条插入

测试代码：（中间有1000条insert语句，用vim复制粘贴比较方便，写完后保存到a.sql，然后在mysql提示符中输入`source a.sql`）
```
set @start=(select current_timestamp(6));
insert into mytable values(null,"value");
......
insert into mytable values(null,"value");
set @end=(select current_timestamp(6));
select @start;
select @end;
```
输出结果：
```
Query OK, 1 row affected (0.03 sec)
......
Query OK, 1 row affected (0.03 sec)
Query OK, 0 rows affected (0.00 sec)

+----------------------------+
| @start                     |
+----------------------------+
| 2016-05-05 23:06:51.267029 |
+----------------------------+
1 row in set (0.00 sec)

+----------------------------+
| @end                       |
+----------------------------+
| 2016-05-05 23:07:22.831889 |
+----------------------------+
1 row in set (0.00 sec)
```
总共耗时31.56486s，事实上几乎每条语句花的时间是差不多的，基本就是30ms。

这样子1000w的数据就得花87h。

至于更大的数据量也就不试了，这种方法肯定不可取。


## 方法二：基于事务的批量插入

实际上就是把这么多的查询放在一个事务中。事实上方法一中没一条语句都开了一个事务，因此才会特别慢。

测试代码：（与方法一基本类似，主要添加两行，由于比较快，这里测试了多种数据量）
```
set @start=(select current_timestamp(6));
start transaction;
insert into mytable values(null,"value");
......
insert into mytable values(null,"value");
commit;
set @end=(select current_timestamp(6));
select @start;
select @end;
```
测试结果：
```
数据量      时间(s)
1k         0.1458
1w         1.0793
10w        5.546006
100w       38.930997
```
看出来基本是对数时间，效率还是比较高的。

## 方法三：单条语句一次插入多组数据

就是一条insert一次插入多个value。

测试代码：
```
insert into mytable values  (null,"value"),
                            (null,"value"),
                             ......
                            (null,"value");
```
测试结果：
```
数据量      时间(s)
1k         0.15
1w         0.80
10w        2.14
100w       *
```
看上去也是对数时间，而且比方法二要稍微快一点。不过问题在于单次SQL语句是有缓冲区大小限制的，虽然可以修改配置让他变大，但也不能太大。所以在插入大批量的数据时也用不了。

## 方法四：导入数据文件

将数数据写成数据文件直接导入（参照[上一节](/2016/05/04/1)）。

数据文件（a.dat）：
```
null    value
null    value
.....
null    value
null    value
```
测试代码：
```
mysql> load data local infile "a.dat" into table mytable;
```
测试结果：
```
数据量      时间(s)
1k         0.13
1w         0.75
10w        1.97
100w       6.75
1000w      58.18
```
时间最快，就是他了。。。。
