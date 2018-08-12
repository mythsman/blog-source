---
title: 从一个诡异的问题看JVM动态反优化
id: 1
date: 2018-08-11 15:36:27
category:
 - Java
tags:
 - Java
---

## 前言

前一段时间在做代码性能比较的时候用到了jmh这个工具，原本以为拥有了这个方便的工具就能hold住java微基准测试这个命题。但是事实上，用着用着就发现自己的理解还非常不深入，有很多在测试的时候难以解释的现象。于是查阅了相关资料，才发现这里面的水比我想象要深，趁着记忆还热乎，赶紧记录一下。

## 动态编译VS静态编译

java作为一种动态编译语言与c/c++这种静态编译语言有本质的不同。静态编译语言是在编译时就已经对代码做好了编译优化(比如C/C++在编译时指定-O1 -O2 -O3参数)，得到的程序能够直接被计算机忠实地执行。而java这种动态编译语言在编译时几乎不会做什么优化，而是等到运行在虚拟机中时，动态的进行优化。

动态优化有好处有坏处，好处就在于他可以根据程序实时的运行状况，忽略掉那些事实上没有被执行的代码的影响，最大化的优化那些被多次执行的代码（这也是jvm有“预热”这一说法的原因）；但是，缺点也在于，随着程序的运行，程序运行的环境会发生变化，如果继续保留之前动态优化的代码则会无法起作用甚至可能会出现错误，此时就需要卸载之前做的优化，这就是**“动态反优化（Dynamic Deoptimization）”**。

显然，我们并不希望jvm经常进行动态反优化，但是其实正常情况下，相比于程序逻辑的执行时间，这点反优化造成影响还是微不足道的。相比于他带来的问题，我们往往更加享受他带来的便利，因此大部分情况我们也无需太在意这些细节。但是当我们分析问题的粒度逐渐变小时、尤其是在做微基准测试时，就需要做到对这类问题心中有数了，否则就可能贻笑大方。


## 诡异的问题

说的可能有点玄乎，举一个简单的例子，比如下面这样一段微基准测试代码：
```java
package com.pinduoduo.tusenpo.test;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.Throughput)
@Warmup(iterations = 5, time = 200, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 5, time = 200, timeUnit = TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
@Threads(4)
@Fork(0)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
public class Test {

    private interface Operator {
        int operate(int d);
    }

    private class Method1 implements Operator {
        public int operate(int d) {
            return d + 1;
        }
    }

    private class Method2 implements Operator {
        public int operate(int d) {
            return d + 1;
        }
    }

    private void callMillionTimes(Operator op) {
        int d = 0;
        for (int i = 1; i < 1000000; i++)
            d = op.operate(d);
    }

    @Benchmark
    public void test_1_Method1() {
        callMillionTimes(new Method1());
    }

    @Benchmark
    public void test_2_Method2() {
        callMillionTimes(new Method2());
    }

    @Benchmark
    public void test_3_Empty() {
    }

    @Benchmark
    public void test_4_Method1Again() {
        callMillionTimes(new Method1());
    }

    @Benchmark
    public void test_5_NaiveLoop() {
        int d = 0;
        for (int i = 1; i < 1000000; i++)
            d = d + 1;
    }


    public static void main(String[] args) throws RunnerException, InterruptedException {
        new Runner(new OptionsBuilder().include(Test.class.getSimpleName()).build()).run();
    }
}
```
这段代码中我们定义了一个父类Operator和他的两个子类Method1、Method2，这两个类的实现**完全相同**，相当于一个自增操作。同时测试了五个方法：

1. test_1_Method1，将Method1的方法执行一百万次。
2. test_2_Method2，将Method2的方法执行一百万次。
3. test_3_Empty，这其实是一个空方法。
4. test_4_Method1Again，与test_1_Method1完全一样。
5. test_5_NaiveLoop，这个方法体现的是Method1和Method2的“本质”。

考虑到在jmh中，以@Benchmark注解的方法是按照方法名的字典序顺序依次执行的，而且我采用的是@Fork(0)注解，因此上述函数的排序就是该函数的执行顺序，且执行的环境是同一个。

理论上讲，上面四个函数的执行速度应该是`1≈2≈4≈5<<3`，但是这段代码跑起来的结果乍一看却让人大吃一惊：

