---
title: Angular2下使用pdf插件
id: 1
categories:
  - Web
date: 2017-03-14 23:53:23
tags:
  - Web
---
## 前言
最近需要在Angualr2建的项目里做一个pdf显示的功能，在网上找了个插件，不过由于是第一次使用额外插件，在用的时候遇到了一些坑，这里权且记一下使用的步骤，方便以后的参考。

## 安装
这里需要安装两个包：`pdfjs-dist`和`ng2-pdf-viewer`，安装时是要顺便保存到`package.json`里的，因此在项目根目录下输入下面命令：
```
npm install pdfjs-dist --save
npm install ng2-pdf-viewer --save
```
于此同时，我们还要在`system.config.js`里添加映射，否则会加载不到这个插件。我们需要添加两个地方，首先是要添加在其中的`map`变量下：
```
var map = {
    ......
    'ng2-pdf-viewer': 'node_modules/ng2-pdf-viewer',
    'pdfjs-dist': 'node_modules/pdfjs-dist'
}
```
然后还要添加在`packages`变量下：
```
var packages = {
    'ng2-pdf-viewer': { main: 'dist/index.js', defaultExtension: 'js' },
    'pdfjs-dist': { defaultExtension: 'js' }
}
```
这样我们才能正确的引用这个包。

## 注册主配置文件
要使用他，我们还要在`app.module.ts`文件里注册这个包，才能在其他文件里使用，一个最简单的配置如下：
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent, PdfViewerComponent],
  bootstrap: [AppComponent]
})

class AppModule {}
platformBrowserDynamic().bootstrapModule(AppModule);
```
注意要`import`，然后在`@NgModule`里的`declarations`里注册即可。

## 页面配置
在模板页面中，只要在适当的位置添加类似下面的标签：
```
  <pdf-viewer [src]="pdfSrc"
              [page]="page"
              [original-size]="true"
              style="display: block;"
  ></pdf-viewer>
```
然后在`.ts`文件里定义`pdfSrc`以及`page`变量，即可控制显示的文件路径以及页数。
这里需要注意的是文件源如果是跨域的话是会报一个error的，而且这里的page是竖排显示的而不是带滚轮的显示，因此这实际上显示的是一张一张的图片。

当然，`pdf-viewer`还有很多其他的属性，比如支持缩放，旋转，以及提供了一系列相关的回调函数，具体的可以在[github](https://github.com/VadimDez/ng2-pdf-viewer)里找到。

## 样例
![](/images/2017/03/14/1/1.png)

## 参考
[github/VadimDez/ng2-pdf-viewer](https://github.com/VadimDez/ng2-pdf-viewer)
[SYSTEMJS.md](https://github.com/VadimDez/ng2-pdf-viewer/blob/master/SYSTEMJS.md)
[Angular 2 PDF Viewer and thumbnail creation](http://codevik.com/2016/11/11/angular2-ng2-pdf-thumbnail-creation-viewer/)
