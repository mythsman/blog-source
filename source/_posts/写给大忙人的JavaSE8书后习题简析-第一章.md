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

这道题主要就是考察lambda的基本用法，以及于其他方法的对比。
```java
import java.io.File;
import java.io.FileFilter;

public class Task2 {
	public static void main(String[] args) {
		File file=new File("/home/myths");
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

这道题主要考察捕获外部变量。
```java
import java.io.File;

public class Task3 {
	public static void main(String[] args){
		File file=new File("/home/myths");
		String suffix=".txt";
		String[] files=file.list((File dir,String name)-> name.endsWith(suffix));
		for(String f:files){
			System.out.println(f);
		}
	}
}
```
捕获了suffix变量。

## 第四题

> 对于一个指定的File对象数组，首先按照路径的目录排序，然后对每组目录中的元素再按照路径名排序。请使用lambda表达式(而不是Comparator)来实现。

这道题翻译的很差劲，我特地找了下英文原版的题目，发现完全是两个问题。。。原版题目如下：
>Given an array of File objects, sort it so that the directories come before the files, and within each group, elements are sorted by path name. Use a lambda expression, not a Comparator.

这样就很清楚了。
```java
import java.io.File;
import java.util.Arrays;

public class Task4 {
    public static void main(String[] args) {
        File[] files = new File("/home/myths/").listFiles();
        Arrays.sort(files, (first, second) -> {
            if (first.isDirectory() && second.isDirectory() || first.isFile() && second.isFile()) {
                return first.getPath().compareTo(second.getPath());
            } else {
                if (first.isDirectory())
                    return -1;
                else
                    return 1;
            }
        });
        for (File file : files) {
            System.out.println(file.getAbsolutePath());
        }
    }
}
```


## 第五题

> 从你的项目中选取一个包含一些ActionListener、Runnable或者其他类似代码的文件。将他们替换为lambda表达式。这样能节省多少行代码？替换后的代码是否有更好的可读性？在这个过程中你使用了方法引用吗？

没有类似的项目，不过显然能节省不少的代码，可读性也会有所提高。如果使用了方法引用，那么可读性和简洁性会进一步提高。


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

主要考察＠FunctionalInterface接口的用法，利用这个接口可以很方便的对函数类型的变量进行封装。
```java
public class Task7 {

    public @FunctionalInterface
    interface RunnableEx {
        void run() throws Exception;
    }

    public static Runnable uncheck(RunnableEx runner) {
        return () -> {
            try {
                runner.run();
            } catch (Exception ex) {
                System.err.println(ex);
            }
        };
    }

    public static void main(String[] args) {
        new Thread(uncheck(
                () -> {
                    System.out.println("Zzz");
                    Thread.sleep(1000);
                })
        ).start();
    }
}
```



## 第七题

> 编写一个静态方法andThen,它接受两个Runnable实例作为参数，并返回一个分别运行这两个实例的Runnable对象。在main方法中，向andThen方法传递两个lambda表达式，并运行返回的实例。

巩固函数接口的使用。
```java
public class Task7 {
    public static Runnable andThen(Runnable runner1, Runnable runner2) {
        return () -> {
            runner1.run();
            runner2.run();
        };
    }

    public static void main(String[] args) {
        new Thread(andThen(
                () -> System.out.println("Runner 1"),
                () -> System.out.println("Runner 2")
        )).start();
    }
}
```


## 第八题

> 当一个lambda表达式捕获了如下增强for循环中的值时，会发生什么？这样做是否合法？每个lambda表达式都捕获了一个不同的值，还是他们都获得了最终的值？如果使用传统的for循环，例如`for (int i=0;i<names.length;i++)`,又会发生什么？
```
String[] names = { "Peter", "Paul", "Mary" };
List<Runnable> runners = new ArrayList<>();
for (String name : names)
    runners.add(() -> System.out.println(name));
```

考察lambda的变量捕获，这里如果采用上面的增强for循环是不会有问题的:
```java
public class Task8 {

    public static void main(String[] args) {
        String[] names = {"Peter", "Paul", "Mary"};
        List<Runnable> runners = new ArrayList<>();

//      增强for循环
        for (String name : names)
            runners.add(() -> System.out.println(name));
        for (Runnable runnable : runners) {
            runnable.run();
        }

//        传统for循环
//        for (int i = 0; i < names.length; i++)
//            runners.add(() -> System.out.println(names[i]));
//        for (Runnable runnable : runners) {
//            runnable.run();
//        }
    }
}
```
但是，这里是不允许使用传统for循环的，否则他会报如下错误：
```
Error:(16, 56) java: local variables referenced from a lambda expression must be final or effectively final
```
显然，lambda表达式里取到的这个i由于发生了变化，不再是一个“有效的final值”，不满足lambda“被引用变量是不能修改的”这一规范。


## 第九题

> 编写一个继承Collection接口的子接口Collection2，并添加一个默认方法`void forEachIf(Consumer<T> action, Predicate<T> filter)`,用来将action应用到所有filter返回true的元素上。你能够如何使用它？

这里主要考察一些常见的函数式接口以及default函数声明。

```java
import java.util.Collection;
import java.util.function.Consumer;
import java.util.function.Predicate;

public class Task9 {
    public interface Collection2<T> extends Collection<T> {

        default void forEachIf(Consumer<T> action, Predicate<T> filter) {
            forEach(item -> {
                filter.test(item) ? action.accept(item);
            });
        }
    }
}
```


## 第十题

> 浏览Collections类中的方法。如果哪一天你可以做主，你会将每个方法放到哪个接口中？这个方法会是一个默认方法还是静态方法？

不是很清楚其中的道理，不敢瞎说。。。

## 第十一题

> 假如你有一个实现了两个接口I和J的类，这两个接口都有一个void f()方法。如果I接口中的f方法是一个抽象的、默认或者静态方法，并且J接口中的f方法是也一个抽象的、默认或者静态方法，分别会发生什么？如果这个类继承自S类并实现了接口I，并且S和I中都有一个void f()方法，又会分别发生什么？

这两个接口之间的搭配有点复杂，不过经过测试，我总结了下面的几个规则：
1. 只要有一个接口中是抽象函数，那么这个类必须要重载这个函数重新实现。
2. 如果一个是静态函数一个是默认函数，那么，最终显示出来的是默认函数的特性。

至于既有extends又有implements的情况。。。有点麻烦，也就不一个一个测了，到时候用到再测吧。。。


## 第十二题

> 在过去，你知道向接口中添加方法是一种不好的形式，因为他会破坏已有的代码。现在你知道了可以像接口中添加新方法，同时能够提供一个默认的实现。这样做安全程度如何？描述一个Collection接口的新stream方法会导致遗留代码编译失败的场景。二进制的兼容性如何？JAR文件中的遗留代码是否还能运行？

所谓安全问题大概就是指对于旧的版本，忽然多出一个可以执行却没有啥作用的函数，略微违背了"封装隐藏"的思想。但是在旧的版本中，他们并不知道这个函数的存在，所以我觉得一般情况下也不存在什么安全问题吧。
第二问不是很清楚。。。


# 参考资料
[Java SE 8 for the Really Impatient](https://doc.lagout.org/programmation/Java/Java%20SE%208%20for%20the%20Really%20Impatient%20%5BHorstmann%202014-01-24%5D.pdf)
[Answers found in github](https://github.com/DanielChesters/java-SE-8-Really-Impatient)
