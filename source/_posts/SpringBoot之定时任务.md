---
title: SpringBoot之定时任务
id: 1
categories:
  - Java
date: 2017-05-21 17:07:35
tags:
  - Java
---

## 任务需求
最近在用SpringBoot写一个关于定时项目的时候遇到一个问题，就是客户端访问服务器的结果实际上是每个一段时间发生一次变化，并且在服务器在每天的某个固定的时间点都要触发一次事件。
我们当然可以在遇到每一个请求时都重新计算结果，但是为了提高效率，我们显然可以让服务器每隔一段时间计算一次结果，并且把这个结果进行保存，对在下一个时间段内的每个请求都直接返回计算后的结果。这样就能较好的提高了服务器的性能。
那么问题就在于如何处理定时任务。其实SpringBoot早就提供了非常方便的接口，但是网上的介绍还是有点乱的，我就记录下具体操作的注意点方便以后查找。

## 创建定时服务
一般来说定时服务会写在一个Component里，方便管理。对于定时任务，我们其实只要在需要定时执行的函数前加上`@Scheduled`注解，比如下面这样:
```java
@Component
public class ScheduledTask {

    @Scheduled(fixedRate = 5000)
    public void scheduledTask() {
        //do sth...
    }
}
```
与此同时，我们还要在项目的启动文件里配置上`@EnableScheduling`注解，告诉项目我们是支持定时任务的:
```java
@SpringBootApplication
@EnableScheduling
public class LotteryApplication {

	public static void main(String[] args) {
		SpringApplication.run(LotteryApplication.class, args);
	}
}
```
这样我们的函数就能定时执行了。

## Scheduled参数
Scheduled主要支持`fixRate`,`fixDelay`,`cron`,`initialDelay`这些参数，下面做简要说明。

### fixRate和fixDelay
fixRate和fixDelay参数都指定了函数每隔某个毫秒数执行一次，但是他们之间也有细小的差别。
**fixRate**
fixRate的计时是相对于系统时间的，也就是一定相隔会固定时间执行。
**fixDelay**
fixDelay的计时是相对于上一次调用的时间的，因此他受其他程序调用的影响，如果该函数在其他地方被手动调用，那么这个计时器就会重新计时。

### initialDelay参数
initialDelay参数是个额外参数，比较简单，就是指定从项目开始运行到该函数首次被调用的执行时间，以毫秒计。
如果不指定这个参数，这个值就是-1，也就是程序开始时不执行。
在不知到initialDelay这个参数的时候为了让程序启动时立即调用该函数，我让这个定时类继承了`InitializingBean`并在重写的`afterPropertiesSet`方法中手动调用了这个函数。。。现在看起来还真是愚蠢。。。

### cron
这个Cron是最复杂也是高度自定义化的定时工具，在Linux系统里也有类似的crontab命令。他其实是更加细致的定义了定时任务，以一个字符串的形式进行表示。
在SpringBoot中，一个cron字符串是由六个部分以空格组成的字符串，文档中的例子是这样的：
```
"0 0 * * * *" = the top of every hour of every day.
"*/10 * * * * *" = every ten seconds.
"0 0 8-10 * * *" = 8, 9 and 10 o'clock of every day.
"0 0 6,19 * * *" = 6:00 AM and 7:00 PM every day.
"0 0/30 8-10 * * *" = 8:00, 8:30, 9:00, 9:30, 10:00 and 10:30 every day.
"0 0 9-17 * * MON-FRI" = on the hour nine-to-five weekdays
"0 0 0 25 12 ?" = every Christmas Day at midnight
```
六个部分分别表示秒、分、时、日、月、周。
他支持'-'表示范围，'*'表示通配，'/'表示在左边的时间匹配后间隔右边的时间，'?'一般表示周的通配。
具体的使用方法还要参考相关文档。
网上有很多类似[Cron表达式测试工具](http://cron.qqe2.com/)这样的测试工具，方便我们测试自己写的Cron表达式。
下面一个例子表示每隔五分钟执行一次:
```java
@Scheduled(cron = "0 0/5 * * * ?")
public void fiveMinutes() {
    //do sth.
}
```

### 注意点
在实际使用Scheduled注解时，我们一定要指定且仅仅指定fixRate、fixDelay、cron当中的一个，否则肯定会导致错误。当然，我们可以任意指定initialDelay参数。

## 参考资料
[SpringBoot Guides](https://spring.io/guides/gs/scheduling-tasks/)
[Spring CronSequenceGenerator](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/support/CronSequenceGenerator.html)
[Cron expression](http://www.manpagez.com/man/5/crontab/)
[Cron表达式详解](http://jingyan.baidu.com/article/7f41ecec0d0724593d095c19.html)