```
Benchmark                  Mode  Cnt         Score        Error   Units
Test.test_1_Method1       thrpt    5  15098760.275 ±  71855.243  ops/ms
Test.test_2_Method2       thrpt    5       178.431 ±   1500.989  ops/ms
Test.test_3_Empty         thrpt    5  15031249.707 ± 428833.911  ops/ms
Test.test_4_Method1Again  thrpt    5        14.213 ±      0.046  ops/ms
Test.test_5_NaiveLoop     thrpt    5  15109072.590 ±  47893.576  ops/ms
```

最终的执行结果竟然是`1≈3≈5>>2≈4`，乍一看是相当令人不可思议。幸亏这里比较的方法比较简单，从而可以很容易让人归谬。如果这几个不一样的方法，那么人们就很容易做出一些自以为是的愚蠢的判断了。

## 问题分析

事实上，由于待测试的函数运行时间相对比较短，因此动态编译对函数的影响就非常的大。而随着JVM的日趋强大，动态编译本身就是一个十分复杂的系统，各种策略与运行状态会互相影响，因此想要真正完全掌握代码的执行状态其实是很困难的事。想要真正了解代码的运行状态，原则上是要在运行时加入`-XX:+PrintCompilation -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining"`这些编译参数。这些参数表示打印出编译信息、解锁隐藏参数以及打印内联信息。事实上，很多编译优化基本都是通过内联来实现的，因此打印内联信息能让我们很好的研究编译优化的情况。

当然，学会读这些结果还是比较有难度的，我也只是大概理解他的含义。不过其实如果了解java编译优化的基本原理，这个问题还是不难解释的。

回归上面的问题，仔细分析一下，上面的这段诡异的代码其实有如下几个疑点：
1. 为什么test_1_Method1和test_2_Method2的逻辑完全相同，但是执行时间却有天壤之别。
2. 为什么test_1_Method1的执行时间竟然和空的test_3_Empty一样。
3. 为什么test_1_Method1和test_4_Method1Again的代码完全一样，但是执行时间却仍然不一样。

不过仔细分析一下，其实可以根据上面的情况分析出三点：
1. 从test_1,test_3,test_5的执行时间几乎相等可以推断出，这里的test_1和test_5其实并没有得到真正的执行，毕竟"10^7 ops/ms"的执行速度都超过了计算机的主频，况且函数体还是一个一百万的循环。
2. 根据常理推断，test_2,test_4的执行速度应该是百万级的运算量理论上的运行速度。
3. test_1与test_2、test_4的区别在于，test_1是第一次实例化Operator，而test_2,test_4则不是。

那么显然，test_1,test_5在运行的时候一定是受到了JVM的动态优化，而test_2,test_4在执行的时候则受到了动态反优化，回归了正常而无用的计算。这里主要用到了两种优化逻辑。

### 单形调用变换
我们知道，jvm支持多态，这个性质可以很方便的帮我们对复杂并具有关联的事物进行抽象建模。但是代价就是，当用父类的引用去调用子类的方法时，会多一次查虚拟表的操作，同时也不利于进行代码的内联(Inline)优化。而内联优化基本可以说是jvm优化的最重要的形式。因此在这种情况下，很多优化措施都无法生效。但是，jvm非常聪明，当他发现最近的代码块中某一个父类只有一个子类的实例时，他就很机智的将这个父类的方法与这个子类的方法进行绑定，使得调用子类的方法变得更快；同时当子类的方法比较简单时，甚至会将子类的方法进行内联。这就是JVM动态优化的一种，叫单形调用变换（monomorphic）。

### 无用代码移除
无用代码移除的优化相比上面的优化更好理解，也就是JVM会判断，某些值在进行运算时如果没有对环境造成除其本身外的任何影响，那么JVM在执行时就有可能将这个值的运算直接移除。

有了这两个知识，基本就可以解释上面这个问题了。

首先，在test_5中，这样的简单循环计算出来的d其实没有任何用处，因此JVM就直接优化掉了，这个test_5也就直接被优化成了test_3。

然后，在test_1中，由于存在单形调用变换，operate方法被直接内联成了`d+1`，因此test_1也就直接被优化成了test_5，从而最终被优化成了test_3。

