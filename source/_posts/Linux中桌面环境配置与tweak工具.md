---
title: Linux中桌面环境配置与tweak工具
id: 1
categories:
  - Linux
date: 2015-12-25 15:30:29
tags:
  - Linux
---

因为Linux是高度自制的，所以几乎任何的设置都可以自行调节，包括主题和桌面效果。

事实上，主题特效是可以调节为任意效果的，甚至可以调节成Mac的样子（当然这样有点二）。

Ubuntu中调节桌面效果的文件路径为:/usr/share/themes/，路径下是这样的：
```
myths@myths-X450LD:/usr/share/themes$ ls
AgingGorilla  Atlanta  Crux     Emacs  HighContrast  Radiance  Simple
Ambiance      Bright   Default  Esco   Metabox       Raleigh
```
每个文件夹就是每个主题了。如果我们想修改主题，我们只需要查询相关文档进行修改即可。

比如如果想调节Ambiance主题下窗口标题的透明度，可以打开/usr/share/themes/Ambiance/gtk-3.0/apps/unity.css文件：

将 UnityDecoration.top 的 background-image 设置由：
```
from (shade (@dark_bg_color, 1.5)),
to (shade (@dark_bg_color, 1.04)));
```
修改为：
```
from (shade (alpha (@dark_bg_color, 0.4), 1.5)),
to (shade (alpha (@dark_bg_color, 0.4), 1.04)));
```
将UnityDecoration.top:backdrop 的 background-image 设置由：
```
from (shade (#474642, 0.92)),
to (@dark_bg_color));
```
修改为：
```
from (shade (alpha (#474642, 0.4), 0.92)),
to (alpha (@dark_bg_color, 0.4)));
```
保存后，重新载入主题即可生效。


事实上事情还可以简单点，Ubuntu下有修改桌面效果的现成的软件包：tweak，用这个可以更加方便的修改主题。

安装：`$ sudo apt-get install unity-tweak-tool`

界面：

![](/images/2015/12/25/1/1.png)

简单易懂，用起来更加方便了。