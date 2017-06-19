---
title: Julia集的win32+GDI演示
id: 1
categories:
  - Others
date: 2016-05-25 21:39:23
tags:
  - Computer Vision
  - C/C++
---

虽然不是第一次win32来写窗口程序，但是最近python和java用惯了，还真用不惯win api繁琐的调用方法，光是一个模版就好难理解。

事实上，那些模版的玩意写上去就好了，我们只要在他的消息循环的处理里添加绘图的函数即可。

至于绘图，我用的是GDI库最简单的用法，不加缓冲直接逐像素点打印。效率很低，而且会出现刷屏的现象。正确的做法应该是在内存中创建一张Image，向这个里面写再一次性输出。（这样弄效率高但是在网上找了半天没找到傻瓜式的代码模版。。。）

## 代码
```cpp
#include <windows.h>
#include <gdiplus.h>
#include<time.h>
#include<stdlib.h>
//添加GDI的库，当然也可以直接在属性->连接器->输入->附加依赖项里加这个库名
#pragma comment(lib,"gdiplus.lib")
using namespace Gdiplus;
struct Complex//自定义一个复数类，据说用自带的complex会很慢
{
	double real;
	double img;
};
void OnPaint(HDC hdc){//每次屏幕重绘时都重新输出一张图
	int B[256],G[256],R[256];
	srand((unsigned)time(0));//随机生成Julia集的初始状态
	Complex c;
	c.real=(rand()%20000*1.0-10000)/10000;
	c.img=(rand()%20000*1.0-10000)/10000;
	int t1=rand()%1000;double t2=rand()%10/10.0;
	for(int i=0;i<256;i++)//随机生成配色方案
	{
		B[i]=i*t1%256;
		G[i]=(int)(t2*255)%256;
		R[i]=(int)(255.0*(1.0-i/255.0*i/255.0
			/1.2)+256)%256;}double dx=5.0/720;

		//下面是逃逸时间算法
		double dy=5.0/540;
		int its=256;
		double size=4.0;
		for(int row	=0;row<540;row++){
			for(int col=0;col<720;col++){
				int color=0;
				Complex z;
				z.real=col*dx-2.5;
				z.img=row*dy-2.5;
				while((color<its)&&((z.img*z.img+z.real*z.real)<size)){
					double tmp=z.real*z.real-z.img*z.img+c.real;
					z.img=z.img*z.real+z.real*z.img+c.img;
					z.real=tmp;color++;
				}
				if(color>=its)
					color=255;
				color%=256;
				//直接SetPixel绘图会比较简单，但是效率却十分低下
				SetPixel(hdc,col,row,RGB(B[color],G[color],R[color]));
			}
		}
}
//处理消息循环
LRESULT CALLBACK WndProc(HWND hWnd,UINT message,WPARAM wParam,LPARAM lParam){
	PAINTSTRUCT ps;
	switch(message){
	case WM_PAINT:
		BeginPaint(hWnd,&ps);
		OnPaint(ps.hdc);
		EndPaint(hWnd,&ps);
		return 0;
	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	default:
		return DefWindowProc(hWnd,message,wParam,lParam);
	}
}
//win32程序的入口函数
INT WINAPI WinMain(HINSTANCE hInstance,HINSTANCE,PSTR,INT iCmdShow){
	HWND hWnd;//窗口句柄
	MSG msg;//消息
	WNDCLASS wndClass;
	GdiplusStartupInput gdiplusStartupInput;ULONG_PTR gdiplusToken;
	GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, NULL);
	wndClass.style= CS_HREDRAW | CS_VREDRAW;
	wndClass.lpfnWndProc= WndProc;
	wndClass.cbClsExtra = 0;
	wndClass.cbWndExtra = 0;
	wndClass.hInstance  = hInstance;
	wndClass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wndClass.hCursor  = LoadCursor(NULL, IDC_ARROW);
	wndClass.hbrBackground  = (HBRUSH)(COLOR_WINDOW+1);
	wndClass.lpszMenuName   = NULL;
	wndClass.lpszClassName  = TEXT("Julia");
	RegisterClass(&wndClass);
	//创建窗口
	hWnd = CreateWindow(
		TEXT("Julia"),
		TEXT("Julia"),  
		WS_OVERLAPPED|WS_SYSMENU|WS_MINIMIZEBOX,//窗口风格，这里禁用了最大化按钮可伸缩边框     
		CW_USEDEFAULT,        
		CW_USEDEFAULT,        
		725, //窗口宽度         
		560, //窗口高度   
		NULL,                 
		NULL,                    
		hInstance,//传入句柄              
		NULL);                    
	ShowWindow(hWnd, iCmdShow);
	UpdateWindow(hWnd);
	while(GetMessage(&msg, NULL, 0, 0))//处理消息循环
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}
	GdiplusShutdown(gdiplusToken);//释放GDI资源
	return msg.wParam;
}
```

## 效果图

![](/images/2016/05/25/1/1.png)
![](/images/2016/05/25/1/2.png)
![](/images/2016/05/25/1/3.png)