---
title: libsvm库的使用
id: 1
categories:
  - Machine Learning
date: 2016-02-06 22:46:30
tags:
  - Machine Learning
---

看了下svm（支持向量机）的实现原理，感觉基础的部分还是不难懂的，但是如果要自己动手实现的话还是有很大难度的，况且自己写的效果肯定不太好。于是就在网上找了一个大牛写的svm库，实现了多种分类方式，而且涵盖了几乎所有常见语言的接口，用起来方便而且效果也很好。

## 概述

LIBSVM是台湾大学林智仁(Lin Chih-Jen)教授等开发设计的，综合使用了包括线性函数，多项式函数，径向基函数，sigmoid函数等在内的不同分类方式，而且支持包括C/C++，python，java，matlab，Octave，R，C#，Perl，Ruby，Weka，Node.js，Scilab，Lisp，,haskell，Cuba，.Net，PHP等等一系列语言（听上去就很强大）。

具体的介绍可以参见林智仁教授的[HomePage](http://www.csie.ntu.edu.tw/~cjlin/)，这里面有他个人的介绍，以及[Libsvm](http://www.csie.ntu.edu.tw/~cjlin/libsvm/index.html)的各种文档以及最新版本。


## 安装

最好的办法就是去林教授的主页上下了，可以见到最完整的文件以及文档，而且还附带基础教程的测试样例。不过调用起来不太方便，还得手动将源文件配置到正确的地方才能随时使用。

我为了图省事，就直接用apt下载了（没想到ubuntu竟然收录了这个，可见这玩意的强大）。
```
$sudo apt-get install python-libsvm
```
这样我们就能像平常导入包一样在python中调用了。

当然我们需要一些文档，试着用man来查看发现并没有，于是locate了一下发现他的文档在这里：
```
/usr/share/doc/libsvm3/README.gz
/usr/share/doc/python-libsvm/README.gz
```
OK，需要用到的时候进去看一下就好了。


## 基本用法

教程中对libsvm的用法有两个档次，即 “high-level ”和"low-level" 。这里的 high-level 并不是指高端用法，low-level 也并不是指低端用法（话说我一开始就是这么理解的0.0）。其实这里的 high-level 是指封装程度高，也就是细节隐藏的更好，用户使用更方便；同样，low-level 是指所用的函数更加底层，更加体现细节，但是用起来难度就更高了。当然，我会选择high-level来进行应用。

具体函数的用法都在文档里，就不一一记录了，我这里姑且就对他进行一个简要的应用。下面就用libsvm来代替之前在 [正方系统验证码识别](/2016/02/05/1/) 项目中的那个logistic_sgd.py文件，并顺便查看下svm算法的效果。
```python
import svmutil,cPickle,gzip
import numpy as np

f = gzip.open('vericode.pkl.gz')
train_set,valid_set,test_set = cPickle.load(f)
f.close()

x = train_set[0].tolist()
x.extend(valid_set[0].tolist())

y = train_set[1].tolist()
y.extend(valid_set[1].tolist())

#以上是为了控制输入格式，y是用list储存的分类标签；x是用list储存的数据，每一个数据是一个list，保存该数据的特征值

prob = svmutil.svm_problem(y,x)#用数据生成表示训练集的对象

param = svmutil.svm_parameter('-t 0')#表示训练参数，这里选择的是线性分类

#m = svm_load_model('heart_scale.model')可以导入之前得到的最优模型
m = svmutil.svm_train(prob,param)#开始训练，并生成训练后的模型
svmutil.svm_predict(y,x, m)#检测训练集的符合程度
p_label, p_acc, p_val = svmutil.svm_predict(test_set[1].tolist(), test_set[0].tolist(), m)#检测测试集的泛化误差，当然也可以用来进行预测，p_label就是用来保存预测结果的
#svmutil.svm_save_model('heart_scale.model', m)#可以将最优模型保存下来
```
本地运行结果：
```
*
optimization finished, #iter = 37
nu = 0.003704
obj = -0.251887, rho = 0.269514
nSV = 10, nBSV = 0
*
optimization finished, #iter = 54
nu = 0.010331
obj = -0.687010, rho = -0.920502
nSV = 16, nBSV = 0
......
*
optimization finished, #iter = 96
nu = 0.004130
obj = -0.280826, rho = 0.255170
nSV = 21, nBSV = 0
*.*
optimization finished, #iter = 178
nu = 0.009597
obj = -0.767762, rho = -0.705452
nSV = 29, nBSV = 0
Total nSV = 1409
Accuracy = 99.009% (2198/2220) (classification)
Accuracy = 91.3669% (508/556) (classification)
```
前面一大段的内容是在svm_train训练的时候自动输出的，大概反映了训练的进程（具体意义暂时没搞懂）。

最后两个分别是对训练集的拟合程度，以及对测试集的泛化拟合程度。我们可以看见他的拟合效果非常的好，几乎达到了完美。后来的泛化拟合效果稍微有点问题，这大概是出现了过拟合问题，而这个问题通常是可以通过加大训练集的量来解决的。总的来说，训练的效率还是非常高的，用起来也非常的方便。
