---
title: Scikit-learn包基本使用
id: 1
categories:
  - Machine Learning
date: 2016-04-09 14:50:02
tags:
  - Machine Learning
  - Python
---

[Scikit-learn](http://scikit-learn.org/stable/)的包是机器学习使用的最全也是实用的包，封装了许多机器学习算法，包括各种分类、回归、聚类、降维、模型选择、预处理等许多方面的内容，提供了相当于黑盒的接口，非常适合初学者使用。

在朋友的推荐下发现了[Kaggle](https://www.kaggle.com/)这个网站，这里面有很多的机器学习的数据和基本的题目，通过这些练习可以比较好的掌握机器学习的算法。因此就在这当中拿了[Titanic号遇难人员的预测](https://www.kaggle.com/c/titanic)做了个实验。其实做法十分简单，权当熟悉框架了。

## 题目要求

题目给定了Titannic号上人员的信息（包括阶层、姓名、性别、年龄、船上直系亲属的个数、船上表亲的个数、船票号、船费、包厢、登船地点等内容），并给出他们的生存情况；然后再给定一些人的信息，让我们预测他们的生存情况。

![](/images/2016/04/09/1/1.png)

数据是以csv文件的形式给出的，如上图所示。

最后从类似的文件里读取另外一波人的信息，并将预测结果输出到一个csv文件中。具体数据规范见原题《[Titanic号遇难人员的预测](https://www.kaggle.com/c/titanic)》。

## 解决方案

对于这种问题其实只要把字符串的描述的特征提取成特征向量然后随便跑个学习算法就可以了，至于什么学习算法好还是要具体问题具体分析，都用一遍就知道了，我这里用的是朴素贝叶斯模型。

注意到有些特征是没有意义的，比如名字、船票号啥的，这些特征可以忽略；还有就是有的年龄和票价是没有的，那么简单点考虑就用平均值代替就好了。

具体实现也就很简单了，主要是Scikit-learn的使用。

**代码如下：**
```python
#coding:utf-8
import csv,re
import numpy as np
from sklearn import metrics
from sklearn.naive_bayes import *

#read csv data
reader=csv.reader(file('train.csv'))
data=[]
age=[]
price=[]
start=True
for item in reader:
    if start:
        start=False
        continue
    data.append(item)
    if(item[5]!=''):
        age.append(float(item[5]))
    if(item[9]!=''):
        price.append(float(item[9]))
meanAge=np.array(age).mean()
meanPrice=np.array(price).mean()
for item in data:
    if(item[5]==''):
        item[5]=meanAge
    if(item[9]==''):
        item[9]=meanPrice

#generate learning data
def getFeature(dataItem):
    feature=[]
    #Pclass
    if dataItem[2]=='1':
        feature.append(1)
    elif dataItem[2]=='2':
        feature.append(2)
    else:
        feature.append(3)

    #Sex
    if dataItem[4]=='female':
        feature.append(1)
    else:
        feature.append(0)

    #Age
    feature.append(float(dataItem[5]))

    #SibSp
    feature.append(float(dataItem[6]))

    #Parch
    feature.append(float(dataItem[7]))

    #Fare
    feature.append(float(dataItem[9]))

    #Cabin
    if  dataItem[10]=='':
        feature.append(0)
    else:
        feature.append(1)

    #Embarked
    if dataItem[11]=='S':
        feature.extend([0,0,1])
    elif dataItem[11]=='C':
        feature.extend([0,1,0])
    else:
        feature.extend([1,0,0])

    return feature,int(dataItem[1])

x=[]
y=[]
for item in data:
    f,l=getFeature(item)
    x.append(f)
    y.append(l)

#classify
model = GaussianNB()
model.fit(x, y)

expected=y
predicted = model.predict(x)

print(metrics.classification_report(expected, predicted))
print(metrics.confusion_matrix(expected, predicted))

#predict and write
reader=csv.reader(file('test.csv','rb'))
testData=[]
start=True
for item in reader:
    if start:
        start=False
        continue
    newItem=[]
    newItem.append(-1)
    newItem.append(item[0])
    newItem.extend(item[1:])
    if(newItem[5]==''):
        newItem[5]=meanAge
    if(newItem[9]==''):
        newItem[9]=meanPrice

    testData.append(newItem)

testX=[]
testId=[]
for item in testData:
    f,Id=getFeature(item)
    testX.append(f)
    testId.append(Id)

predictY=model.predict(testX)

writer=csv.writer(file('result.csv','wb'))

writer.writerow(['PassengerId','Survived'])
for i in xrange(len(testId)):
    writer.writerow([testId[i],predictY[i]])
```

要注意以下几点：

1. 在对csv文件进行读取时，我们从reader中只能逐行读取一遍，因此需要将他读到临时list里方便后续处理；
2. 区分list的append和extend方法的使用，一个是添加一个元素，一个是合并两个list。
3. 传入的学习参数时必须都是float数据类型。
4. 学习模型可以非常容易进行替换，我当前用的是高斯朴素贝叶斯模型，其实完全可以换成决策树（DecisionTreeClassifier）、SVM（SVC）等其他分类模型，而我们要改的只是`model = GaussianNB()`一行而已。


**输出结果：**
```
precision    recall  f1-score   support

          0       0.83      0.83      0.83       549
          1       0.72      0.72      0.72       342

avg / total       0.79      0.79      0.79       891

[[454  95]
 [ 96 246]]
```
第一块是对于每一个分类所得到的准确率、召回率、f1-score，和分出的总数；

第二块是混淆矩阵；

具体含义可见[机器学习中分类准确率的评估方法](/2016/04/09/2)。

最后尝试了下决策树跟SVM，发现使用决策树的结果是最好的（准确率甚至到了99%）。不过最终提交上去才发现最终的识别率还是好低(72%)。。。不过仔细想想，想这种的预测还是挺不靠谱的，毕竟偶然因素太大了，仅仅凭着这些东西感觉完全不可能达到100%的准确率啊。
