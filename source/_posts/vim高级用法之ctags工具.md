---
title: vim高级用法之ctags工具
id: 1
categories:
  - Linux
date: 2016-01-11 22:59:32
tags:
  - Linux
  - Vim
---

都说vim强大，然而之前的简单用法并没有让我觉得vim有多强大，顶多是一个功能齐全的记事本，只到我发现了这个工具－－ctags，以及由他衍生出来的很多插件，让我明白了，“哦，vim 至少可以作为一个很不错的C语言的IDE”。～～

## 概述

ctags工具其实可以认为是为C语言的文件添加索引的工具。C文件经过他的处理后会生成一个tags文件来保存文件中所有函数、变量、宏的索引，通过这个索引，就能非常方便的在后续的编辑过程中获取这些信息，从而达到自动补全、识别函数和变量等一系列的功能。

## 安装

ctags工具有他的官网可以下载，但是实际上我们并不需要手动安装。一般情况下ubuntu系统内会自带ctags工具，他的名字叫：exuberant-ctags（朝气蓬勃的C标签0.0）。可以通过`$ ctags --version `命令来查看版本。如果没有，则只需要`$ sudo apt-get install exuberant-ctags` 就可以直接下载使用了。

## 使用

首先，对我们需要索引的文件进行预处理：`$ctags foo.cpp`（当然，如果需要递归处理所有子文件夹的话可以加 -R 参数，如： `$ctags -R`）。

预处理后，我们会发现在当前文件夹下出现了名叫tags的文件。比如，对于如下的cpp文件：
```cpp
#include<stdio.h>
struct FOO{

};
void fun(){

}
int global;
int main(){
        fun();
        FOO foo;
        int local;
}
```
生成的tags文件是这样的：
```
!_TAG_FILE_FORMAT       2       /extended format; --format=1 will not append ;" to lines/
!_TAG_FILE_SORTED       1       /0=unsorted, 1=sorted, 2=foldcase/
!_TAG_PROGRAM_AUTHOR    Darren Hiebert  /dhiebert@users.sourceforge.net/
!_TAG_PROGRAM_NAME      Exuberant Ctags //
!_TAG_PROGRAM_URL       http://ctags.sourceforge.net    /official site/
!_TAG_PROGRAM_VERSION   5.9~svn20110310 //
FOO     a.cpp   /^struct FOO{$/;"       s       file:
fun     a.cpp   /^void fun(){$/;"       f
global  a.cpp   /^int global;$/;"       v
main    a.cpp   /^int main(){$/;"       f
```
大概解释一下他的文件格式就是：
```
格式：{tagname} {TAB} {tagfile} {TAB} {tagaddress} {term} {field} ..
• {tagname} - 标识符名字,例如函数名、类名、结构名、宏等。不能包含制表符。
• {tagfile} - 包含 {tagname} 的文件。它不能包含制表符。
• {tagaddress} - 可以定位到 {tagname}光标位置的 Ex 命令。通常只包含行号或搜索命令。出于安全的考虑,vim会限制其中某些命令的执行。
• {term} - 设为 ;" ,这是为了兼容Vi编辑器,使Vi忽略后面的{field}字段。
• {field} .. - 此字段可选,通常用于表示此{tagname}的类型是函数、类、宏或是其它。
!_TAG_FILE_SORTED<Tab>1<Tab>{anything}
上面这个标记说明tag文件是经过排序的,并且排序时区分了大小写,对排序的tag,vim会使用二分法来进行查找,大大加快了查找速度;如果值为0,则表示tag文件未经排序;如果值为2,则表示tag文件是忽略大小写排序的。
```
其实就是规定一种保存结构体、函数名、和全局变量的索引了。

经过这样的处理之后，我们就可以使用他带来的非常实用的操作了：

1.  对于已经建立索引的条目，我们可以用`Ctrl+]` 的快捷键来快速找到他的声明，即使是位于不同文件（就像很多IDE中的F12用来查看声明一样），查看完之后可以通过`Ctrl+t ` 或`Ctrl+o` 来返回原来的地方。
2.  选中局部变量，按`gd` 可以搜索到该变量的声明。
3.  选中单词，按`*`可以转到该单词下一次出现的地方。
4.  选中单词，按`#`可以转到该单词上一次出现的地方。
5.  在行末模式下输入`:ta foo` 可以立刻找到foo函数的声明。

## 注意

要使用tags文件，默认是必须要在当前含有tags文件的地方打开vim才能加载到tags文件，否则需要在行末模式下手动指定`:set tags=（你存放tags文件的路径，如果有多个路径的话中间用,隔开，而且貌似不支持*之类的通配符）` 或者在`/etc/vim/vimrc`里面加上这句话，或者在`~/.vimrc` 里面加上这句话。


晓得了这个工具，就像是打开了vim 插件类工具的大门，强大的 vim 配置就要诞生了。
