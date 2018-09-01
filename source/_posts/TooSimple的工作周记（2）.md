---
title: TooSimple的工作周记（2）
id: 1
date: 2018-09-01 16:05:56
category:
 - Note
tags:
 - Note
---

# 前言 

这个礼拜似乎是写了一礼拜的业务代码，没遇到什么太恶心的坑，就是理解业务逻辑费了点功夫。下个礼拜似乎又要开始撸组件撸网页了，现在想想感觉还是写写业务比较舒服，没事可以怼怼产品，给前端找找bug，写完还可以慢慢测；撸组件就比较无聊了，容易出大锅，而且还得求着人家用，用出问题还会被怼。。。不过好处大概就是以后跳槽面试的时候不容易被问死吧。。。

# 知识&技巧

## 常用@see和@link注释

写代码的时候经常会遇到一些需要枚举的类型，比如“活动类型”、“数据来源”这类的。但是一般来讲我们不会直接用enum类型，因为这些数据一般都是以整数的形式存储在数据表里面，因此用整型去存储、转移会更加方便。所以一般我们都是直接声明成一个整型，然后用另外一个类去存储这个类型的值，比如:
```java
    //需要引用的地方
    int xxxType;
```
```java
//该类型的值
public interface XxxType {
    int type1 = 1;
    int type2 = 2;
    int type3 = 3;
}
```
这样搞没啥问题，但是比较讨厌的就是，当另外一个人看到xxxType这个字段时，他可不知道这玩意的值是XxxType去记录的，他甚至有可能去用YyyType的类型去给xxxType赋值。这就说不清楚了。

因此一个比较简单的方法就是把注释写清楚了，而相比普通的注释，java的文档注释就比较好用了。这里面有一个@see的注释，非常适合这种场景：
```java
    /**
    * @see the.package.of.XxxType
    */
    int xxxType;
```

也可以使用{@link}注释，达到类似的效果:
```java
    /**
    * {@link the.package.of.XxxType}
    */
    int xxxType;
```
这样无论谁在给这个字段赋值时，都非常清楚的知道该赋什么值了。这一点jdk做的就非常好，要向他学习。。。

## SQL的分页查询和滚动查询

SQL里的limit语句分页的性能不高这个应该是个常识，因为limit语句其实只是对前面查询的结果进行了一个简单的过滤，而没有做任何额外的优化。比如说我们希望从一个表中把所有的数据批量同步出来，但是考虑到量比较大，所以我们会希望通过分页慢慢查而不是一次性查出来。一个比较弱智的做法就是这样:
```sql
    select * from someTable limit 0,1000;
    select * from someTable limit 1000,1000;
    select * from someTable limit 2000,1000;
    ...
```
比如有1000w的数据，那我们只要查1w次就好了，似乎效果不错。但是实际上我们是每一次都把1000w个数据查出来然后进行的过滤，也就是执行了1w次的全表扫描。可能刚开始的时候比较快，因为不需要查询多少数据就攒满了1000个数据，直接返回了，但是越查到后面就一定会越慢。

这时候正确的做法应该是尽量去使用索引来限制每一次查找的范围，使得每一次扫描不再是全表查找而是索引查找。具体的做法大概是这样：
```sql
    select * from someTable where id > 0 limit 1000;
    select * from someTable where id > 1000 limit 1000;
    select * from someTable where id > 2000 limit 1000;
    ...
```
当然，前提还是在id字段上加了索引。至于为什么说第二种方法会优于第一种方法，其实很简单：

> Talk is cheap , explain your SQL.

## SQL&MyBatis批量处理语句

我们知道每一条SQL语句都会有一个最少执行时间，无论这条语句有多简单，况且每一次网络传输也需要时间。因此如果有大批量的DML语句需要执行，写一个for循环挨个去执行显然是一个很蠢的方法。所以我们更加倾向于将多条查询语句拼凑成一条，一次性去请求数据库。

对于批量查询，我们知道有 where in 语句，可以很方便的一次性查询多条记录，比如:
```sql
    select * from someTable where id in ( 1, 22, 333 );
```

对于批量插入，我们知道 insert 语句本身就可以支持同时插入多个values：
```sql
    insert into someTable (id ,key) values (1,'aa'),(22,'bbb'),(333,'cccc');
```
对于批量更新，我们可以利用when case 语句结合where in语句，一次性更新：
```sql
    update someTable set key = case when id=1 then 'aa' when id=22 then 'bbb' when id=333 then 'ccc' when id in (1, 22, 333);
```

对于批量更新，如果使用mybatis，mapper大概是这样:
```xml
    <update id="updateKey" parameterType="java.util.List">
        update someTable
        <trim prefix="set" suffixOverrides=",">
            <trim prefix="key =case" suffix="end">
                <foreach collection="list" item="item" index="index">
                    when id=#{item.id,jdbcType=BIGINT} then #{item.key,jdbcType=VARCHAR}
                </foreach>
            </trim>
        </trim>
        where id in
        <foreach collection="list" index="index" item="item" separator="," open="(" close=")">
            #{item.id,jdbcType=BIGINT}
        </foreach>
    </update>
```

