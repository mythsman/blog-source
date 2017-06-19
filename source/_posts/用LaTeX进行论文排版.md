---
title: 用LaTeX进行论文排版
id: 1
categories:
  - LaTeX
date: 2016-06-16 13:44:50
tags:
  - LaTeX
mathjax: true
---

都知道写文档论文之类的肯定是用LaTeX比较漂亮，虽然我对用LaTeX写数学公式稍微有点了解，但是还是没有直接用它来排版。下面就整理下用LaTeX写文档的方法。

## 安装

最常用的LaTeX排版工具是[MikTeX](http://www.miktex.org/download)。选择好windows版本，下载安装即可。可执行文件是`%install_path%/miktex/bin/x64/texworks.exe`。

## 论文模板

这里的格式通常是在网上找模板。。。毕竟自己弄还是挺麻烦的，而且还要考虑中文编码的问题。我找到的模板如下：(用pdfLaTeX+MakeIndex+BibTex编译)
```
\documentclass[a4paper, 11pt]{article}

%%%%%% 导入包 %%%%%%
\usepackage{CJKutf8}
\usepackage{graphicx}
\usepackage[unicode]{hyperref}
\usepackage{xcolor}
\hypersetup{hidelinks}%%%取消链接的红框框%%%%

\usepackage{indentfirst}

%%%%%% 设置字号 %%%%%%
\newcommand{\chuhao}{\fontsize{42pt}{\baselineskip}\selectfont}
\newcommand{\xiaochuhao}{\fontsize{36pt}{\baselineskip}\selectfont}
\newcommand{\yihao}{\fontsize{28pt}{\baselineskip}\selectfont}
\newcommand{\erhao}{\fontsize{21pt}{\baselineskip}\selectfont}
\newcommand{\xiaoerhao}{\fontsize{18pt}{\baselineskip}\selectfont}
\newcommand{\sanhao}{\fontsize{15.75pt}{\baselineskip}\selectfont}
\newcommand{\sihao}{\fontsize{14pt}{\baselineskip}\selectfont}
\newcommand{\xiaosihao}{\fontsize{12pt}{\baselineskip}\selectfont}
\newcommand{\wuhao}{\fontsize{10.5pt}{\baselineskip}\selectfont}
\newcommand{\xiaowuhao}{\fontsize{9pt}{\baselineskip}\selectfont}
\newcommand{\liuhao}{\fontsize{7.875pt}{\baselineskip}\selectfont}
\newcommand{\qihao}{\fontsize{5.25pt}{\baselineskip}\selectfont}

%%%% 设置 section 属性 %%%%
\makeatletter
\renewcommand\section{\@startsection{section}{1}{\z@}%
{-1.5ex \@plus -.5ex \@minus -.2ex}%
{.5ex \@plus .1ex}%
{\normalfont\sihao\CJKfamily{hei}}}
\makeatother

%%%% 设置 subsection 属性 %%%%
\makeatletter
\renewcommand\subsection{\@startsection{subsection}{1}{\z@}%
{-1.25ex \@plus -.5ex \@minus -.2ex}%
{.4ex \@plus .1ex}%
{\normalfont\xiaosihao\CJKfamily{hei}}}
\makeatother

%%%% 设置 subsubsection 属性 %%%%
\makeatletter
\renewcommand\subsubsection{\@startsection{subsubsection}{1}{\z@}%
{-1ex \@plus -.5ex \@minus -.2ex}%
{.3ex \@plus .1ex}%
{\normalfont\xiaosihao\CJKfamily{hei}}}
\makeatother

%%%% 段落首行缩进两个字 %%%%
\makeatletter
\let\@afterindentfalse\@afterindenttrue
\@afterindenttrue
\makeatother
\setlength{\parindent}{2em}  %中文缩进两个汉字位

%%%% 下面的命令重定义页面边距，使其符合中文刊物习惯 %%%%
\addtolength{\topmargin}{-54pt}
\setlength{\oddsidemargin}{0.63cm}  % 3.17cm - 1 inch
\setlength{\evensidemargin}{\oddsidemargin}
\setlength{\textwidth}{14.66cm}
\setlength{\textheight}{24.00cm}    % 24.62

%%%% 下面的命令设置行间距与段落间距 %%%%
\linespread{1.4}
% \setlength{\parskip}{1ex}
\setlength{\parskip}{0.5\baselineskip}

%%%% 正文开始 %%%%
\begin{document}
\begin{CJK}{UTF8}{gbsn}

%%%% 定理类环境的定义 %%%%
\newtheorem{example}{例}             % 整体编号
\newtheorem{algorithm}{算法}
\newtheorem{theorem}{定理}[section]  % 按 section 编号
\newtheorem{definition}{定义}
\newtheorem{axiom}{公理}
\newtheorem{property}{性质}
\newtheorem{proposition}{命题}
\newtheorem{lemma}{引理}
\newtheorem{corollary}{推论}
\newtheorem{remark}{注解}
\newtheorem{condition}{条件}
\newtheorem{conclusion}{结论}
\newtheorem{assumption}{假设}

%%%% 重定义 %%%%
\renewcommand{\contentsname}{目录}  % 将Contents改为目录
\renewcommand{\abstractname}{摘要}  % 将Abstract改为摘要
\renewcommand{\refname}{参考文献}   % 将References改为参考文献
\renewcommand{\indexname}{索引}
\renewcommand{\figurename}{图}
\renewcommand{\tablename}{表}
\renewcommand{\appendixname}{附录}
\renewcommand{\algorithm}{算法}

%%%% 定义标题格式，包括title，author，affiliation，email等 %%%%
\title{功能说明}
\author{丁庆祝\footnote{电子邮件：dqz48548263@qq.com，博客：\url{http://blog.mythsman.com}}\\[2ex]%链接、注解%
\xiaosihao 苏州大学 2014级计算机学院\\[2ex]
}
\date{2016年6月}

%%%% 以下部分是正文 %%%%
\maketitle
\tableofcontents
\newpage

--这里是正文--

\newpage%这个newpage很重要，不加的话可能会莫名报错...%
\end{CJK}
\end{document}
```
这主要是写中文文档的配置，当然他会提醒你下载一些包，照做即可。

## 基本格式

其实，通常使用的时候，我们最需要的操作只是对文章进行分章节：
```
\section{Section}
Section content
\subsection{Subsection}
Subsection content
\subsubsection{Subsubsection}
Subsubsection content
\paragraph{paragraph}
Paragraph content
\subparagraph{subparagraph}
subparagraph content
```
效果大概是这样：


![](/images/2016/06/16/1/1.png)
![](/images/2016/06/16/1/2.png)
