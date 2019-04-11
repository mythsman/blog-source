---
title: IntelliJ常用配置备忘
id: 1
date: 2019-04-11 11:46:55
category:
 - Java
tags:
 - Java
---

# 前言
最近IntelliJ又由于自己的骚操作给弄崩溃了，导致之前弄的一大波配置又找不到了，十分蛋疼的又要开始重头开始弄环境。很多之前精心搞过的配置又都记不住了，为了防止以后出现这种情况，这里就把我日常用的配置和注意点记一下，免得以后又要重新摸索。尽量持续更新。

# 安装
安装这块没啥好说的，不过要注意的是，虽然 IntelliJ 有 Community 版，但是毕竟还是少了一些东西的，比如对JavaScript的支持、一些静态检查的支持、Spring框架的整体支持等等。因此还是不要太委屈自己了，安装个正式版然后激活下好了（罪过罪过，实在是正版太贵了）。

# 配置
## 修改文件模板
合作写代码的时候，一般都要求在自己创建的文件头加上一些创建者的信息，用以方便交流。

方法是找到下面的路径：`File > Settings > Editor > File and Code Templates > Includes > File Header`，并修改文件模板：
```java
/**
 * @author ${USER}
 * @date ${DATE}
 */
```
当然，@date 并不是标准的javadoc注解，不过也无妨了。

## 修改编辑器样式
人老了，眼神不好，编辑器字体太小的话为了看清楚还要凑上去，对颈椎也不好。

方法找到下面的路径： `File > Settings > Editor > Font`，并把`Size`设为一个合适的大小（蛋疼的默认设置竟然是12磅），我现在似乎对16磅的感觉比较舒服，不排除以后用更大的字体。

而且，一般公司的灯光都不错，用白底的主题更舒服。在`File > Settings > Appearance & Behavior > Appearance`里将`Theme`调成`IntelliJ`即可。

## 自动Import包时少用通配符
一般在 import 其他包的类时，如果来自同一个包的类比较多，IntelliJ 会弄个通配符出来，缩成一行。这样做可以减少文件长度，但是容易把本地的名空间弄混乱，可读性会差一点，因此一般会建议显示 import 所有需要的类而不要用通配符。

方法是找到下面的路径： `File > Settings > Editor > Code Style > Java > Imports`，并将 `Class count to use import with "*"` 和 `Names count to use static import with "*"` 设为一个较大的值。

## 序列化接口提示自动生成serialVersionUID
序列化的时候如果不指定serialVersionUID，那么实际上每次都要根据类的定义去计算一个UID，这个计算的结果很可能会受编译器的影响，容易导致UID的不一致，出现序列化/反序列化失败。

不知为何 IntelliJ 默认没有增加这个 Inspection ，那我们加一下就好了。

找到下面的路径：`File > Settings > Editor > Inspections `。首先把 `Profile` 设置成`Default IDE`，这样配置才能在所有项目中应用，否则就只在当前项目中应用。然后在`Java > Serialization issues`中，找到`Serializable class without 'serialVersionUID'`，并把校验勾上。

增加了 Inspections 告警之后，就可以条件激活时，触发 Intention 的提示，这样就可以使用 `alt + enter` 直接自动生成UID了。

## 指定JavaScript语言
JavaScript的语言特性飚的太快了，为了防止使用新特性报错，需要调一下语言等级。

找到下面的路径：`File > Settings > Languages & Frameworks > JavaScript`，并将 `JavaScript language version` 调整为 `ECMAScript 6`或以上。

# 插件
对于插件，最好的原则应当是**宁缺毋滥**。曾经有一段时间我也是一听说有什么新奇的插件都会装来已用，后来发现很多东西到头来根本用不到。其实很多功能 IDEA 本身就已经很强大了，再额外装那些**看上去很帅其实并没有什么卵用**的插件其实只能把开发环境弄的乱七八糟，各种热键冲突，各种中英文混淆，各种不适配的Bug，反而让人用起来很烦躁。况且很多所谓插件提供的功能，IDEA 本身其实是慢慢都已经支持了。因此与其到处找新插件，倒不如仔细研究一下 IntelliJ 自身已经提供的功能。

这里也顺便吐槽一下很多推荐插件的文章，我反正是完全不相信他们自己会用他们推荐的插件的。

## Vue.​js

**插件地址：** [Vue.js](https://plugins.jetbrains.com/plugin/9442-vue-js)

**使用理由：** 对于平时需要使用 Vue.js 开发一些页面的我来说，一个支持 Vue.js 语法的插件当然十分有用了啊，否则就是各种波浪线，很难受的。

## VisualVM Launcher

**插件地址：** [VisualVM Launcher](https://plugins.jetbrains.com/plugin/7115-visualvm-launcher)

**使用理由：** 对于需要经常使用 visualvm 来进行性能调优和 debug 的我来说，一个可以直接帮我启动 visualvm 并打开当前正在调试的应用的按钮还是很方便的。

## Lombok

**插件地址：** [Lombok](https://plugins.jetbrains.com/plugin/6317-lombok)

**使用理由：** 虽然我个人不喜欢用 Lombok ，毕竟这玩意不方便调试，而且容易跟 gradle 和 jdk 产生构建冲突，非常蛋疼。但是鉴于很多同事喜欢用这玩意，导致不装这个东西就根本调试不了他们的代码，所以没辙，这玩意必须得装，没得选。

## Alibaba Java Coding Guidelines

**插件地址：** [Alibaba Java Coding Guidelines](https://plugins.jetbrains.com/plugin/10046-alibaba-java-coding-guidelines)

**使用理由：** 阿里的代码规约插件还是能让我们学到一些不错的规范的，在 IntelliJ 自带的 Inspection 的基础上更进一步，可以看成是一种补充。用的时候记得把语言调成**英文**，食用起来更可口。

## CodeGlance

**插件地址：** [CodeGlance](https://plugins.jetbrains.com/plugin/7275-codeglance)

**使用理由：** IntelliJ 自带的滚动条还是太细了点，文件比较长的时候，想拖动的话还是不太方便的。CodeGlance 能做到在右边加一个类似 VSCode 的缩略图，拖动起来就方便多了。