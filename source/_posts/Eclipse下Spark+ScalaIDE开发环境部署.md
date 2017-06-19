---
title: Eclipse下Spark+ScalaIDE开发环境部署
id: 1
categories:
  - Java
date: 2017-01-16 19:58:25
tags:
  - Java
  - Linux
---

刚开始学Spark，之前一直都是在服务器里用Spark-shell进行简单学习的，后来觉得这样实在是很不方便，于是就决定利用Eclipse ide来进行开发，不过这当中遇到了很多问题，搞了半天总算搞得差不多了，下面就记录下环境搭建的步骤方便重新配置。

## 当前环境

在配置eclipse的开发环境前，我已经在服务器中配置好了hadoop+scala+spark的环境：

*   hadoop 2.7.2
*   spark 1.6.2
*   scala 2.10.4
*   jdk1.7
*   Linux系统
由于服务器本身性能强劲，我采用Standerdalone模式，没有slave。

同时，本机也配置了同样的hadoop、spark、scala的环境（一方面是方便本机测试，另一方面是提供必要的jar包）。

## 下载配置Eclipse+Scala

eclipse本身不支持scala语言，但是有一款很不错的插件Scala-IDE，利用这个插件，eclipse就能很好的支持scala语言的开发了。

Scala-IDE官网在[这里](http://scala-ide.org/)，这个社区现在还很活跃，一直在更新产品，不过这也导致了我们在下载配置的时候要十分注意版本选择：

*   保证Scala-ide插件与本地的Scala版本一致，这一点不用多说，但是一定不要抱着"版本落后一点也没事"的侥幸心理。
*   保证Scala-ide插件与eclipse的版本要匹配，否则就会造成一堆错误。因此我们通常不要先急着下eclipse，而是要先根据自身的scala版本选择好Scala-ide版本，再根据Scala-ide版本选择eclipse版本。
*   如果主页上找不到历史版本的Scala-ide，去[这里](http://scala-ide.org/download/prev-stable.html)找。
较新版本的Scala-ide可能会集成好对应的eclipse，不过如果版本较老则很可能需要自己下载eclipse。

对于eclipse而言没有过多要求，由于我们用Scala语言开发，因此不需要附带其他的东西。然后在eclipse->help->install new software中加上Scala-ide插件的地址就会弹出一些可以下载的内容。选择下面的两个组件即可：

*   Scala IDE for Eclipse
*   Scala IDE for Eclipse dev support
下载好后他会提示重启、更新之类的操作，照做就好。

最后我们打开eclipse->window->open perspective->other对话框，选择Scala视图，即完成了eclipse+scala ide 的基本配置。

![](/images/2017/01/16/1/1.png)

做到这一步，基本就能够编写普通的Scala程序了，比如：
```scala
object Test {
  def main(args: Array[String]) {
    println("Hello world")
  }
}
```

## 运行Spark

说白了Spark其实也算作Scala程序，因此和普通Scala程序配置方法没有太多不同，不过一定要确保需要的jar包都有，否则就会出一堆的ClassNotFound的错。

Spark需要的jar包基本上至少要有两部分：

第一部分就是$SPARK_HOME下的lib文件夹中的包。这一部分很容易理解。

第二部分就是对应的hadoop的包，这一部分很容易被忽略，而且hadoop的包比较分散，加起来还比较麻烦。我是在配置好hadoop之后，输入hadoop classpath，来查看hadoop需要的jar包，然后把这些jar包加入项目的build path里。

配置好后理论上就可以写spark程序了。不过对于不同的开发方式，实际用的时候也有区别。如果是用本机配置的spark，那么在开启spark服务后，下面的程序就可以直接run as scala application了：
```scala
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import scala.math.random

object Test {
  def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("Spark Pi").setMaster("local")
    val spark = new SparkContext(conf)
    val slices = 2
    val n = 1000000 * slices
    val count = spark.parallelize(1 to n, slices).map { i =>
      val x = random * 2 - 1
      val y = random * 2 - 1
      if (x * x + y * y < 1) 1 else 0
    }.reduce(_ + _)
    println("Pi is roughly " + 4.0 * count / n)
    spark.stop()
  }
}
```
在伴随着一堆log的输出中，我们就可以看到输出的结果。

但是，如果我们想直接用远程的服务器中的spark服务来运行的话，仅仅修改setMaster的值则会报"主类找不到"之类的错误，这是因为我们还得把jar包发给远程的服务器，这样他才能找到代码。我们只需要将项目导出为一个jar包，然后将代码修改如下：
```scala
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import scala.math.random

object Test {
  def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("Spark Pi").setMaster("spark://ada:7077").setJars(List("/home/myths/Desktop/scala/Test/jar/Test.jar"))
    val spark = new SparkContext(conf)
    val slices = 2
    val n = 1000000 * slices
    val count = spark.parallelize(1 to n, slices).map { i =>
      val x = random * 2 - 1
      val y = random * 2 - 1
      if (x * x + y * y < 1) 1 else 0
    }.reduce(_ + _)
    println("Pi is roughly " + 4.0 * count / n)
    spark.stop()
  }
}
```
setMaster里的是服务器的地址，以及默认接受远程服务的7077端口，然后再在setJars里添加本地导出的jar包的地址。这样基本就能正常的运行spark程序了。