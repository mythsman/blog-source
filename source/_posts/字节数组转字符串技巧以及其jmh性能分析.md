---
title: 字节数组转字符串技巧以及其jmh性能分析
id: 1
date: 2018-07-20 22:02:56
category:
 - Java
tags:
 - 性能
 - Java
---
## 前言
前几天在面向 stackoverflow 编程时，遇到了一串有点诡异的代码:
```java
    private String method1(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
        }
        return sb.toString();
    }
```
对java还不是很熟，乍一看还是有点懵逼的，于是就抽了个时间研究了下。

## 分析
这段代码其实只做了一件简单的事，就是将一个字节数组转换成一个十六进制字符串，比如说传入`{1,2,126,127,-1,-2,-127,-128}`，就会输出`01027e7ffffe8180`。这种类似的代码在很多需要进行编码的场景下还是很常见的。

其实正常人在写这种功能的时候是这样写的：
```java
    private String method2(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(String.format("%02x", aByte));
        }
        return sb.toString();
    }
```
这种代码还是比较好理解的，将一个byte转换成两个字节的十六进制字符串，通俗易懂。那method1是如何实现相同的功能的呢，这里有两个难点，理解了就简单了。

1. 为什么要`& 0xff`
2. 为什么要`+ 0x100`并且要`substring(1)`

第一点，是因为java中的byte是有符号的，为了使用`Integer.toString()`转换成16进制，必须要有一个从byte到int的转换。而默认的转换方法会保留符号，比如对于一个负数的byte，转换成int后符号位就提到最前面了，而我们期望的是无符号的转换。因此这里使用了`& 0xff`的方式，隐式的进行了无符号的转换。

第二点，是因为在byte转换为int后，在末8位的部分有可能是以0开头，这样转换成16进制后，生成的字符串长度就会小于2,开头的0就被舍弃了。因此我们通过`+ 0x100`的方式强制生成一个长度为3的字符串，再用`substring(1)`将开头的1舍弃，这样就保证了输出的字符串长度一定是2。

