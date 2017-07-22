---
title: SDL2安装指南
id: 1
categories:
  - C/C++
date: 2016-09-13 19:31:44
tags:
  - C/C++
---

SDL（Simple DirectMedia Layer）是一套开放源代码的跨平台多媒体开发库，使用C语言写成。SDL提供了数种控制图像、声音、输出入的函数，让开发者只要用相同或是相似的代码就可以开发出跨多个平台（Linux、Windows、Mac OS X等）的应用软件。目前SDL多用于开发游戏、模拟器、媒体播放器等多媒体应用领域。下面主要介绍一下在Windows下搭建SDL2开发环境的过程。

## 下载

下载自[SDL官网](http://www.libsdl.org/download-2.0.php)，在Development Libraries中选择相应的版本。我这里选择的是Windows平台下的Visual C++版，因为我接下来使用的环境是VS2013。

![](/images/2016/09/13/1/1.png)

## 文件

把文件下载下来解压后的文档树应该是这样的：
```
└─SDL2-2.0.4
    │  BUGS.txt
    │  COPYING.txt
    │  README-SDL.txt
    │  README.txt
    │  WhatsNew.txt
    │
    ├─docs
    │      doxyfile
    │      README-android.md
    │      README-cmake.md
    │      README-directfb.md
    │      ......
    │
    ├─include
    │      begin_code.h
    │      close_code.h
    │      SDL.h
    │      SDL_assert.h
    │      SDL_atomic.h
    │      SDL_audio.h
    │      ......
    │
    └─lib
        ├─x64
        │      SDL2.dll
        │      SDL2.lib
        │      SDL2main.lib
        │      SDL2test.lib
        │
        └─x86
                SDL2.dll
                SDL2.lib
                SDL2main.lib
                SDL2test.lib
```
主要包含使用说明、doc文档、头文件、以及库文件。这里的库文件包括x86和x64两种架构的，每种都含有一个动态链接库和三个静态链接库。

## VS中的项目配置

SDL2说白了其实只是一个C语言库，因此配置他就跟配置其他任意的库一样，主要分为三步：

一、包含必需的头文件和库文件

因为我们需要能够include进SDL2的头文件，并且找到对应的实现代码(库文件)，所以我们必需得让编译器能够找到他们。因此我们只需要在工程的`项目->属性->配置属性->VC++目录<` 里配置好相应的路径：

![](/images/2016/09/13/1/2.png)

也就是修改图中的包含目录以及库目录，分别对应之前的include文件夹，以及lib/x86文件夹(VS默认的是x86架构)。

二、添加编译指令

既然用了第三方的库，那么我们在进行编译的时候肯定需要加上-l指令，从而指定编译进去的静态链接库。而按照微软一贯的保姆式作风，在VS中并不需要我们手动输入编译指令，只需要修改一下编译配置，然后就能直接编译了。这个配置在`项目->属性->配置属性->链接器->输入->附加依赖项<` 这里：

![](/images/2016/09/13/1/3.png)

在这里面加上那三个静态库的名字即可(SDL2.lib、SDL2main.lib、SDL2test.lib)。

三、配置动态库

只配置了静态库已经是可以编译的了，但却是无法调试的，因为程序运行需要SDL2.dll这个动态库的支持。那么我们只需要将SDL2.dll加入电脑的PATH环境变量里或者是工程目录下，从而保证程序能找到他。

最后，针对SDL2还需要额外设置一个配置，就是程序的入口，具体原因不明。配置方法就是修改`项目->属性->配置属性->链接器->系统->子系统`，内容改成"**窗口 (/SUBSYSTEM:WINDOWS)**"即可：

![](/images/2016/09/13/1/4.png)

搞好上面这个配置，理论上就能跑SDL2的程序了，那我就直接把下面这个显示图片的程序作为Hello World来测试一下吧：
```cpp
#include "SDL.h"
#include<iostream>
using namespace std;
int main(int argc, char** argv){
	if (SDL_Init(SDL_INIT_EVERYTHING) == -1){
		std::cout << SDL_GetError() << std::endl;
		return 1;
	}
	SDL_Window *win = nullptr;
	win = SDL_CreateWindow("Hello World!", 100, 100, 640, 480, SDL_WINDOW_SHOWN);
	if (win == nullptr){
		std::cout << SDL_GetError() << std::endl;
		return 1;
	}
	SDL_Renderer *ren = nullptr;
	ren = SDL_CreateRenderer(win, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
	if (ren == nullptr){
		std::cout << SDL_GetError() << std::endl;
		return 1;
	}
	SDL_Surface *bmp = nullptr;
	bmp = SDL_LoadBMP("test.bmp");
	if (bmp == nullptr){
		std::cout << SDL_GetError() << std::endl;
		return 1;
	}
	SDL_Texture *tex = nullptr;
	tex = SDL_CreateTextureFromSurface(ren, bmp);
	SDL_FreeSurface(bmp);
	SDL_RenderClear(ren);
	SDL_RenderCopy(ren, tex, NULL, NULL);
	SDL_RenderPresent(ren);
	SDL_Delay(2000);
	SDL_DestroyTexture(tex);
	SDL_DestroyRenderer(ren);
	SDL_DestroyWindow(win);
	SDL_Quit();
	return 0;
}
```
程序运行的结果就是显示test.bmp两秒钟。
