---
title: 关于firefox中链接点击弹出空白标签页的问题分析
id: 1
date: 2018-03-31 21:01:52
category:
 - Html
tags:
 - Html
 - Js
---

## 前言

昨天突然有好心人提醒我说我的网站某些链接在firefox中打开时会弹出 about:blank 的空白页面。本来自己在测试的时候没怎么考虑浏览器的兼容问题，毕竟自己总共也没写几个标签。不过研究了一下发现前端这一行做起来还真挺麻烦的。

## 问题
原先的代码是这样的，有一个a标签，类似这样:
```html
<a href="javascript:void(0); target="_blank" onclick="somefunction()">haha</a>
```
我希望这是一个标签页，为了好看就继承了a标签的样式，而且自己定义了点击事件，不过为了避免链接跳转就在href里用"javascript:void(0);"来阻止页面跳转。
这行简单的代码在chrome里没有问题，不过在 firefox 中如果点击这个标签就会立刻弹出一个 about:blank 的空白标签页，非常的不友好。

## 解决
这个问题解决起来其实也很简单，原因就在于不知道为什么当时手贱顺手加了个 `target="_blank"` ，在大多数浏览器会在看到 `javascript:void(0);`之后阻止了创建页面的操作，但是firefox却优先考虑创建标签页，这才造成了这个问题。因此解决起来也很简单，把 `target="_blank"` 删除即可。

## 思考
但是问题来了，是什么原因导致不同浏览器的执行逻辑不一样呢？
其实我感觉任何一种逻辑的设计都是有他的原理的，查询了一下 mozilla 的文档，我发现了这样的一段话：

> Anchor tags are often abused with the onclick event to create pseudo-buttons by setting href to "#" or "javascript:void(0)" to prevent the page from refreshing. These values cause unexpected behavior when copying/dragging links, opening links in a new tabs/windows, bookmarking, and when JavaScript is still downloading, errors out, or is disabled. This also conveys incorrect semantics to assistive technologies (e.g., screen readers). In these cases, it is recommended to use a `<button>` instead. In general you should only use an anchor for navigation using a proper URL. 

我们通常会用锚点或者 `javascript:void(0);` 这个小 trick 来禁止url跳转从而实现我们想要的效果。但是从逻辑上讲，a标签的语义就是链接跳转，我们这种操作其实是违背了a标签的设计初衷的，因此 mozilla 官方并不推荐我们这样做。
比如说，我们认为a标签代表了用户的链接跳转的操作，那么我们就可以相信这肯定对应了一个url，那么我们就可以在浏览器的功能强化中加上一个新功能就是支持用户将这个链接拖动到地址栏以打开新链接。但是我们的这个小trick违背了这样的逻辑链，因此出现问题也就很自然了。
相比之下，button 的语义才是确认用户的意图，这个跟标签页的语义相当，所以他才会推荐我们在做标签页的时候使用button标签。
这些设计也是挺有意思的，然而，尽管我十分认可 mozilla 的解释，但是考虑到页面当前对a标签的样式做的比较好，我也懒得再写button标签的样式，所以最终还是用了a标签。。。

## 参考资料
[mozilla doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Notes)