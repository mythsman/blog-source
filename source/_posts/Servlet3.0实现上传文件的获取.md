---
title: Servlet3.0实现上传文件的获取
id: 1
categories:
  - Web
date: 2016-06-06 00:38:29
tags:
  - Web
  - Java
---

据说在以前的Servlet版本中，如果想要处理form中post过来的文件数据的话，那么还必须下载第三方的包，比如commons-fileupload等，很是麻烦。但是现在的Servlet版本中已经可以支持对file数据的直接处理，这里姑且记录下简单的用法。

## Html端

前端中只要写一个正常提交的表单即可，比如下面这样：
```html
<form action="Display" method="post" enctype="multipart/form-data">
                <label>上传文件：<label>
                <input type="file" name="file">
                <input type="submit" value="上传">
</form>
```
当然也可以用[ajax的form](/2016/06/04/1/)来提交，这都无妨。


## Servlet端

首先需要在Servlet类定义前加上`@MultipartConfig`标注，然后在doPost方法里这么写：
```java
protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
        //设置字符集
	request.setCharacterEncoding("utf-8");
        //用parts来接收数据并保存到本地路径中（考虑到可能有多个文件，因此循环读入）
	Collection<Part> parts = request.getParts();
	for (Part part : parts) {
		part.write("tmp.txt");
                //对tmp.txt做点什么
	}
        //返回信息
	PrintWriter out = response.getWriter();
	out.println("上传成功");
	out.flush();
	out.close();
}
```
这样就可以将客户上传的文件在本地保存下来了，非常简单方便（但是不知道的话还真的很麻烦）。

通常这样就足够了，但是有时候我们还需要知道文件的名字，这就稍微麻烦一点了，还得解析协议的header来获得文件名：
```java
protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
        //设置字符集
	request.setCharacterEncoding("utf-8");

        Part part = request.getPart("file");//通过表单file控件(<input type="file" name="file">)的名字直接获取Part对象

        String header = part.getHeader("content-disposition");//获取请求头，请求头的格式：form-data; name="file"; filename="snmp4j--api.zip"

        String fileName = getFileName(header);//获取文件名

	part.write(fileName);

        //返回信息
	PrintWriter out = response.getWriter();
	out.println("上传成功");
	out.flush();
	out.close();
}

public String getFileName(String header) {
    /**
    * String[] tempArr1 = header.split(";");代码执行完之后，在不同的浏览器下，tempArr1数组里面的内容稍有区别
    * 火狐或者google浏览器下：tempArr1={form-data,name="file",filename="snmp4j--api.zip"}
    * IE浏览器下：tempArr1={form-data,name="file",filename="E:\snmp4j--api.zip"}
    */
    String[] tempArr1 = header.split(";");
    /**
    *火狐或者google浏览器下：tempArr2={filename,"snmp4j--api.zip"}
    *IE浏览器下：tempArr2={filename,"E:\snmp4j--api.zip"}
    */
    String[] tempArr2 = tempArr1[2].split("=");
    /获取文件名，兼容各种浏览器的写法
    String fileName = tempArr2[1].substring(tempArr2[1].lastIndexOf("\\")+1).replaceAll("\"", "");
    return fileName;
}
```
## 参考

[使用Servlet3.0提供的API实现文件上传](http://www.cnblogs.com/xdp-gacl/p/4224960.html)