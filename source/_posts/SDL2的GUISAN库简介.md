---
title: SDL2的GUISAN库简介
id: 1
categories:
  - C/C++
date: 2016-11-19 20:45:52
tags:
  - C/C++
---

## 简介

GUISAN是一个基于SDL2的开源的GUI控件库，原本是为了一个叫GUICHAN的小游戏而编写的框架。虽然和Qt、C#中的GUI控件没法比，但是他更加简单，可以更好的通过他的代码来进行框架的研究学习。

## 源码

官方的版本托管在kallisti5的[github](https://github.com/kallisti5/guisan)上，不过由于它是用Sconscript来编译的，对于大多数人来说不是很习惯，因此我把他用makefile重新编译了一遍，把静态库独立出来方便以后的使用，同时顺便删掉了一些文件，并且用doxygen生成了一个文档方便学习。

我把修改后的版本放在了我的[github](https://github.com/mythsman/guisan)上。

## 简要分析

GUISAN的include文件夹内容如下：

```
include
├── guisan
│   ├── actionevent.hpp
│   ├── actionlistener.hpp
│   ├── basiccontainer.hpp
│   ├── cliprectangle.hpp
│   ├── color.hpp
│   ├── deathlistener.hpp
│   ├── defaultfont.hpp
│   ├── event.hpp
│   ├── exception.hpp
│   ├── focushandler.hpp
│   ├── focuslistener.hpp
│   ├── font.hpp
│   ├── genericinput.hpp
│   ├── glut.hpp
│   ├── graphics.hpp
│   ├── gui.hpp
│   ├── imagefont.hpp
│   ├── image.hpp
│   ├── imageloader.hpp
│   ├── inputevent.hpp
│   ├── input.hpp
│   ├── keyevent.hpp
│   ├── key.hpp
│   ├── keyinput.hpp
│   ├── keylistener.hpp
│   ├── listmodel.hpp
│   ├── mouseevent.hpp
│   ├── mouseinput.hpp
│   ├── mouselistener.hpp
│   ├── opengl
│   │   ├── openglgraphics.hpp
│   │   ├── openglimage.hpp
│   │   └── openglsdlimageloader.hpp
│   ├── opengl.hpp
│   ├── platform.hpp
│   ├── rectangle.hpp
│   ├── sdl
│   │   ├── sdlgraphics.hpp
│   │   ├── sdlimage.hpp
│   │   ├── sdlimageloader.hpp
│   │   ├── sdlinput.hpp
│   │   ├── sdlpixel.hpp
│   │   └── sdltruetypefont.hpp
│   ├── sdl.hpp
│   ├── selectionevent.hpp
│   ├── selectionlistener.hpp
│   ├── widget.hpp
│   ├── widgetlistener.hpp
│   ├── widgets
│   │   ├── button.hpp
│   │   ├── checkbox.hpp
│   │   ├── container.hpp
│   │   ├── dropdown.hpp
│   │   ├── icon.hpp
│   │   ├── imagebutton.hpp
│   │   ├── label.hpp
│   │   ├── listbox.hpp
│   │   ├── radiobutton.hpp
│   │   ├── scrollarea.hpp
│   │   ├── slider.hpp
│   │   ├── tabbedarea.hpp
│   │   ├── tab.hpp
│   │   ├── textbox.hpp
│   │   ├── textfield.hpp
│   │   └── window.hpp
│   └── x.hpp
└── guisan.hpp

4 directories, 64 files
```

总体上来说，大概可以分为事件处理、基本控件和显示等辅助部分；对于显示部分，他这里不仅可以使用SDL2，还可以直接使用opengl。最后用一个头文件guisan.hpp对整个框架代码进行统一包含。

src文件夹和include文件夹的内容相互对应，不再细说。

### 事件处理

GUISAN的事件处理主要基于gcn::Event这个虚基类，派生的类图如下：
![](/images/2016/11/19/1/1.png)

作为一个UI库，他设计的事件处理机制比SDL2相对庞大的机制相比已经简化很多了，也更加专注于与用户进行交互的事件。

### 基础控件

GUISAN的控件基本继承自gcn::Widget这个虚基类，派生的类图如下：

![](/images/2016/11/19/1/2.png)

可以看到，控件都是用多重继承，既继承自Widget，又根据任务逻辑继承自各个事件监听器。这当中最常见的应该就是gcn::Container这个类了，这是存放所有其他控件的地方。当然，我们还可以根据需要自定义控件，例如上图中的FFXXX，这是demo里自定义的控件。

### 其他

除了上面这两个方面，GUISAN还提供了很多辅助的工具，比如gcn::Color,gcn::Exception,gcn::Image等等，以及一些必不可少的与SDL2相关的类。

## 样例

下面是GUISAN自带的最简单的例子，作为GUISAN框架使用的模板:

```cpp
/**
 * SDL Hello World example for Guichan.
 */

// Include all necessary headers.
#include <iostream>
#include <guisan.hpp>
#include <guisan/sdl.hpp>
#include "SDL2/SDL.h"

/*
 * Common stuff we need
 */
bool running = true;

/*
 * SDL Stuff we need
 */
SDL_Window* window;
SDL_Surface* screen;
SDL_Event event;

/*
 * Guichan SDL stuff we need
 */
gcn::SDLInput* input;             // Input driver
gcn::SDLGraphics* graphics;       // Graphics driver
gcn::SDLImageLoader* imageLoader; // For loading images

/*
 * Guichan stuff we need
 */
gcn::Gui* gui;            // A Gui object - binds it all together
gcn::Container* top;      // A top container
gcn::ImageFont* font;     // A font
gcn::Label* label;        // And a label for the Hello World text

/**
 * Initializes the Hello World
 */
void init()
{
    /*
     * Here we initialize SDL as we would do with any SDL application.
     */
    SDL_Init(SDL_INIT_VIDEO);
    window = SDL_CreateWindow("guisan SDL2 hello world",
        SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 640, 480,
        0);

    screen = SDL_GetWindowSurface(window);

    // We want to enable key repeat
    //SDL_EnableKeyRepeat(SDL_DEFAULT_REPEAT_DELAY, SDL_DEFAULT_REPEAT_INTERVAL);

    /*
     * Now it's time for Guichan SDL stuff
     */
    imageLoader = new gcn::SDLImageLoader();
    // The ImageLoader in use is static and must be set to be
    // able to load images
    gcn::Image::setImageLoader(imageLoader);
    graphics = new gcn::SDLGraphics();
    // Set the target for the graphics object to be the screen.
    // In other words, we will draw to the screen.
    // Note, any surface will do, it doesn't have to be the screen.
    graphics->setTarget(screen);
    input = new gcn::SDLInput();

    /*
     * Last but not least it's time to initialize and create the gui
     * with Guichan stuff.
     */
    top = new gcn::Container();
    // Set the dimension of the top container to match the screen.
    top->setDimension(gcn::Rectangle(0, 0, 640, 480));
    gui = new gcn::Gui();
    // Set gui to use the SDLGraphics object.
    gui->setGraphics(graphics);
    // Set gui to use the SDLInput object
    gui->setInput(input);
    // Set the top container
    gui->setTop(top);
    // Load the image font.
    font = new gcn::ImageFont("fixedfont.bmp", " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    // The global font is static and must be set.
    gcn::Widget::setGlobalFont(font);

    // Create a label with test hello world
    label = new gcn::Label("Hello World");
    // Set the labels position
    label->setPosition(280, 220);
    // Add the label to the top container
    top->add(label);
}

/**
 * Halts the application
 */
void halt()
{
    /*
     * Destroy Guichan stuff
     */
    delete label;
    delete font;
    delete top;
    delete gui;

    /*
     * Destroy Guichan SDL stuff
     */
    delete input;
    delete graphics;
    delete imageLoader;

    /*
     * Destroy SDL stuff
     */
    SDL_DestroyWindow(window);
    SDL_Quit();
}

/**
 * Checks input. On escape halt the application.
 */
void checkInput()
{
    /*
     * Poll SDL events
     */
    while(SDL_PollEvent(&event))
    {
        if (event.type == SDL_KEYDOWN)
        {
            if (event.key.keysym.sym == SDLK_ESCAPE)
            {
                running = false;
            }
            if (event.key.keysym.sym == SDLK_f)
            {
                if (event.key.keysym.mod & KMOD_CTRL)
                {
                    printf("TODO: Toggle full screen!\n");
                }
            }
        }
        else if(event.type == SDL_QUIT)
        {
            running = false;
        }

        /*
         * Now that we are done polling and using SDL events we pass
         * the leftovers to the SDLInput object to later be handled by
         * the Gui. (This example doesn't require us to do this 'cause a
         * label doesn't use input. But will do it anyway to show how to
         * set up an SDL application with Guichan.)
         */
        input->pushInput(event);
    }
}

/**
 * Runs the application
 */
void run()
{
    while(running)
    {
        // Poll input
        checkInput();
        // Let the gui perform it's logic (like handle input)
        gui->logic();
        // Draw the gui
        gui->draw();
        // Update the screen
        SDL_UpdateWindowSurface(window);
    }
}

int main(int argc, char **argv)
{
    try
    {
        init();
        run();
        halt();
    }
    /*
     * Catch all Guichan exceptions
     */
    catch (gcn::Exception e)
    {
        std::cerr << e.getMessage() << std::endl;
        return 1;
    }
    /*
     * Catch all Std exceptions
     */
    catch (std::exception e)
    {
        std::cerr << "Std exception: " << e.what() << std::endl;
        return 1;
    }
    /*
     * Catch all Unknown exceptions
     */
    catch (...)
    {
        std::cerr << "Unknown exception" << std::endl;
        return 1;
    }

    return 0;
}
```

编译的时候注意要将事先编译好的静态库加到PATH里或者写在编译命令里，并且要用-I参数包含头文件夹。

运行输出:


![](/images/2016/11/19/1/3.png)

当然，下面这个样例展示了更多的控件：

![](/images/2016/11/19/1/4.png)
