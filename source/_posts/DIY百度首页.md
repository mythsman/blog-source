---
title: DIY百度首页
id: 1
categories:
  - Web
date: 2015-12-15 23:55:44
tags:
  - Web
---

花了一天时间DIY了一个百度首页，学习了好多东西，特别是关于页面的dom布局，和css的属性设置，还有关于图片的使用和jquery等等的知识，算是web前端入了个门。贴下代码纪念下，效果页面我觉得差不多能以假乱真了。。。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type"  content="text/html" charset="utf-8" >
		<style  type="text/css" >
			#header{
				color:white;
				position:absolute;
				right:0;
				top:0;
				margin:19px 0 5px 0;
				padding:0 20px 0 0;

			}
			#header div{
				text-align:center;
				position:relative;
				float:right;
			}
			.b{
				color:#333;
				font-weight:bold;
				line-height:24px;
				margin-left:21px;
				font-size:13px;
				text-decoration:underline;
			}
			.b:hover{
				color:blue;
			}
			#setting{
				font-weight:normal;
				margin-top:6px;
				display:none;
				position:relative;
				left:24px;
				margin-left:-100px;
				border:1px solid #d1d1d1;
				width:70px;
				-webkit-box-shadow: 1px 1px 5px #d1d1d1;
			}
			.clear{
				clear:both;
			}
			#setting a{
				color:black;
				margin:1px 2px 1px 2px;
				height:22px;
				padding:1px;
				display:block;
				font-size:12px;
				text-decoration:none;
			}
			#setting a:hover{
				background-color:#6495ED;
				color:white;
			}
			*{
				margin:0 0 0 0;
				padding:0 0 0 0;			
			}
			#logo{
				width:270px;
				height:129px;
				border:0;
			}
			#mid{
				position:center;
				margin-top:70px;
				text-align:center;

			}
			#input{
				margin-top:20px;
				width:539px;
				height:34px;
				font-size:16px;
				border: 1px solid #3385ff;
			}
			#submit{
				width:95px;
				height:34px;
				border:0px;
				color:white;
				font-size:15px;
				background-color:#3385ff;
			}
			.more{
				float:right;
				line-height:24px;
				margin-left:21px;
				background-color:#38f;
				color:white;
				padding:0 4px 0 4px;
				margin-left:25px;
				margin-right:-8px;
				font-size:13px;
				text-decoration:none;
			}
			#right{
				border-left:solid 1px #f0f0f0;
				position:absolute;
				display:none;
				top:0;
				right:0;
				bottom:0;
				background-color:#f9f9f9;
				width:85px;
			}
			.cover{
				padding-top:10px;	
				text-decoration:none;
				height:
			}
			.r{
				margin-top:10px;
				text-align:center;
				border-bottom:solid 1px #f0f0f0;
				height:75px;
				font-size:11px;
				color:#666;
				cursor:pointer;
			}
			.pic{
				background:url("icon.png") no-repeat;
				width:36px;
				height:36px;
				margin:0 auto;
				margin-bottom:10px;
			}
			.pic1{
				background-position:-72px 0;
				width:40px;
			}
			.pic2{
				background-position:-112px 0;

			}
			.pic3{
				background-position:-36px 0;
			}
			.pic4{
				background-position:-148px 0;
			}
			.pic5{
				background-position:-184px 0;
			}
			.pic6{
				background-position:-220px 0;
			}
			.clear{
				clear:both;
			}
			.footer{
				margin:280px 0 0 0 ;
				text-align:center;
			}
			.wrapper{
				margin:0 auto;
				padding:0 0 0 0;
				position:center;
				width:660px;
			}
			.mobile{
				background:url("mobile.png") no-repeat;
				width:60px;
				height:60px;
				margin:0 auto;
			}
			.nuomi{
				background:url("nuomi.png") no-repeat;
				width:60px;
				height:60px;
				margin:0 auto;
			}
			.bt{
				float:left;
				text-align:left;
			}
			#btn{
				background:url("btn.png") no-repeat;
				float:left;
				background-position:-600px -96px;
				width:14px;
				height:17px;
			}
		</style>
		<script src="jquery.js"></script>
		<script>
			$(document).ready(function(){
				$("#m").mouseover(function(){
					$("#setting").show();
				});
				$("#m").mouseout(function(){
					$("#setting").hide();
				});
				$(".more").mouseover(function(){
					$("#right").show();
				});
				$("#right").mouseover(function(){
					$("#right").show();
				})
				$("#right").mouseout(function(){
					$("#right").hide();
				});
				$(".r").hover(function(){
					$(this).css("text-decoration","underline");
				},function(){
					$(this).css("text-decoration","none");
				})
			});
		</script>
	</head>
	<body>
		<div id="header">
			<div><a class="more" >更多产品</a></div>
			<div id="m">
				<div>
					<a class="b" id='set' href="javascript:;">设置</a>
				</div>
				<div class="clear"></div>
				<div id="setting">
					<a href="#">搜索设置</a>
					<a href="#">高级搜索</a>
					<a href="#">关闭预测</a>
					<a href="#">搜索历史</a>
				</div>	
			</div>
			<div><a class="b" href="https://passport.baidu.com/">登录</a></div>
			<div><a class="b" href="http://tieba.baidu.com">贴吧</a></div>
			<div><a class="b" href="http://v.baidu.com">视频</a></div>
			<div><a class="b" href="http://map.baidu.com">地图</a></div>
			<div><a class="b" href="http://www.hao123.com">hao123</a></div>
			<div><a class="b" href="http://news.baidu.com">新闻</a></div>
			<div><a class="b" href="http://www.nuomi.com/?cid=002540">糯米</a></div>
		</div>
			<div class="clear"></div>
		<div id="right">
			<div class="r cover" style="height:50px;">更多产品</div >
			<div class="r" onclick=window.open("http://music.baidu.com")><div class="pic pic1"></div>音乐</div>
			<div class="r" onclick=window.open("http://image.baidu.com")><div class="pic pic2"></div>图片</div>
			<div class="r" onclick=window.open("http://zhidao.baidu.com")><div class="pic pic3"></div>知道</div>
			<div class="r" onclick=window.open("http://wenku.baidu.com")><div class="pic pic4"></div>文库</div>
			<div class="r" onclick=window.open("http://top.baidu.com")><div class="pic pic5"></div>风云榜</div>
			<div class="r" onclick=window.open("http://e.baidu.com/?refer=888")><div class="pic pic6"></div>百度推广</div>
			<div class="r" onclick=window.open("http://www.baidu.com/more/")>全部产品>></div>
		</div>
		<div id="mid">
			<div>
				<img src="logo.png" id="logo">
			</div>
			<div>
				<form method='get' action="https://www.baidu.com/s" id="form">
					<input id='input' type="text" name='wd'><input id='submit' type='submit' value="百度一下">
				</form>
			</div>
		</div>
		<div class="footer">
			<div class="wrapper">
				<div class="mobile bt"></div>
				<div class="bt" style="width:90px">
					<span style="font-size:12px;padding-top:10px;">&nbsp;&nbsp;手机百度</span>
					<br><br>
					<span style="font-size:12px;color:gray;">&nbsp;&nbsp;快人一步</span>
				</div>
				<div class="nuomi bt"></div>
				<div class="bt" style="width:90px">
					<span style="font-size:12px;">&nbsp;&nbsp;百度糯米</span>
					<br><br>
					<span style="font-size:12px;color:gray;">&nbsp;&nbsp;一毛大餐</span>
				</div>
				<div class="bt">
					<div style="float:left;">
						<span style="font-size:12px;text-decoration:underline;cursor:pointer;" onclick=window.open("https://www.baidu.com/cache/sethelp/help.html")>把百度设为首页</span>&nbsp;&nbsp;&nbsp;
						<span style="font-size:12px;text-decoration:underline;cursor:pointer;" onclick=window.open("http://home.baidu.com/")>关于百度</span>&nbsp;&nbsp;&nbsp;
						<span style="font-size:12px;text-decoration:underline;cursor:pointer;" onclick=window.open("http://ir.baidu.com/")>About Baidu</span>
					</div>
					<br>
					<br>
					<div style="float:left">
						<span style="font-size:12px;color:gray;">@2015&nbsp;baidu</span>
						<span style="font-size:12px;color:gray;text-decoration:underline;cursor:pointer;" onclick=window.open("http://www.baidu.com/duty/")>使用百度前必读</span>
						<span style="font-size:12px;color:gray;text-decoration:underline;cursor:pointer;" onclick=window.open("http://jianyi.baidu.com/")>意见反馈</span>
						<span style="font-size:12px;color:gray;">京ICP证030173号</span>
					</div>
					<div id="btn"></div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</body>
</html>
```