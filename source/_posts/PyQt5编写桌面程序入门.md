---
title: PyQt5编写桌面程序入门
id: 1
categories:
  - Qt
date: 2016-10-22 19:13:50
tags:
  - Qt
---

## 前言

捣鼓了半天，终于把用python写界面的一套玩意大体上搞清楚了。一开始一直在纠结用什么python IDE适合进行桌面程序开发，很多PyQt发布网站都推荐用Eric这个编辑器，然而我自己试了下发现界面很一般，而且搞不好还会在安装配置的过程中搞出很多麻烦。而实际上，稍微研究一下也能发现PyQt5也并不是和Eric绑定的东西，他其实就是一个python库，完全可以直接用任意的文本编辑器来写，因此我还是选择了比较方便的PyCharm。

## 环境安装

为了使用PyQt5，我们最好还是使用python3及以上的版本，虽说他(貌似)能够兼容python2.x，但是不管是从字符集、兼容性、还是未来的趋势来讲，用python3总没错。一般来说，在Ubuntu下，我们可以直接用类似下面的命令来安装python3以及python3对应的qt5库:
```
$sudo apt install python3
$sudo apt install python3-pyqt5*
$sudo apt install libqt5*
```
单独的PyQt5用法可以找到很多文档，也就是不拖控件直接写代码的那种，当然这样写相对麻烦，更快捷的方法就是用QtDesigner来设计界面生成.ui文件，再用pyuic5将他转换为.py的界面文件，最后实现其任务逻辑。当然，我们也可以把Qt Designer 和 pyuic5集成到pycharm的工具栏里，不过没啥卵用，本质上还是不同的软件。Qt Designer可以从[Qt的官网](https://www.qt.io/download/)上下到。

QtDesigner其实就是原先给C++版的Qt(Qt Creator)用的界面设计工具，不过他们之间采用的是松散耦合，也就是QtDesigner设计界面，然后生成*.ui的界面描述文件，接着再将这个文件转化为C++代码。这里的PyQt5也是一样，首先我们直接用Qt  Designer，编辑好界面(包括布局以及各种槽函数的配置)，然后在命令行下，用`pyuic5 HelloWorld.ui -o HelloWorld.py`命令生成一个布局类，然后在这个基础上进行后续操作。后续操作的具体方法可以参考官方文档的做法[《PyQt---Using Qt Designer》](http://pyqt.sourceforge.net/Docs/PyQt5/designer.html)。

因此，总而言之，我们需要用到的就是python3，pycharm，pyuic5(通常集成在Qt Designer里)，以及Qt Designer。

## 使用样例

下面稍微记录下一般的流程：

首先打开Qt Designer，随便编辑一个Widget窗口，并添加一个退出按钮，以及一个自定义按钮，为退出按钮绑定窗口退出的函数，为自定义按钮绑定一个自定义的函数（Qt Designer的使用不做介绍），保存到Test.ui：

![](/images/2016/10/22/1/1.png)

生成的Test.ui是以xml格式描述的界面信息：
```
<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>Form</class>
 <widget class="QWidget" name="Form">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>400</width>
    <height>300</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>Form</string>
  </property>
  <widget class="QPushButton" name="pushButton">
   <property name="geometry">
    <rect>
     <x>140</x>
     <y>190</y>
     <width>99</width>
     <height>27</height>
    </rect>
   </property>
   <property name="text">
    <string>Exit</string>
   </property>
  </widget>
  <widget class="QPushButton" name="pushButton_2">
   <property name="geometry">
    <rect>
     <x>140</x>
     <y>110</y>
     <width>99</width>
     <height>27</height>
    </rect>
   </property>
   <property name="text">
    <string>Diy</string>
   </property>
  </widget>
 </widget>
 <resources/>
 <connections>
  <connection>
   <sender>pushButton</sender>
   <signal>clicked()</signal>
   <receiver>Form</receiver>
   <slot>close()</slot>
   <hints>
    <hint type="sourcelabel">
     <x>228</x>
     <y>207</y>
    </hint>
    <hint type="destinationlabel">
     <x>342</x>
     <y>248</y>
    </hint>
   </hints>
  </connection>
  <connection>
   <sender>pushButton_2</sender>
   <signal>clicked()</signal>
   <receiver>Form</receiver>
   <slot>slotDiy()</slot>
   <hints>
    <hint type="sourcelabel">
     <x>225</x>
     <y>119</y>
    </hint>
    <hint type="destinationlabel">
     <x>348</x>
     <y>167</y>
    </hint>
   </hints>
  </connection>
 </connections>
 <slots>
  <slot>slotDiy()</slot>
 </slots>
</ui>
```
下面生成python代码`pyuic5 Test.ui -o Test.py` ：
```python
# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'Test.ui'
#
# Created by: PyQt5 UI code generator 5.7
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(400, 300)
        self.pushButton = QtWidgets.QPushButton(Form)
        self.pushButton.setGeometry(QtCore.QRect(140, 190, 99, 27))
        self.pushButton.setObjectName("pushButton")
        self.pushButton_2 = QtWidgets.QPushButton(Form)
        self.pushButton_2.setGeometry(QtCore.QRect(140, 110, 99, 27))
        self.pushButton_2.setObjectName("pushButton_2")

        self.retranslateUi(Form)
        self.pushButton.clicked.connect(Form.close)
        self.pushButton_2.clicked.connect(Form.slotDiy)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.pushButton.setText(_translate("Form", "Exit"))
        self.pushButton_2.setText(_translate("Form", "Diy"))
```
他是以Ui_Form类的形式来保存界面设置的信息，显然不能直接执行他，当然也不要直接编写他，否则万一重新修改了界面，还得重新写控制代码。我们可以看到在空行前面的是界面的设置，空行后面的是槽的设置，显然这就意味着传进去的Form 对象得有slotDiy函数来响应信号。

下面就用这个布局来写一个可执行的窗口，新建一个Main.py文件:
```python
import sys
from  PyQt5 import QtWidgets
from Test import Ui_Form

class Main(QtWidgets.QWidget, Ui_Form):
    def __init__(self):
        super(Main, self).__init__()
        self.setupUi(self)
        self.show()
    def slotDiy(self):
        print("DiyBtn clicked")
app = QtWidgets.QApplication(sys.argv)
main = Main()
sys.exit(app.exec_())
```
执行python Main.py即可：

![](/images/2016/10/22/1/2.png)