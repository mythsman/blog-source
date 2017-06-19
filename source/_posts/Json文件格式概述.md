---
title: Json文件格式概述
id: 1
categories:
  - Others
date: 2015-12-19 23:58:21
tags:
  - Others
---

我们知道现如今，json格式很多网页在前端和后端交互的过程中都会用到的一种文件格式，尤其是在使用ajax进行交互的场合。他的语法简单，而且条理十分清晰，适合处理大量的有着逻辑关系的数据。

## 定义

什么是 JSON ？

1. JSON 指的是 JavaScript 对象表示法（JavaScript Object Notation）
2. JSON 是轻量级的文本数据交换格式
3. JSON 独立于语言
4. JSON 具有自我描述性，更易理解
5. JSON 使用 JavaScript 语法来描述数据对象，但是 JSON 仍然独立于语言和平台。JSON 解析器和 JSON 库支持许多不同的编程语言。

w3c的标准说明如下：
JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。 易于人阅读和编写。同时也易于机器解析和生成。 它基于JavaScript Programming Language, Standard ECMA-262 3rd Edition - December 1999的一个子集。 JSON采用完全独立于语言的文本格式，但是也使用了类似于C语言家族的习惯（包括C, C++, C#, Java, JavaScript, Perl, Python等）。 这些特性使json成为理想的数据交换语言。

所以几乎所有的语言都会有支持json格式转化的库。

## 格式

json的格式只有两种！所以非常简单方便：

1.键值对

对象是一个无序的“‘名称/值'对”集合。一个对象以“{”开始，“}”结束。每个“名称”后跟一个“:”；“键值对”之间使用“,”分隔。

2.数组

数组是值（value）的有序集合。一个数组以“[”开始，“]”结束。值之间使用“,”分隔。

## 示例
```json
{
    "employees": [
        {
            "firstName": "Bill",
            "lastName": "Gates"
        },
        {
            "firstName": "George",
            "lastName": "Bush"
        },
        {
            "firstName": "Thomas",
            "lastName": "Carter"
        }
    ]
}
```
要注意的是，每一个非数值的字符串都应当带引号，否则标准的解析库是无法解析的。

网上也有很多json的在线格式化的网站，在遇到json无法解析的时候可以去那里找找错。
