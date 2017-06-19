---
title: PostGIS初探
id: 2
categories:
  - Database
date: 2016-08-04 23:32:12
tags:
  - Database
---

PostGIS是PostgreSQL的空间扩展，他使得PostgreSQL支持空间数据类型，比如点、线段、折线段、多边形、椭圆等等，并且能够使用高效的空间索引进行存储和查找。

## 安装

ubuntu下在安装好PostgreSQL的基础下用`apt install postgis`即可。

确认安装版本可以用在postgreSQL的shell里查询:
```
myths=# select * from pg_available_extensions where name like 'postgis%';
```
我这里大概显示的是：
```
name          | default_version | installed_version |                               comment                               
------------------------+-----------------+-------------------+---------------------------------------------------------------------
 postgis_sfcgal         | 2.2.1           |                   | PostGIS SFCGAL functions
 postgis                | 2.2.1           |                   | PostGIS geometry, geography, and raster spatial types and functions
 postgis_topology       | 2.2.1           |                   | PostGIS topology spatial types and functions
 postgis_tiger_geocoder | 2.2.1           |                   | PostGIS tiger geocoder and reverse geocoder
```
很明显可以看见版本和说明。


## 简要使用

用好这个扩展好像也是个挺麻烦的事的，因为这个牵涉到使用很多的函数，因此查看帮助文档就显得很必要了。

下面就以对点进行最近邻的查找为例。

**首先要导入该扩展:**
```
>myths=# create extension postgis;
```
导入后会在数据库里多出下面这几个表：
```
myths=# \d
             List of relations
 Schema |       Name        | Type  | Owner 
--------+-------------------+-------+-------
 public | geography_columns | view  | myths
 public | geometry_columns  | view  | myths
 public | raster_columns    | view  | myths
 public | raster_overviews  | view  | myths
 public | spatial_ref_sys   | table | myths
(５ rows)
```
这些东西都是postgis必备的东西，尤其是spatial_ref_sys表，保存了不同的坐标系信息。


**然后建表：**
```
myths=# create table testTable(id int primary key ,geo geometry(point,0));
```
基本的sql语句，不同的是geo字段的类型是point，而且后面跟了个数字。这个数字是srid，表示我们使用的坐标集。这个数字对应的是之前的spatial_ref_sys里的字段。通常的经纬度坐标集对应的srid是4326，而这里的0表示我用的是普通的几何坐标。关于srid的问题可以直接百度。

**插入语句：**
```
myths=#　insert into testTable values(1,ST_GeomFromText('POINT(32 66)',0));
```
这就用到了st_geomfromtext()函数，这个函数把文本形式的类型转换为实际类型，并且指定srid，插入到表中。

对应的类型还有：
```
• POINT(0 0)
• LINESTRING(0 0,1 1,1 2)
• POLYGON((0 0,4 0,4 4,0 4,0 0),(1 1, 2 1, 2 2, 1 2,1 1))
• MULTIPOINT(0 0,1 2)
• MULTILINESTRING((0 0,1 1,1 2),(2 3,3 2,5 4))
• MULTIPOLYGON(((0 0,4 0,4 4,0 4,0 0),(1 1,2 1,2 2,1 2,1 1)), ((-1 -1,-1 -2,-2 -2,-2 -1,-1 -1)))
• GEOMETRYCOLLECTION(POINT(2 3),LINESTRING(2 3,3 4))
。。。。。。
```

**批量生成数据**
```java
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Random;

public class Test {
	public static void main(String[] args) throws IOException {
		BufferedWriter writer = Files.newBufferedWriter(Paths.get("/home/myths/Desktop/data.txt"));
		Random rand = new Random();
		int left = -500000, right = 500000, up = 500000, down = -500000;
		int number = 1000000;
		writer.write("begin;\n");
		for (int i = 0; i < number; i++) {
			int randx = rand.nextInt(right - left) + left;
			int randy = rand.nextInt(up - down) + down;
			String query = String.format("insert into testTable values(%d,ST_GeomFromText('POINT(%d %d)',0));\n", i,
					randx, randy);
			writer.write(query);
		}
		writer.write("commit;\n");
		writer.flush();
		writer.close();
		System.out.println("done");
	}
}
```
生成后用`myths=# \i ~/Desktop/data.txt`导入即可。

