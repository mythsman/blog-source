---
title: Java类加载原理与ClassLoader使用总结
id: 1
date: 2017-12-17 21:34:38
category:
 - Java
tags:
 - Java
 - Jvm
---
## 前言
说来好笑，不知道怎么我就来搞Java了。虽说大学也码了三年多的代码，但是七七八八乱糟糟的东西搞得有点多，对Java的理解也只能算是hello world，这让我感觉非常慌，尤其是看到招聘网上的一堆JD都要求深入理解JVM，再对比下自己真是自惭形秽。这一两个月没什么事情，感觉是时候要补充点知识了。。。

## 双亲委派模型
类加载这个概念应该算是Java语言的一种创新，目的是为了将类的加载过程与虚拟机解耦，达到”通过类的全限定名来获取描述此类的二进制字节流“的目的。实现这个功能的代码模块就是类加载器。类加载器的基本模型就是大名鼎鼎的双亲委派模型(Parents Delegation Model)。听上去很牛掰，其实逻辑很简单，在需要加载一个类的时候，我们首先判断该类是否已被加载，如果没有就判断是否已被父加载器加载，如果还没有再调用自己的findClass方法尝试加载。基本的模型就是这样(盗图侵删)：
![](/images/2017/12/17/1/1.png)

实现起来也很简单，重点就是ClassLoader类的loadClass方法，源码如下：
```java
    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                
                Class(c);
            }
            return c;
        }
    }
```
闲来无事再看一下findClass方法:
```java
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
```
突然感觉被逗了，怎么默认直接就抛了异常呢？其实是因为ClassLoader这个类是一个抽象类，实际在使用时候会写个子类，这个方法会按照需要被重写，来完成业务需要的加载过程。

## 自定义ClassLoader
在自定义ClassLoader的子类时候，我们常见的会有两种做法，一种是重写loadClass方法，另一种是重写findClass方法。其实这两种方法本质上差不多，毕竟loadClass也会调用findClass，但是从逻辑上讲我们最好不要直接修改loadClass的内部逻辑。
个人认为比较好的做法其实是只在findClass里重写自定义类的加载方法。
为啥说这种比较好呢，因为前面我也说道，loadClass这个方法是实现双亲委托模型逻辑的地方，擅自修改这个方法会导致模型被破坏，容易造成问题。因此我们最好是在双亲委托模型框架内进行小范围的改动，不破坏原有的稳定结构。同时，也避免了自己重写loadClass方法的过程中必须写双亲委托的重复代码，从代码的复用性来看，不直接修改这个方法始终是比较好的选择。
当然，如果是刻意要破坏双亲委托模型就另说。

## 破坏双亲委托模型
为什么要破坏双亲委托模型呢？
其实在某些情况下，我们可能需要加载两个不同的类，但是不巧的是这两个类的名字完全一样，这时候双亲委托模型就无法满足我们的要求了，我们就要重写loadClass方法破坏双亲委托模型，让同一个类名加载多次。当然，这里说的破坏只是局部意义上的破坏。
但是类名相同了，jvm怎么区别这两个类呢？显然，这并不会造成什么世界观的崩塌，其实类在jvm里并不仅是通过类名来限定的，他还属于加载他的ClassLoader。由不同ClassLoader加载的类其实是互不影响的。
做一个实验。
我们先写两个类:
```java
package com.mythsman.test;

public class Hello {

    public void say() {
        System.out.println("This is from Hello v1");
    }

}
```
```java
package com.mythsman.test;

public class Hello {

    public void say() {
        System.out.println("This is from Hello v2");
    }

}
```
两个类名字一样，唯一的区别是方法的实现不一样。我们先分别编译，然后把生成的class文件重命名为Hello.class.1和Hello.class.2。
我们的目的是希望能在测试类里分别创建这两个类的实例。
接着我们新建一个测试类com.mythsman.test.Main，在主函数里创建两个自定义的ClassLoader：
```java
    ClassLoader classLoader1=new ClassLoader() {
        @Override
        public Class<?> loadClass(String s) throws ClassNotFoundException {
            try {
                if (s.equals("com.mythsman.test.Hello")) {
                    byte[] classBytes = Files.readAllBytes(Paths.get("/home/myths/Desktop/test/Hello.class.1"));
                    return defineClass(s, classBytes, 0, classBytes.length);
                }else{
                    return super.loadClass(s);
                }
            }catch (IOException e) {
                throw new ClassNotFoundException(s);
            }
        }
    };
    ClassLoader classLoader2=new ClassLoader() {
        @Override
        public Class<?> loadClass(String s) throws ClassNotFoundException {
            try {
                if (s.equals("com.mythsman.test.Hello")) {
                    byte[] classBytes = Files.readAllBytes(Paths.get("/home/myths/Desktop/test/Hello.class.2"));
                    return defineClass(s, classBytes, 0, classBytes.length);
                }else{
                    return super.loadClass(s);
                }
            }catch (IOException e) {
                throw new ClassNotFoundException(s);
            }
        }
    };
```
这两个ClassLoader的用途就是分别关联Hello类的两种不同字节码，我们需要读取字节码文件并通过defineClass方法加载成class。注意我们重载的是loadClass方法，如果是重载findClass方法那么由于loadClass方法的双亲委托处理机制，第二个ClassLoader的findClass方法其实并不会被调用。
那我们怎么生成实例呢？显然我们不能直接用类名来引用(名称冲突)，那就只能用反射了：
```java
        Object helloV1=classLoader1.loadClass("com.mythsman.test.Hello").newInstance();
        Object helloV2=classLoader2.loadClass("com.mythsman.test.Hello").newInstance();
        helloV1.getClass().getMethod("say").invoke(helloV1);
        helloV2.getClass().getMethod("say").invoke(helloV2);
```
输出：
```
This is from Hello v1
This is from Hello v2
```
OK，这样就算是完成了两次加载，但是还有几个注意点需要关注下。

