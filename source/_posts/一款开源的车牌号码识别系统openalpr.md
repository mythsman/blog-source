---
title: 一款开源的车牌号码识别系统openalpr
id: 1
categories:
  - Computer Vision
date: 2015-12-27 23:56:49
tags:
  - Computer Vision
---

关于车牌号码的识别，其实研究也很多了。但是对于普通的开发者而言，本身不想去研究这些算法层面的东西，只是想能够直接应用来做我们自己需要的事情。虽然很多网站提供了Api接口，但是毫无疑问这是要money的。之前看到国人发的一片博客介绍他自己写的开源车牌识别系统叫Easypr，我自己也下载下来研究了一下。然而使用的时候发现错误有很多，而且没有正规的接口文档，做的也特别粗糙，显然不太适合直接使用。百度不到我就直接去google，果然还是发现了老外写的一款开源的识别软件--openalpr(Open Automatic License Plate Recognition 开源自动车牌识别)，发布在[github]( https://github.com/openalpr/openalpr )上。拿过来测试之后发现效果还挺好的，而且文档清楚，虽然不能识别中文，但是对字母和数字的识别准确性还是挺好的。不管怎么说，先记下来以防以后用到。

这个程序有很多版本，有各种语言的接口，也有Linux下的二进制文件。鉴于现在不需要用来开发，我们直接用他编译成的二进制命令即可。当然如果有需要，也可以去下载他的源码，调用他的函数库。如果有闲工夫的话也可以尝试这改一改。。。。让他能识别中文，造福国人。

安装：

使用github上提供的最简单的方法--
```
wget -O - http://deb.openalpr.com/openalpr.gpg.key | sudo apt-key add -
echo "deb http://deb.openalpr.com/master/ openalpr main" | sudo tee /etc/apt/sources.list.d/openalpr.list
sudo apt-get update
sudo apt-get install openalpr openalpr-daemon openalpr-utils libopenalpr-dev
```
帮助：
```
alpr  [-c <country_code>] [--config <config_file>] [-n <topN>] [--seek
         <integer_ms>] [-p <pattern code>] [--clock] [-d] [-j] [--]
         [--version] [-h] <image_file_path>

Where: 

   -c <country_code>,  --country <country_code>
     Country code to identify (either us for USA or eu for Europe). 
     Default=us

   --config <config_file>
     Path to the openalpr.conf file

   -n <topN>,  --topn <topN>
     Max number of possible plate numbers to return.  Default=10

   --seek <integer_ms>
     Seek to the specified millisecond in a video file. Default=0

   -p <pattern code>,  --pattern <pattern code>
     Attempt to match the plate number against a plate pattern (e.g., md
     for Maryland, ca for California)

   --clock
     Measure/print the total time to process image and all plates. 
     Default=off

   -d,  --detect_region
     Attempt to detect the region of the plate image.  [Experimental] 
     Default=off

   -j,  --json
     Output recognition results in JSON format.  Default=off

   --,  --ignore_rest
     Ignores the rest of the labeled arguments following this flag.

   --version
     Displays version information and exits.

   -h,  --help
     Displays usage information and exits.

   <image_file_path>
     Image containing license plates

   OpenAlpr Command Line Utility
```
效果：

![](/images/2015/12/27/1/1.jpg)
```
myths@myths-X450LD:~/Download$ alpr a.jpg
plate0: 10 results
    - EHL5747	 confidence: 90.5541
    - EHL577	 confidence: 83.4746
    - EHLS747	 confidence: 82.0519
    - EH5747	 confidence: 80.6372
    - EHLB747	 confidence: 78.9456
    - EHE5747	 confidence: 78.337
    - EHC5747	 confidence: 77.903
    - EHL747	 confidence: 77.4477
    - EBL5747	 confidence: 76.8316
    - EL5747	 confidence: 75.6551
```
对于正面的牌照识别的效果还是很好的，但是对于中国的车牌来说识别的效果就很差了。
