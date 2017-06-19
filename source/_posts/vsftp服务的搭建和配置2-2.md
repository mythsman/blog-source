---
title: vsftp服务的搭建和配置(2/2)
id: 1
categories:
  - Linux
date: 2015-10-23 18:56:16
tags:
  - Linux
---

## 配置本地用户

１．在配置文件中添加local_enable=YES表示允许以本地用户登陆。这是必须的。

２．然而默认情况下登陆后只有读取权限没有写入权限，所以如果需要能够上传文件，则需要添加write_enable=YES 。并且保证登陆的用户有相应的权限。

３．有时候不希望让登陆的用户看见不属于他家目录里的东西，这时候就需要将该用户'chroot'，需要添加chroot_local_user=YES ，或者：
chroot_local_user=YES
chroot_list_enable=YES
chroot_list_file=/etc/vsftpd.chroot_list＃这个可以自定义

通过编辑/etc/vsftpd.chroot_list来精确控制chroot的权限。

但是这样设置有时候在登陆的时候出现refusing to run with writable root inside chroot 错误，这是因为系统不允许chroot 用户有写入自身的权限，所以如果这样设置就不能给该用户写权限了，需要取消他对自身家目录的写入权限：
```
root@iZ28ntr2ej5Z:/home# chmod g-w stu
```
(在配置了chroot_local_user=YES之后一定要注意，所有拥有w权限的用户将无法登录！！！所以。。如果想设置多个用户，其中某些我们想让他拥有w权限，而另一些只拥有r权限的话，还是要配置一下chroot_list_file 为好)

## 配置匿名用户


anonymous_enable=YES　　          #是否启用匿名用户
no_anon_password=YES 　　         #匿名用户login时不询问口令

#下面这四个主要语句控制这文件和文件夹的上传、下载、创建、删除和重命名。
anon_upload_enable=(YES/NO);        #控制匿名用户对文件（非目录）上传权限。
anon_world_readable_only=(YES/NO); #控制匿名用户对文件的下载权限
anon_mkdir_write_enable=(YES/NO); #控制匿名用户对文件夹的创建权限
anon_other_write_enable=(YES/NO); #控制匿名用户对文件和文件夹的删除和重命名

#匿名用户下载是使用的是nobody这个用户，所以相应的O这个位置要有R权限才能被下载。若想让匿名用户能上传和删除权限，必需设置write_enable=YES #全局设置，是否容许写入(无论是匿名用户还是本地用户，若要启用上传权限的话，就要开启他)
anon_root=(none) #匿名用户主目录
anon_max_rate＝(0) #匿名用户速度限制
chown_uploads=YES #所有匿名上传的文件的所属用户将会被更改成chown_username
chown_username=whoever #匿名上传文件所属用户名

由于一般情况下懒得弄这个匿名，所以以上设置并没有实践确认，权且留下来备用。

## 文件的定义

chroot_list_file=/etc/vsftpd/vsftpd.chroot_list #定义限制/允许更改用户主目录的文件
userlist_file=/etc/vsftpd/vsftpd.user_list #定义限制/允许用户登录的文件
banner_file=/etc/vsftpd/banner #定义登录信息文件的位置
banned_email_file=/etc/vsftpd/banned_emails #禁止使用的匿名用户登陆时作为密码的电子邮件地址
xferlog_file=/var/log/vsftpd.log #日志文件位置
message_file=.message #目录信息文件
user_config_dir=/etc/vsftpd/userconf　　#定义用户配置文件的目录
local_root=webdisk #此项设置每个用户登陆后其根目录为/home/username/webdisk。定义本地用户登陆的根目录,注意定义根目录可以是相对路径也可以是绝对路径。相对路径是针对用户家目录来说的.
anon_root=/var/ftp　　 #匿名用户登陆后的根目录

## 显示欢迎信息

ftpd_banner=welcome to FTP .　　#login时显示欢迎信息.如果设置了banner_file则此设置无效
dirmessage_enable=YES　　 #允许为目录配置显示信息,显示每个目录下面的message_file文件的内容
在设置了这个属性之后，只要在每一个文件夹下面创建一个以message_file定义的文件为名的文本文件（默认是.message），那么在打开到这个文件夹时就会显示该文件中的欢迎信息。
setproctitle_enable=YES　　 #显示会话状态信息,关!