## 比较
原理很简单，我感兴趣的是在 [stackoverflow](https://stackoverflow.com/questions/25838473/what-does-0xff-do-and-md5-structure#answer-25838523) 上搜索的时候看到了高票答案有这样一句话:

```
It's debatable whether all that has better performance (it certainly isn't clearer) than:

sb.append(String.format("%02x", bytes[i]));

```
很有趣，method1是否比method2更快竟然是有争议的，那我为啥要写这种奇怪的代码呢，速度没优势还可读性更差。从哲学上讲如果method2在任何方面都吊打method1，那么method1就没有任何存在的道理了。于是我就闲着蛋疼跑了一波微基准测试（记得在一位大佬的书里看到过这样一句话：任何在做微基准测试之前就对函数执行效率进行评论的行为都是耍流氓）。

## 实验

实验很简单，照着微基准测试的模板敲了（顺便mark下，以后接着用）：

**gradle依赖配置**：
```
compile 'org.openjdk.jmh:jmh-core:1.21'
compile 'org.openjdk.jmh:jmh-generator-annprocess:1.21'
```
如果不加第二个依赖有可能会报错:
```
Unable to find the resource: /META-INF/BenchmarkList
```

**测试代码**:
```java
package com.pinduoduo.tusenpo.test;

import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@BenchmarkMode(Mode.Throughput)
@Warmup(iterations = 5, time = 200, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 10, time = 500, timeUnit = TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
@Threads(1)
@Fork(0)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
public class Test {

    private byte[] bytes;

    @Setup
    public void setUp() {
        bytes = new byte[1024];
        new Random().nextBytes(bytes);
    }

    private String method1(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(Integer.toString((aByte & 0xff) + 0x100, 16).substring(1));
        }
        return sb.toString();
    }

    private String method2(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(String.format("%02x", aByte));
        }
        return sb.toString();
    }

    @Benchmark
    public void method1Test() {
        method1(bytes);
    }

    @Benchmark
    public void method2Test() {
        method2(bytes);
    }

    public static void main(String[] args) throws RunnerException {
        new Runner(new OptionsBuilder().include(Test.class.getSimpleName()).build()).run();
    }
}

```

我这里测量的是函数单线程下的执行效率，比较了经过1秒钟预热以后在5秒钟内填充长度为1024的字节数组的执行次数（由于函数比较简单，这里执行时间短一点没问题）。

**执行结果**:
```
# JMH version: 1.21
# VM version: JDK 1.8.0_171, Java HotSpot(TM) 64-Bit Server VM, 25.171-b11
# VM invoker: D:\programs\java\jre\bin\java.exe
# VM options: -javaagent:D:\programs\IDEA\lib\idea_rt.jar=11241:D:\programs\IDEA\bin -Dfile.encoding=UTF-8
# Warmup: 5 iterations, 200 ms each
# Measurement: 10 iterations, 500 ms each
# Timeout: 10 min per iteration
# Threads: 1 thread, will synchronize iterations
# Benchmark mode: Throughput, ops/time
# Benchmark: com.pinduoduo.tusenpo.test.Test.method1Test

# Run progress: 0.00% complete, ETA 00:00:12
# Fork: N/A, test runs in the host VM
# Warmup Iteration   1: 22.866 ops/ms
# Warmup Iteration   2: 24.230 ops/ms
# Warmup Iteration   3: 28.774 ops/ms
# Warmup Iteration   4: 21.830 ops/ms
# Warmup Iteration   5: 34.136 ops/ms
Iteration   1: 33.400 ops/ms
Iteration   2: 34.004 ops/ms
Iteration   3: 33.689 ops/ms
Iteration   4: 34.109 ops/ms
Iteration   5: 33.567 ops/ms
Iteration   6: 33.985 ops/ms
Iteration   7: 33.615 ops/ms
Iteration   8: 33.877 ops/ms
Iteration   9: 33.622 ops/ms
Iteration  10: 33.973 ops/ms

Result "com.pinduoduo.tusenpo.test.Test.method1Test":
  33.784 ±(99.9%) 0.355 ops/ms [Average]
  (min, avg, max) = (33.400, 33.784, 34.109), stdev = 0.235
  CI (99.9%): [33.429, 34.140] (assumes normal distribution)


# JMH version: 1.21
# VM version: JDK 1.8.0_171, Java HotSpot(TM) 64-Bit Server VM, 25.171-b11
# VM invoker: D:\programs\java\jre\bin\java.exe
# VM options: -javaagent:D:\programs\IDEA\lib\idea_rt.jar=11241:D:\programs\IDEA\bin -Dfile.encoding=UTF-8
# Warmup: 5 iterations, 200 ms each
# Measurement: 10 iterations, 500 ms each
# Timeout: 10 min per iteration
# Threads: 1 thread, will synchronize iterations
# Benchmark mode: Throughput, ops/time
# Benchmark: com.pinduoduo.tusenpo.test.Test.method2Test

# Run progress: 50.00% complete, ETA 00:00:06
# Fork: N/A, test runs in the host VM
# Warmup Iteration   1: 0.775 ops/ms
# Warmup Iteration   2: 1.419 ops/ms
# Warmup Iteration   3: 1.882 ops/ms
# Warmup Iteration   4: 1.905 ops/ms
# Warmup Iteration   5: 1.903 ops/ms
Iteration   1: 1.901 ops/ms
Iteration   2: 1.896 ops/ms
Iteration   3: 1.893 ops/ms
Iteration   4: 1.898 ops/ms
Iteration   5: 1.897 ops/ms
Iteration   6: 1.897 ops/ms
Iteration   7: 1.897 ops/ms
Iteration   8: 1.896 ops/ms
Iteration   9: 1.904 ops/ms
Iteration  10: 1.896 ops/ms

Result "com.pinduoduo.tusenpo.test.Test.method2Test":
  1.897 ±(99.9%) 0.005 ops/ms [Average]
  (min, avg, max) = (1.893, 1.897, 1.904), stdev = 0.003
  CI (99.9%): [1.893, 1.902] (assumes normal distribution)


# Run complete. Total time: 00:00:12

REMEMBER: The numbers below are just data. To gain reusable insights, you need to follow up on
why the numbers are the way they are. Use profilers (see -prof, -lprof), design factorial
experiments, perform baseline and negative tests that provide experimental control, make sure
the benchmarking environment is safe on JVM/OS/HW level, ask for reviews from the domain experts.
Do not assume the numbers tell you what you want them to tell.

Benchmark          Mode  Cnt   Score   Error   Units
Test.method1Test  thrpt   10  33.784 ± 0.355  ops/ms
Test.method2Test  thrpt   10   1.897 ± 0.005  ops/ms
```
很明显，"难读"的方法比"简单"的方法还是快了几十倍的。当然，如果这一块不是性能瓶颈的话，执行一次相差零点几毫秒这点区别还是没啥意义的。


## 参考资料
[stackoverflow](https://stackoverflow.com/questions/25838473/what-does-0xff-do-and-md5-structure#answer-25838523)
[Java使用JMH进行简单的基准测试Benchmark](http://irfen.me/java-jmh-simple-microbenchmark/)

