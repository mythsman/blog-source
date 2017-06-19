---
title: service命令的原理以及init.d启动脚本的格式
id: 1
categories:
  - Linux
date: 2016-01-20 15:27:00
tags:
  - Linux
---

我们在启用一些服务的时候，经常会用到这个service命令，比如启动apache2的命令`$sudo service apache2 start`等等。用他来开启或者关闭我们的服务可谓是非常的方便，因为service命令基本都会支持start、stop、restart之类的参数，十分的好记。

## 作用原理

那么service命令的原理是什么呢？为什么他能做到这么统一的样式呢？

其实答案很简单，我们来查看帮助文档就知道了：
```
$man service
......
     service runs a System V init script or upstart job in as predictable an
       environment as possible, removing most environment variables  and  with
       the current working directory set to /.

       The  SCRIPT  parameter  specifies  a  System  V init script, located in
       /etc/init.d/SCRIPT, or the name of an upstart  job  in  /etc/init.  The
       existence of an upstart job of the same name as a script in /etc/init.d
       will cause the upstart job to take precedence over the  init.d  script.
       The  supported values of COMMAND depend on the invoked script.  service
       passes COMMAND and OPTIONS to the init script unmodified.  For  upstart
       jobs,  start, stop, status, are passed through to their upstart equiva‐
       lents. Restart will call the upstart 'stop' for the job, followed imme‐
       diately by the 'start', and will exit with the return code of the start
       command.  All scripts should support at least the start and  stop  com‐
       mands.   As a special case, if COMMAND is --full-restart, the script is
       run twice, first with the stop command, then with  the  start  command.
       This option has no effect on upstart jobs.
......
```
上面这段话已经说了很清楚了，这个service命令，会去查找/etc/init.d/和/etc/init/目录下的可执行脚本。这些脚本通常保证得实现start，stop，status之类的命令来实现相应的功能。也就是说，我们通常类似`service apache2 start`的命令完全可以用`/etc/init.d/apache2 start`来代替，效果一模一样。

其实他做的事情就是这么简单，一般就是去/etc/init.d/目录下寻找脚本来执行。所以问题的重点就变成了这些脚本到底是什么样的。

这就牵涉到/etc/init.d/下的启动脚本格式的问题了。

## 启动脚本

本着自力更生的原则，自己查看man文档，在service命令的末尾他给了一个/etc/init.d/skeleton文件叫我们看。那就打开来看看喽～～：
```bash
#! /bin/sh
### BEGIN INIT INFO
# Provides:          skeleton
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Example initscript
# Description:       This file should be used to construct scripts to be
#                    placed in /etc/init.d.
### END INIT INFO

# Author: Foo Bar <foobar@baz.org>
#
# Please remove the "Author" lines above and replace them
# with your own name if you copy and modify this script.

# Do NOT "set -e"

# PATH should only include /usr/* if it runs after the mountnfs.sh script
PATH=/sbin:/usr/sbin:/bin:/usr/bin
DESC="Description of the service"
NAME=daemonexecutablename
DAEMON=/usr/sbin/$NAME
DAEMON_ARGS="--options args"
PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

# Read configuration variable file if it is present
[ -r /etc/default/$NAME ] && . /etc/default/$NAME

# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh

# Define LSB log_* functions.
# Depend on lsb-base (>= 3.2-14) to ensure that this file is present
# and status_of_proc is working.
. /lib/lsb/init-functions

#
# Function that starts the daemon/service
#
do_start()
{
	# Return
	#   0 if daemon has been started
	#   1 if daemon was already running
	#   2 if daemon could not be started
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON --test > /dev/null \
		|| return 1
	start-stop-daemon --start --quiet --pidfile $PIDFILE --exec $DAEMON -- \
		$DAEMON_ARGS \
		|| return 2
	# Add code here, if necessary, that waits for the process to be ready
	# to handle requests from services started subsequently which depend
	# on this one.  As a last resort, sleep for some time.
}

#
# Function that stops the daemon/service
#
do_stop()
{
	# Return
	#   0 if daemon has been stopped
	#   1 if daemon was already stopped
	#   2 if daemon could not be stopped
	#   other if a failure occurred
	start-stop-daemon --stop --quiet --retry=TERM/30/KILL/5 --pidfile $PIDFILE --name $NAME
	RETVAL="$?"
	[ "$RETVAL" = 2 ] && return 2
	# Wait for children to finish too if this is a daemon that forks
	# and if the daemon is only ever run from this initscript.
	# If the above conditions are not satisfied then add some other code
	# that waits for the process to drop all resources that could be
	# needed by services started subsequently.  A last resort is to
	# sleep for some time.
	start-stop-daemon --stop --quiet --oknodo --retry=0/30/KILL/5 --exec $DAEMON
	[ "$?" = 2 ] && return 2
	# Many daemons don't delete their pidfiles when they exit.
	rm -f $PIDFILE
	return "$RETVAL"
}

#
# Function that sends a SIGHUP to the daemon/service
#
do_reload() {
	#
	# If the daemon can reload its configuration without
	# restarting (for example, when it is sent a SIGHUP),
	# then implement that here.
	#
	start-stop-daemon --stop --signal 1 --quiet --pidfile $PIDFILE --name $NAME
	return 0
}

case "$1" in
  start)
	[ "$VERBOSE" != no ] && log_daemon_msg "Starting $DESC" "$NAME"
	do_start
	case "$?" in
		0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
  stop)
	[ "$VERBOSE" != no ] && log_daemon_msg "Stopping $DESC" "$NAME"
	do_stop
	case "$?" in
		0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
		2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
	esac
	;;
  status)
	status_of_proc "$DAEMON" "$NAME" && exit 0 || exit $?
	;;
  #reload|force-reload)
	#
	# If do_reload() is not implemented then leave this commented out
	# and leave 'force-reload' as an alias for 'restart'.
	#
	#log_daemon_msg "Reloading $DESC" "$NAME"
	#do_reload
	#log_end_msg $?
	#;;
  restart|force-reload)
	#
	# If the "reload" option is implemented then remove the
	# 'force-reload' alias
	#
	log_daemon_msg "Restarting $DESC" "$NAME"
	do_stop
	case "$?" in
	  0|1)
		do_start
		case "$?" in
			0) log_end_msg 0 ;;
			1) log_end_msg 1 ;; # Old process is still running
			*) log_end_msg 1 ;; # Failed to start
		esac
		;;
	  *)
		# Failed to stop
		log_end_msg 1
		;;
	esac
	;;
  *)
	#echo "Usage: $SCRIPTNAME {start|stop|restart|reload|force-reload}" >&2
	echo "Usage: $SCRIPTNAME {start|stop|status|restart|force-reload}" >&2
	exit 3
	;;
esac

:
```
哦～原来这就是所有init.d目录下脚本的框架了～～难怪他能保证良好的兼容性，原来所有的service原则上都是从这个框架上生成的。。。这个文件看上去挺长的，其实内容很少，主要就是一个case语句根据相应的参数进行不同的输出。这里不做过多讨论，以后需要自己写一个启动脚本的时候再来研究也不迟。