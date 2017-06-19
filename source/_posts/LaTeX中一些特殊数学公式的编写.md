---
title: LaTeX中一些特殊数学公式的编写
id: 1
categories:
  - LaTeX
date: 2015-10-10 23:43:05
tags:
  - LaTeX
mathjax: true
---

## 前言
一般情况下，在编写数学公式的时候，符号表就能满足我们的需求。但是很多情况下，当我们书写一些比较复杂的行间公式时，这点符号就显得捉襟见肘了，一下就整理一些常用的特殊数学公式

## 上标和下标
$\text{\overset{}{}}$ 这个东西后面接两个参数，第一个参数表示想加上标，第二个参数表示施加的对象,如果不加大括号，那么默认是把最近的一个元素作为下一个参数，比如
$$\text{\overset{up}{base}}:\overset{up}{base}$$
$\text{\underset{}{}}$ 这个表示加下标，用法跟上标一样比如
$$\text{\underset{under}{base}}:\underset{under}{base}$$

## 大括号结构
很多情况下，我们需要大一点的括号来表示包含关系，平时的小括号就显得不够用了，这时候就需要left和right对来表示括号：
一般用法是$\text\left$后面接左括号的类型，最后再加上$\text\right$后面接右括号的类型。这里的$\text\left$和$\text\right$一定要成对出现，如果想不出现某一个括号，只需要加"."，比如$\text{\right.}$就表示不显示右括号。
例：
$$\text{\left(\frac{a}{b}\right)}:\left(\frac{a}{b}\right)$$
$$\text{\left(\frac{a}{b} \right.}:\left(\frac{a}{b} \right.$$


当然，上面的方法适用与单行显示，如果想让大括号包括多行(比如显示方程组)，我们可以用类似下面的方法来显示：

$$
\text{\left\\\{\begin{aligned}function1\\\\function2\end{aligned}\right.}:
\left\\\{\begin{aligned}function1\\\\function2\end{aligned}\right.
$$


## 不同大小的嵌套括号
可以使用\big, \Big, \bigg, \Bigg控制括号的大小，比如代码
$$
\text{\Bigg ( \bigg ( \Big ( \big (} :
\Bigg ( \bigg ( \Big ( \big (
$$

## 多行公式
要处理多行的公式比如分段函数或者连等推导的时候，通常需要使用$\text{\begin{aligned}...\end{aligned}}$对，在这当中用双反斜杠表示换行，在每行中，用&符号来定位对齐，比如:

$$
\begin{aligned}(a + b)^3 &= (a + b) (a + b)^2\\\\
&= (a + b)(a^2 + 2ab + b^2) \\\\
&= a^3 + 3a^2b + 3ab^2 + b^3\end{aligned}
$$

## 矩阵

$\begin{matrix} 0 & 1 \\\\ 1 & 0 \end{matrix}$

$\begin{pmatrix} 0 & -i \\\\ i & 0 \end{pmatrix}$

$\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \end{bmatrix}$

$\begin{Bmatrix} 1 & 0 \\\\ 0 & -1 \end{Bmatrix}$

$\begin{vmatrix} a & b \\\\ c & d \end{vmatrix}$

$\begin{Vmatrix} i & 0 \\\\ 0 & -i \end{Vmatrix}$
