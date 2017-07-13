---
title: 写给大忙人的JavaSE8书后习题简析-第二章
id: 1
date: 2017-07-11 22:51:42
category:
 - Java
tags:
 - Java
---
# Stream API
## 第一题
> 编写一个第2.1节中的for循环的并行版本。获取处理器的数量，创造出多个独立的线程，每个都只处理列表的一个片段，然后将他们各自的结果汇总起来。（我们不希望这些线程都更新一个计数器，为什么？）

还是有点麻烦的，线程得传值，得获取运行结果，相比流式计算麻烦太多了。这里为了平均给每个线程分配任务，我们得手动将资源进行拆分，有的是将数据List平均分，我这里是通过取模的结果来进行分配。
我们当然不希望这些线程都更新一个计数器，因为累加的操作不是原子操作，我们得加锁，这样不仅麻烦容易出错，而且效率也低。
附我的代码如下：
```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class Task1 {
    public final int CORES = Runtime.getRuntime().availableProcessors();

    class MyThread extends Thread {
        int id;
        int[] result;
        List<String> words;

        public MyThread(int id, List<String> words, int[] result) {
            this.words = words;
            this.result = result;
            this.id = id;
        }

        @Override
        public void run() {
            int count = 0;
            for (int i = 0; i < words.size() / CORES; i++) {
                if ((i * CORES + id) < words.size() && words.get(i * CORES + id).length() > 12)
                    count++;
            }
            result[id] = count;
        }
    }

    public void task1() throws IOException, InterruptedException {
        String contents = new String(Files.readAllBytes(Paths.get("article.txt")), StandardCharsets.UTF_8);
        List<String> words = Arrays.asList(contents.split("[\\P{L}]+"));
        int[] result = new int[CORES];
        Thread[] threads = new Thread[CORES];
        for (int i = 0; i < CORES; i++) {
            threads[i] = new Thread(new MyThread(i, words, result));
            threads[i].start();
        }
        for (int i = 0; i < CORES; i++) {
            threads[i].join();
        }
        int total = 0;
        for (int i = 0; i < CORES; i++)
            total += result[i];
        System.out.println(total);
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        new Task1().task1();
    }
}
```

## 第二题
> 请想办法验证一下，对于获得前五个最长单词的代码，一旦找到第五个最长的单词后，就不会再调用filter方法了。（一个简单的方法是记录每次的方法调用）

这题主要验证流式计算跟循环的一个很明显的区别，流式计算对于每一个流元素是直接运算到结束，而循环则是一层一层的计算。(姑且这么理解)
```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class Task2 {

    public void task2() throws IOException {
        String contents = new String(Files.readAllBytes(Paths.get("article.txt")), StandardCharsets.UTF_8);
        Stream<String> words = Stream.of(contents.split("[\\P{L}]+"));

        Stream<String> result = words.filter((word) -> {
            if (word.length() > 12) {
                System.out.println("bingo");
                return true;
            } else
                return false;
        }).limit(5);
        System.out.println(result.count());
    }

    public static void main(String[] args) throws IOException {
        new Task2().task2();
    }
}
```
输出结果：
```
bingo
bingo
bingo
bingo
bingo
5
```
## 第三题
> 要统计长单词的数量，使用parallelStream与使用stream有什么区别？请具体测试一下。你可以在调用方法之前和之后调用System.nanoTime，并打印出他们之间的区别。如果你有速度较快的计算机，可以试着处理一个较大的文档（例如战争与和平的英文原著）。

验证串行流跟并行流的效率，实验证明并行流还是比串行流快好多的。我本机cpu是E5-2690v2，数据集也不算大，但是跑起来效率差别还是不小的。代码如下：
```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class Task3 {
    public void task3() throws IOException {
        String contents = new String(Files.readAllBytes(Paths.get("article.txt")), StandardCharsets.UTF_8);
        Stream<String> words1 = Stream.of(contents.split("[\\P{L}]+"));
        long singleStart = System.nanoTime();
        long count1 = words1.filter((word) -> word.length() > 12).count();
        long singleEnd = System.nanoTime();

        Stream<String> words2 = Stream.of(contents.split("[\\P{L}]+"));
        long parrStart = System.nanoTime();
        long count2 = words2.parallel().filter((word) -> word.length() > 12).count();
        long parrEnd = System.nanoTime();

        System.out.println(String.format("count1 = %d in %d ms.", count1, (singleEnd - singleStart) / 1000000));
        System.out.println(String.format("count2 = %d in %d ms.", count2, (parrEnd - parrStart) / 1000000));

    }

    public static void main(String[] args) throws IOException {
        new Task3().task3();
    }
}
```
我的运行结果是：
```
count1 = 48 in 93 ms.
count2 = 48 in 7 ms.
```
我这里并行流的速度接近串行流的十倍。。。

