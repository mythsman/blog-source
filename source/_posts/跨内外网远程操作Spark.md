---
title: 跨内外网远程操作Spark
id: 1
categories:
  - Java
date: 2017-01-18 21:06:11
tags:
  - Java
  - Linux
  - SSH
---

## 问题

我们知道通过反向ssh可以借助有固定IP的外网服务器登陆没有外网IP的内网主机，但是我们在真正使用的时候可能不仅仅需要远程登陆，可能还会需要内网机器中其他端口提供的服务。比如现在我需要在远处利用Spark程序去操作内网机器里的分布式系统进行工作，这就至少需要调用内网机器的7077端口(默认的Spark调用端口)和9000端口(默认的hdfs端口)。那么这时候我们应当怎么处理呢？


## 解决思路

最容易想到的解决方案就是同样利用反向ssh，将内网的9000端口映射到服务器的9000端口上。这一点显然是很容易做到的，与利用反向ssh进行登陆的操作是类似的。但是当我想当然的去telnet服务器的9000端口时却发现报了下面的错误：
```
myths@business:~$ telnet mythsman.com 9000
Trying 120.27.41.126...
telnet: Unable to connect to remote host: Connection refused
```
他提示我对这个端口的访问被拒绝了，于是我登陆服务器，去查看端口情况：
```
root@server:~# ss -ant|grep 9000
LISTEN     0      128               127.0.0.1:9000                     *:*     
```
仔细一看才发现，原来利用反向ssh进行端口绑定的时候，端口的访问权限默认只给了本机(127.0.0.1)，从其他IP访问这个端口的请求都会被拒绝。要是这个权限不受限制，对所有IP(0.0.0.0)都能访问就好了。

但是想了想好像也不知道怎么能够修改这个值，于是我就采取了一个折中的办法，干脆把这个端口再进行一次转发，用另一对外的端口转发出去。

这里我采用的是rinetd工具（internet “redirection server”），用在apt商店里可以直接下载。用这个工具进行端口转发十分的方便。

## rinetd工具

这个工具的用法很简单，只有一个配置文件/etc/rinetd.conf:
```
#
# this is the configuration file for rinetd, the internet redirection server
#
# you may specify global allow and deny rules here
# only ip addresses are matched, hostnames cannot be specified here
# the wildcards you may use are * and ?
#
# allow 192.168.2.*
# deny 192.168.2.1?

#
# forwarding rules come here
#
# you may specify allow and deny rules after a specific forwarding rule
# to apply to only that forwarding rule
#
# bindadress    bindport  connectaddress  connectport

# logging information
logfile /var/log/rinetd.log

# uncomment the following line if you want web-server style logfile format
# logcommon
```
利用这个配置文件，我们首先可以利用allow 和deny语句，修改允许访问的IP和拒绝访问的IP；然后我们可以用下面的格式来修改转发表：
```
# bindadress    bindport  connectaddress  connectport
0.0.0.0 50071   127.0.0.1   50070
0.0.0.0 7078    127.0.0.1   7077
0.0.0.0 9001    127.0.0.1   9000
```
首先是期望发送的IP以及端口，接着是提供服务的IP和端口，每一行就是一个条目，十分清楚。

这里我把只允许127.0.0.1访问的50070端口发送到面向所有IP的50071端口。修改过后，我们就可以重启rinetd服务来使其生效。

这样就可以在利用其外网IP:新端口来访问原来无法访问的端口了。

## 配置总结

上面是我们的总体思路，下面就开始针对Spark来详细配置一下。

1.  准备号进行Spark远程开发需要的Spark的7077端口、Hdfs的9000端口、hadoop的Web显示50070端口、ssh登陆的22端口。
2.  在内网主机上配置反向SSH：
    ```
    autossh -M 2100 -NfR 9000:localhost:9000 root@mythsman.com
    autossh -M 2200 -NfR 7077:192.168.131.198:7077 root@mythsman.com
    autossh -M 2300 -NfR 2222:localhost:22 root@mythsman.com
    autossh -M 2400 -NfR 50070:localhost:50070 root@mythsman.com
    ```
    注意到，7077端口的本地IP用的不是localhost，而是他本身在内网里的IP。这是因为Spark服务默认设置的就是这个值，和hadoop的不一样：
    ```
    myths@node5:~/spark/conf$ss -ant|grep 7077
    LISTEN     0      128     ::ffff:192.168.131.198:7077                    :::*
    ```

3.  修改服务器上的/etc/rinetd.conf配置：
    ```
    # bindadress    bindport  connectaddress  connectport
    0.0.0.0 50071   127.0.0.1   50070
    0.0.0.0 7078    127.0.0.1   7077
    0.0.0.0 9001    127.0.0.1   9000
    ```
    这样我们其实就已经把网络链路配置好了，访问50071端口就能够看到hadoop的web页面了，也可以跑跑Spark的测试程序：
    ```scala
    import org.apache.spark.SparkConf
    import org.apache.spark.SparkContext

    object Test {
      def main(args: Array[String]) {
        val conf = new SparkConf().setAppName("Spark App").setMaster("spark://mythsman.com:7078").setJars(List("/home/myths/Desktop/scala/Test/jar/Test.jar"))
        val sc = new SparkContext(conf)
        val datafile = sc.textFile("hdfs://mythsman.com:9001/user/myths/dataset/data",50)
        sc.stop()
      }
    }
    ```
	程序连接成功，hdfs读取成功，搞定。

## 其他

搞完了这个突然想起来之前用反向ssh进行内网登陆的时候还要先登陆服务器再登陆内网，甚是麻烦，我们其实完全可以再利用rinetd工具进行一次转发，这样就能直接用服务器的IP+转发后的端口直接登陆内网主机 了。
