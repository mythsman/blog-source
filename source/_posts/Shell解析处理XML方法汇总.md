---
title: Shell解析处理XML方法汇总
id: 1
date: 2017-10-15 13:24:41
category: Shell
tags:
  - Shell
  - Linux
  - Tools
  - Xml
---

## 前言
前几天干活的时候遇到一个需要解析处理xml文件的一个需求，当时考虑到逻辑比较复杂，因此用java慢慢搞了搞。不过这个需求经常会变，每次变化之后都要重新找到jar包的代码，改了之后还要替换原来的jar包，一来不方便修改，二来不方便统一保存代码，三来也不方便查看jar包的功能。
其实对于这种比较灵活的功能，最方便高效的做法是采用一些脚本语言，比如python，ruby等等，开发效率高，而且也能处理一些复杂逻辑。但是由于种种原因，工作中有的机器没有安装这些语言的解释器。因此不得已，研究了一波用shell脚本解析xml的方法。
说到底，shell还是不太适合处理复杂的逻辑，但是对于一些简单的查找替换等需求，用shell来搞还是挺方便的。
我这里主要采用了下面三个工具：
- xmllint
- xpath
- xml2

下面就分别总结下这三个工具的用法，方便以后查阅。

## xmllint
### 简述
xmllint其实是由一个叫libxml2的c语言库函数实现的一个小工具，因此效率比较高，对不同系统的支持度也很好，功能也比较全。他一般属于`libxml2-utils`这个软件包，因此类似与`sudo apt install libxml2-utils`的命令就可以安装。

### 功能
xmllint至少支持下面几个常用功能：
1. 支持xpath查询语句
2. 支持类shell的交互式查询
3. 支持xml格式验证
4. 支持dtd,xsd对xml的校验
5. 支持编码转换
6. 支持xml格式化
7. 支持去空格压缩
8. 支持时间效率统计

其实我们比较常用的功能主要也就是三个--xpath查询、去空格和格式化、校验。
比如当前有sample.xml:
```xml
<books>
        <book id="1">
                <name>book1</name>
                <price>100</price>
        </book>
        <book id="2">
                <name>book2</name>
                <price>200</price>
        </book>
        <book id="3"><name>book3</name><price>300</price>
        </book>
</books>
```

**执行xpath查询：**
```bash
myths@business:~$ xmllint --xpath "//book[@id=2]/name/text()" sample.xml
book2
```

**去空格：**
```xml
myths@business:~$ xmllint --noblanks sample.xml
<?xml version="1.0"?>
<books><book id="1"><name>book1</name><price>100</price><license/></book><book id="2"><name>book2</name><price>200</price></book><book id="3"><name>book3</name><price>300</price></book></books>
```

**格式化：**
```xml
myths@business:~$ xmllint --format sample.xml
<?xml version="1.0"?>
<books>
  <book id="1">
    <name>book1</name>
    <price>100</price>
    <license/>
  </book>
  <book id="2">
    <name>book2</name>
    <price>200</price>
  </book>
  <book id="3">
    <name>book3</name>
    <price>300</price>
  </book>
</books>
```
**xsd校验：**
```xml
myths@business:~$ cat sample.xsd
<?xml version="1.0" encoding="utf-8"?>
<xs:schema id="books" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
  <xs:element name="books" msdata:IsDataSet="true" msdata:Locale="en-US">
    <xs:complexType>
      <xs:choice minOccurs="0" maxOccurs="unbounded">
        <xs:element name="book">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="name" type="xs:string" minOccurs="0" msdata:Ordinal="0" />
              <xs:element name="price" type="xs:string" minOccurs="0" msdata:Ordinal="1" />
            </xs:sequence>
            <xs:attribute name="id" type="xs:string" />
          </xs:complexType>
        </xs:element>
      </xs:choice>
    </xs:complexType>
  </xs:element>
</xs:schema>
	
myths@business:~$ xmllint --noout --schema sample.xsd sample.xml
sample.xml validates
```
注意校验结果信息是输出到stderr中的，工具默认会把原文件回显到stdout里，可以加--noout参数关闭stdout回显。

