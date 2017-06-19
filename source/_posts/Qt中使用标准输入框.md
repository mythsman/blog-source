---
title: Qt中使用标准输入框
id: 1
categories:
  - Qt
date: 2015-10-25 23:12:02
tags:
  - Qt
---

这一节主要讲一下标准输入框的使用，Qt提供了一个QInputDialog类，这个类提供了几个预先设定好的常用输入对话框。
比如：
* 需要输入文本的时候，他将QlineEdit的一系列控件封装到QInputDialog::getText()中;
* 需要输入选择条目的时候，他将QComboBox的一系列控件封装到QInputDialog::getItem()中;
* 需要输入数值的时候，他将QSpinbox的一系列控件封装到QInputDialog::getInt()或QInputDialog::getDouble()中。

以下依旧是用程序来说明:
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
#include<QInputDialog>
class Dialog : public QDialog
{
    Q_OBJECT

public:
    Dialog(QWidget *parent = 0);
    ~Dialog();
public:
   QGridLayout *layout;
   QPushButton *nameButton,*sexButton,*ageButton,*statureButton;
   QLabel *label1,*label2,*label3,*label4,*nameLabel,*sexLabel,*ageLabel,*statureLabel;
private slots:
    //设置按钮单击信号的槽
    void slotName();
    void slotSex();
    void slotAge();
    void slotStature();
};

#endif // DIALOG_H
```
## dialog.cpp
```cpp
#include "dialog.h"

Dialog::Dialog(QWidget *parent)
    : QDialog(parent)
{
    setWindowTitle("Input Dialog");
    label1=new QLabel("姓名:");
    label2=new QLabel("性别:");
    label3=new QLabel("年龄:");
    label4=new QLabel("身高:");

    //创建显示标签，用于显示已选择的信息。
    nameLabel=new QLabel("LiMing");
    /**

      以下调用了QLabel的setFrameStyle()方法，设置QLabel的样式，这里有两个枚举类型--QFrame::Shape和QFrame::Shadow

      QFrame::Shape定义了QFrame的框架所使用的外形。当前定义的效果有：

      QFrame::NoFrame            不画任何东西
      QFrame::Box                在它的内容周围画一个框
      QFrame::Panel              画一个平板使内容看起来凸起或者凹陷
      QFrame::WinPanel           像Panel，但QFrame绘制三维效果的方式和Microsoft Windows 95（及其它）的一样
      QFrame::ToolBarPanel       调用QStyle::drawToolBarPanel()
      QFrame::MenuBarPanel       调用QStyle::drawMenuBarPanel()
      QFrame::HLine              绘制一个水平线，但没有框任何东西（作为分隔是有用的）
      QFrame::VLine              绘制一个竖直线，但没有框任何东西（作为分隔是有用的）
      QFrame::StyledPanel        调用QStyle::drawPanel()
      QFrame::PopupPanel         调用QStyle::drawPopupPanel()

      QFrame::Shadow这个枚举类型定义了QFrame的框架所使用的外形。当前定义的效果有：

      QFrame::Plain     框架和内容看来和周围一样高
      QFrame::Raised    框架和内容看起来凸起
      QFrame::Sunken    框架和内容看起来凹陷
      QFrame::MShadow   内部的，对于阴影的掩码

      */

    nameLabel->setFrameStyle(QFrame::Panel|QFrame::Sunken);//这里设置了凹陷的效果
    sexLabel=new QLabel("man");
    sexLabel->setFrameStyle(QFrame::Panel|QFrame::Sunken);
    ageLabel=new QLabel("20");
    ageLabel->setFrameStyle(QFrame::Panel|QFrame::Sunken);
    statureLabel=new QLabel("178");
    statureLabel->setFrameStyle(QFrame::Panel|QFrame::Sunken);

    nameButton=new QPushButton;
    nameButton->setText("...");
    sexButton=new QPushButton;
    sexButton->setText("...");
    ageButton=new QPushButton;
    ageButton->setText("...");
    statureButton=new QPushButton;
    statureButton->setText("...");

    layout=new QGridLayout(this);
    layout->addWidget(label1,0,0);
    layout->addWidget(nameLabel,0,1);
    layout->addWidget(nameButton,0,2);
    layout->addWidget(label2,1,0);
    layout->addWidget(sexLabel,1,1);
    layout->addWidget(sexButton,1,2);
    layout->addWidget(label3,2,0);
    layout->addWidget(ageLabel,2,1);
    layout->addWidget(ageButton,2,2);
    layout->addWidget(label4,3,0);
    layout->addWidget(statureLabel,3,1);
    layout->addWidget(statureButton,3,2);

    //设置各个Grid列的相对比例，这里是1:4:2
    layout->setColumnStretch(0,1);
    layout->setColumnStretch(1,4);
    layout->setColumnStretch(2,1);

    layout->setMargin(10);
    //设置窗口的固定大小
    this->setFixedSize(300,120);

    connect(nameButton,SIGNAL(clicked()),this,SLOT(slotName()));
    connect(sexButton,SIGNAL(clicked()),this,SLOT(slotSex()));
    connect(ageButton,SIGNAL(clicked()),this,SLOT(slotAge()));
    connect(statureButton,SIGNAL(clicked()),this,SLOT(slotStature()));
}

