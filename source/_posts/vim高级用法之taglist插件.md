---
title: vim高级用法之taglist插件
id: 1
categories:
  - Linux
date: 2016-01-13 22:17:11
tags:
  - Linux
---

之前有了ctags的基础，我们就可以实现另外一项炫酷的功能了。我们都知道在类似eclipse之类的ide中，都有能够显示当前函数和变量的outline窗口。能非常清楚的看出程序的架构，而且也方便程序员寻找。好了，开始迈出vim插件之旅的第一步。

## 下载安装

话说到现在我才知道原来vim有他的官网的:[www.vim.org](http://www.vim.org)，在这里照script条目就可以看到5000多个的插件了，搜索下taglist就可以找到最新的版本了：[taglist_46.zip](http://www.vim.org/scripts/download_script.php?src_id=19574)。

下载下来并解压会有两个文件夹，doc/和plugin/。意图很明显了。我们只要把他们放到~/.vim路径下对应的文件夹里就行了（如果没有对应的文件夹就创建一个）。

搞定后打开一个vim,在行末模式下输入:`:helptags ~/.vim/doc/`，这样就能用`:help taglist.txt`来查看帮助文档了。

## vim中的简单配置

首先当然是要简单配置一下了，直接上代码，已经注释的很清楚了：
```
""""""""""""""""""""""""""""""""""
" Taglist
"set mouse=a                            "这个设置是必须的，这样才能点击标签
let Tlist_Ctags_Cmd = 'ctags'           "设置ctags命令的路径
let Tlist_Show_One_File = 1             "不同时显示多个文件的tag
let Tlist_Exit_OnlyWindow = 1           "如果taglist是当前最后一个窗口则退出vim
let Tlist_Use_Right_Window = 1          "设置窗口位置为右边（默认在左>边）
let Tlist_Sort_Type='name'              "设置Tlist的排序方式为按名称排序，默认为按出现顺序
let Tlist_Use_SingleClick=1             "设置单击一次tag即跳转到定义，默认为双击
"let Tlist_Auto_Open = 1                "设置开启vim自动打开Tlist
"let Tlist_Close_On_Select = 1          "设置在选择tag后自动关闭Tlist}
let Tlist_Process_File_Always=1         "在不显示Tlist的时候仍然解析tags
nnoremap <silent> <F8> :TlistToggle<CR> "映射F8为打开和关闭Tlist的快捷键(在normal模式下)

""""""""""""""""""""""""""""""""""
```
当然在不配置的情况下，在行末模式下输入`:TlistOpen`可以打开窗口。

## 效果图

![](/images/2016/01/13/1/1.png)


另外，使用后发现其实效果并没有想象中那么好。界面比较丑，非全屏模式下丑的不能看，而且代码识别的相应程度也不好，必须要先保存文件他才会识别。不过如果熟练掌握了应该也是一个很强大的东西吧。