最后，在test_2和test_4中，由于环境中存在着Operator类的不同实例，因此单形调用变换失效，内联代码被重新动态反优化成了函数调用。而在函数调用中，当读到`d=op.operate(d)`这个方法无法时，jvm无法直接判断出d是否对op这个对象造成影响，因此也就无法将d直接优化掉，从而导致了程序完完整整的跑完了一百万次循环。

## 启示

这个例子告诉我们，对java进行微基准测试与对c/c++进行微基准测试是不一样的。JVM会有很多复杂的逻辑，我们要对代码**心存敬畏**。

那么，有什么方法能够让我们尽量避免编译优化与编译反优化对我们的基准测试的影响呢？其实我们能做的也很有限，我们不能指定JVM去优化某段代码或者让他不去优化某段代码，我们只能尽量保证让JVM以**同样**的优化逻辑去优化我们希望比较的那些函数，从而尽量避免动态优化对我们结论的影响。

### 充分的预热
同样是上面的那段代码，如果我们将预热和执行的运行时间充分扩大（比如扩大十倍），那么我们就会得到完全不一样的运行结果：

**调整参数**：
```java
@Warmup(iterations = 5, time = 2000, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 5, time = 2000, timeUnit = TimeUnit.MILLISECONDS)
@Fork(0)
```

**运行结果**：
```
Benchmark                  Mode  Cnt         Score          Error   Units
Test.test_1_Method1       thrpt    5  14686856.275 ±  2661991.738  ops/ms
Test.test_2_Method2       thrpt    5  12162409.605 ± 24908442.187  ops/ms
Test.test_3_Empty         thrpt    5  15019642.291 ±   288132.800  ops/ms
Test.test_4_Method1Again  thrpt    5  15002946.149 ±   221140.844  ops/ms
Test.test_5_NaiveLoop     thrpt    5  14978329.847 ±   464391.640  ops/ms
```
你会发现，经过充分的预热，所有的代码都得到了优化。

### 隔离环境
同样是上面的那段代码，如果我们将不同测试时的环境(profiler)进行隔离，我们也会得到完全优化后的结果：

**调整参数**
这里使用给@Fork注解赋一个非零值来给新的函数创造新的执行环境。
```java
@Warmup(iterations = 5, time = 200, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 5, time = 200, timeUnit = TimeUnit.MILLISECONDS)
@Fork(1)
```

**运行结果**
```
Benchmark                  Mode  Cnt         Score        Error   Units
Test.test_1_Method1       thrpt    5  15063249.605 ±  86686.469  ops/ms
Test.test_2_Method2       thrpt    5  15059995.145 ± 170559.955  ops/ms
Test.test_3_Empty         thrpt    5  15083788.370 ± 109821.284  ops/ms
Test.test_4_Method1Again  thrpt    5  15108390.906 ±  77092.684  ops/ms
Test.test_5_NaiveLoop     thrpt    5  15048447.746 ± 458691.436  ops/ms
```

## 总结
其实根据**观察者效应**或者是广义的**测不准原理**，对代码进行微基准测试本身就会对代码造成影响，正如下面这句话所说：
> Once you measure a system's performance ,you change the system.

总而言之，学会对代码保持敬畏，技术和技术带来的现象永远只是表象，要学会脱离技术思考本质，提高自己的思维。毕竟，在IT界还有这样一句话：
> A fool with a tool is still a fool.

共勉。

## 参考资料

[Java 理论与实践-动态编译与性能测量](https://www.ibm.com/developerworks/cn/java/j-jtp12214/index.html)
[An introduction to JVM performance](https://www.slideshare.net/RafaelWinterhalter/an-introduction-to-jvm-performance)
[JVM Mechanics: When Does the JVM JIT & Deoptimize?](https://www.slideshare.net/dougqh/jvm-mechanics-when-does-the)
[What is the purpose of JMH @Fork?](https://stackoverflow.com/questions/35046745/what-is-the-purpose-of-jmh-fork)
[How do I write a correct micro-benchmark in Java?](https://stackoverflow.com/questions/504103/how-do-i-write-a-correct-micro-benchmark-in-java/)
