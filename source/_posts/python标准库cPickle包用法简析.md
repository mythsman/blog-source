---
title: python标准库cPickle包用法简析
id: 2
categories:
  - Python
date: 2016-01-22 23:53:50
tags:
  - Python
---

CPickle包是一个很常用的工具，用来将任何一个数据类型存储到文件中，再原封不动的读取出来。在需要保存一些特定格式的数据或是大量的数据的时候相比自己写文件来说，可是非常方便而且有用的。

## 用法

## 将数据输出到文件

```python
import cPickle

class test():
    element1 = 1
    element2  = '2'

obj=test()
cPickle.dump(obj,open("data.txt",'wb'))#输出到文件
cPickleString=cPickle.dumps(obj)#输出到变量
print cPickleString
```
输出：（屏幕和文件）
```
(i__main__
test
p1
(dp2
b.
```
从上面这个例子可以看出用dump方法可以把任何数据类型输出到文件，而dumps方法可以把任何数据输出到变量。当然，存储的形式就是他自己规定的了。

## 从文件读取数据

用刚才生成的数据来恢复文件：
```python
import cPickle

class test():
    element1 = 1
    element2  = '2'

obj=cPickle.load(open("data.txt",'rb'))
print obj.element1
print obj.element2
```
输出：
```
１
２
```
很明显load方法接受文件参数，把读取的数据返回给变量，可以无损恢复。

## ps

用法很简单，但是绝对是挺实用的。最后补充句，就是这个cPickle包其实是原来的pickle包用C语言改写的。所以pickle包跟他的用法基本相同，但是cPickle会更快一点。
