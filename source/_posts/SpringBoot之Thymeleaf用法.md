---
title: SpringBoot之Thymeleaf用法
id: 1
categories:
  - Java
date: 2017-05-24 23:42:33
tags:
  - Java
  - Web
---

## Thymeleaf
Thymeleaf是最近SpringBoot推荐支持的模板框架，官网在[thymeleaf.org](http://www.thymeleaf.org/)这里。

我们为什么要用Thymeleaf来作为模板引擎呢？官网给了我们一个非常令人信服的解释：

>Thymeleaf is a modern server-side Java template engine for both web and standalone environments.>

基本写法就像下面这样:
```html
<table>
  <thead>
    <tr>
      <th th:text="#{msgs.headers.name}">Name</th>
      <th th:text="#{msgs.headers.price}">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr th:each="prod: ${allProducts}">
      <td th:text="${prod.name}">Oranges</td>
      <td th:text="${#numbers.formatDecimal(prod.price, 1, 2)}">0.99</td>
    </tr>
  </tbody>
</table>
```
没错，由于这个模板是以xml的格式以属性的形式嵌入在html里，因此不仅适合后台人员使用，也能直接在没有后台程序的情况下直接由浏览器渲染，因为浏览器会自动忽视html未定义的属性。

这个属性还是非常吸引人的，毕竟我们做后台最麻烦的就是在乱七八糟的前台模板加代码，加完代码之后前台的也不知道加的代码对不对，非得先跑一遍才能知道。如果模板文件能够直接由前端人员编写那该多好，而且前端人员在编写的时候就能知道这个代码能不能跑，岂不是非常开心？


## 参考文档
Thymeleaf的文档链接在[这里](http://www.thymeleaf.org/doc/tutorials/2.1/usingthymeleaf.html)，细节可以直接去搜索，下面主要列举下我经常遇到的一些问题。

## 模板定义
由于我们很多的IDE都会提供很好的提示工作，因此我们有必要告诉IDE我们使用的模板规范以方便他给我们提供服务。Thymeleaf的一般规范是这样的:

```html
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
...
</html>

```
把我们需要编写的DOM放在这个html标签里面就好了。
这句话做了什么事呢？其实就是定义了一个叫`th`的名空间，所有Thymeleaf的属性都是在这个名空间下面。


## 静态文件的加载
我们知道一个网页中加载的静态文件通常有一个十分尴尬的问题，比如对于bootstrap.css，就是如果我们能让IDE识别这个文件，那么我们得用相对路径来引入这个文件。这样我们的IDE才能加载到这个文件，并且给予我们相应的提示。但是如果我们想要在发布后服务器能够加载这个文件，我们就必须用相对于resources或者static的位置来引入静态文件。显然，一般情况下我们不能兼顾这两个问题，只能要么在编写的时候用相对自己的路径，然后在发布的时候用相对于项目资源文件夹的路径，要么就只能放弃IDE的提示，非常尴尬。

而在Thymeleaf中，我们可很好的处理这一点。在引入资源的时候，我们可以写类似下面的代码:
```html
<link rel="stylesheet" type="text/css" media="all" 
          href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
```
当我们在没有后台渲染的情况下，浏览器会认得href，但是不认得th:href，这样它就会选择以相对与本文件的相对路径去加载静态文件。而且我们的IDE也能识别这样的加载方式，从而给我们提示。
当我们在有后台渲染的情况下，后台会把这个标签渲染为这样:
```html
<link rel="stylesheet" type="text/css" media="all" href="/css/gtvg.css" />
```
原来的href标签会被替换成相对于项目的路径，因此服务器就能找到正确的资源，从而正确渲染。

非常的智能而且方便。

这里需要注意到所有的路径我们是用"@{}"来引用，而不是"${}"，因为后者是用来引用变量名的，而前者是引用路径的，因此我们在这里用的是前者。可是如果我们是把路径写在变量里，那么就要用后者来引用了。


## 常量的渲染以及文字国际化
很多情况下我们并不希望在代码里硬编码进文字，我们希望把文字提取成统一的代号，这样方便管理，也方便更改语言。
我们要做的首先是创建一个语言文件，比如`message_chinese.properties`:
```
title=这是标题
message1=这是消息2
message2=这是消息2
....
```
然后我们在application.properties里加上下面这行注册这个语言文件:
```
spring.messages.basename=message_chinese
```
这样，我们在模板里就可以通过`#{消息名}`来获取这个消息对应的真正的文字:
```
<title th:text="#{title}"></title>
```


## 变量的渲染
对于一个模板文件来说，最重要的事情莫过与传递变量了。
这件事情非常简单，主要分为两步，首先是在SpringBoot的Controller里给Model传进参数：
```java
@Controller
public class IndexController {

    @RequestMapping(path = {"index", "/"}, method = {RequestMethod.GET})
    public String index(Model model) {
    
        model.addAttribute("var1", "value1");
        model.addAttribute("src1", "https://www.baidu.com");
        
        Map<String,Object> map=new HashMap<>();
        map.put("src1","/a.png");
        map.put("src2","/b.png");
        model.addAttribute("src", map);

        return "index";
    }
}
```
这样我们就可以在模板里通过`th:属性名="${变量名}"`这种方式来传值，比如:
```
<span th:text="${var1}"></span>
<a th:href="${src1}" >baidu</a>
<img th:src="${src.src1}" />
```
定义十分清楚，也很容易类比，支持层次选择，不再细说。

## 循环语句
当我们需要动态加载一些帖子的时候，我们经常需要用循环语句，Thymeleaf中循环语句也很简单，主要是依靠`th:each`这玩意来实现。
首先我们当然是在Controller里创建可供循环的List对象并传递给model:
```java
@Controller
public class IndexController {

    @RequestMapping(path = {"index", "/"}, method = {RequestMethod.GET})
    public String index(Model model) {
    
        List<String> list=new ArrayList<>();
        for(int i=0;i<10;i++){
            list.add(String.valueOf(i));
        }
        model.addAttribute("list", list);

        return "index";
    }
}
```
然后在需要循环的地方这样使用：
```html
<div th:each="value:${list}" th:text="${value}"></div>
```
就能循环渲染这个list里的元素了。

## 激活语句
所谓的激活语句(自己起得名字)，就是在某些情况下我们想根据变量的值来选择到底显示还是不显示这个标签。用法也很见简单，主要靠`th:if`跟`th:unless`:
```html
<div th:if="${judge}" >if clause</div>
<div th:unless="${judge}" >unless clause</div>
```
通过判断judge这个变量是否不为空来控制这个标签是否显示。。。if跟unless互为反义词。。。不解释了。。。

## 选择语句
类似于switch-case语句，非常简单，见下例：
```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
</div>
```
这段代码顺便体现了一个小细节，如果想在th名空间里直接填入字符串，我们必须再用一对引号来引用。。。


## 代码分割引用
thymeleaf也提供了类似import的东西，可以将很多代码块抽象成模块，然后在需要的时候引用，非常方便。具体的说，引用方式有两种--replace和include。
比如有两个文件
```html
<!--footer.html-->
<div th:fragment="copy">footer</div>
```
```html
<!--index.html-->
<div th:include="footer :: copy">index</div>
```
通过这样，我们就可以在index里面引用footer里面的这个div，我们用的是include，因此渲染的结果就是这样:
```html
<div>
    <div th:fragment="copy">footer</div>
</div>
```
如果是replace，那就是整个标签的替换，很好理解。
当然，除了用fragment来标识引用的部分，我们还可以用id来引用，具体可以参考文档。

有时候我们可能希望在引用的时候传递参数，我们可以在引用时加上这样的参数:
```html
<!--index.html-->
<div th:include="footer :: copy" th:with="param=${value}" >index</div>
```
这样我们就可以把index页面的value变量传递到footer页面里。非常简单。

## 引用js的坑
有时候我们想用js变量来保存模板传递的参数，我们可以这样来引用:
```javascript
<script th:inline="javascript">
/*<![CDATA[*/
    ...
    var username = /*[[${session.user.name}]]*/ 'Sebastian';
    ...
/*]]>*/
</script>
```
注意，这是官方推荐的写法，注意以下几点。

* 我们要用inline来指定这个script标签;
* 我们需要注释`<![CDATA[`,`]]>`对，否则就会无法在js中使用比较符号;
* 我们要用`[[${value}]]`来引用模板变量;
* 我们要在变量外面也套上注释`\**\`，并在后面添加上默认的值，这是为了前端开发人员能在没有后台的情况下正常渲染。

## 最后
当前我遇到的基本上靠上面的知识都足以解决了，更多高级用法可以直接读文档，到时候用到再来添加0.0。