Dialog::~Dialog()
{

}

void Dialog::slotName(){
    bool ok;

    /*
    static　QString　QInputDialog::getText　(　QWidget　*　parent,const　QString　&　title,const　QString　&label,　QLineEdit::EchoMode　mode　=　QLineEdit::Normal,const　QString　&　text　=　QString(),　bool　*　ok　=　0,　Qt::WindowFlags　flags　=　0　);

    第一个参数parent，也就是那个熟悉的父组件的指针;
    第二个参数title就是对话框的标题;
    第三个参数label是在输入框上面的提示语句;
    第四个参数mode用于指明这个QLineEdit的输入模式，取值范围是QLineEdit::EchoMode，默认是Normal，也就是正常显示，你也可以声明为password，这样就是密码的输入显示了;
    第五个参数text是QLineEdit的默认字符串;
    第六个参数 ok是可选的，如果非NLL，则当用户按下对话框的OK按钮时，这个bool变量会被置为true，可以由这个去判断用户是按下的OK还是Cancel，从而获知这个text是不是有意义;
    第七个参数flags用于指定对话框的样式。
    */

    QString name=QInputDialog::getText(this,"Username","Please input the name:",QLineEdit::Normal,nameLabel->text(),&ok);
    if(ok&&!name.isEmpty()){
       nameLabel->setText(name);
    }
}

void Dialog::slotSex(){
    QStringList list;
    list<<"male"<<"female";//给QStringList 赋值
    bool ok;

    /*
 static　QString　QInputDialog::getText　(　QWidget　*　parent,const　QString　&　title,const　QString　&label,　const QStringList &list,int current=0,bool editable=true,　bool　*　ok　=　0,　Qt::WindowFlags　flags　=　0　);

   第一个参数parent，也就是那个熟悉的父组件的指针;
   第二个参数title就是对话框的标题;
   第三个参数label是在输入框上面的提示语句;
   第四个参数QStringList用于指定需要显示的条目是一个QStringList 对象，
   第五个参数current是QStringList 中默认的条目的下标;
   第六个参数editable是设置文字是否可以编辑
   第七个参数 ok是可选的，如果非NLL，则当用户按下对话框的OK按钮时，这个bool变量会被置为true，可以由这个去判断用户是按下的OK还是Cancel，从而获知这个text是不是有意义;
   第八个参数flags用于指定对话框的样式。
 */
    QString sex=QInputDialog::getItem(this,"Sex","Please choose the sex",list,0,false,&ok);
    if(ok){
        sexLabel->setText(sex);
    }
}

void Dialog::slotAge(){
    bool ok;
     /*
 static　QString　QInputDialog::getText　(　QWidget　*　parent,const　QString　&　title,const　QString　&label,　int value ,int minValue=-2147483647, int maxValue = 2147483647, int step=1,　bool　*　ok　=　0,　Qt::WindowFlags　flags　=　0　);

   第一个参数parent，也就是那个熟悉的父组件的指针
   第二个参数title就是对话框的标题
   第三个参数label是在输入框上面的提示语句
   第四个参数value表示默认值
   第五个参数minValue表示最小值
   第六个参数maxValue表示最大值
   第七个参数step表示各个选项的间隔
   第八个参数ok是可选的，如果非NLL，则当用户按下对话框的OK按钮时，这个bool变量会被置为true，可以由这个去判断用户是按下的OK还是Cancel，从而获知这个text是不是有意义;
   第九个参数flags用于指定对话框的样式。
 */

    int age=QInputDialog::getInt(this,"User age","Please input the age",ageLabel->text().toInt(),0,150,1,&ok);
    if(ok){
        ageLabel->setText(QString().setNum(age));//将数字变成文本
    }
}

void Dialog::slotStature(){
    bool ok;

    //QInputDialog::getDouble使用方法如getInt
    double stature=QInputDialog::getDouble(this,"User stature","Please input the stature",statureLabel->text().toDouble(),0,240.00,1,&ok);//这里文本变成double要进行转换
    if(ok){
        statureLabel->setText(QString().setNum(stature));
    }
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
## 运行截图

![](/images/2015/10/25/1.png)
![](/images/2015/10/25/2.png)
![](/images/2015/10/25/3.png)
![](/images/2015/10/25/4.png)
![](/images/2015/10/25/5.png)
