---
title: Julia集分形图案绘制
id: 1
categories:
  - Others
date: 2016-02-19 19:22:37
tags:
  - Python
mathjax: true
---

从去年就开始窥东大的C++教学群，当时就被李骏扬老师讲的分形图案给吸引了，简直美赞了。他们的期末作业就是制作一个分形图案的视频，我们这种学校显然不会有这种东西。于是就想着能不能自己研究着画下，然而并不知道这种图案怎么画，度娘上找来的基本没用。搁置了一年，偶然间翻到了一篇论文，终于找到了画图的方法了，加上之前正好有用python绘图的工具，总算把这个东西搞通了一点。其实这个玩意的水还是非常深的，牵涉到了复分析，分形，甚至是混沌理论，据说从上古贝壳的图案，到如今麦田怪圈的图案，都和Julia集有关，说来也是玄乎。


## Julia集

简单的讲，_Julia_集就是复平面上的一些点$z$，对于一个固定的复数$c$，$z$点在经过无限次$z\gets z^2+c$的迭代之后最终都收敛到一个固定的值上，那么复平面上所有这样的z点构成的集合就是_julia_集。（如果固定初始值而将$c$当做变量则生成的是mandelbrot集）

当然，这个迭代公式也有他的变种，比如多重julia集或者指数julia集等。

讲的不太清楚，具体的介绍可以参见_[wiki pedia](https://en.wikipedia.org/wiki/Julia_set)_以及_[matrix67](http://www.matrix67.com/blog/archives/4570)_的博客(对度娘表示无语)，这里就不班门弄斧了。_wiki_里面主要介绍的是一些数学定义和推导以及他的一些典型图形，而_matrix67_写的则更加容易理解，他通过一步一步迭代过程的展现十分生动的描述了图像的产生过程。不过事实上，matrix67在之前的博客里虽然提供了绘图的代码，但是并没有介绍图像生成的算法。干看代码还是有点恶心的。而市面上又没怎么提及绘图的算法。事实上，他用的算法也非常的简单普遍，我们叫他“逃逸时间算法”。

## 逃逸时间算法（Escape Time Algorithm）

曾经纳闷了很长时间，上面那个简单的迭代式究竟是怎样生成那些纷繁复杂的分形图案的。最后终于在知网上找到了这个算法。

1. 设定逃逸半径R，最高迭代次数N；

2. 将初始的点z进行迭代，如果在N次迭代之内z的模超过了R，那么就认为z“逃逸出去”了，逃逸出去时的迭代次数n就是”逃逸时间“；

3. 如果经过N次迭代，z的模仍然未到达R，那么就认为z是收敛集内的点；

4. 将所有的逃逸点按照不同的逃逸时间进行染色就得到了美丽的“逃逸时间图”。

其实逃逸时间图显示的并不是真正意义上的_julia_集，而是不属于_julia_集合的点。

当然，还有一种常用的_julia_集绘图算法--外部距离估计算法，这里不做过多介绍。

## 静态实现

用python+matplotlib模拟逃逸时间算法进行简单绘图：
```python
import numpy as np
import matplotlib.pyplot as plt
import time

c_real=-1.621
c_imag=-2

def func(a):
	c=np.complex(c_real,c_imag)
	return np.exp(a*a*a)+c+a*a-a

R=50
density=400
N=100

x=[]
y=[]
c=[]

for i in xrange(density):
	for j in xrange(density):
		real=(i-density/2.0)/density*2.0
		imag=(j-density/2.0)/density*2.0
		now=np.complex(real,imag)
		for n in xrange(N):
			now=func(now)
			if np.abs(now)>R:
				x.append(real)
				y.append(imag)
				c.append(n+1)
				break

plt.scatter(x,y,s=2,c=c,edgecolors='face')
plt.xticks([])
plt.yticks([])
plt.xlim(-1,1)
plt.ylim(-1,1)
plt.savefig(str(const_real)+'+'+str(const_imag)+'i.png')
```
参数c由c_real和c_imag确定，迭代公式由func函数确定，描点时注意去掉边界以及标尺。

通过这个模板可以非常轻松的绘出下面这几张图：

![c=-0.74543+0.11301i](/images/2016/02/19/1/1.png)

![c=-0.8+0.156i](/images/2016/02/19/1/2.png)

![c=-0.4+0.6i](/images/2016/02/19/1/3.png)

![c=-0.621+0i,func=exp(z*z*z)+c](/images/2016/02/19/1/4.png)

![c=0.285+0.01i](/images/2016/02/19/1/5.png)


## 动态实现

既然我们可以直接绘出迭代N次之后的图像，那么我们当然也可以画出每一次的图像组合成动图，这样看起来效果也更明显。

**图像生成：**
```python
import numpy as np
import matplotlib.pyplot as plt
import time

def func(a):
	c=np.complex(-0.74543,0.11301)
	return a*a+c

R=10
density=400
N=100

time1=time.time()

mat=[]
for i in xrange(density):
	for j in xrange(density):
		real=(i-density/2.0)/density*2.0
		imag=(j-density/2.0)/density*2.0
		now=np.complex(real,imag)
		for n in xrange(N):
			now=func(now)
			if np.abs(now)>R:
				mat.append((real,imag,n+1))
				break

time2=time.time()

print 'calculating costs '+str(time2-time1)+' s.'

mat.sort(lambda x,y:cmp(x[2],y[2]))

time3=time.time()
print 'sorting costs '+str(time3-time2)+' s.'

real=[]
imag=[]
color=[]

cnt=1
for i in xrange(len(mat)-1):
	real.append(mat[i][0])
	imag.append(mat[i][1])
	color.append(mat[i][2])
	if i==len(mat)-2 or (not mat[i][2]==mat[i+1][2]):
		plt.scatter(real,imag,s=2,c=color,alpha=1,edgecolors='face')
                plt.xticks([])
                plt.yticks([])
		plt.xlim(-1,1)
		plt.ylim(-1,1)
		plt.savefig('%02d' % cnt)
		print 'pic'+('%02d' % cnt)+' OK.'
		cnt+=1

time4=time.time()
print 'generating costs '+str(time4-time3)+' s.'

print 'total costs '+str(time4-time3)+' s.'
```
生成图像的过程比较缓慢，相比而言计算所耗费的时间就不算太多了。



**gif组合：**
```
$convert *.png -resize 320x240 out.gif
```
我们用ImageMagick工具来生成gif，这里如果用-layer来压缩会导致图像失真，因此用改变图像大小的方式来适当压缩文件。

最后就可以生成动图：

![](/images/2016/02/19/1/6.gif)
