---
title: SpringBoot之拦截器用法
id: 2
categories:
  - Java
date: 2017-05-21 22:32:53
tags:
  - Java
  - Web
---

## 拦截器
我们知道做Web开发最知名的一个编程思路叫AOP--面向切面的编程。第一次接触到这个名词以为是跟面向对象编程一样是套很复杂的流程。然而实际接触下来才发现，这其实是一个非常简单的思想，能够解决非常现实的问题，比如登录问题。

我们知道很多网站在访问时是需要登录的，也就是说服务器在处理每一个访问之前，必须都要做一件事情，就是登录用户的身份确认。我们很容易想到一个解决方法，就是定义一个类，专门处理这个登录问题。但是这也是比较麻烦的事情，在每一个请求处理前都要写一些一模一样的代码来调用这个类，显然维护起来比较难受。那怎么办呢？这时候我们很容易想到在Web请求处理的生命周期里横插一刀，在对请求进行处理之前统一加上一个函数，做一些必须做的事情。那么这个函数就叫做切面，这个方法就叫做面向切面的编程。

不过事实上，切面也分种类，我们可以在通过请求的URL来进行过滤，也可以指定Controller的名字来进行过滤。有时候我们会通过Controller的名字来进行拦截，不过这需要添加一些额外的包，比如`spring-boot-starter-aop`。通常情况下我们使用的是对URL进行过滤，这就要用到我们SpringBoot自带的Interceptor机制了。

## 定义拦截器
为了定义一个拦截器，我们只需要定义一个Component，让他实现HandlerInterceptor接口：
```java
@Component
public class AppInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {

    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
```
事实上，HandlerInterceptor这个接口有三个重载方法，我们可以打开源码来看看:
```java
public interface HandlerInterceptor {

	/**
	 * Intercept the execution of a handler. Called after HandlerMapping determined
	 * an appropriate handler object, but before HandlerAdapter invokes the handler.
	 * <p>DispatcherServlet processes a handler in an execution chain, consisting
	 * of any number of interceptors, with the handler itself at the end.
	 * With this method, each interceptor can decide to abort the execution chain,
	 * typically sending a HTTP error or writing a custom response.
	 * <p><strong>Note:</strong> special considerations apply for asynchronous
	 * request processing. For more details see
	 * {@link org.springframework.web.servlet.AsyncHandlerInterceptor}.
	 * @param request current HTTP request
	 * @param response current HTTP response
	 * @param handler chosen handler to execute, for type and/or instance evaluation
	 * @return {@code true} if the execution chain should proceed with the
	 * next interceptor or the handler itself. Else, DispatcherServlet assumes
	 * that this interceptor has already dealt with the response itself.
	 * @throws Exception in case of errors
	 */
	boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception;

	/**
	 * Intercept the execution of a handler. Called after HandlerAdapter actually
	 * invoked the handler, but before the DispatcherServlet renders the view.
	 * Can expose additional model objects to the view via the given ModelAndView.
	 * <p>DispatcherServlet processes a handler in an execution chain, consisting
	 * of any number of interceptors, with the handler itself at the end.
	 * With this method, each interceptor can post-process an execution,
	 * getting applied in inverse order of the execution chain.
	 * <p><strong>Note:</strong> special considerations apply for asynchronous
	 * request processing. For more details see
	 * {@link org.springframework.web.servlet.AsyncHandlerInterceptor}.
	 * @param request current HTTP request
	 * @param response current HTTP response
	 * @param handler handler (or {@link HandlerMethod}) that started asynchronous
	 * execution, for type and/or instance examination
	 * @param modelAndView the {@code ModelAndView} that the handler returned
	 * (can also be {@code null})
	 * @throws Exception in case of errors
	 */
	void postHandle(
			HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
			throws Exception;

	/**
	 * Callback after completion of request processing, that is, after rendering
	 * the view. Will be called on any outcome of handler execution, thus allows
	 * for proper resource cleanup.
	 * <p>Note: Will only be called if this interceptor's {@code preHandle}
	 * method has successfully completed and returned {@code true}!
	 * <p>As with the {@code postHandle} method, the method will be invoked on each
	 * interceptor in the chain in reverse order, so the first interceptor will be
	 * the last to be invoked.
	 * <p><strong>Note:</strong> special considerations apply for asynchronous
	 * request processing. For more details see
	 * {@link org.springframework.web.servlet.AsyncHandlerInterceptor}.
	 * @param request current HTTP request
	 * @param response current HTTP response
	 * @param handler handler (or {@link HandlerMethod}) that started asynchronous
	 * execution, for type and/or instance examination
	 * @param ex exception thrown on handler execution, if any
	 * @throws Exception in case of errors
	 */
	void afterCompletion(
			HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception;

}
```
这三个函数就像三把刀，横着插进了服务端接受并处理请求的整个生命周期。
### preHandle
preHandle作用的地方是请求已经被`RequestMapping`分配到了不同的`Controller`里，但是还并未被`Controller`进行处理。
如果我们的目的是对登陆进行验证的话，那么这里就是我们主要的工作地点了。在这个过程里，我们可以验证用户的Cookie：
* 如果成功，则可以记录下当前User的信息，并且将这个信息保存到一个ThreadLocal的UserComponent里，方便以后的调用，并且将请求放行。
* 如果失败，则可以将请求通过response的sendRedirect函数重定向到登陆页面。
这里的返回值就是是否放行，如果不放行，那么客户端就收不到任何消息。显然我们一般都会放行。