### 两个类的关系是什么
显然这两个类并不是同一个类，但是他们的名字一样，那么类似isinstance of之类的操作符结果是什么样的呢：
```java
        System.out.println("class:"+helloV1.getClass());
        System.out.println("class:"+helloV2.getClass());
        System.out.println("hashCode:"+helloV1.getClass().hashCode());
        System.out.println("hashCode:"+helloV2.getClass().hashCode());
        System.out.println("classLoader:"+helloV1.getClass().getClassLoader());
        System.out.println("classLoader:"+helloV2.getClass().getClassLoader());
```
输出：
```
class:class com.mythsman.test.Hello
class:class com.mythsman.test.Hello
hashCode:1581781576
hashCode:1725154839
classLoader:com.mythsman.test.Main$1@5e2de80c
classLoader:com.mythsman.test.Main$2@266474c2
```
他们的类名的确是一样的，但是类的hashcode不一样，也就意味着这两个本质不是一个类，而且他们的类加载器也不同(其实就是Main的两个内部类)。

### 这两个类加载器跟系统的三层类加载器是什么关系
以第一个自定义的类加载器为例：
```java
    System.out.println(classLoader1.getParent().getParent().getParent());
    System.out.println(classLoader1.getParent().getParent());
    System.out.println(classLoader1.getParent());
    System.out.println(classLoader1 );
    System.out.println(ClassLoader.getSystemClassLoader());
```
输出：
```
null
sun.misc.Launcher$ExtClassLoader@60e53b93
sun.misc.Launcher$AppClassLoader@18b4aac2
com.mythsman.test.Main$1@5e2de80c
sun.misc.Launcher$AppClassLoader@18b4aac2
```
我们可以看到，第四行就是这个自定义的ClassLoader，他的父亲是AppClassLoader，爷爷是ExtClassLoader，太爷爷是null，其实就是用C写的BootStrapClassLoader。而当前系统的ClassLoader就是这个AppClassLoader。
当然，这里说的父子关系并不是继承关系，而是组合关系，子ClassLoader保存了父ClassLoader的一个引用(parent)。

### 有没有不用反射的更优雅的调用方法
显然，每次都用反射来调用还是太蠢了，难道就没有更方便的类似用类名引用的方法么？当然是有的，前面之所以不能直接用类名引用是因为原生类的类加载器是systemClassLoader，而从class文件创建的类的类加载器是自定义的classLoader，这两个类本质不一样，因此才不能互相强制转换，如果硬要强制转换就会报ClassCastException。那么，如果我们提取一个父类，父类由systemClassLoader加载，而子类由自定义classLoader加载，然后强制转换的时候转换成父类不就好了么？
做个试验，创建一个父类Father，其实就是提取了个抽象方法:
```java
package com.mythsman.test;

public abstract class Father {
    public abstract void say();
}
```
然后修改一下Hello类：
```java
package com.mythsman.test;

public class Hello extends Father {
    @Override
    public void say() {
        System.out.println("say outside");
    }
}
```
然后将Hello类手动编译，并把class文件放到其他地方。重新修改这个类，将"say outside"改成"say inside"。
再修改下主函数：
```java
package com.mythsman.test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {

    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        ClassLoader classLoader = new ClassLoader() {
            @Override
            public Class<?> loadClass(String s) throws ClassNotFoundException {
                try {
                    if (s.equals("com.mythsman.test.Hello")) {
                        byte[] classBytes = Files.readAllBytes(Paths.get("/home/myths/Desktop/test/Hello.class"));
                        return defineClass(s, classBytes, 0, classBytes.length);
                    } else {
                        return super.loadClass(s);
                    }
                } catch (IOException e) {
                    throw new ClassNotFoundException(s);
                }
            }
        };
        Father outside = (Father) classLoader.loadClass("com.mythsman.test.Hello").newInstance();
        Hello inside = new Hello();
        outside.say();
        inside.say();
    }
}
```
这样我们就可以看到输出是:
```
say outside
say inside
```