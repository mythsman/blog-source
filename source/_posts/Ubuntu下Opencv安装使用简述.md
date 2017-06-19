---
title: Ubuntu下Opencv安装使用简述
id: 1
categories:
  - Computer Vision
date: 2016-02-11 14:03:59
tags:
  - Computer Vision
  - Linux
---

## 简述

Opencv就不解释了，是个很有名的图形库。不仅在进行软件开发的过程中需要用到，而且他也是很多开源软件的运行依赖，所以安装一个Opencv就很有必要了，即使自己本身并不想学习使用。

## 安装

以下主要是从百度上找到的可用方法：

### 安装运行依赖
```
$ sudo apt-get install libqt4-dev libopencv-dev build-essential cmake git libgtk2.0-dev pkg-config\
python-dev python-numpy libdc1394-22 libdc1394-22-dev libjpeg-dev libpng12-dev libtiff5-dev \
libjasper-dev libavcodec-dev libavformat-dev libswscale-dev libxine2-dev libgstreamer0.10-dev\
libgstreamer-plugins-base0.10-dev libv4l-dev libtbb-dev  libfaac-dev libmp3lame-dev libopencore-amrnb-dev \
libopencore-amrwb-dev libtheora-dev libvorbis-dev libxvidcore-dev x264 v4l-utils unzip
```

### 下载源代码

在 [官网](http://opencv.org/) 下载适合的版本就好，我这下的是3.1.0。

下载完成解压就好。


### 编译

编译还是有点麻烦的，现在都是用cmake结合make来编译，头一次用这个有点头大。

1.  在文件目录下新建一个叫build/的文件夹，这个文件夹的目的主要是用来存放编译生成的临时文件。当然起别的名字也可以。
2.  进入build/文件夹，输入以下命令
    ```
    cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local  -D BUILD_PYTHON_SUPPORT=ON       -D WITH_XINE=ON       -D WITH_OPENGL=ON       -D WITH_TBB=ON       -D BUILD_EXAMPLES=ON       -D BUILD_NEW_PYTHON_SUPPORT=ON       -D WITH_V4L=ON  ..
    ```
	其实就是cmake命令后加些配置参数，最后是CMakeLists.txt配置文件的位置，这个位置当然就是../
3.  编译安装，输入`make -j $(nproc)`(这是多进程make的命令，\$(nproc)就是进程数，当然也可以直接指定)，这会花很长时间，最后再`$ sudo make install` ，对文件进行安装。
4.  最后还要配置一些路径，输入以下命令
    ```
    /bin/bash -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf'
    ```
	然后再`ldconfig`即可。（注意给权限）
5.  最后可以用如下命令来判断是否安装成功
    ```
    pkg-config --modversion opencv
    pkg-config --cflags opencv
    ```

## 测试

OpenCV在codeblock下可以通过加链接库的形式编译运行。但是如果在命令行下，就得手写cmake了。

为了方便测试，我们新建一个test文件夹，在这下面写一个测试程序。

首先新建如下文件，保存为test.cpp
```cpp
#include<opencv2/highgui.hpp>
#include<opencv2/imgproc.hpp>
using namespace cv;
int main(int argc ,char** argv){
	if(argc!=2){
		printf("No image data\n");
		return -1;
	}
	char *imageName=argv[1];
	Mat image;
	image=imread(imageName,1);
	if(!image.data){
		printf("No iamge data\n");
		return -1;
	}
	namedWindow(imageName,CV_WINDOW_AUTOSIZE);
	imshow(imageName,image);
	waitKey(0);
	return 0;
}
```
然后随便把一个测试用图片复制到test文件夹下，我用的是他自带的最经典的lena.jpg。

接着编写cmake配置文件，将下面的文件保存为CMakeLists.txt
```
project(test)
add_executable(test test.cpp)
find_package(OpenCV REQUIRED)
target_link_libraries(test ${OpenCV_LIBS})
```
里面用到的各种文件的意义也很清楚了，以后照着改就行。

最后在test下新建build文件夹，进入后输入`cmake ../` 即可完成cmake编译，然后再输入`make`即可生成可执行文件。

找到test文件，然而在命令行下输入`./test ../lena.jpg` 即可运行程序。
