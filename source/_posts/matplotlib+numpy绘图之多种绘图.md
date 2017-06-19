---
title: matplotlib+numpy绘图之多种绘图
id: 1
categories:
  - Python
date: 2016-01-24 11:54:24
tags:
  - Python
---

下面将以例子的形式分析matplot中支持的，分析中常用的几种图。


## 填充图

### 参考代码
```python
from matplotlib.pyplot import *
x=linspace(-3,3,100)
y1=np.sin(x)
y2=np.cos(x)
fill_between(x,y1,y2,where=(y1>=y2),color='red',alpha=0.25)
fill_between(x,y1,y2,where=(y<>y2),color='green',alpha=0.25)
plot(x,y1)
plot(x,y2)
show()
```

### 简要分析

这里主要是用到了fill_between函数。这个函数很好理解，就是传入x轴的数组和需要填充的两个y轴数组；然后传入填充的范围，用where=来确定填充的区域；最后可以加上填充颜色啦，透明度之类修饰的参数。

当然fill_between函数还有更加高级的用法，详见[fill_between用法](http://matplotlib.org/api/pyplot_api.html#matplotlib.pyplot.fill_between)或者help文档。

### 效果图
![](/images/2016/01/24/1/1.png)



## 散点图(scatter plots)

### 参考代码
```python
from matplotlib.pyplot import *
n = 1024
X = np.random.normal(0,1,n)
Y = np.random.normal(0,1,n)
T = np.arctan2(Y,X)
scatter(X,Y, s=75, c=T, alpha=.5)
xlim(-1.5,1.5)
ylim(-1.5,1.5)
show()
```

### 简要分析

首先介绍一下numpy 的normal函数，很明显，这是生成正态分布的函数。这个函数接受三个参数，分别表示正态分布的平均值，标准差，还有就是生成数组的长度。很好记。

然后是arctan2函数，这个函数接受两个参数，分别表示y数组和x数组，然后返回对应的arctan(y/x)的值，结果是弧度制。

接下来用到了绘制散点图的scatter方法，首先当然是传入x和y数组，接着s参数表示scale，即散点的大小；c参数表示color，我给他传的是根据角度划分的一个数组，对应的就是每一个点的颜色（虽然不知道是怎么对应的，不过好像是一个根据数组内其他元素进行的相对的转换，这里不重要了，反正相同的颜色赋一样的值就好了）；最后是alpha参数，表示点的透明度。

至于scatter函数的高级用法可以参见官方文档[scatter函数](http://matplotlib.org/api/pyplot_api.html#matplotlib.pyplot.scatter)或者help文档。

最后设置下坐标范围就好了。

### 效果图

![](/images/2016/01/24/1/2.png)


## 条形图(bar plots)

### 参考代码
```python
from matplotlib.pyplot import *
n = 12
X = np.arange(n)
Y1 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)
Y2 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)
bar(X, +Y1, facecolor='#9999ff', edgecolor='white')
bar(X, -Y2, facecolor='#ff9999', edgecolor='white')
for x,y in zip(X,Y1):
	text(x+0.4, y+0.05, '%.2f' % y, ha='center', va= 'bottom')
for x,y in zip(X,Y2):
	text(x+0.4, -y-0.05, '%.2f' % y, ha='center', va= 'top')
xlim(-.5,n)
xticks([])
ylim(-1.25,+1.25)
yticks([])
show()
```

### 简要分析

注意要手动导入pylab包，否则会找不到bar。。。

首先用numpy的arange函数生成一个[0,1,2,...,n]的数组。（用linspace也可以）

其次用numpy的uniform函数生成一个均匀分布的数组，传入三个参数分别表示下界、上界和数组长度。并用这个数组生成需要显示的数据。

然后就是bar函数的使用了，基本用法也和之前的plot、scatter类似，传入横纵坐标和一些修饰性参数。

接着我们需要用for循环来为柱状图显示数字：用python的zip函数将X和Y1两两配对并循环遍历，得到每一个数据的位置，然后用text函数在该位置上显示一个字符串（注意位置上的细节调整）。text传入横纵坐标，要显示的字符串，ha参数制定横向对齐，va参数制定纵向对齐。

最后调整下坐标范围，并且取消横纵坐标上的刻度以保持美观即可。

至于bar函数的具体用法可以参照[bar函数用法](http://matplotlib.org/api/pyplot_api.html?highlight=bar#matplotlib.pyplot.bar)或者help文档。


### 效果图

![](/images/2016/01/24/1/3.png)

## 等高线图(contour plots)

### 参考代码
```python
from matplotlib.pyplot import *
def f(x,y):
    return (1-x/2+x**5+y**3)*np.exp(-x**2-y**2)
n = 256
x = np.linspace(-3,3,n)
y = np.linspace(-3,3,n)
X,Y = np.meshgrid(x,y)
contourf(X, Y, f(X,Y), 8, alpha=.75, cmap=cm.hot)
C = contour(X, Y, f(X,Y), 8, colors='black', linewidth=.5)
clabel(C, inline=1, fontsize=10)
show()
```

### 简要分析

首先要明确等高线图是一个三维立体图，所以我们要建立一个二元函数f，值由两个参数控制，(注意，这两个参数都应该是矩阵)。

然后我们需要用numpy的meshgrid函数生成一个三维网格，即，x轴由第一个参数指定，y轴由第二个参数指定。并返回两个增维后的矩阵，今后就用这两个矩阵来生成图像。

接着就用到coutourf函数了，所谓contourf，大概就是contour fill的意思吧，只填充，不描边；这个函数主要是接受三个参数，分别是之前生成的x、y矩阵和函数值；接着是一个整数，大概就是表示等高线的密度了，有默认值；然后就是透明度和配色问题了，cmap的配色方案这里不多研究。

随后就是contour函数了，很明显，这个函数是用来描线的。用法可以类似的推出来，不解释了，需要注意的是他返回一个对象，这个对象一般要保留下来个供后续的加工细化。

最后就是用clabel函数来在等高线图上表示高度了，传入之前的那个contour对象；然后是inline属性，这个表示是否清除数字下面的那条线，为了美观当然是清除了，而且默认的也是1；再就是指定线的宽度了，不解释，。


### 效果图

![](/images/2016/01/24/1/4.png)


## 点阵图

### 参考代码
```python 
from matplotlib.pyplot import *
def f(x,y):
    return (1-x/2+x**5+y**3)*np.exp(-x**2-y**2)
n = 10
x = np.linspace(-3,3,3.5*n)
y = np.linspace(-3,3,3.0*n)
X,Y = np.meshgrid(x,y)
Z = f(X,Y)
imshow(Z,interpolation='nearest', cmap='bone', origin='lower')
colorbar(shrink=.92)
show()
```

### 简要分析

这段代码的目的就是将一个矩阵直接转换为一张像照片一样的图，完整的进行显示。

前面的代码就是生成一个矩阵Z，不作解释。

接着用到了imshow函数，传人Z就可以显示出一个二维的图像了，图像的颜色是根据元素的值进行的自适应调整，后面接了一些修饰性的参数，比如配色方案（cmap），零点位置（origin）。

最后用colorbar显示一个色条，可以不传参数，这里传进去shrink参数用来调节他的长度。


### 效果图

![](/images/2016/01/24/1/5.png)

## ３Ｄ图

### 参考代码
```python
import numpy as np
from pylab import *
from mpl_toolkits.mplot3d import Axes3D
fig = figure()
ax = Axes3D(fig)
X = np.arange(-4, 4, 0.25)
Y = np.arange(-4, 4, 0.25)
X, Y = np.meshgrid(X, Y)
R = np.sqrt(X**2 + Y**2)
Z = np.sin(R)
ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap=plt.cm.hot)
ax.contourf(X, Y, Z, zdir='z', offset=-2, cmap=plt.cm.hot)
ax.set_zlim(-2,2)
show()
```

### 简要分析

有点麻烦，需要用到的时候再说吧，不过原理也很简单，跟等高线图类似，先画图再描线，最后设置高度，都是一回事。

### 效果图

![](/images/2016/01/24/1/6.png)
