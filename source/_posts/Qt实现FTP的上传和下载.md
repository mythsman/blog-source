---
title: Qt实现FTP的上传和下载
id: 1
categories:
  - Qt
date: 2015-10-29 23:51:32
tags:
  - Qt
---

本来想简单抄抄书，随便手写个Ftp客户端的，结果发现教材上的是基于Qt4的QFtp类库，而在Qt5中取消了这一个类库（同时也取消了QHttp等的类），取而代之的是QNetworkAccessManager 这个类，把这些杂货全都揽下来了，据说是因为之前的两个类有重复而且效率有问题balabala。于是就百度了一下，发现百度上要么讲的不全，要么就是要去下一个由热心网民重新封装的QFtp类。显然我并不喜欢无脑复制粘贴，想好好看下Qt官方提供的东西的用法，深入的理解下Qt网络编程，于是就果断自行google（话说google真好用），加上查看帮助文档，终于把一个简版的Ftp客户端大概框架弄清楚了。

不多说，上源码：

## Dialog.pro
```cpp
#-------------------------------------------------
#
# Project created by QtCreator 2015-10-29T23:52:56
#
#-------------------------------------------------

QT       += core gui
QT       += network  #这里要添加这个库

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = QFtp
TEMPLATE = app

SOURCES += main.cpp
        dialog.cpp

HEADERS  += dialog.h
```
## dialog.h
```cpp
#ifndef DIALOG_H
#define DIALOG_H

//注意需要添加的头文件
#include<QDialog>
#include<QPushButton>
#include<QFile>
#include<QNetworkReply>
#include<QLineEdit>
#include<QtNetwork/QNetworkAccessManager>
#include<QtNetwork/QNetworkRequest>
#include<QLabel>
#include<QString>
#include<QGridLayout>
#include<QMessageBox>
class Dialog : public QDialog
{
    Q_OBJECT

public:
    Dialog(QWidget *parent = 0);
    ~Dialog();
public:
    QGridLayout *layout;
    QLabel *LbServer,*LbUser,*LbPasswd;
    QLineEdit *LeServer,*LeUser,*LePasswd;
    QPushButton *PbPut,*PbGet;
    QNetworkAccessManager manager;//这个是重点
protected slots:
    //处理按钮的点击信号
    void slotPut();
    void slotGet();
    //处理网络连接的信号
    void managePut(QNetworkReply*);
    void manageGet(QNetworkReply*);
};

#endif // DIALOG_H
```
## dialog.cpp
```cpp
#include "dialog.h"

Dialog::Dialog(QWidget *parent)
    : QDialog(parent)
{
    setWindowTitle("My Ftp");

    layout=new QGridLayout(this);
    LbServer=new QLabel("Server:");
    LbUser=new QLabel("User:");
    LbPasswd=new QLabel("Passwd:");
    LeServer=new QLineEdit("ftp://120.27.41.126/home/myths/1.txt");
    LeUser=new QLineEdit("myths");
    LePasswd=new QLineEdit("123456");
    LePasswd->setEchoMode(QLineEdit::Password);//设置加密显示
    PbPut=new QPushButton("Put");
    PbGet=new QPushButton("Get");

    layout->addWidget(LbServer,0,0);
    layout->addWidget(LeServer,0,1);
    layout->addWidget(LbUser,1,0);
    layout->addWidget(LeUser,1,1);
    layout->addWidget(LbPasswd,2,0);
    layout->addWidget(LePasswd,2,1);
    layout->addWidget(PbPut,3,0);
    layout->addWidget(PbGet,3,1);

    setFixedSize(300,200);//固定大小

    //按钮点击事件信号槽的连接
    connect(PbPut,SIGNAL(clicked()),this,SLOT(slotPut()));
    connect(PbGet,SIGNAL(clicked()),this,SLOT(slotGet()));

}

void Dialog::managePut(QNetworkReply * reply){
    qDebug()<<reply->error();//输出调试信息
    switch(reply->error()){//判断连接后的状态
    case QNetworkReply::NoError:
        QMessageBox::information(this,"Put information","Upload Success!");
        break;
    case QNetworkReply::HostNotFoundError:
        QMessageBox::information(this,"Put information","Host Not Found!");
        break;
    case QNetworkReply::AuthenticationRequiredError:
        QMessageBox::information(this,"Put information","Login Failure!");
        break;
    default:
        QMessageBox::information(this,"Put information","Unknown Failure");
        break;
    }
}

void Dialog::manageGet(QNetworkReply *reply){
    //基本和managerPut类似   
    qDebug()<<reply->error();
    QByteArray data;
    switch(reply->error()){
    case QNetworkReply::NoError:
        data=reply->readAll();//从url中读取文件内容，输出到data中（也可以再将数据写入到文件中，为了方便，这里就权且打印一下吧）
        QMessageBox::information(this,"Put information","Upload Success!nThe file you've got is :n"+data);
        break;
    case QNetworkReply::HostNotFoundError:
        QMessageBox::information(this,"Put information","Host Not Found!");
        break;
    case QNetworkReply::AuthenticationRequiredError:
        QMessageBox::information(this,"Put information","Login Failure!");
        break;
    default:
        QMessageBox::information(this,"Put information","Unknown Failure");
        break;
    }
}

Dialog::~Dialog()
{

}

void Dialog::slotPut(){
    //判断信息输入完整
    if(LeUser->text().isEmpty()||LePasswd->text().isEmpty()||LeServer->text().isEmpty()){
        QMessageBox::warning(this,"Error","Please fill in the information");
        return ;
    }

    //重点！将之前的槽清空并重新连接至需要的
    manager.disconnect(SIGNAL(finished(QNetworkReply*)));
    //完全清空某对象连接的槽可以用manager.disconnect();
    connect(&manager,SIGNAL(finished(QNetworkReply*)),SLOT(managePut(QNetworkReply*)));

    //设置登录信息
    QUrl url(LeServer->text());
    url.setPort(21);
    url.setUserName(LeUser->text());
    url.setPassword(LePasswd->text());

    QByteArray data="This is the test data.n";
    /*QNetworkReply *reply=*/
    manager.put(QNetworkRequest(url),data);//将data上传到url中，返回的reply将触发网络的连接信号
}

void Dialog::slotGet(){
    //基本意义与slotPut类似
    if(LeUser->text().isEmpty()||LePasswd->text().isEmpty()||LeServer->text().isEmpty()){
        QMessageBox::warning(this,"Error","Please fill in the information");
        return ;
    }
    manager.disconnect(SIGNAL(finished(QNetworkReply*)));
    connect(&manager,SIGNAL(finished(QNetworkReply*)),SLOT(manageGet(QNetworkReply*)));
    QUrl url(LeServer->text());
    url.setPort(21);
    url.setUserName(LeUser->text());
    url.setPassword(LePasswd->text());
    /*QNetworkReply *reply=*/
    manager.get((QNetworkRequest(url)));
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

5、运行截图

权且只显示主界面：

![](/images/2015/10/29/1/1.png)
