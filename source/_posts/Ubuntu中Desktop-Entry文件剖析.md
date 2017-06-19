---
title: Ubuntu中Desktop Entry文件剖析
id: 7
categories:
  - Linux
date: 2015-10-04 20:40:58
tags:
  - Linux
---

## 前言
很多情况下，当我们通过别的渠道安装了程序包之后，发现dash中并没有收录这个程序，想使用的话还得通过输命令或者执行脚本，显得很麻烦。其实，Linux  KDE 或者Linux GNOME下这种东西完全可以自己配置，而且弄得比windows下还要漂亮。我们用到的工具就是Desktop Entry文件系统。

## 文件样例
一般情况下我们都吧*.desktop文件放在/usr/share/applications/目录下，文件夹下的每一个文件就对应这dash菜单内的一个程序，我们任意打开一个文件来看一看这里面都写了啥：
```
myths@myths-X450LD:/usr/share/applications$ cat libreoffice-writer.desktop[Desktop Entry]
Version=1.0
Encoding = UTF-8
Name=LibreOffice Writer
GenericName[zh_CN]=字处理器
Comment[zh_CN]=使用 Writer 创建并编辑信函、报表、文档和网页中的文本和图形。
Type=Application
Exec=libreoffice --writer %U
Icon=libreoffice-writer
Terminal=false
Categories=Office;WordProcessor;X-Red-Hat-Base;X-MandrivaLinux-Office-Wordprocessors;
MimeType=application/vnd.oasis.opendocument.text;...;application/vnd.palm;application/clarisworks;
StartupNotify=true
Keywords=Text;Letter;Fax;Document;OpenDocument Text;Microsoft Word;Microsoft Works;Lotus WordPro;OpenOffice Writer;CV;odt;doc;docx;rtf;
InitialPreference=5
StartupWMClass=libreoffice-writer
X-KDE-Protocols=file,http,smb,ftp,webdav
Actions=NewDocument;
[Desktop Action NewDocument]
Name=New Document
Exec=libreoffice --writer
OnlyShowIn=Unity;
```
（中间的MimeType有点长，我给用...代替了，而且Comment和GenericName本来支持多种语言的，这里就给精简了0.0）

下面我们就来正式的看一下这写的究竟是啥。

## 简要分析
首先一般是以[Desktop Entry]开头，表明格式。剩下的就是以键值对的形式指明各种属性值。Desktop Entry 文件标准定义了一系列标准关键字。标准关键字分为必选和可选两种：必选标准关键字必须在 .desktop 文件中被定义；而可选关键字则不必。以下是对重点关键字的解析：

* 关键字”Version“：[可选]该数值指定了当前 Desktop Entry 文件所遵循的 Desktop Entry 文件标准版本。

* 关键字"Encoding"：[可选]1.0 版本不推荐使用 该数值指定了当前 Desktop Entry 文件中特定字符串所使用的编码方式。尽管Desktop Entry 文件标准 1.0 不再推荐使用该关键字，但由于历史原因该关键字仍然广泛出现在现有的 Desktop Entry 文件中。

* 关键字"Name"：[必选]该数值指定了相关应用程序的名称。打开dash，显示的名字就是了。

* 关键字"GenericName"：[可选]该数值指定了相关应用程序的通用名称。

* 关键字"Comment"：[可选]该数值是对当前Desktop Entry的简单描述。就是dash中右键出来的评论。

* 关键字"Type"：[必选]关键字"Type"定义了Desktop Entry文件的类型。常见的"Type"数值是"Application"和"Link"。"Type = Application"表示当前Desktop Entry文件指向了一个应用程序；而"Type = Link"表示当前Desktop Entry文件指向了一个URL (Uniform Resource Locator)。

*   关键字"Exec"：[可选]关键字"Exec"只有在"Type"类型是"Application"时才有意义。"Exec"的数值定义了启动指定应用程序所要执行的命令，在此命令是可以带参数的。通常就是在命令行执行程序或者脚本的命令，比如我的mc配置的就是
```Exec=/home/myths/Download/Minecraft/minecraft.sh。```

* 关键字"URL"：[可选]关键字"URL"只有在"Type"类型是"Link"时才有意义。"URL"的数值定义了该Desktop Entry文件指向的URL。

* 关键字"Icon"：[可选]该数值定义了当前Desktop Entry文件在应用程序浏览器或是在文件浏览器中所显示的图标。一般关键字"Icon"的数值是以绝对路径的格式给出（其实是不知道系统给的相对路径是啥0.0），那么其数值所指定图标文件将被使用。

* 关键字"Terminal"：[可选]该关键字的数值是布尔值，并且该关键字只有在"Type"类型是"Application"时才有意义。其数值指出了相关应用程序（即关键字"Exec"的数值）是否需要在终端窗口中运行。

* 关键字"Categories"：[可选]关键字"Categories"只有在"Type"类型是"Application"时才有意义。"Categories"的数值指出了相关应用程序在菜单中显示的类别。具体菜单分类由规范"Desktop Specification Menu"具体定义。（一般没必要写）

基本上常见的就是这些属性，毕竟自己搞的玩意也没有必要多标准，凑合用就行啦。
