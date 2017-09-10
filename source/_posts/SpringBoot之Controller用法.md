---
title: SpringBoot之Controller用法
id: 1
categories:
  - Java
date: 2017-05-13 22:53:21
tags:
  - Java
  - Web
---

## Controller
Controller是SpringBoot里最基本的组件，他的作用是把用户提交来的请求通过对URL的匹配，分配给不同的接收器，再进行处理，然后向用户返回结果。他的重点就在于如何从HTTP请求中获得信息，提取参数，并分发给不同的处理服务。

## 基本组成
一个最经典的Controller应该大概长这样:
```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by myths on 5/16/17.
 */
@Controller
public class IndexController {
    @RequestMapping(value = {"index", "/"})
    public String index(Model model) {
        return "index";
    }
}

```
首先应该在类的开头，加上`@Controller`注解，告知Spring这是一个控制器。
然后在对应的处理函数前面加上`@RequestMapping`，告知这个函数需要相应的URL。
接着这个函数传入了一个Model类型的参数，这个参数主要是用于向模板传递数据。
该函数最后返回了一个叫"index"的字符串，表示将调用名为"index"的模板，具体名称取决于模板引擎，比如对于jsp他将访问"index.jsp"这个文件,对于thymeleaf，他将访问"index.html"这个文件。

上面的是最简单的用法，实际上有很多细节需要注意，下面就来一一解释。

## ResponseBody
如果我们想返回纯字符串而不是渲染后的模板，那我们可以在需要返回字符串的函数前面加上`@ResponseBody`这个注解；
如果我们像对于整个类都返回字符串，我们也可以在这个类前面加上`@ResponseBody`注解，或者将`@Controller`注解换成`@RestController`，均可。


## RequestMapping
### 基本用法
这个注解是用来告诉Spring，下面的这个函数或者类是用来映射到那个URL的，通常情况下有下面这些选项：
```java
    @RequestMapping(
            path = {"/test"},
            params = {"name","userId"},
            method = {RequestMethod.GET},
            consumes = {"text/plain", "application/*"},
            produces = "text/plain",
            headers = "content-type=text/*"
    )
```
我们可以指定这个路径，参数，方法，头信息，来作为一个Controller的入口。当然，通常我们只需要指定path就行了。

### 对象转json或xml
这里有一个使用的小窍门，比如有时候我们希望返回json字符串，我们当然可以调用jackson,gson,fastjson等等工具来组合数据，但是这样显然比较麻烦。其实springboot自带了将对象持久化的工具，只要我们在`produces`参数中指定头信息，就可以将返回的对象直接转换为json或xml。比如:
```java
package com.mythsman.controller;

import com.mythsman.bean.TestBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @RequestMapping(value = "test", produces = {"application/json;charset=UTF-8"})
    public TestBean test() {
        TestBean testBean = new TestBean();
        testBean.setName("myths");
        testBean.setAge(12);
        return testBean;
    }

}
```
访问后的返回结果就是`{"name":"myths","age":12}`。同理，也可以自动转换成xml格式，不过xml格式对与map等的数据结构无法支持，因此我们还是建议采用json。


### 作用对象
这个注解可以注解一个函数，也可以注解一个类。当注解一个类时，类中所有的方法都会在这个基础上再进行过滤：
```java
@Controller
@RequestMapping("/path1")
public class TestController {
    @RequestMapping("/path2")
    @ResponseBody
    public String index() {
        return "ok";
    }
}
```
这个函数就能匹配"/path1/path1"这个地址。

### 缺省参数
当RequestMapping的参数是空的时候，他就表示匹配剩余所有的页面,实际上也就是匹配所有的404页面。
```java
@Controller
public class IndexController {
    @RequestMapping
    public String index(Model model) {
        return "index";
    }
}
```
当RequestMapping不指定参数名时，默认就是path参数。
```java
@Controller
public class IndexController {
    @RequestMapping("/index")
    public String index(Model model) {
        return "index";
    }
}
```


## PathVariable
RequestMapping中的path也可以是一个未定的变量，比如下面的代码:
```java
@Controller
public class TestController {
    @RequestMapping("/{variable}")
    @ResponseBody
    public String index(@PathVariable("variable")String variable) {
        return variable;
    }
}
```
通过花括号我们就可以指定这个变量，并且通过`@PathVariable`注解得到这个参数，非常方便。

## RequestParam
RequestMapping也可以获取类似表单传回的信息形式，比如`/index?name=XXX`，这个`name`变量就可以通过RequestParam注解来获得:
```java
@Controller
public class TestController {
    @RequestMapping("/index")
    @ResponseBody
    public String index(@RequestParam(value = "name",required = false,defaultValue = "233")String name) {
        return name;
    }
}
```
我们可以控制这个参数的名字，是否必须，以及设置默认值，来更好的进行匹配。

## RequestBody
RequestBody用来获取Post信息的消息体,只要在参数中通过`@RequestBody`注解就能得到这个参数:
```java
@Controller
public class TestController {
    @RequestMapping("/index")
    @ResponseBody
    public String index(@RequestBody String body) {
		//对body进行解析即可
        return "success";
    }
}

```

## 总结
上面这些大概就是Controller中最基本的用法了，十分的方便清楚。具体的细节可以参考源码中的注释，解释的也是十分详尽了。
