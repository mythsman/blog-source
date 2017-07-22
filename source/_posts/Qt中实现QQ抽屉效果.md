---
title: Qt中实现QQ抽屉效果
id: 1
categories:
  - Qt
date: 2015-10-28 13:45:33
tags:
  - Qt
---

本节主要介绍利用QToolBox类实现抽屉效果。

所谓抽屉效果，就是类似QQ的好友分组的效果，每一个分组都可以独立打开和折叠。这样可以以一种动态直观的方式在有限大小的界面上扩展出更多的功能。

具体用法见代码：

## Dialog.pro
```cpp
#-------------------------------------------------
#
# Project created by QtCreator 2015-10-24T17:32:35
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Dialog
TEMPLATE = app

SOURCES += main.cpp 
    dialog.cpp

HEADERS  += 
    dialog.h
</pre>
2、dialog.h
<pre class="minimize:true lang:c++ decode:true">#ifndef DIALOG_H
#define DIALOG_H

#include<QDialog>
#include<QVBoxLayout>
#include<QGroupBox>
#include<QToolBox>
#include<QToolButton>
class Drawer : public QToolBox//注意这里是继承自QToolBox。。
{
    Q_OBJECT

public:
    Drawer(QWidget *parent = 0);
    ~Drawer();
public:
    QToolButton *tBtn1[5],*tBtn2[2],*tBtn3[2];//QToolButton类主要用于设置在工具栏中快速访问的按钮，这里姑且用一下。
    QGroupBox *groupBox[3];//这里QGroupBox是用来组织各个按钮的。
    QVBoxLayout *layout;//这里用QVBoxLayout来处理各个QGroupBox
};

#endif // DIALOG_H
```
## dialog.cpp
```cpp
#include "dialog.h"

Drawer::Drawer(QWidget *parent)
    : QToolBox(parent)
{
    setWindowTitle("The Drawer");

    groupBox[0]=new QGroupBox;
    groupBox[1]=new QGroupBox;
    groupBox[2]=new QGroupBox;

    layout=new QVBoxLayout(groupBox[0]);//用layout来处理每个groupbox
    layout->setMargin(10);
    layout->setAlignment(Qt::AlignHCenter);//设置对齐模式
    for(int i=0;i<5;i++){
        tBtn1[i]=new QToolButton;
        tBtn1[i]->setText("Button"+QString().setNum(i+1)+"nnnnn");
        layout->addWidget(tBtn1[i]);//在groupbox中加入按钮
    }
    layout->addStretch();//拉伸布局，使部件能够对齐

    layout=new QVBoxLayout(groupBox[1]);
    layout->setMargin(10);
    layout->setAlignment(Qt::AlignHCenter);
    for(int i=0;i<2;i++){
        tBtn2[i]=new QToolButton;
        tBtn2[i]->setText("Button"+QString().setNum(i+1));
        layout->addWidget(tBtn2[i]);
    }
    layout->addStretch();

    layout=new QVBoxLayout(groupBox[2]);
    layout->setMargin(10);
    layout->setAlignment(Qt::AlignHCenter);
    for(int i=0;i<2;i++){
        tBtn3[i]=new QToolButton;
        tBtn3[i]->setText("Button"+QString().setNum(i+1));
        layout->addWidget(tBtn3[i]);
    }
    layout->addStretch();

    this->addItem(groupBox[0],"family");//在当前的QToolBox中添加部件即可
    this->addItem(groupBox[1],"friends");
    this->addItem(groupBox[2],"strangers");
}
Drawer::~Drawer()
{

}
```
## 运行截图

![](/images/2015/10/28/1.png)
![](/images/2015/10/28/2.png)
![](/images/2015/10/28/3.png)