### postHandle
postHandle作用的地方是请求已经被`Controller`处理了，但是还并未传递到网页模板进行渲染。因此我们可以看到postHandle的参数比preHandle多了一个ModelAndView这个参数。这个参数其实就包括了`Controller`处理后需要传递给模板的那个Model参数。
如果我们的目的是将拦截器得到的User信息统一渲染到模板上，那么我们只要在这个步骤做这件事就不会错了:
```java
@Override
public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
    if (modelAndView != null) {
        modelAndView.addObject("user", userComponent.getUser());
    }
}
```

### afterCompletion
afterCompletion显然就是处理一些收尾工作了，他作用的地方就是在页面被渲染之后即将返回给用户的时候。这里通常是清除一些局部变量，比如清除掉在前面保存的ThreadLocal的本地信息:
```java
@Override
public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
    userComponent.clear();
}
```

## 配置拦截器
当然，上面写了半天代码，我们并没有定义我们的拦截器的拦截规则，也没有在SpringBoot里做任何配置。下面我们就来进行相应的配置。
我们需要新建一个继承了`WebMvcConfigurerAdapter`的配置类，或者在原有配置类上进行修改。
```java
@Component
public class AppWebConfiguration extends WebMvcConfigurerAdapter {
    @Autowired
    AppInterceptor appInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(appInterceptor).addPathPatterns("/app/**");
        super.addInterceptors(registry);
    }
}
```
这个WebMvcConfigurerAdapter管理了很多的配置信息，就包括了拦截器的配置。
我们需要做的就是在这里通过依赖注入导入我们想注册的拦截器，然后通过重写`addInterceptors`方法来进行配置。
如果需要对拦截器进行过滤，我们只需要对`addInterceptors`返回的`InterceptorRegistration`对象进行处理。
这个`InterceptorRegistration`对象通常有两个方法`addPathPatterns`和`excludePathPatterns`，并且支持链式调用。
显然，这两个函数应该会接受一个用来进行匹配的字符串，跟普通的正则匹配的规则不同，这类规则我们通常称为`Ant path style`。

## Ant Path Style
这个规范的设计在`org.springframework.util.AntPathMatcher`里，基本上包括了下面的规则：
```
? matches one character
* matches zero or more characters
** matches zero or more directories in a path
{spring:[a-z]+} matches the regexp [a-z]+ as a path variable named "spring"
```

具体可以参照下面的例子：
```
com/t?st.jsp — matches com/test.jsp but also com/tast.jsp or com/txst.jsp
com/*.jsp — matches all .jsp files in the com directory
com/**/test.jsp — matches all test.jsp files underneath the com path
org/springframework/**/*.jsp — matches all .jsp files underneath the org/springframework path
org/**/servlet/bla.jsp — matches org/springframework/servlet/bla.jsp but also org/springframework/testing/servlet/bla.jsp and org/servlet/bla.jsp
com/{filename:\\w+}.jsp will match com/test.jsp and assign the value test to the filename variable
```
## 最后
通过上述步骤，我们就成功配置了一个拦截器。

## 参考资料
[learning-ant-path-style](http://stackoverflow.com/questions/2952196/learning-ant-path-style)
[Spring doc--AntPathMatcher](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/util/AntPathMatcher.html)