## Git stash快速保存状态
一个之前一直没有注意到的git命令，主要用于把当前未保存的状态直接推到一个栈里暂存，并且将工作区环境清空，回头有空的时候也可以再把工作区恢复。当开发到一半突然要切分支的时候特别有用。。。
```
$ git stash -h
usage: git stash list [<options>]
   or: git stash show [<stash>]
   or: git stash drop [-q|--quiet] [<stash>]
   or: git stash ( pop | apply ) [--index] [-q|--quiet] [<stash>]
   or: git stash branch <branchname> [<stash>]
   or: git stash save [--patch] [-k|--[no-]keep-index] [-q|--quiet]
                      [-u|--include-untracked] [-a|--all] [<message>]
   or: git stash [push [--patch] [-k|--[no-]keep-index] [-q|--quiet]
                       [-u|--include-untracked] [-a|--all] [-m <message>]
                       [-- <pathspec>...]]
   or: git stash clear
```

## Gradle将jar包打包到maven本地库

主要利用gradle的[maven插件](https://docs.gradle.org/current/userguide/maven_plugin.html)。
```
    apply plugin: 'maven'
    uploadArchives {
        repositories {
            mavenDeployer {
                repository(url: uri('C:\\Users\\admin\\.m2\\repository'))
            }
        }
    }
```
执行`gradle uploadArchives`命令即可。

需要注意的是，gradle默认的缓存目录并不是maven的`~/.m2/repository/`下，而是类似`~/.gradle/caches/modules-2/files-2.1`的目录下。


# 问题&反省

## 注意各种json转化工具对map的转化

在将一些对象转化为json的时候要格外注意，尤其是在数据中有map类型的数据，而且key是普通对象的时候。看下下面的例子：
```java
import com.alibaba.fastjson.JSONObject;
import com.google.gson.Gson;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Foo {
    private int field1;
    private int field2;

    public Foo(int field1, int field2) {
        this.field1 = field1;
        this.field2 = field2;
    }

    public static void main(String[] args) {
        Map<Foo, Integer> map = new HashMap<>();
        Foo foo1 = new Foo(1, 2);
        Foo foo2 = new Foo(2, 3);
        map.put(foo1, 1);
        map.put(foo2, 2);

        System.out.println(JSONObject.toJSONString(map));
        System.out.println(new Gson().toJson(map));
    }
}
```
这个例子中，fastjson会将这个map对象转成下面这个:
```
{{"field1":2,"field2":3}:2,{"field1":1,"field2":2}:1}
```
fastjson将map的key也展开成了json，导致这个结果不满足标准的json格式，需要格外注意，不要因为无法进行json格式化而怀疑人生。

gson会将这个map对象转换成下面这个:
```
{"Foo(field1\u003d2, field2\u003d3)":2,"Foo(field1\u003d1, field2\u003d2)":1}
```
他也将key展开成了json，但是仍然是一个字符串，这样就仍然符合json的格式，可以格式化成这样:
```
{
    "Foo(field1=2, field2=3)":2,
    "Foo(field1=1, field2=2)":1
}
```
二者其实各有利弊，一个方便我们去理解，另一个则满足了约定俗成的标准。


## 小心使用String的replace和replaceAll

不得不说，愚蠢的我一直以为replace函数是只替换一次，而replaceAll函数是替换全部。其实压根不是这样，replace是用普通字符串进行匹配，而replaceAll是用正则表达式去匹配。事实上他们的本质都是用的正则表达式，看一下函数实现就知道了:
```java
    public String replace(CharSequence target, CharSequence replacement) {
        return Pattern.compile(target.toString(), Pattern.LITERAL).matcher(
                this).replaceAll(Matcher.quoteReplacement(replacement.toString()));
    }
    public String replaceAll(String regex, String replacement) {
        return Pattern.compile(regex).matcher(this).replaceAll(replacement);
    }
```
误用这两个函数会有很多明显的bug，比如下面的代码:
```java
    String s = "(1)(11)(111)";
    System.out.println(s.replace("(1)", "(2)"));
    System.out.println(s.replaceAll("(1)", "(2)"));
```
输出就会是这样:
```java
(2)(11)(111)
((2))((2)(2))((2)(2)(2))
```
因为括号会被正则理解为捕获，而不被当成括号，类似的错误还会有很多很多，要格外注意。

当然，即使是知道差别，有时候想当然的用了也会出问题。比如下面代码:
```java
    String s = ",1,1,1,11,111,";
    System.out.println(s.replace(",1,", ",2,"));
```
我的意图是将字符串按逗号分隔，将值为1的全部变为2,（不替换11,111）。但是这段代码实际跑起来缺变成了这样:
```
,2,1,2,11,111,
```
这样就少替换了一个。这是由于正则匹配的本质是自动机，匹配过的字符串是不会拿回来重新匹配的。。。