**流传递：**
xmllint默认是传递文件名，如果我们希望用通过管道传递文件流的方式传递数据，我们可以这样弄：
```xml
myths@business:~$ cat sample.xml |xmllint --format -
<?xml version="1.0"?>
<?xml version="1.0"?>
<books>
  <book id="1">
    <name>book1</name>
    <price>100</price>
    <license/>
  </book>
  <book id="2">
    <name>book2</name>
    <price>200</price>
  </book>
  <book id="3">
    <name>book3</name>
    <price>300</price>
  </book>
</books>
```

## xpath
### 简述
xpath工具其实是封装了的perl脚本，本身也只有两百来行，功能比较专一，就是提供xpath的查询功能。他一般属于`libxml-xpath-perl`这个软件包，因此类似于`sudo apt install libxml-xpath-perl`的命令就可以安装。像suse之类的系统还会直接自带。

### 功能
不同系统中安装的版本可能不同，不过基本功能是类似的：
```bash
myths@business:~$ xpath -e '//book/name/text()'  sample.xml
Found 3 nodes in sample.xml:
-- NODE --
book1
-- NODE --
book2
-- NODE --
book3
```
默认会将查询呢结果输出到stdout中，将说明信息输出到stderr中。如果为了方便收集结果，可以将stderr重定向到/dev/null，或者加上-q参数：
```bash
myths@business:~$ xpath -e '//book/name/text()' sample.xml 2>/dev/null
book1
book2
book3

myths@business:~$ xpath -q -e '//book/name/text()' sample.xml
book1
book2
book3

```
xpath相比xmllint的xpath功能有一点点区别很重要，如果xpath匹配了多个结果，那么xpath就会分行输出，而xmllint则会揉到一行：
```bash
myths@business:~$ xmllint --xpath "//book/name/text()" sample.xml
book1book2book3
```

## xml2
### 简述
xml2这个工具感觉知道的人并不多，不过其实他在某些场景里跟其他命令配合能起到奇效。这个工具的开发人员的博客似乎已经挂掉了，不过目测应该用C以及libxml2库写的一个小工具。一般是在`xml2`软件包中，因此类似`sudo apt install xml2`的命令就可以安装。

### 功能
这个工具包含六个命令：xml2,2xml,html2,2html,csv2,2csv，功能也非常unix，就是分别将xml,html,csv格式与一种他称之为“flat format”的格式进行转换。举个例子：
```bash
myths@business:~$ cat sample.xml |xml2
/books/book/@id=1
/books/book/name=book1
/books/book/price=100
/books/book
/books/book/@id=2
/books/book/name=book2
/books/book/price=200
/books/book
/books/book/@id=3
/books/book/name=book3
/books/book/price=300

myths@business:~$ cat sample.xml |xml2|2xml
<books><book id="1"><name>book1</name><price>100</price></book><book id="2"><name>book2</name><price>200</price></book><book id="3"><name>book3</name><price>300</price></book></books>
```
这种自定义的格式非常简单而巧妙，有的表示新建节点(`/books/book`)，有的表示给节点赋值(`/books/book/name=book1`)，有的表示给节点的属性赋值(`/books/book/@id=1`)。写法跟xpath很像但又不完全一样。而且相互对应的两个命令放在一起能做到幂等。

那么这种转化命令有什么用呢？其实我们经常会遇到一些创建xml文件的需求，但是直接按照xml格式动态生成就非常麻烦，这时候用flat format做个中转就非常方便了：
```bash
#!/usr/bin/env bash

tempFile=$(mktemp tmp.XXXX)

function addBook(){
    id=$1
    name=$2
    price=$3
    echo "/books/book">>$tempFile
    echo "/books/book/@id=$id">>$tempFile
    echo "/books/book/name=$name">>$tempFile
    echo "/books/book/price=$price">>$tempFile
}

function main(){
    addBook 1 book1 100
    addBook 2 book2 200
    addBook 3 book3 300
    cat $tempFile|2xml|xmllint --format --output new_sample.xml -
    rm $tempFile
}

main "$@"
```
上面这段代码就生成了与sample.xml一模一样的new_sample.xml.