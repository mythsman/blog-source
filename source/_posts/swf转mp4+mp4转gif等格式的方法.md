---
title: swf转mp4+mp4转gif等格式的方法
id: 1
categories:
  - Linux
date: 2016-11-02 21:32:53
tags:
  - Linux
---

## 前言

我们都知道swf文件（ShockwaveFlash的简称，读作swiff）在前几年是非常火的，由于他是基于矢量绘图的flash动画文件，他的图像效果，交互效果等都非常出色，而且文件本身还很小巧，尤其适合在网页端进行显示，以至于很多的演示视频，甚至小游戏都是用swf文件来保存的。不过近几年随着Html5的发展，他在移动端的优点渐渐消失，甚至很多浏览器也开始不支持flash插件。而且如果在电脑上运行还得额外安装flash player，很是麻烦。比如很多情况下，我们还是需要在网页中播放swf文件进行演示，或者将这个swf文件放到另外一台电脑中播放，这样我们还得搞定用户浏览器是否支持flash插件或者另外一台电脑是否安装了flash player。因此最方便的做法就是提前把swf文件转化为mp4视频文件进行播放，甚至是直接制作成动态图片的效果。

这个需求显然是存在的，那么有什么解决的办法呢？

## 方法一：在线格式转换&转换软件

无论是baidu，还是google，只要搜索类似"swf 转 mp4"之类的关键词，我们大概都能搜到很多在线转换的网站。当然，这些网站据称是能完美将swf转换成mp4等视频格式。然而当你真正试的时候才会发现，或许有的swf文件能正确转换，然而对大多数swf文件进行转换的时候我们就会发现，转换后的文件可能只会保留音频信息，我们只能看到一片漆黑。这是因为swf文件与mp4等流媒体文件有着本质的不同，因为他并是以完整的图片帧为播放单位的，很多情况下他以矢量图形块的形式进行保存的，然后对图形发出指令进行旋转啊位移之类的操作，甚至可以还接受用户的指令。而流媒体文件则完全是以帧的形式一帧一帧的向显示器发送图片。

比如对于某一个swf文件，我对他进行元素的提取：

```
$ swfextract contrast-movie.swf
Objects in file contrast-movie.swf:
 [-i] 7 Shapes: ID(s) 3, 6, 7, 9, 12, 16, 22
 [-i] 1 MovieClip: ID(s) 23
 [-F] 4 Fonts: ID(s) 1, 4, 17, 18
 [-f] 1 Frame: ID(s) 0
 [-m] 1 MP3 Soundstream
```

我们可以发现他是由形状、字体等要件构成的，而一般的swf2mp4之类的在线转换器只能识别出其中的音频流部分，无法处理图像信息。因此这个方法基本是不适用的。

当然，网上也有很多类似的转换软件，但经我测试，是基本都是垃圾软件。。。甚至是格式工厂这类比较知名的软件，也无法完美处理swf的转换问题。

## 方法二：利用swfTools工具

ubuntu社区中集成了swfTools工具包（通过`$sudo apt install swftools` 进行安装即可），这个工具包里有很多对swf进行处理的命令，比如swfbbox、swfcombine swfextract、 swfstrings 、swfc、 swfdump、 swfrender，等一系列工具，包括了对swf进行编译、拆分、提取素材、提取音频、提取字体、查看信息等方法。其中swfrender命令就可以将swf提取成图片帧。

比如对我想将a.swf提取成图片帧，那我只要输入命令`$swfrender a.swf` ，就会一次生成很多个png图片，再对这些图片进行后期处理即可生成想要的内容。

虽然对于大多数swf还是能很好的处理成图片帧的，但是还是会有一些小问题，比如各个帧之间会存在干扰、帧的背景是透明的等问题。显然这个命令也不是很成熟(或者是我还不怎么会用)。。。

## 方法三：土方法

所谓土方法，就是最朴素的方法了，既然我不能直接转换，那我干脆就播放出来然后截屏好了。没错，这就是我捣鼓半天之后找到的最好的方法了。。。

ubuntu下播放swf的工具是swfdec-gnome，可以通过`$ sudo apt install swfdec-gnome` 的命令进行安装。

ubuntu下有一个很方便的录屏工具叫Kazam，可以通过`$ sudo apt install kazam`进行安装，

![a](/images/2016/11/02/1/1.png)


这个程序能够截取一小段窗口进行屏幕录制，并且可以选择是否带声音，非常方便。因此我们只要用 swfdec-gnome程序包中的Gnash SWF Viewer 打开swf文件，再进行录屏即可得到一个视频文件。

如果想把视频文件转换成gif格式的图片，我们只要再利用imagemagick的convert命令，将a.mp4文件转换成图片帧(注意图片名的格式控制)：

```
convert a.mp4 out%03d.png
$ls
out-000.png    out-198.png  out-295.png  out-392.png
out-100.png  out-199.png  out-296.png  out-393.png
out-101.png  out-19.png   out-297.png  out-394.png
......
out-102.png  out-001.png    out-298.png  out-395.png
out-195.png  out-292.png  out-038.png   out-099.png
out-196.png  out-293.png  out-390.png  out-009.png
out-197.png  out-294.png  out-391.png  a.mp4
```

这样我们就得到了依次标号的图片帧。再用convert命令将这些图片帧转换成gif图片即可:

`$ convert *.png out.gif`

当然，我们一般还要稍微优化压缩下，然后调解下帧率，通常会加下面的参数：

`$ convert -delay 5 -layers Optimize *.png out.gif`

这样一般就能得到我们想要的动图了。一般这样得到的gif图片也不会太大。

当然，我们也可以把这两步进行合并，一次性生成：

`$ convert -delay 5 -layers Optimize a.mp4 out.gif`