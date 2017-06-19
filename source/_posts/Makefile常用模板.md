---
title: Makefile常用模板
id: 1
categories:
  - C/C++
date: 2016-11-22 19:56:47
tags:
  - C/C++
---

写Makefile大概是每一个合格的C/C++程序员的基本功吧，几乎所有C语言写的开源项目都会用Makefile或者类似的Cmake来组织和编译，可见这个是有多重要。不过说白了，Makefile其实下面就简单记录下Makefile的常用模板，并且附带了自己总结的注意点方便以后查找使用。下面这两个模板是用来搞[guisan](https://github.com/mythsman/guisan)的。

## 简单项目模板

简单小程序的makefile，一般情况下编译少量的、不分头文件的项目的话用下面的模板就够用了：
```
CC      =g++
INCLUDE =-I../include
LDFLAGS =-L../lib
LIBS    =-lSDL2 -lSDL2_ttf -lSDL2_mixer -lguisan -lSDL2_image
CFLAGS  =-g -w -O3 $(INCLUDE) $(LDFLAGS)
CXXFLAGS=$(CFLAGS)

.PHONY:all clean

all :sdlhelloworld sdlaction sdlwidgets

sdlhelloworld:sdlhelloworld.o
    $(CC) $(CXXFLAGS) -o sdlhelloworld sdlhelloworld.o $(LIBS)

sdlaction:sdlaction.o
    $(CC) $(CXXFLAGS) -o sdlaction sdlaction.o $(LIBS)

sdlwidgets:sdlwidgets.o
    $(CC) $(CXXFLAGS) -o sdlsdlwidgets sdlwidgets.o $(LIBS)

clean:
    rm -rf sdlhelloworld sdlaction sdlwidgets *.o
```
上面这段代码摘自我在guisan中写的[Makefile](https://github.com/mythsman/guisan/blob/master/examples/Makefile)，分别编译生成三个可执行文件。下面进行简要分析。

其实个人认为Makefile其实就是加了一些特定格式的shell脚本，只是针对编译这个任务做了特定的处理，Makefile自己并不是编译器，只是将编译命令整合在一起罢了。

makefile核心的部分就是文件依赖了，这些基本都是一些套路，即可执行文件依赖.o文件，.o文件依赖.cpp文件，这个过程其实就是先编译、后链接的具体表现。但是如果严格这样写的话，得写两次依赖，很不方便，因此makefile在编译（链接的过程仍然需要自己写）的过程中能够自动进行推导。说是自动，其实也很简单，就是如果他发现一个叫xxx.o的文件当前目录下没有，那他就会自动的找对应的xxx.cpp(或者xxx.c)文件，并且自动进行编译。也就是说，我们不需要关心如何编译生成.o文件，只需要关心怎么链接生成可执行文件即可。

上面有个问题，就是在自动推导将.cpp文件生成.o文件的过程中，我们如何控制编译参数呢？这里就需要牵涉到一些常量的使用了。

在makefile文件的开头定义了一些常量，这当中有的是make命令默认能够识别的，比如CC(编译器)、CFLAGS(gcc编译参数)、CXXFLAGS(g++编译参数)；有些是我们自己定义的或者说是习惯定义的，比如LIBS(链接库)，LDFLAGS(库目录)，INCLUDE(头文件目录)。在自动推导过程中，makefile会根据CC来确定是将CFLAGS还是CXXFLAGS加入到编译命令中，这样，我们就可以轻松的控制自动推导过程中的编译参数了。我在上面的CFLAGS里加了-g -w -o3，分别表示调试模式、禁止warning和启用O3优化，除此之外，一般还会加INCLUDE和LDFLAGS这两个参数，因为在自动编译的过程中需要必要的包含目录和库目录；而且一般不加LIBS，因为编译的过程中不需要链接库文件。

链接静态库和动态库其实是一样的，只要都是要用-lxxx来链接，不过要记得如果他们不在系统的环境变量的话，就得把他们所在的目录带上-L参数加到LDFLAGS的里。

如果在LIBS里面有多个链接库，需要注意如果这些库当中有依赖关系，也要保证被依赖的要写在后面，比如这里的guisan是依赖于SDL2_image的，我们就得把他挪到SDL2_image前面。。。

还有个.PHONY参数，这个参数又叫伪指令，实际上就是制定了在命令行下输入make指令后能带的参数，当然不写这个基本也没事，用这个的主要目的就是为了防止命令解释器把参数当成同目录下的同名文件。通常得支持all和clean这两个命令。

在编写具体依赖的过程中，由于编译的过程已经由自动推导代劳了，我们只需要编写链接过程的命令，我们需要手动加上CC和CXXFLAGS这样的命令，并且要在最后添加链接库LIBS。

最后写一个clean，自己给自己揩屁股。。。

这样一来，我们就能用make all来编译和链接，make clean来清除了。

在编译的过程也会原封不动的回显出来：
```
g++ -g -w -O3 -I../include -L../lib   -c -o sdlhelloworld.o sdlhelloworld.cpp
g++ -g -w -O3 -I../include -L../lib -o sdlhelloworld sdlhelloworld.o -lSDL2 -lSDL2_ttf -lSDL2_mixer -lguisan -lSDL2_image
g++ -g -w -O3 -I../include -L../lib   -c -o sdlaction.o sdlaction.cpp
g++ -g -w -O3 -I../include -L../lib -o sdlaction sdlaction.o -lSDL2 -lSDL2_ttf -lSDL2_mixer -lguisan -lSDL2_image
g++ -g -w -O3 -I../include -L../lib   -c -o sdlwidgets.o sdlwidgets.cpp
g++ -g -w -O3 -I../include -L../lib -o sdlsdlwidgets sdlwidgets.o -lSDL2 -lSDL2_ttf -lSDL2_mixer -lguisan -lSDL2_image
```
这里可以十分清楚地看到自动推导的编译过程和自己编写的链接过程。

## 大型项目模板

复杂、较大程序的编译以及打包成库，通常需要下面的模板来弄(以生成静态库为例)：
```
TARGET  = lib/libguisan.a

AR      = ar

DIRS	=$(shell find ./src -maxdepth 3 -type d)
SOURCE	= $(foreach dir,$(DIRS),$(wildcard $(dir)/*.cpp))
OBJS    = $(patsubst %.c,%.o,$(patsubst %.cpp,%.o,$(SOURCE)))

INCLUDE	=-I./include  
CFLAGS  = -g -w -O3  $(INCLUDE)
CXXFLAGS= $(CFLAGS)

.PHONY : all clean

$(TARGET) : $(OBJS)
	$(AR) cr $(TARGET) $(OBJS)

all : $(TARGET)

clean :
	find . -name *.o |xargs rm -f
	rm -rf $(TARGET)
```
简要说明下，首先我们的目的是在lib下生成一个静态库叫guisan，因此我用一个常量来突出下；打包生成静态库的命令是ar，我也用默认的常量来表示下；然后配置自动编译需要的参数，很好理解。

下面就是编译大型项目的关键了，由于文件可能比较多，一个一个写依赖显然很麻烦，而且不好维护，因此这里采用了递归查找的方法。首先是DIRS常量，这其实就是用shell命令写的，他表示递归查找./src目录下三层以内的所有文件夹；在此基础上，SOURCE常量就定义为DIRS下的文件中所有以.cpp为后缀的文件，这实际上就是所有的源文件；最后，OBJS常量定义为SOURCE里的所有文件把.cpp都改为.o后的文件名，这其实就是预测的所有目标文件。。。个人觉得这个小技巧还是非常帅气的。

然后就是打包命令，看一下就好了。

最后在clean里还要用脚本递归删除所有生成的文件。

还有一个问题，就是通常我们可能会在项目主目录下写一个Makefile，这个默认是编译主项目的，不过有时候我们可能会在主目录下加一个demo、或者example之类的小项目作为例子，显然他们应当有自己独立的makefile，但是我们很想在主目录下的Makefile里同时编译他们，怎么弄呢？其实很简单，我们只要把makefile当成shell脚本来用就好了：
```
......

all : $(TARGET)
    cd demo&&make all&&cd ..
    cd examples&&make all&&cd ..

clean :
    cd demo&&make clean&&cd ..
    cd examples&&make clean&&cd ..
    find . -name *.o |xargs rm -f
    rm -rf $(TARGET)
```
最后还有一个小窍门，我们知道在编译大型目录的时候经常编译要等好久，这就很坑爹了，其实make是支持多线程编译的，比如可以用`make -j4`来指定用四个线程进行编译。不过不要以为线程数越多效果就越好，操作系统课告诉我们多线程计算的效果是受cpu核的个数限制的，并行数显然不会超过cpu核的个数。因此，我们可以用`make -j$(nproc)`来优雅的确定线程数，其中`$(nproc)`这个常量就是表示cpu支持的并行进程数，效果谁用谁知道。
