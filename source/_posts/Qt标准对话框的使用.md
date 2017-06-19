---
title: Qt标准对话框的使用
id: 1
categories:
  - Qt
date: 2015-10-24 21:58:05
tags:
  - Qt
---

学习编程个人觉得还是得从代码谈起，一方面有利于加深理解，另一方面也方便使（摘）用（抄）。

这一节只要是理解简单的对话框的编写框架和一些基本的标准对话框的使用方法。一些具体的说明将在源码中分析。

## Dialog.pro（Qt的基本文件）
```cpp
#-------------------------------------------------
#
# Project created by QtCreator 2015-10-24T17:38:36
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = DIalog
TEMPLATE = app

SOURCES += main.cpp
        dialog.cpp

HEADERS  += dialog.h
```
## dialog.h（对话框类的声明）
```cpp
#ifndef DIALOG_H
#define DIALOG_H
#include<QApplication>
#include <QDialog>
#include<QGridLayout>
#include<QPushButton>
#include<QLineEdit>
#include<QFrame>
#include<QString>
#include<QFileDialog>
#include<QColor>
#include<QColorDialog>
#include<QFont>
#include<QFontDialog>
class Dialog : public QDialog
{
    Q_OBJECT

public:
    Dialog(QWidget *parent = 0);
    ~Dialog();
public://以下是使用到的控件的声明
    QGridLayout *layout;
    QPushButton *filePushButton,*colorPushButton,*fontPushButton;
    QLineEdit *fileLineEdit,*fontLineEdit;
    QFrame *colorFrame;
private slots://以下是用到的槽，各对应一个信号（事件）
    void slotOpenFileDlg();
    void slotOpenColorDlg();
    void slotOpenFontDlg();
};

#endif // DIALOG_H
```

## dialog.cpp（类的实现－－－重要－－－）
```cpp
#include "dialog.h"

Dialog::Dialog(QWidget *parent)
    : QDialog(parent)
{

    setWindowTitle(tr("This is the title."));//设置对话框标题,这里有个tr()函数，用途好像是为了实现国际化的一个翻译函数。。。不太懂，不过目测问题挺多的，小规模的程序感觉没什么必要用，以后就不用这个了。

    layout=new QGridLayout(this);//这句是把当前的布局交给layout来表示

    //创建按钮控件并设置Text属性
    filePushButton =new QPushButton;
    filePushButton->setText("File Dialog");
    colorPushButton=new QPushButton;
    colorPushButton->setText("Color Dialog");
    fontPushButton=new QPushButton;
    fontPushButton->setText("Font Dialog");

    fileLineEdit =new QLineEdit; //QLineEdit类代表编辑框，它可以让用户输入一个单行文本。

    //QFrame 类，这个姑且用来显示当前选择的颜色
    colorFrame=new QFrame;
    colorFrame->setFrameShape(QFrame::Box);//设置来自框架风格的框架外形值,一般就这个。
    colorFrame->setAutoFillBackground(true);//是否自动刷新填充色，这里我们需要设为true

　　 //文本编辑框，用来显示样例字体
    fontLineEdit=new QLineEdit;
    fontLineEdit->setText("Hello world.");

　　 //设置布局，这里是GridLayout,用addWidget方法设置控件的相对位置
    layout->addWidget(filePushButton,0,0);
    layout->addWidget(fileLineEdit,0,1);
    layout->addWidget(colorPushButton,1,0);
    layout->addWidget(colorFrame,1,1);
    layout->addWidget(fontPushButton,2,0);
    layout->addWidget(fontLineEdit,2,1);
    layout->setMargin(15);//设置到上下左右边界的距离
    layout->setSpacing(10);//设置各个控件之间的空隙

　　 //信号和槽的连接，连接各个按钮的点击事件
    connect(filePushButton,SIGNAL(clicked()),this,SLOT(slotOpenFileDlg()));
    connect(colorPushButton,SIGNAL(clicked()),this,SLOT(slotOpenColorDlg()));
    connect(fontPushButton,SIGNAL(clicked()),this,SLOT(slotOpenFontDlg()));
}

Dialog::~Dialog()
{

}

//打开标准文件选择对话框
void Dialog::slotOpenFileDlg(){
    //传入句柄，标题，默认目录，文件类型(多种文件的话用;;分开)，返回选择的文件名，或者一个空串
    QString s=QFileDialog::getOpenFileName(this,"open file dialog","/","C++ files(*.cpp);;C files(*.c)");
    fileLineEdit->setText(s);//将文件名交给编辑框
}

//打开标准颜色选择对话框
void Dialog::slotOpenColorDlg(){
    //getColor方法会打开一个颜色选择对话框，传入默认的颜色，返回选择的颜色。
    QColor color=QColorDialog::getColor(Qt::blue);
    if(color.isValid()){//判断颜色是否合法
        colorFrame->setPalette(QPalette(color));//将Frame的背景色设置为选择的颜色
    }
}

//打开标准字体对话框
void Dialog::slotOpenFontDlg(){
    bool ok;
　　 //getFont方法打开一个字体选择对话框，返回选择的字体，同时以引用的方式返回字体是否合法。
    QFont font=QFontDialog::getFont(&ok);
    if(ok){//判断字体是否合法
        fontLineEdit->setFont(font);//设置编辑框的字体
    }
}
```
