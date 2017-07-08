---
title: 写给大忙人的JavaSE8书后习题简析-第一章
date: 2017-07-04 22:13:56
id: 1
category:
 - Java
tags:
 - Java
---

# lambda表达式

## 第一题

> Arrays.sort方法中的比较器代码的线程与调用sort的线程是同一个吗？

是的，看下源码就知道了。
Arrays.sort默认采用的是TimSort的方法(即传统Mergesort的优化版本)。当用户指定了一个Comparator时，他会同步的回调这个Comparator的compare方法来作为比较的参照，因此显然这里并不存在多线程的问题。
事实上在JDK1.8以后就提供了并行的排序方法Arrays.parallelSort。
不过需要注意的是，经过测验，在小数量集上并行排序的速度反倒不如非并行的快，这主要受数量级大小以及并行的核心数的影响。在通常的4核PC机中，这个转折点大约在1e6这个数量级左右。

## 第二题

> 使用java.io.File类的listFiles(FileFilter)和isDirectory方法，编写一个返回指定目录下所有子目录的方法。使用lambda表达式来代替FileFilter对象，再将它改写为一个方法的引用。

```java
import java.io.File;
import java.io.FileFilter;

public class Task2 {
	public static void main(String[] args) {
		File file=new File("D://");
		//File[] files=file.listFiles((f)->f.isDirectory());
		//File[] files=file.listFiles(File::isDirectory);
		File[] files=file.listFiles(new FileFilter() {

			@Override
			public boolean accept(File pathname) {
				return pathname.isDirectory();
			}
		});
		for(File f : files){
			System.out.println(f.getAbsolutePath());
		}
	}
}
```

## 第三题

> 使用java.io.File类的list(FilenameFilter)方法，编写一个返回指定目录下、具有指定扩展名的所有文件。使用lambda表达式(而不是FilenameFilter)来实现。他会捕获闭合作用域中的哪些变量？

```java
import java.io.File;

public class Task3 {
	public static void main(String[] args){
		File file=new File("D://");
		String suffix=".txt";
		String[] files=file.list((File dir,String name)-> name.endsWith(suffix));
		for(String f:files){
			System.out.println(f);
		}
	}
}
//捕获了suffix变量
```

## 第四题

> 对于一个指定的File对象数组，首先按照路径的目录排序，然后对魅族目录中的元素再按照路径名排序。请使用lambda表达式(而不是Comparator)来实现。

## 第五题

> 从你的项目中选取一个包含一些ActionListener、Runnable或者其他类似代码的文件。将他们替换为lambda表达式。这样能节省多少行代码？替换后的代码是否有更好的可读性？在这个过程中你使用了方法引用吗？

## 第六题

> 你是否讨厌在Runnable实现中处理检查器异常？编写一个捕获所有异常的uncheck方法，再将它改造为不需要检查异常的方法。例如:
```
new Thread(uncheck(
    () -> {
        System.out.println("Zzz");
        Thread.sleep(1000);
    })).start();
    //看，不需要catch(InterruptedException);
```
提示：定义一个RunnableEx接口，其run方法可以跑出任何异常。然后实现`public static Runanble uncheck(RunnableEx runner)`。在uncheck函数中使用一个lambda表达式。

## 第七题

> 编写一个静态方法andThen,它接受两个Runnable实例作为参数，并返回一个分别运行这两个实例的Runnable对象。在main方法中，向andThen方法传递两个lambda表达式，并运行返回的实例。

## 第八题

> 当一个lambda表达式捕获了如下增强for循环中的值时，会发生什么？
```
String[] names = { "Peter", "Paul", "Mary" };
List<Runnable> runners = new ArrayList<>();
for (String name : names)
    runners.add(() -> System.out.println(name));
```
这样做是否合法？每个lambda表达式都捕获了一个不同的值，还是他们都获得了最终的值？如果使用传统的for循环，例如for (int i=0;i<names.length;i++),又会发生什么？

## 第九题

> 编写一个继承Collection接口的子接口Collection2，并添加一个默认方法void forEachIf(Consumer<T> action, Predicate<T> filter),用来将action应用到所有filter返回true的元素上。你能够如何使用它？

## 第十题

> 浏览Collections类中的方法。如果哪一天你可以做主，你会将每个方法放到哪个接口中？这个方法会是一个默认方法还是静态方法？

## 第十一题

> 加入你有一个实现了两个接口I和J的类，这两个接口都有一个void f()方法。如果I接口中的f方法是一个抽象的、默认或者静态方法，分别会发生什么？如果这个类继承自S类并实现了接口I，并且S和I中都有一个void f()方法，又会分别发生什么？

## 第十二题

> 在过去，你知道向接口中添加方法是一种不好的形式，因为他会破坏已有的代码。现在你知道了可以像接口中添加新方法，同时能够提供一个默认的实现。这样做安全程度如何？描述一个Collection接口的新stream方法会导致遗留代码编译失败的场景。二进制的兼容性如何？JAR文件中的遗留代码是否还能运行？