## 第四题
> 假设你有一个数组int[] values={1,4,9,16}。那么Stream.of(values)的结果是什么？你如何获得一个int类型的流。

他返回的是一个引用对象的流，这个引用对象既不是int(int不是引用)，也不是Integer。。。我们只能用`Stream<Object>`来接收他。。。事实上Java8提供了的IntStream来专门处理int类型的流。。。
```java
import java.io.IOException;
import java.util.stream.IntStream;

public class Task4 {
    public void task4() throws IOException {
        int[] values = {1, 4, 9, 16};
        IntStream intStream = IntStream.of(values);
        intStream.forEach(System.out::println);
    }

    public static void main(String[] args) throws IOException {
        new Task4().task4();
    }
}
```


## 第五题
> 使用Stream.iterate来得到一个包含随机数字的无限流－不许调用Math.Random，只能直接实现一个线性同余生成器(LCG)。在这个生成器中，你可以从$x\_0=seed$开始，然后根据合适的a,c和m值产生$x\_{n+1}=(ax\_n+c)%m$。你应该实现一个含有参数a,c,m和seed的方法，并返回一个`Stream<Long>`对象。可以试一下a=25214903917,c=11,m=$2^{48}$

巩固Stream.iterate的用法。
```java
import java.util.stream.Stream;

public class Task5 {
    public Stream<Long> lcgStream(long a, long c, long m, long seed) {
        return Stream.iterate(seed, v -> (a * v + c) % m);
    }

    public void task5() {
        lcgStream(25214903917L, 11, 1L << 48, System.currentTimeMillis()).limit(5).forEach(System.out::println);
    }

    public static void main(String[] args) {
        new Task5().task5();
    }
}

```

## 第六题
> 第2.3节中的characterStream方法不是很好用，他需要先填充一个数组列表，然后再转变为一个流。试着编写一行基于流的代码。一个办法是构造一个从0开始到s.length()-1的整数流，然后使用s::charAt方法引用来映射它。

考察IntSteam的用法，以及IntStream可以利用mapToObj来转换成其他类型的流。
```java
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Task6 {

    public Stream<Character> characterStream(String s) {
        return IntStream.range(0, s.length()).mapToObj(s::charAt);
    }

    public void task6() {
        characterStream("1234567").forEach(System.out::print);
    }

    public static void main(String[] args) {

        new Task6().task6();
    }
}

```
输出：
```
1234567
```

## 第七题
> 假设你的老板让你编写一个方法`public static<T> boolean isFinite(Stream<T> stream)`。为什么这不是一个好主意？不管怎样，先试着写一写。

