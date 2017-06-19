---
title: 关于Ascii-art的一些总结
id: 1
categories:
  - Computer Vision
date: 2017-06-05 21:36:53
tags:
  - Computer Vision
---

## 前言
好久没写博客了，倒不是因为最近没在学习，而是觉得最近学得有点太多，一时无从下笔。知识这种东西真是奇怪，真的是懂得越多才知道自己懂得越少。虽然这个真相经常会给我一种无力感，但是我还是会沉浸在了解一件事情的来龙去脉的过程中。唔，看来学习也是会容易让人上瘾的。。。

不过最近在学习的过程中，我渐渐也明白了一点，那就是碎片化的学习效率那是惊人的低。我曾经十分推崇学习一个技术的时候，先上手，然后遇到一个问题就解决一个问题。但是后来慢慢发现，这样经常会导致我们花很多的时间去解决那些在这个领域里非常基本的问题。所谓语速则不达，还是稳扎稳打拿本书在手里啃啃靠谱点。

不过今天我不打算写那些工具类的笔记，我倒是想记一记一个有趣的问题，那就是如何用Ascii字符来绘制一幅画。

## Ascii-Art是啥
Ascii-art是啥，话不多说，举几个例子:

### 类别一
```
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 1.6.2
      /_/
```
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.3.RELEASE)
```
这个是我最近遇到的两个图标，他们都是用ascii字符来表示另一个Ascii串。当我第一次见到的时候我还对这个图标的设计赞叹不已，感觉设计者还是花了一点小心思的，毕竟相比于普通的图片banner，这个纯ascii码的更加方便文本的显示，尤其是对于程序员。我们可以把他放在代码的注释里、网页的console里，命令行的提示里等等，并且总有一种十分装x的感觉。

### 类别二
再看看下面的例子:
```

                             /T /I
                              / |/ | .-~/
                          T\ Y  I  |/  /  _
         /T               | \I  |  I  Y.-~/
        I l   /I       T\ |  |  l  |  T  /
     T\ |  \ Y l  /T   | \I  l   \ `  l Y
 __  | \l   \l  \I l __l  l   \   `  _. |
 \ ~-l  `\   `\  \  \\ ~\  \   `. .-~   |
  \   ~-. "-.  `  \  ^._ ^. "-.  /  \   |
