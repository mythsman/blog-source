---
title: Python中字符串的format函数使用
id: 1
categories:
  - Python
date: 2016-03-03 23:26:25
tags:
  - Python
---

从python2.6之后，python中的字符串就有了str.format()函数这一格式控制的强大工具。相比于之前使用%的格式控制手段，str.format()函数显然更加符合我们的思维习惯，而且更加简洁。

## 语法

作为字符串的一个方法，它以{}和:来代替%，进行格式控制。

## 定位

### 通过位置
```
In [1]: '{0},{1}'.format('kzc',18)
Out[1]: 'kzc,18'
In [2]: '{},{}'.format('kzc',18)
Out[2]: 'kzc,18'
In [3]: '{1},{0},{1}'.format('kzc',18)
Out[3]: '18,kzc,18'
```
十分好理解，就是在字符串中用{}中的值来指定format中用以代替他的值。可以接受不限个参数，位置可以不按顺序，可以不用或者用多次。

### 通过关键字参数
```
In [5]: '{name},{age}'.format(age=18,name='kzc')
Out[5]: 'kzc,18'
```
就是可以用键值对的形式给参数列表中的元素赋值。


### 通过对象属性
```
class Person:
  def __init__(self,name,age):
    self.name,self.age = name,age
    def __str__(self):
      return 'This guy is {self.name},is {self.age} old'.format(self=self)

In [2]: str(Person('kzc',18))
Out[2]: 'This guy is kzc,is 18 old'
```
在参数列表中指定要显示的对象的属性，并在format中传入这个对象。


### 通过下标
```
In [7]: p=['kzc',18]
In [8]: '{0[0]},{0[1]}'.format(p)
Out[8]: 'kzc,18'
```
结合位置与下表进行传参。

## 格式限定符

### 填充与对齐
填充常跟对齐一起使用
^、<、>分别是居中、左对齐、右对齐，后面带宽度
:号后面带填充的字符，只能是一个字符，不指定的话默认是用空格填充
比如
```
In [15]: '{:>8}'.format('189')
Out[15]: '   189'
In [16]: '{:0>8}'.format('189')
Out[16]: '00000189'
In [17]: '{:a>8}'.format('189')
Out[17]: 'aaaaa189'

```

### 精度与类型
```
In [44]: '{:.2f}'.format(321.33345)
Out[44]: '321.33'
```
精度常跟类型f一起使用，本例中.2表示长度为2的精度，f表示float类型。

### 进制转换
```
In [54]: '{:b}'.format(17)
Out[54]: '10001'
In [55]: '{:d}'.format(17)
Out[55]: '17'
In [56]: '{:o}'.format(17)
Out[56]: '21'
In [57]: '{:x}'.format(17)
Out[57]: '11'
```
b、d、o、x分别是二进制、十进制、八进制、十六进制，跟在冒号后面

### 分割字符
```
In [47]: '{:,}'.format(1234567890)
Out[47]: '1,234,567,890'
```
用逗号还能用来做金额的千位分隔符。