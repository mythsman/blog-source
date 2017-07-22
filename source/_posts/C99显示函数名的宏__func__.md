---
title: C99显示函数名的宏__func__
id: 1
categories:
  - C/C++
date: 2016-01-12 13:03:04
tags:
  - C/C++
---

## 前言
在调试代码或者写一些通用的测试函数的时候，有时候想如果能够用字符串的方式显示出正在调用的函数名该有多好。其实在C99标准中就已经有了这样的宏__func__，只是平常不怎么被提起。那么这个宏怎么用呢？

## 示例

程序：
```cpp
＃include<iostream>
using namespace std;
void fun(){
    cout<<__func__<<endl;
}
int main(){
    fun();
}
```
结果：
```
fun
```
没错，就是这么简单，非常方便。特别在某些调用函数指针进行测试的函数里，用这个东西来显示当前所调用的不同函数还是特别轻松的。比如：
```cpp
＃include<iostream>
using namespace std;
string insertionSort(int *a , int n){
    //------
    return string(__func__);
}
string bubbleSort(int *a , int n){
    //------
    return string(__func__);
}
string quickSort(int *a , int n){
    //------
    return string(__func__);
}
string mergeSort(int *a , int n){
    //------
    return string(__func__);
}

void test(void (*sort)(int *,int),int *a,int n){
    int time;
    //-----
    cout<<(*sort)(a,n)<<time<<endl;
}
int main(){
    int a[100];
    //----
    test(insertionSort,a,100);
    test(bubbleSort,a,100);
    test(quickSort,a,100);
    test(mergeSort,a,100);
}
```
这就可以非常轻松的显示各个方法调用后运行的结果了，而不用手动写函数名了。
