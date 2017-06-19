---
title: Ubuntu中命令行下的图片查看器eog
id: 1
categories:
  - Linux
date: 2016-01-08 10:37:15
tags:
  - Linux
---

有时候在命令行下看文件的时候突然遇到个图片，这个又不能直接在命令行下查看，还得手动在桌面上打开文件来查看，十分的不方便。其实ubuntu本身自带的图像查看器就带了一个命令行下打开的接口------eog 命令（eye of gnome 的缩写，十分好记）。

## 命令
```
EOG(1)                 General Commands Manual                EOG(1)

NAME
       eog - a GNOME image viewer

SYNOPSIS
       eog [options] files...

DESCRIPTION
       An image viewer for GNOME which uses gdk_pixbuf
```
用man 命令可以看到用法，其实通常option 选项可以忽略，直接在后面接文件名即可，非常的方便。

## 附加
后来发现，其实Linux桌面下绝大多数图片查看器都可以用命令行打开，比如使用shotwell命令也可以从命令行查看图片。。