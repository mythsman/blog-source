---
title: Caffe深度学习框架搭建
id: 1
categories:
  - Machine Learning
date: 2016-02-27 19:53:26
tags:
  - Machine Learning
---

在整理最近学习的知识时，突然意识到机器学习与深度学习的差别。之前学的gd算法，logistic回归算法，svm算法等都属于机器学习的范畴，而深度学习与他们其实是并列的关系，同属机器学习这个大的范畴。个人认为深度学习其实是曾经没落的BP神经网络的发展，可以说神经网络就是趁着深度学习的浪潮借尸还魂的。不过，深度学习想要理解起来也不是那么容易的。既然如此，我们何不搭建一个黑盒环境，先直观感受一下深度学习的魅力再慢慢研究呢？这里我们用到的工具就是Caffe深度学习框架。


## 简介

说道Caffe，我们不得不提他的作者[贾扬清](http://daggerfs.com/)（点击进入个人主页）。没错是一个中国人，而且是一个非常厉害的中国人（我词穷）。话不多说，我们来看看他的CV：

![Yangqing](/images/2016/02/27/1/1.png)![cv](/images/2016/02/27/1/2.png)

只是很少的一部分，不说话，我们用心来感受就可以了。

Caffe其实是他与他的朋友利用课余时间写的一个框架，而且写的时候正逢他写博士毕业论文的时候。这么推来大概是2014年左右完成的。

因此说白了Caffe只是一个普通的小团体的开源项目而已，就连他的官网也是挂靠在berkeleyvision.org上。官网：[http://caffe.berkeleyvision.org/](http://caffe.berkeleyvision.org/)


### 环境搭建

根据惯例，本人还是一切以[官方文档](http://caffe.berkeleyvision.org/installation.html)做参考，搭建在ubuntu14.04系统上。


### 下载

项目托管在github上，见他的[github](https://github.com/BVLC/caffe)即可。


### 依赖

依赖有很多，除了常见的包之外，还要下这些：
```
sudo apt-get install libprotobuf-dev libleveldb-dev libsnappy-dev libopencv-dev libhdf5-serial-dev protobuf-compiler
sudo apt-get install --no-install-recommends libboost-all-dev
sudo apt-get install libgflags-dev libgoogle-glog-dev liblmdb-dev
sudo apt-get install libatlas-base-dev
```
当然，原则上还要有GPU的依赖，但是不用GPU照样可以工作，只是要注意之后的参数设定。

### 编译

和OpenCV一样，这里用cmake编译。

打开项目根目录，依次输入以下指令即可：
```
mkdir build
cd build
cmake ..
make all
make install
make runtest
```
这样就会在build文件加里面生成很多的文件。注意，这些文件不能删的，因为事实上他编译得到的头文件啊、二进制文件啊都在这里，将来使用caffe的时候都要用到。

如果需要安装python接口的话还要输入`make pycaffe`，而且还需要下载python的依赖。在项目根目录下，输入：
```
cd ./build/install/python/
for req in $(cat requirements.txt); do sudo pip install $req; done
```
就是要满足这个文件里的所有依赖(除此之外还有一个skimage.so需要下载i)。但是，由于国内的pip镜像普遍不全，如果不翻墙，总有一些包下不下来。因此，我手动打开requirements.txt，查看具体需要的包，然后通过`$sudo apt-get install python-*****`的办法下载某些无法下载的包。

如果完全下载好了，那么在项目中进入./python目录中打开ipython，就能import caffe 了。当然，为了方便，我们可以把caffe文件夹（caffe模块的位置）复制到`/usr/lib/python2.7/dist-packages` 目录下，这样就可以在任意的地方调用了。


### 运行测试

事实上在编译阶段就进行了测试，只是这样并没有具体的感悟，下面就结合mnist来简单测试下。

在项目根目录下输入：
```
./data/mnist/get_mnist.sh
./examples/mnist/create_mnist.sh
```
表示下载mnist训练集，并转换为指定格式。

然后需要打开`./examples/mnist/lenet_solver.prototxt` 文件，并将最后一行的GPU改成CPU。(毕竟之前没有装GPU，果断是不支持的)。

最后就可以跑训练程序了。
```
./examples/mnist/train_lenet.sh
```
得到结果：
```
......
I0227 16:58:31.228276  5528 solver.cpp:228] Iteration 9800, loss = 0.0148246
I0227 16:58:31.228313  5528 solver.cpp:244]     Train net output #0: loss = 0.0148246 (* 1 = 0.0148246 loss)
I0227 16:58:31.228335  5528 sgd_solver.cpp:106] Iteration 9800, lr = 0.00599102
I0227 16:58:37.839028  5528 solver.cpp:228] Iteration 9900, loss = 0.00598603
I0227 16:58:37.839066  5528 solver.cpp:244]     Train net output #0: loss = 0.00598603 (* 1 = 0.00598603 loss)
I0227 16:58:37.839088  5528 sgd_solver.cpp:106] Iteration 9900, lr = 0.00596843
I0227 16:58:44.390777  5528 solver.cpp:454] Snapshotting to binary proto file examples/mnist/lenet_iter_10000.caffemodel
I0227 16:58:44.395431  5528 sgd_solver.cpp:273] Snapshotting solver state to binary proto file examples/mnist/lenet_iter_10000.solverstate
I0227 16:58:44.425786  5528 solver.cpp:317] Iteration 10000, loss = 0.00296525
I0227 16:58:44.425813  5528 solver.cpp:337] Iteration 10000, Testing net (#0)
I0227 16:58:48.531802  5528 solver.cpp:404]     Test net output #0: accuracy = 0.9909
I0227 16:58:48.531833  5528 solver.cpp:404]     Test net output #1: loss = 0.0281938 (* 1 = 0.0281938 loss)
I0227 16:58:48.531841  5528 solver.cpp:322] Optimization Done.
I0227 16:58:48.531859  5528 caffe.cpp:222] Optimization Done.
```
最后可以发现拟合的准确率为99.09%。

至于每一个命令文件到底是做了什么可以直接打开看看。