额，这个问题有点好玩，判断一个流是不是无限流，应该跟判断一个循环是不是死循环差不多等价啊。。。这个问题就有点复杂了，我也没时间研究。不过我也尝试了一些方法。
首先，我试了试最普通的collect,count,reduce这些聚合方法。不过显然我只能得到一个死循环。。。接着我去网上找了半天，总算找到一个看似靠谱的答案，(来自[coderanch.co](https://coderanch.com/t/657377/java/Detecting-infinite-Stream))：
```java
    public static <T> boolean isFinite(Stream<T> stream) {
        System.out.println(Stream.of(1).spliterator().estimateSize());
        System.out.println(stream.spliterator().estimateSize());
        System.out.println(Long.MAX_VALUE);
        return false;

    }

    public void task7() {
        isFinite(Stream.iterate(1, x -> x));
    }
```
这段代码输出：
```
1
9223372036854775807
9223372036854775807
```
也就是说，对于有限流，他能返回流的长度，对于无限流，他能返回Long类型的MAX_VALUE。他通过spliterator的estimateSize方法，做到了能够估计一段流长度。
看似也能算是一个变通。
但是，且不说当一个有限流的长度大于MAX_VALUE会怎么样，事实上这段代码也是有硬伤的，比如下面的代码:
```java
System.out.println(Stream.of(1,2,3).limit(1).spliterator().estimateSize());
System.out.println(Stream.iterate(1, x -> x).limit(1).spliterator().estimateSize());
```
他们的返回结果并不是我们想象的`1 1`而是`3 9223372036854775807`。。。显然这个方法也不能准确的保证流的长度。。。看上去好像是因为spliterator处理的对象是没有考虑limit的。。。
从本质上讲，无限流其实就是一个迭代器，除非我们能判断迭代器是有终点的，否则我们是无法判断这个流是不是有限流。具体原因可以参照下面一题的解法。

难怪作者大佬说这不是一个Good idea。。。


## 第八题
> 编写一个方法`public static <T> Stream<T> zip(Stream<T> first,Stream<T> second)`,依次调换流first和second中元素的位置，直到其中一个流结束为止。

这道题又是翻译的锅，所谓的“调换”意思其实是交替获取。。。看来再看翻译书的时候还是要注意身边放一个原文的。。。
虽然意思清楚了，但是这道题要真正写的好还是很有难度的，主要的坑点在于如何处理无限流的情况。因此我们不能将流读取到list等容器，只能以迭代器的方式进行操作。而且我们在使用普通的转换函数的时候也是不太方便终止当前流的。所以这就需要用到一些平常比较少用的工具类了。
这种zip操作可以帮我们更好的理解流的本质。我们可以看到，将两个无限流进行zip的函数竟然是可以直接返回的，这就说明这个运算一定是lazy的，即只有当取道这个流的时候才会去进行获取下一个值，而这就是迭代器的特征。
参考了[stackOverflow](https://stackoverflow.com/questions/17640754/zipping-streams-using-jdk8-with-lambda-java-util-stream-streams-zip)的代码，我的zip代码该代码如下：

```java
import java.util.Iterator;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class Task8 {

    public static <T> Stream<T> zip(Stream<T> first, Stream<T> second) {
        Iterator<T> firstIterator = first.iterator();
        Iterator<T> secondIterator = second.iterator();
        Iterator<T> iterator = new Iterator<T>() {
            private boolean first = false;

            @Override
            public boolean hasNext() {
                first = !first;
                return first ? firstIterator.hasNext() : secondIterator.hasNext();
            }

            @Override
            public T next() {
                return first ? firstIterator.next() : secondIterator.next();
            }
        };
        Iterable<T> iterable = () -> iterator;
        boolean parallel = first.isParallel() || second.isParallel();
        return StreamSupport.stream(iterable.spliterator(), parallel);
    }

    public void task8() {
        Stream<Integer> stream1 = zip(Stream.of(1, 3, 5), Stream.of(2, 4, 6, 8, 10));
        stream1.forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();

        Stream<Integer> stream2 = zip(Stream.iterate(1, x -> x * 2), Stream.of(2, 4, 6, 8, 10));
        stream2.forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();


        Stream<Integer> stream3 = zip(Stream.iterate(1, x -> x * 2), Stream.iterate(1, x -> x * 3)).limit(10);
        stream3.forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();

    }

    public static void main(String[] args) {
        new Task8().task8();
    }

}
```
输出结果如下：
```java
1 2 3 4 5 6
1 2 2 4 4 6 8 8 16 10 32
1 1 2 3 4 9 8 27 16 81
```
可以看到这个函数是可以支持有限流和无限流的。


## 第九题
> 将一个`Stream<ArrayList<T>>`中的全部元素连接为一个ArrayList<T>。试着用三种不同的聚合方式来实现。

这道题就是总结reduce的三种用法，注意每种用法的用途和特点。
```java
import java.util.ArrayList;
import java.util.stream.Stream;

public class Task9 {


    public <T> ArrayList<T> join1(Stream<ArrayList<T>> stream) {
        return stream.reduce((a1, a2) -> {
            a1.addAll(a2);
            return a1;
        }).orElse(new ArrayList<T>());
    }

    public <T> ArrayList<T> join2(Stream<ArrayList<T>> stream) {
        return stream.reduce(new ArrayList<>(), (x, y) -> {
            x.addAll(y);
            return x;
        });
    }

    public <T> ArrayList<T> join3(Stream<ArrayList<T>> stream) {
        return stream.reduce(new ArrayList<>(),
                (result, added) -> {
                    result.addAll(added);
                    return result;
                },
                (result1, result2) -> {
                    result1.addAll(result2);
                    return result1;
                });
    }

    public Stream<ArrayList<Integer>> initStream() {
        ArrayList<Integer> list1 = new ArrayList<>();
        list1.add(0, 2);
        list1.add(1, 3);
        ArrayList<Integer> list2 = new ArrayList<>();
        list2.add(0, 4);

        return Stream.of(list1, list2);
    }

    public void task9() {


        join1(initStream()).forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();

        join2(initStream()).forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();

        join3(initStream()).forEach(x -> System.out.print(String.format("%d ", x)));
        System.out.println();
    }

    public static void main(String[] args) {
        new Task9().task9();
    }

}
```

## 第十题
> 编写一个可以用于计算`Stream<Double>`平均值的聚合方法。为什么不能直接计算出总和再除以count()？

暂且没有找到更加方便的利用聚合函数进行计算的方法，因为不太方便处理这个count。当然，直接转化成数组来处理就不再考虑中吧。
显然不能直接计算count，因为这就会导致流的终止，无法继续下面的计算了。除非完全拷贝这个流，但是这样效率就特别低了。。。
比较中庸的办法是创建一个对象，让他记录这个count信息：
```java
import java.util.stream.Stream;

public class Task10 {

    class Item {
        private int count;
        private double sum;

        public Item() {
            count = 0;
            sum = 0;
        }

        public Item add(double num) {
            count++;
            sum += num;
            return this;
        }

        public Item add(Item num) {
            count += num.count;
            sum += num.sum;
            return this;
        }

        public double getAverage() {
            return sum / count;
        }
    }

    public Double mean(Stream<Double> stream) {
        return stream.reduce(new Item(), Item::add, Item::add).getAverage();
    }

    public void task10() {
        Stream<Double> doubleStream = Stream.of(1.2, 2.3, 3.4, 4.5, 5.6);
        System.out.println(mean(doubleStream));//3.4
    }

    public static void main(String[] args) {
        new Task10().task10();
    }

}
```
但是这样的代码有点冗长，我们其实可以引入一个原子类来记录这个count：
```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class Task10 {

    public Double mean1(Stream<Double> stream) {
        AtomicInteger count = new AtomicInteger(0);
        return stream.reduce(0., (total, num) -> {
            int now = count.incrementAndGet();
            return (total * (now - 1) + num) / now;
        });

    }

    public Double mean2(Stream<Double> stream) {
        AtomicInteger count = new AtomicInteger(0);
        return stream.reduce(0., (total, num) -> {
            count.incrementAndGet();
            return total + num;
        }) / count.doubleValue();

    }

    public void task10() {
        System.out.println(mean2(Stream.of(1.2, 2.3, 3.4, 4.5, 5.6)));
        System.out.println(mean2(Stream.of(1.2, 2.3, 3.4, 4.5, 5.6)));
    }

    public static void main(String[] args) {
        new Task10().task10();
    }

}
```
我们这里用了两种方法，原则上都可以，只是方法一更加适合比较长的流，数字不容易溢出，方法二速度更快一点。

## 第十一题
> 我们应该可以将流的结果并发收集到一个`ArrayList`中，而不是将多个`ArrayList`合并起来。由于对集合不相交部分的并发操作是线程安全的，所以我们假设这个`ArrayList`的初始大小即为流的大小。如何能做到这一点？

这题没怎么看懂，好像就是考察原子类。。。
```java
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class Task11 {

    public void task11() throws IOException {
        Stream<String> stream = Stream.of("1", "2", "3", "4", "5");
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            list.add("");
        }

        AtomicInteger atomic = new AtomicInteger();
        stream.parallel().forEach(x -> {
            list.set(atomic.getAndIncrement(), x);
        });
        list.forEach(System.out::println);
    }

    public static void main(String[] args) throws IOException {
        new Task11().task11();
    }
}
```

## 第十二题
> 如第2.13节所示，通过更新一个`AtomicInteger`数组来计算一个并行`Stream<String>`宏的所有短单词。使用原子操作方法getAndIncreament来安全的增加每个计数器的值。

简单考察原子类操作。
```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class Task12 {

    public void task12() throws IOException {
        String contents = new String(Files.readAllBytes(Paths.get("article.txt")), StandardCharsets.UTF_8);
        Stream<String> words = Stream.of(contents.split("[\\P{L}]+"));
        AtomicInteger count = new AtomicInteger();
        words.parallel().forEach(x -> {
            if (x.length() < 12) {
                count.getAndIncrement();
            }
        });
        System.out.println(count.get());
    }

    public static void main(String[] args) throws IOException {
        new Task12().task12();
    }
}

```

## 第十三题
> 重复上一个练习，这次使用collect方法、Collectors.groupingBy方法和Collectors.counting方法来过滤出短单词。

巩固Collectors的分组方法等。
```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Task13 {

    public void task13() throws IOException {
        String contents = new String(Files.readAllBytes(Paths.get("article.txt")), StandardCharsets.UTF_8);
        Stream<String> words = Stream.of(contents.split("[\\P{L}]+"));

        long count = words.parallel()
                .unordered()
                .collect(Collectors.groupingBy(x -> x.length() < 12, Collectors.counting()))
                .get(true);
        System.out.println(count);
    }

    public static void main(String[] args) throws IOException {
        new Task13().task13();
    }
}

```

## 参考资料
[Java SE 8 for the Really Impatient](https://doc.lagout.org/programmation/Java/Java%20SE%208%20for%20the%20Really%20Impatient%20%5BHorstmann%202014-01-24%5D.pdf)
[Answers found in github](https://github.com/DanielChesters/java-SE-8-Really-Impatient)

