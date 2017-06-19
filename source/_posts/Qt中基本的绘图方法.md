---
title: Qt中基本的绘图方法
id: 1
categories:
  - Qt
date: 2015-11-02 22:17:58
tags:
  - Qt
---

Qt中实现绘图功能和其他的库差不多，主要靠Painter，Pen，Brush之类的东西进行描绘。这里主要牵涉到QPainter，QPen，QBrush三个类，用法也很简单。下面主要是实现一个全面显示各种图形的程序，定义了两个类，一个负责绘图区，一个负责用户交互，这里先介绍绘图区的类。

## Painter.pro
```cpp
#-------------------------------------------------
#
# Project created by QtCreator 2015-11-02T18:38:46
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Painter
TEMPLATE = app

SOURCES += main.cpp 
    painter.cpp 
    widget.cpp

HEADERS  += 
    painter.h 
    widget.h
```
## painter.h
```cpp
#ifndef WIDGET_H
#define WIDGET_H

#include <QWidget>
#include <QBrush>
#include<QPen>
#include<QPainter>
#include<QRect>
#include<QPoint>
#include<QDebug>
class Painter : public QWidget
{
    Q_OBJECT

public:
    Painter(QWidget *parent = 0);
    ~Painter();
public:
    //枚举所有类型的图形
    enum Shape{Line,Rectangle,RoundRect,Ellipse,Polygon,Polyline,Points,Arc,Path,Text,Pixmap};
    void setShape(Shape);
    void setPen(QPen);
    void setBrush(QBrush);
    //重写重绘事件
    void paintEvent(QPaintEvent*);
private :
    Shape shape;
    QBrush brush;
    QPen pen;

};

#endif // WIDGET_H
```
## painter.cpp
```cpp
#include "painter.h"

Painter::Painter(QWidget *parent)
    : QWidget(parent)
{
    setPalette(QPalette(Qt::white));//设置背景
    setAutoFillBackground(true);
    setMinimumSize(400,400);
}

Painter::~Painter()
{

}

void Painter::setShape(Shape s){
    shape=s;
    update();//调用qwidget的update()来更新状态
}

void Painter::setPen(QPen p){
    pen=p;
    update();

}

void Painter::setBrush(QBrush b){
    brush=b;
    update();
}

void Painter::paintEvent(QPaintEvent *){
    qDebug()<<"debug 2";

    QPainter p(this);//拿到当前的画笔句柄

    p.setPen(pen);
    p.setBrush(brush);

    //留一个Qrect备用
    QRect rect(50,100,300,200);

    //留一个QPoint 数组备用
    static const QPoint points[4]={
        QPoint(150,100),
        QPoint(300,150),
        QPoint(350,250),
        QPoint(100,300),
    };

    //留几个角度备用
    int startAngle=30*16;
    int spanAngle=120*16;

    //留一个QPainterPath备用
    QPainterPath path;
    path.addRect(150,150,100,100);
    path.moveTo(100,100);
    path.cubicTo(300,100,200,200,300,300);
    path.cubicTo(100,300,200,200,100,100);

    //根据选择的shape分别显示
    switch(shape){
    case Line://直线
        p.drawLine(rect.topLeft(),rect.bottomRight());
        break;
    case Rectangle://矩形
        p.drawRect(rect);
        break;
    case RoundRect://圆角矩形
        p.drawRoundRect(rect);
        break;
    case Ellipse://椭圆
        p.drawEllipse(rect);
        break;
    case Polygon://多边形
        p.drawPolygon(points,4);
        break;
    case Polyline://多边线
        p.drawPolyline(points,4);
        break;
    case Points://点
        p.drawPoints(points,4);
        break;
    case Arc://弧线
        p.drawArc(rect,startAngle,spanAngle);
        break;
    case Path://路径
        p.drawPath(path);
        break;
    case Text://文字
        p.drawText(rect,Qt::AlignCenter,"Hello Qt!");
        break;
//  case Pixmap://图片
//      p.drawPixmap(150,150,QPixmap("homemythstest.png"));
//      break;
    default:
        break;
    }
}
```
## main.cpp
```cpp
#include "painter.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Widget w;
    w.show();

    return a.exec();
}
```