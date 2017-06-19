---
title: Linux的环境变量配置详解
id: 1
categories:
  - Linux
date: 2017-03-28 23:27:33
tags:
  - Linux
---

## 简介
在平时使用Linux的时候，经常需要配置一些环境变量，这时候一般都是网上随便搜搜就有人介绍经验的。不过问题在于他们的方法各不相同，有人说配置在`/etc/profile`里，有人说配置在`/etc/environment`，有人说配置在`~/.bash_profile`里，有人说配置在`~/.bashrc`里，有人说配置在`~/.bash_login`里，还有人说配置在`~/.profile`里。。。这真是公说公有理。。。那么问题来了，Linux到底是怎么读取配置文件的呢，依据又是什么呢？

## 文档
我一向讨厌那种说结论不说出处的行为，这会给人一种“我凭什么相信你”的感觉。而且事实上没有出处就随便议论得出的结论也基本上是人云亦云的。事实上，与其去问别人，不如去问文档。
找了一会，发现关于环境变量配置的相关文档其实是在`bash`命令的`man`文档里，毕竟我们常用的就是这个shell。
在`$man bash`里，我发现了下面的一段文字：
```
INVOCATION
       A login shell is one whose first character of argument zero is a -,  or
       one started with the --login option.

       An  interactive  shell  is one started without non-option arguments and
       without the -c option whose standard input and error are both connected
       to  terminals  (as determined by isatty(3)), or one started with the -i
       option.  PS1 is set and $- includes i if bash is interactive,  allowing
       a shell script or a startup file to test this state.

       The  following paragraphs describe how bash executes its startup files.
       If any of the files exist but cannot be read, bash  reports  an  error.
       Tildes  are expanded in filenames as described below under Tilde Expan‐
       sion in the EXPANSION section.

       When bash is invoked as an interactive login shell, or as a  non-inter‐
       active  shell with the --login option, it first reads and executes com‐
       mands from the file /etc/profile, if that file exists.   After  reading
       that file, it looks for ~/.bash_profile, ~/.bash_login, and ~/.profile,
       in that order, and reads and executes commands from the first one  that
       exists  and  is  readable.  The --noprofile option may be used when the
       shell is started to inhibit this behavior.

       When a login shell exits, bash reads and  executes  commands  from  the
       file ~/.bash_logout, if it exists.

       When  an  interactive  shell that is not a login shell is started, bash
       reads and executes commands from  /etc/bash.bashrc  and  ~/.bashrc,  if
       these  files  exist.  This may be inhibited by using the --norc option.
       The --rcfile file option will force bash to read and  execute  commands
       from file instead of /etc/bash.bashrc and ~/.bashrc.

       When  bash  is  started  non-interactively,  to run a shell script, for
       example, it looks for the variable BASH_ENV in the environment, expands
       its  value if it appears there, and uses the expanded value as the name
       of a file to read and execute.  Bash behaves as if the  following  com‐
       mand were executed:
              if [ -n "$BASH_ENV" ]; then . "$BASH_ENV"; fi
       but  the value of the PATH variable is not used to search for the file‐
       name.
```
通过这段文字，我们发现其实所谓的环境变量配置文件，就是在shell登陆的时候自动加载的那些文件。不过他所定义的登陆却分为两种：

1. login shell登陆。
2. interactive shell登陆。

### login shell 登陆
所谓的login shell登陆，实际上就是指需要输入密码的登陆。具体的说，包括开机登陆、ssh登陆，或者是输入`bash --login`这种“假装自己输入密码登陆”的方式。
在这种登陆方式下，系统会先读取`/etc/profile`文件，然后，系统会依次搜索`~/.bash_profile`、`~/.bash_login`、`~/.profile` 这三个文件，并运行**只**其中第一个存在的文件。
尤其要注意到后三个文件的“逻辑或”的关系。很多情况下我们会发现，明明已经修改了`~/.profile`文件为什么重新登陆后配置不生效呢？这是因为我们的系统可能存在了前面两个文件中的一个，导致不会继续读取剩下的文件。
下面的三张图很好的说明了这个问题：

![](/images/2017/03/28/1/1.png)
![](/images/2017/03/28/1/2.png)
![](/images/2017/03/28/1/3.png)

### interactive shell 登陆
所谓的interactive shell登陆，其实就是相对于login shell登陆而言的。我们平时在登陆后右键打开终端、或者CTRL+ALT+T打开终端都是interactive shell登陆。
在这种登陆方式下，系统会依次读取`/etc/bash.bashrc`和`~/.bashrc`，并加以执行。
通常情况下，`~/.bashrc`文件里会默认记录一些常量和一些别名，尤其是`$PS1`变量，这个变量决定着bash提示符的格式、样式以及颜色等。

### 注意
需要注意的是，这两种登陆方式读取的是不同的配置文件，而且互相之间没有交集，因此当我们需要配置环境变量时，我们要根据自己的登陆方式将需要的变量配置到不同的文件里。
例如下面这个经典的问题。

## 典型问题

环境配置文件配置异常的例子是，当我用ssh登录服务器的时候，发现提示符是这样的：
```
bash-4.3$
```
没错，就像上面第三张图片里的那个bash一样，提示符非常奇怪，而且当输入ls时文件和文件夹的颜色也没有区分。
这个问题显然是由于`$PS1`这个环境变量没有配置，导致他用了默认值，虽然查看`.bashrc`文件时发现有`$PS1`这个变量的定义。，但是由于ssh属于login shell，因此他在登陆时读入的配置文件是`/etc/profile`一类的文件，并没有读入`.bashrc`。
导致这个问题的原因通常是我们误删除了`/etc/profile`里默认的配置文件，因此解决的办法也很简单。。。把`.bashrc`里的部分文件复制到`/etc/profile`里就行了。

这个问题给我们的启示是，当我们为服务器配置变量时，尽量配置到`/etc/profile`里或者`~/.bash_profile`里，因为用ssh登录服务器是基本上用不到`.bashrc`文件的；当我们给自己的电脑配置环境变量时，尽量配置到`.bashrc`里，因为这样我们只要打开终端就会读入这个文件，这样就可以不用注销就能应用配置了（只有注销重新登录才会应用`/etc/profile`一类的配置文件）。

