---
title: 苏大Mooc系统的刷课脚本的制作（2/3）
id: 1
categories:
  - Web
date: 2015-12-24 23:49:00
tags:
  - Web
  - Python
---

我们知道了通过发送get请求来进行手动刷课的原理，但是这显然还是不够方便。而且虽然我们知道了发送的包，但是我们并不知道这些数据从何而来。这是一个问题。

继续查看源码，终于在头信息里发现他引用了一个叫StudentLearning.js文件，介绍了整个系统运行的逻辑。其中有一个非常重要的函数：
```javascript
//视频学习表
function GetStudentstudy() {
    if (Isfull != true) {
        if ($(".item_odd1").attr("kid") != "") {
            noteTime = parseInt(jwplayer("div_play").getPosition());
            $.ajax({ url: 'StudentLearning.ashx?action=GetG2SSetStageLearnPartStudent&fPlanID=' + $(".item_odd1").attr("FBI") + '&fPartID=' + $(".item_odd1").attr("kid") + "&fSecond=" + noteTime, cache: false,
                success: function(data) {

                }
            });
        }
    }
}
```
看到了我们之前用的地址了，这里他用ajax技术向后台传输那些数据，fPlanID、fPartID、fSecond这些东西就来自于这里了。

其中的fPlanID的值很明显就是课程的URL:`http://kczx.suda.edu.cn/G2S/Learning/Learning.htm?Part=&Plan=34&type=2`里的Plan值了。那么fPartID该怎么得到呢？

在StudentLearning.js中找了一下，又发现了一个函数：
```javascript
function GetList(type) {
    var flagqimokaoshi = 1;
    var locktiaozhuan = 0;
    var fPlanID = request("Plan");
    var flagPartID = request("Part");
    var flagisLmitNum = 0;
    $.ajax({ url: 'StudentLearning.ashx?action=GetG2SStageLearnGetChapter&fPlanID=' + fPlanID, cache: false, async: false,
        success: function(data) {
            if (data != "False") {
                data = data.replace(/[\r\n]/g, "\\r\\n");
                var json = eval("(" + data + ")");
                var strHtml = "";
                var flagParent = 0;
                var flagPart = 1;
                if (json.Rows.length > 0) {
                    strHtml += " <ul class='catalogue_ul1' id='chapterList'>";
                    for (var i = 0; i < json.Rows.length; i++) {
                        var rows = json.Rows[i];
                        var fPartID = rows.fPartID;
                        var fPartName = rows.fPartName;
                        var fParentID = rows.fParentID;
                        var fVideoURL = rows.fVideoURL;
                        var zhuangtai = 0;
                        var fpartvideourl = rows.fpartvideourl;
                        var fCCPWebSiteID = rows.fCCPWebSiteID;
                        var fSchoolWork_ExamID = "";
                        fSchoolWork_ExamID = rows.fSchoolWork_ExamID;
                        var fVideoFileID = rows.fVideoFileID;
                        var fIsCrossChapter = rows.fIsCrossChapter; //是否跨章
                        var fStatus = rows.fStatus; //测试状态
                        var fSecond = rows.fSecond; //已读视频(秒)
                        var fContent = rows.fContent;
                        var fstudyStatus = rows.fstudyStatus; //学习状态
                        var fBuildMode = rows.fBuildMode; //作业状态 1 指定试卷 2 题库选题 3 直接出题
                        var fvideoSecond = rows.fvideoSecond; //视频总时长(秒)
                        var fxuexi = rows.fxuexi;
                        var qimokaishi = rows.qimokaishi; //期末考试
                        var qimofBuildMode = rows.qimofBuildMode;
                        var qimofCCPWebSiteID = rows.qimofCCPWebSiteID;
                        var weixuexi = rows.weixuexi; //是否学习 1已学 2 未学
                        var fisTest = rows.fisTest;
                        var fTaskID = rows.fTaskIDs;
                        var fisLmitNum = rows.fisLmitNum;
                        var MustFileIsFinish=rows.MustFileIsFinish;//资料学习情况 1:已完成学习 0:未完成 
                        var flagyangshi = "time_ico1 unPlay ";
                        var icoTest = "";
                        var ficoTestTitle = "";
                        if (weixuexi == 1) {
                            zhuangtai = 1;
                        } else {
                            zhuangtai = 0;
                        }
 ......
 ```
名字叫GetList，那么意图也就很明显了，就是得到课程列表的所有信息。用ajax向后台传入课程名，然后就会得到一大串的关于整个课程信息的回复。尝试了发送下，得到如下类似json格式的反馈：
```json
{
    RowCount: 34,
    Rows: [
        {
            "fPartID": "264",
            "fPartName": " 大学文化——大学的内涵与使命",
            "fParentID": "0",
            "fPlanID": "34",
            "fBrief": "",
            "fVideoFileID": "0",
            "fSchoolWork_ExamID": "3172",
            "fCCPWebSiteID": "27745",
            "fBuildMode": "3",
            "fpartvideourl": "",
            "fStatus": "20",
            "fSecond": "5953",
            "fvideoSecond": "5953",
            "fVideoURL": "",
            "fContent": "",
            "fOrder": "100",
            "fIsCrossChapter": "1",
            "qimokaishi": "5919",
            "qimofBuildMode": "3",
            "qimofCCPWebSiteID": "27745",
            "qimoStatus": "1",
            "fstudyStatus": "1",
            "fxuexi": "0",
            "weixuexi": "1",
            "fisTest": "1",
            "MustFileIsFinish": "0",
            "fTaskID": "0",
            "fisLmitNum": "-1"
        },
        {
            "fPartID": "265",
            "fPartName": " 大学文化——大学的内涵与使命（一）",
            "fParentID": "264",
            "fPlanID": "34",
            "fBrief": "%u5185%u5BB9%u63CF%u8FF0%uFF08%u6700%u591A200%u5B57%uFF09",
            "fVideoFileID": "651",
            "fSchoolWork_ExamID": "",
            "fCCPWebSiteID": "",
            "fBuildMode": "-1",
            "fpartvideourl": "http://42.244.42.193:1221/download/38d2e715-2044-429d-b29d-89b964863a81.mp4",
            "fStatus": "",
            "fSecond": "1756",
            "fvideoSecond": "1756",
            "fVideoURL": "",
            "fContent": "",
            "fOrder": "101",
            "fIsCrossChapter": "1",
            "qimokaishi": "5919",
            "qimofBuildMode": "3",
            "qimofCCPWebSiteID": "27745",
            "qimoStatus": "1",
            "fstudyStatus": "1",
            "fxuexi": "0",
            "weixuexi": "1",
            "fisTest": "1",
            "MustFileIsFinish": "1",
            "fTaskID": "0",
            "fisLmitNum": "-1"
        },
.......
```
说他是类json格式，是因为他的RowCount和Rows没有加引号。。。。也是无语。。。

我们发现想要得到的信息几乎全在这里，通过他的命名也很容易看懂其表示的含义。

OK，到现在我们已经知道了所有想要的信息和业务的逻辑了，剩下的就是将这个思想付诸实现了。
