---
title: Qt中各种消息框的使用
id: 1
categories:
  - Qt
date: 2015-10-27 18:29:22
tags:
  - Qt
---

在程序运行时，经常需要提示用户一些信息，比如警告啊，提示啊，建议啊之类的东西。这些东西基本上是通过消息框与用户进行交互的，Qt中主要是用QMessageBox类来加以实现的。

消息框一般分为七种：

1.  Question询问消息框：为正常的操作提供一个简单的询问
2.  Information信息消息框：为正常操作提供一个提示
3.  Warning提示消息框：提醒用户发生了一个错误
4.  Critical警告消息框：警告用户发生了一个严重错误
5.  About关于消息框：自定义的关于信息
6.  AboutQt关于Qt消息框：Qt自身的关于信息
7.  Custom自定义消息框：自己定制消息框

具体用法见源码以及分析：

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

HEADERS  += dialog.h
```
## dialog.h
```cpp
#ifndef DIALOG_H
#define DIALOG_H

#include <QDialog>
#include<QGridLayout>
#include<QPushButton>
#include<QLabel>
#include<QMessageBox>
class Dialog : public QDialog
{
    Q_OBJECT

public:
    Dialog(QWidget *parent = 0);
    ~Dialog();
public://配置部件和布局
    QLabel *label;
    QPushButton *QuestionBtn,*InformationBtn,*WarningBtn,*CriticalBtn,*AboutBtn,*AboutQtBtn,*CustomBtn;
    QGridLayout *layout,*layoutLabel,*layoutBtn;
protected slots://各种按钮的槽
    void slotQuestion();
    void slotInformation();
    void slotWarning();
    void slotCritical();
    void slotAbout();
    void slotAboutQt();
    void slotCustom();
};

#endif // DIALOG_H
```

## dialog.cpp
```cpp
#include "dialog.h"

Dialog::Dialog(QWidget *parent)
    : QDialog(parent)
{
    setWindowTitle("QMessageBox");

    QuestionBtn=new QPushButton("Question");
    InformationBtn=new QPushButton("Information");
    WarningBtn=new QPushButton("Warning");
    CriticalBtn=new QPushButton("Critical");
    AboutBtn=new QPushButton("About");
    AboutQtBtn=new QPushButton("AboutQt");
    CustomBtn=new QPushButton("Custom");

    label=new QLabel("About Qt MessageBox:");
    layout=new QGridLayout(this);
    layoutLabel=new QGridLayout;
    layoutBtn=new QGridLayout;
    layoutLabel->addWidget(label,0,0);
    layoutBtn->addWidget(QuestionBtn,1,0);
    layoutBtn->addWidget(InformationBtn,1,1);
    layoutBtn->addWidget(WarningBtn,2,0);
    layoutBtn->addWidget(CriticalBtn,2,1);
    layoutBtn->addWidget(AboutBtn,3,0);
    layoutBtn->addWidget(AboutQtBtn,3,1);
    layoutBtn->addWidget(CustomBtn,4,0);
    layoutBtn->setSpacing(15);

    //嵌套布局
    layout->addLayout(layoutLabel,0,0);
    layout->addLayout(layoutBtn,1,0);
    setFixedSize(300,220);//固定大小

    connect(QuestionBtn,SIGNAL(clicked()),this,SLOT(slotQuestion()));
    connect(InformationBtn,SIGNAL(clicked()),this,SLOT(slotInformation()));
    connect(WarningBtn,SIGNAL(clicked()),this,SLOT(slotWarning()));
    connect(CriticalBtn,SIGNAL(clicked()),this,SLOT(slotCritical()));
    connect(AboutBtn,SIGNAL(clicked()),this,SLOT(slotAbout()));
    connect(AboutQtBtn,SIGNAL(clicked()),this,SLOT(slotAboutQt()));
    connect(CustomBtn,SIGNAL(clicked()),this,SLOT(slotCustom()));
}

Dialog::~Dialog()
{

}

//直接调用AboutQt，设置句柄和标题即可
void Dialog::slotAboutQt(){
 QMessageBox::aboutQt(this,"This is the title");
}

//以下三个函数均是设置句柄标题和信息即可，也可以在最后设置默认按钮，一般默认的是QMessageBox::Ok。
void Dialog::slotAbout(){
     QMessageBox::about(this,"About","This is the label.");
}
void Dialog::slotCritical(){
    QMessageBox::critical(this,"Critical","This is the label.");
}
void Dialog::slotInformation(){
 QMessageBox::information(this,"Information","This is the label.");
}

//自定义消息框
void Dialog::slotCustom(){

    QMessageBox customMsgBox;
    customMsgBox.setWindowTitle("Custom message box");

    //添加按键
    QPushButton *lockBtn=customMsgBox.addButton("Lock",QMessageBox::ActionRole);
    QPushButton *unlockBtn=customMsgBox.addButton("Unlock",QMessageBox::ActionRole);
    QPushButton *cancelBtn=customMsgBox.addButton(QMessageBox::Cancel);//注意cancel不能指定Text

    //customMsgBox.setIconPixmap(QPixmap("a.png"));//设置图片
    customMsgBox.setText("This is the label");
    customMsgBox.exec();//执行消息框

    QPushButton *msg=(QPushButton*)customMsgBox.clickedButton();//接受按键信息

    //判断按键
    if(msg==lockBtn)
        label->setText("Custom button /lock");

    if(msg==unlockBtn)
        label->setText("Custom button /unlock");

    if(msg==cancelBtn)
        label->setText("Custom button /cancel");

}

void Dialog::slotQuestion(){
    //QMessageBox::**question()**函数，传入句柄，标题，文本，按钮值，返回按键对应的值，最后也可以加默认按键的位置
    int msg=QMessageBox::question(this,"Question","This is the label.",QMessageBox::Ok|QMessageBox::Cancel);

    //判断选择信息
    switch(msg){
    case QMessageBox::Ok:
        label->setText("Question button /OK");
        break;
    case QMessageBox::Cancel:
        label->setText("Question button /Cancel");
        break;
    default:
        break;
    }
}

void Dialog::slotWarning(){

    //QmessageBox::warning()函数同Question函数
    int msg=QMessageBox::warning(this,"Question","This is the label.",QMessageBox::Save|QMessageBox::Discard|QMessageBox::Cancel,QMessageBox::Save);

    switch(msg){//判断选择信息
    case QMessageBox::Save:
        label->setText("Warning button /Save");
        break;
    case QMessageBox::Cancel:
        label->setText("Warning button /Cancel");
        break;
    case QMessageBox::Discard:
        label->setText("Warning button /Discard");
        break;
    default:
        break;
    }

}
```

##main.cpp
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

## 运行截图

![](/images/2015/10/27/1.png)
![](/images/2015/10/27/2.png)
![](/images/2015/10/27/3.png)
![](/images/2015/10/27/4.png)
![](/images/2015/10/27/5.png)
![](/images/2015/10/27/6.png)
![](/images/2015/10/27/7.png)