**最近邻查找**
`myths=# select id,st_astext(geo) from testtable order by geo<->st_geomfromtext('point(10 10)',0) limit 10;`
这个语句就是查找距离点(10,10)最近的前10个点。这里<->表示求距离，st_astext()函数把wkb形式的数据转换成wkt的可读形式：
```
id   |     st_astext     
--------+-------------------
 863823 | POINT(-388 537)
 789164 | POINT(-136 -947)
 841388 | POINT(670 808)
 368903 | POINT(1069 664)
 169180 | POINT(1209 -458)
 359475 | POINT(-83 1348)
 167871 | POINT(792 -1300)
 337646 | POINT(-1047 1152)
 585595 | POINT(-955 1439)
  46949 | POINT(-920 -1480)
(10 rows)

Time: 2207.639 ms
```
否则就是这样：
```
myths=# select id,geo from testtable order by geo<->st_geomfromtext('point(10 10)',0) limit 10;
   id   |                    geo                     
--------+--------------------------------------------
 863823 | 010100000000000000004078C00000000000C88040
 789164 | 010100000000000000000061C00000000000988DC0
 841388 | 01010000000000000000F084400000000000408940
 368903 | 01010000000000000000B490400000000000C08440
 169180 | 01010000000000000000E492400000000000A07CC0
 359475 | 01010000000000000000C054C00000000000109540
 167871 | 01010000000000000000C0884000000000005094C0
 337646 | 010100000000000000005C90C00000000000009240
 585595 | 01010000000000000000D88DC000000000007C9640
  46949 | 01010000000000000000C08CC000000000002097C0
(10 rows)

Time: 690.557 ms
```

**添加索引**
`myths=# create index testIndex on testtable using gist(geo);`
对于空间类型添加的索引是gist类型的，具体含义参见文档。

添加了索引后可以发现查询效率有明显提升：
```
myths=# select id,st_astext(geo) from testtable order by geo<->st_geomfromtext('point(10 10)',0) limit 10;
   id   |     st_astext     
--------+-------------------
 863823 | POINT(-388 537)
 789164 | POINT(-136 -947)
 841388 | POINT(670 808)
 368903 | POINT(1069 664)
 169180 | POINT(1209 -458)
 359475 | POINT(-83 1348)
 167871 | POINT(792 -1300)
 337646 | POINT(-1047 1152)
 585595 | POINT(-955 1439)
  46949 | POINT(-920 -1480)
(10 rows)

Time: 49.153 ms

myths=# select id,geo from testtable order by geo<->st_geomfromtext('point(10 10)',0) limit 10;
   id   |                    geo                     
--------+--------------------------------------------
 863823 | 010100000000000000004078C00000000000C88040
 789164 | 010100000000000000000061C00000000000988DC0
 841388 | 01010000000000000000F084400000000000408940
 368903 | 01010000000000000000B490400000000000C08440
 169180 | 01010000000000000000E492400000000000A07CC0
 359475 | 01010000000000000000C054C00000000000109540
 167871 | 01010000000000000000C0884000000000005094C0
 337646 | 010100000000000000005C90C00000000000009240
 585595 | 01010000000000000000D88DC000000000007C9640
  46949 | 01010000000000000000C08CC000000000002097C0
(10 rows)

Time: 1.092 ms
```

## 参考

[PostGIS.net](http://www.postgis.net/)
[PostGIS 2.0 Manual](http://postgis.net/docs/manual-2.0/)
[PostGIS 在 O2O应用中的优势](http://mysql.taobao.org/monthly/2015/07/04/)
