---
title: Qt各类位置信息函数
id: 2
categories:
  - Qt
date: 2015-10-24 23:38:36
tags:
  - Qt
---

本节主要演示获取窗口位置以及显示区域坐标以及大小的函数，分析其中的区别，主要是 x(),y(),frameGeometry(),pos(),geometry(),width(),height(),rect(),size()函数，这些函数是由QWidget 提供。

以下是演示的工程源码，具体分析结合在源码中。

## Dialog.pro(必备)
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

HEADERS  += dialog.h
```

## dialog.h
```cpp
#ifndef DIALOG_H
#define DIALOG_H

#include <QDialog>
#include<QLabel>
#include<QGridLayout>
class Dialog : public QDialog
{
    Q_OBJECT

public:
    Dialog(QWidget *parent = 0);
    ~Dialog();
public:
    //基本的布局
    QGridLayout *layout;
    QLabel *xLabel,*yLabel,*frameGeometryLabel,*posLabel,*geometryLabel,*widthLabel,*heightLabel,*rectLabel,*sizeLabel;
    QLabel *xLabelv,*yLabelv,*frameGeometryLabelv,*posLabelv,*geometryLabelv,*widthLabelv,*heightLabelv,*rectLabelv,*sizeLabelv;
    //刷新时调用的函数
    void updateLabel();
protected:
    //以下是继承自QWidget的函数，分别响应对话框移动事件和对话框大小调整事件
    void moveEvent(QMoveEvent *);
    void resizeEvent(QResizeEvent *);
};

#endif // DIALOG_H
```
## dialog.cpp
```cpp
#include "dialog.h"

Dialog::Dialog(QWidget *parent)
    : QDialog(parent)
{
    //基本布局
    setWindowTitle("Show position");
    layout=new QGridLayout(this);
    xLabel=new QLabel;
    xLabel->setText("x():");
    yLabel=new QLabel;
    yLabel->setText("y():");
    frameGeometryLabel=new QLabel;
    frameGeometryLabel->setText("frameGeometry():");
    posLabel=new QLabel;
    posLabel->setText("pos():");
    geometryLabel=new QLabel;
    geometryLabel->setText("geometry():");
    widthLabel=new QLabel;
    widthLabel->setText("width():");
    heightLabel=new QLabel;
    heightLabel->setText("height():");
    rectLabel=new QLabel;
    rectLabel->setText("rect():");
    sizeLabel=new QLabel;
    sizeLabel->setText("size():");

    xLabelv=new QLabel;
    yLabelv=new QLabel;
    frameGeometryLabelv=new QLabel;
    posLabelv=new QLabel;
    geometryLabelv=new QLabel;
    widthLabelv=new QLabel;
    heightLabelv=new QLabel;
    rectLabelv=new QLabel;
    sizeLabelv=new QLabel;

    layout->addWidget(xLabel,0,0);
    layout->addWidget(xLabelv,0,1);
    layout->addWidget(yLabel,1,0);
    layout->addWidget(yLabelv,1,1);
    layout->addWidget(frameGeometryLabel,2,0);
    layout->addWidget(frameGeometryLabelv,2,1);
    layout->addWidget(posLabel,3,0);
    layout->addWidget(posLabelv,3,1);
    layout->addWidget(geometryLabel,4,0);
    layout->addWidget(geometryLabelv,4,1);
    layout->addWidget(widthLabel,5,0);
    layout->addWidget(widthLabelv,5,1);
    layout->addWidget(heightLabel,6,0);
    layout->addWidget(heightLabelv,6,1);
    layout->addWidget(rectLabel,7,0);
    layout->addWidget(rectLabelv,7,1);
    layout->addWidget(sizeLabel,8,0);
    layout->addWidget(sizeLabelv,8,1);
    updateLabel();
}

Dialog::~Dialog()
{

}

void Dialog::updateLabel(){
    //调用QString匿名对象的setNum()方法将int转化为QString
    xLabelv->setText(QString().setNum(x()));
    yLabelv->setText(QString().setNum(y()));

    QString tmp;
    tmp=QString().setNum(frameGeometry().x())+","+
            QString().setNum(frameGeometry().y())+","+
            QString().setNum(frameGeometry().width())+","+
            QString().setNum(frameGeometry().height());
    frameGeometryLabelv->setText(tmp);

    tmp=QString().setNum(pos().x())+","+
            QString().setNum(pos().y());
    posLabelv->setText(tmp);

    tmp=QString().setNum(geometry().x())+","+
            QString().setNum(geometry().y())+","+
            QString().setNum(geometry().width())+","+
            QString().setNum(geometry().height());
    geometryLabelv->setText(tmp);

    widthLabelv->setText(QString().setNum(width()));
    heightLabelv->setText(QString().setNum(height()));

    tmp=QString().setNum(rect().x())+","+
            QString().setNum(rect().y())+","+
            QString().setNum(rect().width())+","+
            QString().setNum(rect().height());
    rectLabelv->setText(tmp);

    tmp=QString().setNum(size().width())+","+QString().setNum(size().height());
    sizeLabelv->setText(tmp);
}

void Dialog::moveEvent(QMoveEvent *){
    updateLabel();
}

void Dialog::resizeEvent(QResizeEvent *){
    updateLabel();
}
```
## main.cpp
```cpp
#include "dialog.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Dialog w;
    w.show();
    return a.exec();
}
```
## 程序截图

![](/images/2015/10/24/2/1.png)

## 各个函数的意义简图

![](/images/10/24/2/2.png)