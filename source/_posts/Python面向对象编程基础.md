---
title: Python面向对象编程基础
id: 1
categories:
  - Python
date: 2016-03-25 22:34:08
tags:
  - Python
---

最近一直在用Python写代码，发现了很多代码重复的问题，总是复制粘贴显得特别凌乱，于是就想用类来封装一下。下面就记录下Python中最基础的面向对象编程方法。python的面向对象跟java，c++的面向对象意思都差不多，从他们类比过来还是非常好理解的。

## 类定义

python的类定义比较简单格式基本是这样的：
```python
class Test():

    publicAttr= 0

    def __init__(self):
        pass

    def instanceMethod(self):
        pass

    @staticmethod
    def staticMethod():
        pass

    @classmethod
    def classMethod(cls):
        pass

    def __del__():
        pass
```

*   直接定义一个Test类，括号里面表示他的父类，默认是Object。
*   构造函数名字叫__init__，括号内表示构造的参数，但是第一个参数必须是self，表示传入自己的引用，而且之后调用的所有类属性类方法都需要用self来引导。
*   类的方法分为实例方法、静态方法和类方法。除了实例方法外，其他方法是在方法上方用‘@staticmethod’或'@classmethod'来表示的。而且只有实例方法必须先生成一个实例才可以调用。
*   注意类方法默认传入的参数不是self，而是cls，表示他是类方法。类方法跟静态方法基本差不多，不同的就是这个参数，以及在继承中的差异。
*   析构函数名字叫__del__，传入self参数。由于python本身具有垃圾回收机制，我们既可以用`del myinstance`来显式调用，也可以让系统自己调用。

## 权限控制

python中并没有权限控制的关键字，所以默认的权限都是public，他相信程序员知道自己正在做什么。不过他也提供了权限控制的机制，就是通过方法名。如果方法名或属性名前面由‘__’修饰，那么python就认为他是私有的。

比如:
```python
class Test():
    __privateAttr=1
    publicAttr= 2
    def __privateMethod(self):
        print self.__private
    def publicMethod(self):
        print self.publicAttr

test=Test()             #constructor
print test.publicAttr
#print test.__privateAttr
test.publicMethod()
#test.__privateMethod()
```
类外部调用私有属性是会报错的。

不过事实上，私有属性也是可以在类外被访问到的，只要在他的名字前面加上“_类名”就可以了。

## 继承

python支持多重继承（具体内容暂时不研究），父类名写在类声明的括号里面。具体用法跟其他的支持OOP语言的使用方法类似。
