---
title: 实现SSH无密码自动登录
id: 1
categories:
  - SSH
date: 2015-11-11 23:58:09
tags:
  - SSH
  - Linux
---

在使用ssh登陆服务器的时候很蛋疼的事是每次登陆的时候都要输入服务器密码，而且为了安全性，密码一般都不短，大概都得十几位的样子，一不小心输错了还得重来，十分麻烦。所以实现SSH的自动登陆是一件非常方便的事情，避免了恶心蛋疼而且无聊重复的输密码环节。

当然，这种所谓的无密码登陆认证实际上是一种通过公钥加密方法来进行自动化认证的技术。所以这里也存在这公钥和私钥的说法，其中，公钥是保存在服务器中的，而私钥是保存在客户端中的。具体方法如下：

## 产生密钥
```
myths@myths-X450LD:~/.ssh$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/myths/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/myths/.ssh/id_rsa.
Your public key has been saved in /home/myths/.ssh/id_rsa.pub.
The key fingerprint is:
dc:ee:f5:9d:c9:2d:06:65:a8:ce:ce:65:8d:5d:98:08 myths@myths-X450LD
The key's randomart image is:
+--[ RSA 2048]----+
|                 |
|                 |
|          E  .   |
|       . . ...oo |
|        S ...oo .|
|         .. .+ . |
|         o. =.o  |
|         oo+ .+.+|
|         .+  ..=o|
+-----------------+
```
这里使用ssh-keygen 命令，-t参数表示接下来跟的是加密类型（type），然后就是加密的算法，可以选择rsa1（老版的rsa），rsa（新版的rsa），dsa，ecdsa，ed25519　等。这里用作证书通常使用rsa算法。

然后会要求你填输出的文件夹，一般默认就摆在`/home/myths/.ssh/`下的id_rsa文件中吧。不过需要注意的是，如果曾经生成过密钥，现在重新生成一个的话，如果不改地址是会将原来的覆盖掉的，这样可能会惹一些麻烦的。。。

接下来你可以另外设置一个密码，这个密码相当于一个独立的连接服务器的密码，而不是服务器用户的密码。你就是相当于用这个密码来替代服务器的用户密码（这个密码的长度要大于四）。当然如果怕麻烦可以直接回车回车，表示不用这个密码。

到这一步密码就生成完了，在~/.ssh/下就有了生成的文件了：
```
myths@myths-X450LD:~/.ssh$ ls 
id_rsa  id_rsa.pub  known_hosts
```
当然这里的known_hosts 是本来就有的。生产的id_rsa为私钥，id_rsa.pub为公钥。

## 上传公钥

接下来只要把公钥上传到服务器的对应位置上就可以了，这里用scp上传到~/.ssh/authorized_keys中：
`myths@myths-X450LD:~/.ssh$ scp id_rsa.pub root@myserver:~/.ssh/authorized_keys`
当然这里这样写是因为我的服务器上并没有别的认证的密码，所以可以直接覆盖这个文件。否则就需要先上传，然后用>>添加到这个文件中了。

最后本地的id_rsa.pub文件删除即可。

## 关闭密码登录

做到这里，就已经完成了免密码的登陆了。不过，既然已经不用输密码登陆了，那我们就不必留下用密码登陆的这个途径了。那我们就可以直接修改服务器端的配置，使得我们的ssh不接受直接用密码登陆，这样无疑提高了整个服务器的安全性，而又不影响使用。

这个配置文件为`/etc/ssh/sshd_config`，打开后默认是：
```
# Package generated configuration file
# See the sshd_config(5) manpage for details

# What ports, IPs and protocols we listen for
Port 22
# Use these options to restrict which interfaces/protocols sshd will bind to
#ListenAddress ::
#ListenAddress 0.0.0.0
Protocol 2
# HostKeys for protocol version 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
#Privilege Separation is turned on for security
UsePrivilegeSeparation yes

# Lifetime and size of ephemeral version 1 server key
KeyRegenerationInterval 3600
ServerKeyBits 1024

# Logging
LogLevel INFO

# Authentication:
LoginGraceTime 120
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
#AuthorizedKeysFile	%h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no
# similar for protocol version 2
HostbasedAuthentication no
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Change to no to disable tunnelled clear text passwords

# Kerberos options
#KerberosAuthentication no
#KerberosGetAFSToken no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

# Set this to 'yes' to enable PAM authentication, account processing,
# and session processing. If this is enabled, PAM authentication will
# be allowed through the ChallengeResponseAuthentication and
# PAM authentication via ChallengeResponseAuthentication may bypass
# If you just want the PAM account and session checks to run without
# and ChallengeResponseAuthentication to 'no'.
UsePAM yes
UseDNS no
AddressFamily inet
PermitRootLogin yes
SyslogFacility AUTHPRIV
PasswordAuthentication yes
```
这里我们只要关注
`PermitRootLogin yes`
这一行，把他改成no然后再把ssh重启一下就好了。

如果发现这样配置完之后，仍然不能免密码登录，那多半是因为sshd_config配置里的`SAAuthentication yes`和`ubkeyAuthentication yes`这两个选项被注释了，把他们加回来即可。


## Last but not least

我一直在想，既然上述的免认证登录这么常见，为什么没有人写个脚本来帮助大家做这件事呢，然后果然在apt的软件包里找到了一个叫`sh-copy-id`的命令，通过`ssh-copy-id user@ip`能够非常方便的一次性执行上面的操作。`