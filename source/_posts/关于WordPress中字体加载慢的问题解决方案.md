---
title: 关于WordPress中字体加载慢的问题解决方案
id: 1
categories:
  - Others
date: 2016-04-15 19:48:03
tags:
---

最近发现Wordpress有时候加载的特别慢，于是就想办法找了下原因。之前听网上说是因为wordpress用的是Google的字体库，而且是每次都要加载，导致访问慢的，于是当时装了个Disable Google Fonts的插件，禁用了Google字体，然后装了一个Useso take over Google插件，将字体文件改为360托管的字体库，这样就可以访问快点了。当时的效果的确挺好的，结果最近在使用的时候又发现网站访问慢了，用Chrome查了下资源加载的情况，发现访问useso的字体库的时间特别的长。这时候改用Google字体的时候反而更快了。。。这就十分令人惆怅了，有时候用useso的快，有时候用google的快，真的挺麻烦的。后来想想干脆把这个文件下到服务器上不就好了么。。。于是就倒腾出了下面的办法，将当前主题的字体文件下载到了服务器上。

## 一
首先在源代码中找到加载字体文件的位置，在博客首页的源代码中找到了下面这行：
```html
<link rel='stylesheet' id='baskerville_googleFonts-css'  href='//fonts.googleapis.com/css?family=Roboto+Slab%3A400%2C700%7CRoboto%3A400%2C400italic%2C700%2C700italic%2C300%7CPacifico%3A400&#038;ver=4.5' type='text/css' media='all' />
```
其实搜索fonts就可以找到了这行。根据这行，我们晓得他引用了googleapis的字体包，命名为'baskerville_googleFonts-css'，而'baskerville'事实上就是我当前的主题名。

## 二
然后我们需要在后台找到上面id对应的那个超链接的位置。打开wordpress的根文件夹，直接搜索'fonts.googleapis.com'这个关键字：
```
$find . -type f |xargs grep fonts.googleapis.com
```
查找结果为：
```
./wp-admin/includes/class-wp-press-this.php:	$open_sans_font_url = ',' . add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
./wp-content/themes/baskerville/functions.php:	    wp_register_style('baskerville_googleFonts',  '//fonts.googleapis.com/css?family=Roboto+Slab:400,700|Roboto:400,400italic,700,700italic,300|Pacifico:400' );
./wp-content/themes/baskerville/functions.php:    $font_url = '//fonts.googleapis.com/css?family=Roboto+Slab:400,700|Roboto:400,400italic,700,700italic,300';
./wp-includes/js/tinymce/plugins/compat3x/css/dialog.css:@import url("https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=latin-ext,latin");
./wp-includes/script-loader.php:	$open_sans_font_url = "https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=$subsets";
```
这样我们就找到了所在文件的位置。大概看一下，实际上用处比较大的是第二行的那串在主体中的定义（对比第一步的内容）（./wp-content/themes/baskerville/functions.php的内容）（其余都是写无关紧要的插件所用的字体）。很明显可以看出来，接下来我们只要把后面那个url换成本地的字体包就可以了。

## 三
现在就来下字体包，打开第一步中的那个链接，可以看到是下面的内容：
```css
/* latin */
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(http://fonts.gstatic.com/s/pacifico/v7/Q_Z9mv4hySLTMoMjnk_rCfesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}
/* cyrillic-ext */
@font-face {
......
```

发现是一段css，使用了很多的外部资源，下面我们就用一个爬虫来把他直接下下来并打包好：
```python
#coding:utf-8
import urllib2,cookielib,sys,re,os,urllib
import numpy as np

#网站登陆
cj=cookielib.CookieJar()
opener=urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
opener.addheaders=[('User-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36))')]
urllib2.install_opener(opener)

path='http://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Roboto:400,400italic,700,700italic,300|Pacifico:400'
request=urllib2.Request(path)
response=urllib2.urlopen(request)

html=response.read()
urls=re.findall(r'url\ ((.*?)\ )',html.replace('\n',' '))#由于这里排版会和latex冲突，所以在\和(，以及\和)之间加了空格，使用的时候要删掉

path='font_cache/'

if not os.path.exists(path):
    os.mkdir(path)
for url in urls:
    urllib.urlretrieve(url,path+url.split('/')[-1])#下载文件

for url in urls:
    html=html.replace(url,url.split('/')[-1])#更新改css文件

font=open(path+'font-css','w+')
font.write(html)#保存
```
这样就生成了一个font_cache文件夹，在这里有所有下好的字体文件以及更新新后的css文件

## 四
最后把这个文件上传到wordpress的根目录下（放到其他目录有时候会没有权限访问，有点麻烦），然后将function.php中的那个url改成`/font_cache/font-css`（相对于wordpress的根）即可。（记得备份初始文件防止改错。。。。）