.--~-._  ~-  `  _  ~-_.-"-." ._ /._ ." ./
 >--.  ~-.   ._  ~>-"    "\\   7   7   ]
^.___~"--._    ~-{  .-~ .  `\ Y . /    |
 <__ ~"-.  ~       /_/   \   \I  Y   : |
   ^-.__           ~(_/   \   >._:   | l______
       ^--.,___.-~"  /_/   !  `-.~"--l_ /     ~"-.
              (_/ .  ~(   /'     "~"--,Y   -=b-. _)
               (_/ .  \  :           / l      c"~o \
                \ /    `.    .     .^   \_.-~"~--.  )
                 (_/ .   `  /     /       !       )/
                  / / _.   '.   .':      /        '
                  ~(_/ .   /    _  `  .-<_
                    /_/ . ' .-~" `.  / \  \          ,z=.
                    ~( /   '  :   | K   "-.~-.______//
                      "-,.    l   I/ \_    __{--->._(==.
                       //(     \  <    ~"~"     //
                      /' /\     \  \     ,v=.  ((
                    .^. / /\     "  }__ //===-  `
                   / / ' '  "-.,__ {---(==-       -Row
                 .^ '       :  T  ~"   ll       
                / .  .  . : | :!        \\
               (_/  /   | | j-"          ~^
                 ~-<_(_.^-~"
```
```
                      _..-'(                       )`-.._
                   ./'. '||\\.       (\_/)       .//||` .`\.
                ./'.|'.'||||\\|..    )O O(    ..|//||||`.`|.`\.
             ./'..|'.|| |||||\`````` '`"'` ''''''/||||| ||.`|..`\.
           ./'.||'.|||| ||||||||||||.     .|||||||||||| |||||.`||.`\.
          /'|||'.|||||| ||||||||||||{     }|||||||||||| ||||||.`|||`\
         '.|||'.||||||| ||||||||||||{     }|||||||||||| |||||||.`|||.`
        '.||| ||||||||| |/'   ``\||``     ''||/''   `\| ||||||||| |||.`
        |/' \./'     `\./         \!|\   /|!/         \./'     `\./ `\|
        V    V         V          }' `\ /' `{          V         V    V
        `    `         `               V               '         '    '
```
唔，这两张图片就更有意思了，一个好像是只鹰，另一个好像是只蝙蝠，栩栩如生，重点是他的设计是如此的精巧，图片的轮廓与字符衔接的十分完美，真的可以说每一幅图都给人一种眼前一亮的感觉。甚至可以说，这就是art。

### 类别三
还有一类:
```
ZZZZZZZZZZZZuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
ZZZZZZZZZZZZZZZuuuZuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
ZZZZZZZZZZZuuZuuZuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
ZZZZZZZZuuZuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
ZZZZZZZZuZuZuuuuuZyfppkqqbppyZuuuuuuuuuuuuuuuuuuuu
ZZZZZZZZuuZuypg@NNMMMMMMMMMMM#@qyuuuuuuuuuuuuuuuuu
ZZZZZZZuZZf@#NNMMMMMMMMMMMMMMMMMM#qZuuuuuuuuuuuuuu
ZZZZuZZZpg#NMNMNNNNNNN#####NNMMMMMN#qZuuuuuuuuuuuu
ZZuuuuZqH#NNNNNN#H@@@ggqkbqg@@H##NNNNHpuuuzuuuuuuu
ZZuuZZg#NNNNN#HgqpfVyyZZuuuuuuuVbg@H#HHfuzuuuuzuuu
ZZZuZyHNNNNNHmbffVyZuuuzzrrtl===trf@@HH@Zuuuuuuuuu
ZZZZuy#NNNNHgpffVyZZuuzzrttl=????>tq@@HHpuuzuuuuuu
ZZZZZy#NNNNHqfVyyZZuuzzvttll===?>;?p@HHHpuuzuuuuuu
ZZZZZf#NNN#@bfpbbfVZzzzrt=lrrvuzr=>rqHHHpzuuuuuuuu
ZZuuuVHNNNHbfpkpbppffyyul=rZyyzl==??r@@Hbzuuzzuuzu
ZZuuZZ@#NN@bkVVpqqqfZZypuvZubqytt>;rrg@mZzzzzzuzuu
ZZZuZZyq@#myyVfpVVyyyfqpr=Zrvuvt??>=?bu>ttzzzuuzuu
ZZZZZZfVp@qZyyyyZVVyyffZr?>?lrrtl?;:;zz:ltuzzuuzuu
ZZZZZZZVgbfyZZZZuuuZfZpyv?=?>==?>::~;;ul>uzzuuuuuu
ZZZZZZZZfyyyZZZuuuuZyfpfuttl?==?;:~:::;>rzzzuzuuuu
ZZZZZZZZZZyyZZZZZuZyyyyZuvll=>?>::~:>;lzzuzuuuuuuu
ZZZZZZZZZuZZyZZZZZyVpbpfyuuurtl>::~:zuuuuuzuuuuuuu
ZZZZZZZZZZZZZZZZZZZZZZZZzr=>?l?;:::luzuuuuuuzuuuuu
ZZZZZZZZZZZZZZyZZZZyZZZuvl?>;;;:::luuuuuuzuuuuuuuu
yZZZZZZZZZZZZZyyyyyZyyyuvt?;;;::;=uuuuuuuuuuuuuuuu
yZZZZZZZZZZZZZyyVfVyyyZuzrl=>>>;:tuuuuuuuuuzuuuuuu
yZZZZZZZZZZZZZyyyVfffVyZzrt??>;::lrvuuuuuuuuuuuuuu
yyyZZZZZZZZrufyyyyVVyyZur=>;;;;::rZ>>uuuuuuuuuuuuu
yyyyyZZZZZ=tqkyyyyyyyyZv=>>;>;;::tqz.:uuuuuuuuuuuu
yyyZZZZZZt;>VqyyyZZyZZuvl??>>;;;>vb?` >uuuuuuuuuuu
yyyZyZyZr>;;;tVyZZZZZuzrl=?????lzr~`   ~?ruuuuuuuu
yyyuvtl?;;;>;;:lZyZuuzzrttlllrzt:`    ```.~:?tuuuu
t=>>>>>>;;;;;;::~luuvrrrrvrrv=~.`  `````.......~;?
>;>>>>>>::;;;;;::~~>=trrzvl;..``````.````......~~~
>>>>>>??;::::;;::~~:;~~::~~.`````.....``......~~~~
;;;;>>>??::::::;>?==;...~~:;;:~........``.....~~~~
;;;>>>>>?>>>???>;;>?:`....~~:::;;:~...~~``.....~~~
```
虽然看不太清楚但是意思到了（如果想清楚一点可以加大图片的大小）。。。其实这是我本人的一个证件照。。。跟上面棱角分明的简图不同，这个类似用字符代替像素点来对图片进行构造，看上去简陋了许多。

## 历史来源
其实这种类似的图片并不新鲜，或者说这其实是旧时代的产物。在计算机刚刚普及的时候，由于图像处理能力以及网络比较差劲，一般只能显示文本。为了传递更多有趣的信息，人们想到了用ascii码来拼一个图片。在很多早期的电子邮件，BBS里经常会看到这样的东西。不过其实最早的asciiart可以追溯到1966年左右。。。具体的历史可以参考[wiki](https://en.wikipedia.org/wiki/ASCII_art)。[charter.net](http://webpages.charter.net/lgbeard/Ascii-Art-Faq.html)里也有一些关于ascii-art的FAQ。

到了当今时代，网络和显示器显然都不成问题了，但是仍然有很多人对这类精巧的图片感兴趣，他们致力于设计和使用这类文字。而事实上，我们的输入法中也有大量类似的颜文字，比如：
```
@_@ 疑惑、晕头转向
o_O 讶异
^_^ 高兴
XD (横向看) 现在多用于高兴地笑、张开嘴大笑
T_T 哭得很伤心
-_-b 流汗
=_=" 无奈
=3= 亲吻、嘟嘴
^o^/ 抱抱
(^O^)/ 开心
._/.# 生气
(=^_^=) 喵猫
(￣(工)￣) 大狗熊
```
其实我们现在所说的“颜文字”，一般就是指日式颜文字或日本颜文字（emoticon--emotion icon的简称），或者"Japanese ascii art"。

## 如何制作
当然，我并不是很在意这些东西的历史，我更加关心这些东西从哪里能搞得到以及是怎么搞出来的。

### FIGlet字体
首先我们研究一下第一类图片是怎么搞的。
我找到了这样的一个网站[patorjk.com](http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something)。
他提供了我们不同字体不同宽度高度的Text转Ascii的接口，一般情况下我们可以直接利用这个接口得到自己想要的图案。

很显然，他的原理十分简单，就是将Ascii码做成一种特定格式的字体，然后将这个字体应用到你写的Ascii码上即可。
需要注意的是这个字体与我们常见的.ttf之类的字体是不一样的。在[FIglet Fonts](http://www.jave.de/figlet/fonts.html)里提供了至少263中字体包。下载下来的文件中以.flf为后缀的就是字体文件。

这个.flf的字体文件需要用专门的软件打开。在Linux下就直接有一个叫figlet的软件包，apt-get就能下载下来。
基本用法如下:
```
myths@business:~$ figlet -d ~/Downloads/fonts/ -f o8.flf
myths
                          o8   oooo                    
oo ooo oooo oooo   oooo o888oo  888ooooo    oooooooo8  
 888 888 888 888   888   888    888   888  888ooooooo  
 888 888 888  888 888    888    888   888          888 
o888o888o888o   8888      888o o888o o888o 88oooooo88  
             o8o888     
```
```
myths@business:~$ figlet -d ~/Downloads/fonts/ -f 3d_diagonal.flf
myths
                                                           
                                                           
          ____              ___      ,---,                 
        ,'  , `.          ,--.'|_  ,--.' |                 
     ,-+-,.' _ |          |  | :,' |  |  :                 
  ,-+-. ;   , ||          :  : ' : :  :  :      .--.--.    
 ,--.'|'   |  ||    .--,.;__,'  /  :  |  |,--. /  /    '   
|   |  ,', |  |,  /_ ./||  |   |   |  :  '   ||  :  /`./   
|   | /  | |--', ' , ' ::__,'| :   |  |   /' :|  :  ;_     
|   : |  | ,  /___/ \: |  '  : |__ '  :  | | | \  \    `.  
|   : |  |/    .  \  ' |  |  | '.'||  |  ' | :  `----.   \ 
|   | |`-'      \  ;   :  ;  :    ;|  :  :_:,' /  /`--'  / 
|   ;/           \  \  ;  |  ,   / |  | ,'    '--'.     /  
'---'             :  \  \  ---`-'  `--''        `--'---'   
                   \  ' ;                                  
                    `--`                                   

```
用-d指定字体文件夹，-f 指定字体文件，然后就进入了交互式的环境，输入字符后输入回车就能产生生成的图案，十分方便。

### JavE绘图
对于第二类的图形，我找到了很多汇总的网站，比如[ascii-art.de](http://www.ascii-art.de/)、[chris.com](http://www.chris.com/ascii/)。这里都记载了很多有趣的图形，就不一一列举了。其实很多ascii-art的网站都属于一个叫`ASCII Arts Web Ring`的圈子([artcode](http://artcode.org/ascii/))，通过这个主站我们可以很轻松的找到很多手机图案的网站。

那么这些图案又是怎么做的呢？

显然上面的方法只能搞定纯Ascii的文本，甚至不能支持中文(谁叫中文那么多。。。)，所以显然也不能支持。这就需要用到我们的[JavE5](http://www.jave.de/)了。
由于看上去这个网站好多年没更新了，生怕他哪天宕掉，我就把这个项目fork到了我的[github](https://github.com/mythsman/Jave5)上，并且加上了最新的Figlet字体。。。侵删。。。

项目中有一个jave5.jar的文件，运行这个文件我们就可以打开这个软件(`java -jar jave5.jar`):
![](/images/2017/06/05/1/1.png)

我们可以很方便的使用这个软件来进行创作。值得一提的是，除了支持一般的绘画，他也支持上面的 FIGlet字体，甚至支持latex公式。。。

### image2ascii
相比于上面的，我个人觉得这个就比较简单了。毕竟稍微懂点计算机图形学的同学就知道怎么从图片中提取像素信息。一个简单的思路是，我们可以把图片进行二值化，然后对应白色的地方我们补0，对应黑色的地方我们补8，这样我们就可以生成一个0-8的ascii图片（这里可能还需要考虑字符的宽高比）。如果想要缩放，我们就需要先对原图进行缩放再进行替换即可。

不过这个方法还是有点丑，毕竟我们是把图片当成二值图来进行处理的。其实我们完全可以把图片变成灰度图，然后根据不同像素点的灰度选择不同"灰度"的字符，这样生成的图片更为好看。

在jave5中，也非常完美的实现了这个功能，我们可以直接在命令行使用这个命令：
```
myths@business:~/Downloads/jave5$ java -jar jave5.jar i2a ~/Pictures/me.gif width=20
ZZZZZuuZuuuuuuuuuuuu
ZZZuZuuuZZZuuuuuuuuu
ZZZZQNMMMMMMNmXuuuuu
ZuQMNNMMMMHMMMMRuuuu
ZZWNMHVZuwtz=vHHkuuu
ZuMNMWkkwOzuy+WHkuzu
ZZdMHfHHXKXW01wBwzuu
ZZXWWZZXWkj+z<(Izzuu
ZZZZWZZXkkAz<:(zuuuu
ZZZZZZZyZkI<<(zuuuzz
yyZZZZVWWXO+<juuuzuu
yyyZOHyyyZ<;;d>Ouuuu
yZU3;?WZuOz1z=  ?Ouu
>>><;;_?zvC^`  `..._
;;><((<1!__<--.- ._~
```
这是我上面的证件照的缩小版，我们可以通过指定width来修改大小。

## 参考资料
[Wiki Ascii_art](https://en.wikipedia.org/wiki/ASCII_art)
[Ascii-Art-Faq](http://webpages.charter.net/lgbeard/Ascii-Art-Faq.html)
[Text to ASCII Art Generator](http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20)
[artcode.org](http://artcode.org/ascii/)
[Jave](http://www.jave.de/)
[chris ascii](http://www.chris.com/ascii/)
[textart](http://textart.io/)