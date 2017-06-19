---
title: python下解析json格式文件
id: 1
categories:
  - Python
date: 2015-12-21 23:44:46
tags:
  - Python
---

解析json文件无非编码和解码，这里我们用了python下自带的json模块。当然还要结合python本身特有的dict类型的操作。

## 编码

编码用到的是json.dumps()函数，将字典转化为json对象。
```python
import json
data = [{'a':"A",'b':(2,4),'c':3.0}]  #list对象
print "DATA:",repr(data)
data_string = json.dumps(data)#dumps函数
print "JSON:",data_string
```
输出的结果是：
```
DATA: [{'a':'A','c':3.0,'b':(2,4)}] #python的dict类型的数据是没有顺序存储的
JSON: [{"a":"A","c":3.0,"b":[2,4]}]
```

## 解码

解码用json.loads()函数，将json格式转化为dict。
```python
import json
data = '{"a":"A","b":[2,4],"c":3.0}'  #json格式

decoded = json.loads(data)
print "DECODED:",decoded
```
输出的结果是
```
DECODED: [{u'a': u'A', u'c': 3.0, u'b': [2, 4]}]
```

编码和解码的过程中，元组会被变成无次序的列表，而字典的次序也并不能保证不变。

现在，处理json格式的重点便成了正确处理dict类型数据了。

## 常见错误

python的json模块不支持单引号，所以类似`"{'a':'A','b':[2,4],'c':3.0}"`的字符串是会报以下错误的：
```
ValueError: Expecting property name: line 1 column 2 (char 1)
```
这时候我们只需要把他单双引号互换即可：
```
'{"a":"A","b":[2,4],"c":3.0}'
```