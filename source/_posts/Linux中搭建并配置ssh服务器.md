---
title: Linux中搭建并配置ssh服务器
id: 2
categories:
  - SSH
date: 2015-10-05 15:17:55
tags:
  - Linux
  - SSH
---

## 简述
首先让我们来认识一下什么是SSH。

SSH是英文Secure Shell的简写形式，是一个用来替代TELNET、FTP以及R命令的工具包，主要是想解决口令在网上明文传输的问题。他的最大特点就是安全。通过使用SSH，你可以把所有传输的数据进行加密，这样"中间人"这种攻击方式就不可能实现了，而且也能够防止DNS欺骗和IP欺骗。总的来说就是一种安全的进行远程登陆的方式，也是现在最常用的登陆服务器的方式，今天我们就来系统的了解下。

SSH分为两部分：客户端部分和服务端部分。
服务端是一个守护进程(demon)，他在后台运行并响应来自客户端的连接请求。服务端一般是sshd进程，提供了对远程连接的处理，一般包括公共密钥认证、密钥交换、对称密钥加密和非安全连接。
客户端包含ssh程序以及像scp（远程拷贝）、slogin（远程登陆）、sftp（安全文件传输）等其他的应用程序。这些也都是我们比较常用的命令。
值得一提的是我们现在常用的SSH并不是真正的SSH，而是另一种替代的版本OPENSSH，毕竟这里涉及到加密算法和版权的限制。

ubuntu下在更新了源之后就可以直接安装了：
```
myths@myths-X450LD:~$ sudo apt-get install openssh-server
```

安装好一般就直接启动了，不放心可以试下：
```
myths@myths-X450LD:~$ sudo service ssh start
start: Job is already running: ssh
```
他会告诉你正在运行，第一步就ok了（一定要记得sudo，否则他会骗你说没有这个服务的0.0）。
接下来就需要处理配置文件了，openssh的配置文件是/etc/ssh/sshd_config，（不是ssh_config）

## 文件样例
我本机的配置文件是这样的：

    myths@myths-X450LD:/etc/ssh$ cat sshd_config
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
    SyslogFacility AUTH
    LogLevel INFO
    # Authentication:
    LoginGraceTime 120
    PermitRootLogin without-password
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
    #PasswordAuthentication yes
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
    # PasswordAuthentication.  Depending on your PAM configuration,
    # PAM authentication via ChallengeResponseAuthentication may bypass
    # the setting of "PermitRootLogin without-password".
    # If you just want the PAM account and session checks to run without
    # PAM authentication, then enable this but set PasswordAuthentication
    # and ChallengeResponseAuthentication to 'no'.
    UsePAM yes


呃。。有点长，我们捡几个重（jian）要（dan）的研究下。

## 配置文件简析

*   Port：这个很明显就是记录SSH的端口啦，默认的是22，自己也可以改，（虽然并不晓得改完会不会出问题）

*   Protocol：这个指的是SSH的版本，众所周知有两个版本1和2，据说兼容行不好，如果确实要兼容的话，值应该设置为2,1。我这里是2。

*   HostKey：这里有好几个路径，指的就是private-key的保存路径，闲着没事可以打开看看。

*   ServerKeyBits：就是密钥的长度啦，估计随着时间的推移这个数字会越来越大吧。

*   PermitRootLogin： 是否允许 root 登入！预设是允许的，但是很明显这是不安全的，我们通常把这个改为no，但是我知道我在干什么所以我一般把这一栏改成yes。

*   StrictModes： 当使用者的 host key 改变之后，Server 就不接受联机 当使用者的 host key 改变之后，Server 就不接受联机，为了安全一般是yes。

*   PubkeyAuthentication ： 是否允许 Public Key ？当然允许啦！（反正不晓得有啥用）

*   HostbasedAuthentication：哦，基于host的安全认证，就是~/.ssh/known_hosts下记录的了。

*   PasswordAuthentication：密码验证当然是需要的，yes不解释。

*   PermitEmptyPasswords：是否允许空密码，最好是no吧。

*   Subsystem ：这一行写的是sftp服务路径，如果不想开放sftp的话可以把这一行注释掉。

一般来说这里的配置都不用改的，因为这基本上已经是对SSH的最佳配置了。如果修改了的话一定要重启ssh服务。


然后呢，就可以通过远程计算机输入“ssh 用户名@主机名” 进行远程登陆了。

另：想查看服务器的登陆信息的话可以用last命令。