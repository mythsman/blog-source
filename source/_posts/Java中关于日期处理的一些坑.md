---
title: Java中日期处理的一些坑
id: 1
date: 2018-03-11 12:57:05
category:
 - Java
tags:
 - Java
---
## 前言
记录下最近在用java处理日期格式的时候遇到的一些坑，虽然是挺简单的一些点，但是如果不了解清楚在使用的时候还是会走很多弯路的。

## 相关类
Java8 之后，涉及日期处理的类基本都分到了 java.time 包下，非常清楚，功能也做了强化。而在这之前，如果我们要处理日期，就只能组合的使用 java.util 以及 java.text 这两个包，感觉十分凌乱。当然，以后我们就不用再纠结这些了，直接用 java.time 包就行了。这个包下有众多类，不过一般在做日期转换的时候主要关注下面这几个:
```
LocalDate
LocalTime
LocalDateTime
ZonedDateTime
DateTimeFormatter
TemporalAccessor
TemporalQueries
TemporalQueries
ChronoField
```
前四个类是用来保存日期的，DataTimeFormatter 使用来将日期进行格式化和解析的，剩下的是用来从格式化的时间数据中提取信息的，分工明确。看起来挺简单的，但是在用的时候还是有一些坑。。。


## 一些坑

### 日期本地化
很经典的一个例子就是给一个格式化的日期串，比如 `Sun Feb 13 15:00:10 +0000 2011` 我们该怎么把他提取到 LocalDateTime 里。
看上去没难度，查一下 DateTimeFormatter 的文档，找到每个部分对应的 pattern 即可:
```java
    public void test() {
        String dateString = "Sun Feb 13 15:00:10 2011";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss yyyy");
        LocalDateTime dateTime = LocalDateTime.parse(dateString, formatter);
        System.out.println(dateTime);
    }
```
然而，这段代码却极大可能会报错:
```
Exception in thread "main" java.time.format.DateTimeParseException: Text 'Sun Feb 13 15:00:10 2011' could not be parsed at index 0
	at java.time.format.DateTimeFormatter.parseResolved0(DateTimeFormatter.java:1949)
	at java.time.format.DateTimeFormatter.parse(DateTimeFormatter.java:1851)
	......
```
说是无法解析，研究了半天才发现 DateTimeFormatter 这个类默认进行了本地化的设置，如果默认环境是中文，那么他只能解析用中文表示的字符串，类似 `星期日 二月 13 15:00:10 2011`。。。
解决的方法也很简单，强行传入一个本地化参数即可:
```java
    public void test() {
        String dateString = "Sun Feb 13 15:00:10 2011";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss yyyy", Locale.US);
        LocalDateTime dateTime = LocalDateTime.parse(dateString, formatter);
        System.out.println(dateTime);
    }
```

### 带时区的数据
如果我们希望打印带时区信息的格式串，一定要用 ZonedDateTime 而不能用 LocalDateTime ，比如
```java
    public void test() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss xx yyyy", Locale.US);
        String zoned = formatter.format(ZonedDateTime.now());//正常
        String local = formatter.format(LocalDateTime.now());//报错
        
    }
```
正常的会打印出 `Sun Mar 11 14:22:43 +0800 2018`，而错误的就会报下面的错:
```
Exception in thread "main" java.time.temporal.UnsupportedTemporalTypeException: Unsupported field: OffsetSeconds
	at java.time.LocalDate.get0(LocalDate.java:680)
	at java.time.LocalDate.getLong(LocalDate.java:659)
	at java.time.LocalDateTime.getLong(LocalDateTime.java:720)
	......
```

### 正确使用格式串
关于格式串的含义可以参考 [java doc](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html#patterns)，这里有很多意义相近的表示方法，用的时候要**用心**区分。
比如文档里有这两行：
```
  Symbol  Meaning         Presentation      Examples
  ------  -------         ------------      -------
   Y     week-based-year   year           1996; 96
   y     year-of-era      year           2004; 04
```
所以我们指的年到底是哪个年呢？这个要好好区分，其实我们一般用的年是指 'year-of-era' ，如果用了另外一个就会发生解析错误。

## 参考资料

[java8 doc DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html)
