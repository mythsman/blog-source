---
title: 利用jQuery异步上传文件的插件
id: 1
categories:
  - Web
date: 2016-06-04 21:24:50
tags:
  - Web
---

现在想实现用ajax来上传文件的功能，但是却发现Jquery自带的ajax方法只能上传文件名，而不能上传文件；用form提交虽然能够上传文件，但是却要刷新页面。。。多方查找下找到了一个可用的jQuery插件，刚好可以满足异步上传文件的要求。

## 代码

[jquery.form.js](http://jquery.malsup.com/form/#download)

## 用法

这个插件是基于表单提交的，我们只要正常的写一段提交文件的表单，如：
```html
<form id="myForm" action="comment.php" method="post" enctype="multipart/form-data">
    <input type="file" name="name" />
    <input type="submit" value="Submit Comment" />
</form>
```
然后在js中加上如下代码：
```
<html>
<head>
    <script src="jquery.js"></script>
    <script src="jquery.form.js"></script>
    <script>
        $(document).ready(function() {
            $('#myForm').ajaxForm(function(data) {
                alert(data);
            });
        });
    </script>
</head>
```
这样就可以监听表单的提交事件，把它变成ajax传送到后台，然后将后台返回的信息从data中获取。如此一来就可以用ajax通信来传输文件了。
