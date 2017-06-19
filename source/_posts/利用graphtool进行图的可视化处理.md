---
title: 利用graphtool进行图的可视化处理
id: 1
categories:
  - Python
date: 2017-06-11 13:50:35
tags:
  - Python
  - Data Mining
---

## 前言
最近恶心的项目中期检查，我被分配到做社交图的分析，然而事实上我并不知道弄啥。虽然不是我自己答辩，但是考虑到还是不要太坑dalao，我决定不管怎样至少得搞点图撑撑场面免得尴尬，这几天就赶鸭子上架倒腾了下`graph_tool`这个专门用于对图进行可视化的python库。虽然网上中文资料不足，但是他的英文文档还是非常全面的，很多设计的小细节也在文档里提及了，非常简单容易上手。下面就从一个初学者的记录下我的学习历程。

## 安装
虽然是个python库，但是毕竟是要做大量数据计算的，因此graphtool在底层使用了Boost, CGAL 和 expat这几个C++库(Boost是扩展的标准库，CGAL是一个计算几何算法库，expat是一个XML解析器)。这就导致了使用通常的pip和easyinstall不太好直接安装。正确的安装姿势大概有三种:

1. 使用Docker
2. 源码安装
3. 各个Linux版本的包管理器

这里主要参考[graph-tool installation](https://git.skewed.de/count0/graph-tool/wikis/installation-instructions)的各种安装说明。
从最基本的源码安装，到封装好的包管理器安装，再到最万金油的docker安装一应俱全。
看上去一片美好。
然而真正用的时候发现，如果使用docker，官方提供的镜像还是太过庞大，用起来还是太臃肿了;如果采用更新源+包管理器安装的化，要是系统的版本比较新还好，要是系统版本老了，就会报各种依赖不足的问题。。。最坑爹的是，即使采用源码安装的方式，由于开发人员比较勤快，经常更新技术，很多库都需要较新的版本，容易导致老的机器上无法编译，而且由于项目源码是托管在他自己搭的[git服务器](https://git.skewed.de/count0/graph-tool/)上，这个服务器还很坑，旧的版本经常下不下来。。。最近不知道为什么官网的服务器崩了，还好我之前下了源码，于是把他fork到了我的[github](https://github.com/mythsman/graph_tool_2.2)上，做个备份。

不过还好，虽然我的服务器比较旧，但是我的台式机比较新，没啥问题。。。

## 函数结构
这个项目的文档非常详尽，可以参考他的[quickstart](https://graph-tool.skewed.de/static/doc/quickstart.html)，类的API在[这里](https://graph-tool.skewed.de/static/doc/py-modindex.html)。下面稍微整理下大概用途，方便查找：

|||
|-|-|
|graph_tool|主要用于是图的加载、构建、删除、持久化、迭代|
|graph_tool.centrality|主要用于计算与图的中心度相关的信息|
|graph_tool.clustering|主要用于计算图的各种聚类系数|
|graph_tool.collection|保存了十几个供参考的数据集|
|graph_tool.correlations|主要用与计算各种相关度信息|
|graph_tool.draw|封装了一些常用的绘图算法|
|graph_tool.flow|处理图的最大流最小割一类的问题|
|graph_tool.generation|主要用于预先生成一些图，比如完全图，随机图，晶格图等等|
|graph_tool.inference|主要用于推断图的社区结构|
|graph_tool.search|包装了一些图的搜索算法，比如bfs,dijikstra,astar等等|
|graph_tool.spectral|主要用于计算图的矩阵信息|
|graph_tool.stats|主要用于图的简单直方图统计等信息|
|graph_tool.topology|主要包装了图的拓扑性质，比如最短路，最小生成树，拓扑排序等等|
|graph_tool.util|主要是一些节点和边的查找方法|


## 简单说明

### 图的构建
* graph-tool支持有向图和无向图，默认是无向图，他将节点用一个编号表示，边用开始节点和终结点的编号来表示。节点编号下标从0开始递增，并始终从0开始保持连续。
* 当我们删除一个节点时，实际上是将这个节点与最后一个节点交换索引，然后将总的编号减一。因此当我们迭代删除的时候，要按照节点编号逆序遍历删除。
* graph-tool为方便保存图的信息，采用的是压缩的xml来进行图的持久化存储，用这个格式来保存图还是比较高效的，我们要率先考虑。
* 使用这个库的时候我们尽量不要写循环语句，比如节点度数的统计信息等。因为就和numpy一样，绝大多数需要循环的操作他都提供了并且做了优化，我们需要做的就是找到这个函数。

### PropertyMap对象
这个对象是`graph_tool`封装的一个映射工具，文档在[这里](https://graph-tool.skewed.de/static/doc/graph_tool.html#graph_tool.PropertyMap)，以后经常会用到。他其实是对C++中的Map进行的一个封装，键的类型被限定为了'e','v','g'，而值可以映射为int,float,vector等多种c++类型，用法如下:
```python
import graph_tool.all as gt
g=gt.price_network(200)

prop_v=g.new_vertex_property("int")#创建一个节点到int的映射
#prop_e=g.new_edge_property("int")#创建一个边到int的映射
#prop_g=g.new_graph_property("int")#创建一个图到int的映射

prop_v.a=np.ones(g.num_vertices()) #为prop_v赋值
#print prop_v.a#直接获取映射数组
#print prop_v[2]#按下标取值
#print prop_v.value_type()#值的类型
#print prop_v.key_type()#键的类型
```
我们也可以直接把PropertyMap跟Graph绑定:
```python
g.properties[("e", "foo")] = g.new_edge_property("vector<double>")
g.vertex_properties["foo"] = g.new_vertex_property("double")
g.vertex_properties["bar"] = g.new_vertex_property("python::object")
g.graph_properties["gnat"] = g.new_graph_property("string", "hi there!")
```

## 绘图方法
我的目的是画图，那么我就重点研究了下用来画"图"的函数graph_draw。这个函数必选参数只有一个，但是可选参数却有十几个，我们选几个重要的一一讨论。
下面是函数原型:
```
graph_tool.draw.graph_draw(g, pos=None, vprops=None, eprops=None, vorder=None, eorder=None, nodesfirst=False, output_size=(600, 600), fit_view=True, inline=False, mplfig=None, output=None, fmt='auto', **kwargs)
```
**必备参数**
必备的参数肯定是g，是指我们需要画的Graph对象。

**pos参数**
pos参数是指我们通过一些布局算法计算出来的对于每一个节点的坐标，是一个PropertyMap对象。这个PropertyMap对象其实就是一个映射，每一个节点的下标对应了该节点的x,y坐标。这个对象是通过布局算法生成的就行了。默认情况下我们用的是`sfdp_layout()`方法来生成这一系列坐标。

**vorder,eorder,nodefirst参数**
这些参数控制的是绘图的顺序，主要是考虑了一些点线的覆盖问题。

**output参数**
这个参数指定的是文件的输出文件名和格式，可以根据后缀判断，支持png,svg,pdf,ps四种文件格式。当然也可以用fmt参数直接指定格式。通常情况下png方便显示，但是容易失真。pdf和svg是基于矢量的，放大不失真。
有趣的是如果不指定这个参数，那么他会生成一个可以交互的界面:

![](/images/2017/06/11/1/1.png)
这个界面至少有下面的功能:
* 点击一个节点，左下角会显示这个节点的下标
* 点击一个节点，他会高亮与之相邻的节点
* 我们可以对图片进行放大，缩小，旋转
* 我们可以拖动节点从而改变图的形状
* 对图片进行修改后，在我们关闭界面之后，修改后的布局会被更新到pos参数里

**`vertex_*,edge_*`属性**
这些属性可以指定具体画图的样式，样式表可以参见[文档](https://graph-tool.skewed.de/static/doc/draw.html?highlight=draw#module-graph_tool.draw)，下面用几个例子说明。

```python
import graph_tool.all as gt
import numpy as np
g = gt.price_network(1500)
deg = g.degree_property_map("in")
deg.a = 4 * (np.sqrt(deg.a) * 0.5 + 0.4)
ebet = gt.betweenness(g)[1]
ebet.a /= ebet.a.max() / 10.
eorder = ebet.copy()
eorder.a *= -1
pos = gt.sfdp_layout(g)
gt.graph_draw(g, pos=pos, vertex_size=deg, vertex_fill_color=deg,
    vorder=deg,edge_color=ebet, eorder=eorder, edge_pen_width=ebet,
    output="output.png")
```
这个例子非常简单而且经典，他做了下面的事情：
1. 随机初始化了一个由5000个节点组成的price_network模型
2. 用PropertyMap deg保存所有节点的入度，用于保存节点的权重
3. 对deg的值做了个简单的函数变换
4. 用PropertyMap ebet保存所有边的betweenness中心度，用于保存边的权重
5. 将ebet的值归一化到0-10之间
6. 用PropertyMap eorder对ebet进行拷贝并取反，用于保存绘图顺序
7. 用PropertyMap pos保存sfdp算法生成的图的坐标信息
8. 将节点的大小、颜色用deg控制，将边的粗细、颜色用ebet控制，随后输出成png。

![](/images/2017/06/11/1/2.png)

## 其他布局算法与绘图算法
graphtool提供了至少７种布局算法，非常丰富。同时他也提供了社区分块算法与层级绘图算法，这里就不细说了。

最后链一个简单实验:[Weibo_Data_Analysis](https://github.com/mythsman/Weibo_Data_Analysis/blob/master/README.md)

## 参考资料

[graph-tool installation](https://git.skewed.de/count0/graph-tool/wikis/installation-instructions)
[graph-tool](https://graph-tool.skewed.de)
