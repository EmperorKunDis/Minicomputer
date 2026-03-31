---
title: "Installing MariaDB on a different filesystem."
source: "DBplatz Blog"
url: "https://blog.dbplatz.com/installing-mariadb-on-a-different-filesystem/"
date: "January 9, 2025"
author: "DBplatz Support"
tag: "homelab"
categories: "homelab, mariadb, redhat, linux"
---

# Installing MariaDB on a different filesystem.

> **Source:** [DBplatz Blog](https://blog.dbplatz.com/installing-mariadb-on-a-different-filesystem/)  
> **Date:** January 9, 2025  
> **Author:** DBplatz Support  
> **Tag:** `homelab`

---

![Installing MariaDB on a different filesystem.](images/dbplatz-01-img01.jpg)


In this article we are installing MariaDB on Red Hat and on a different location.
```
`Software:
OS: Red Hat Enterprise Linux 8.10 (Ootpa)
DB: 11.6.2-MariaDB MariaDB Server`
```


And we are installing MariaDB on /mariadb
```
`$ df -h
Filesystem Size Used Avail Use% Mounted on
devtmpfs 890M 0 890M 0% /dev
tmpfs 909M 0 909M 0% /dev/shm
tmpfs 909M 20M 889M 3% /run
tmpfs 909M 0 909M 0% /sys/fs/cgroup
/dev/mapper/rhel-root 29G 4.8G 25G 17% /
/dev/sda1 1014M 252M 763M 25% /boot
/dev/sdb 9.8G 1.3G 8.0G 14% /mariadb
/dev/sdd 4.9G 20M 4.6G 1% /mariadb_bck
/dev/sdc 4.9G 20M 4.6G 1% /mariadb_log
tmpfs 182M 0 182M 0% /run/user/0`
```


#### Download software


```
`wget https://dlm.mariadb.com/3971341/MariaDB/mariadb-11.6.2/bintar-linux-systemd-x86_64/mariadb-11.6.2-linux-systemd-x86_64.tar.gz
`
```


#### Untar software


```
`tar zxf mariadb-11.6.2-linux-systemd-x86_64.tar.gz
`
```


#### Create mysql user (no login, no home directory)


```
`useradd mysql -M --shell &apos;/sbin/nologin&apos;
`
```


#### Move the installation folder to /mariadb (different filesystem)


```
`[root@redhatenterprise8.10 ~]# mv mariadb-11.6.2-linux-systemd-x86_64 /mariadb
`
```


#### Change directory to /mariadb


```
`[root@redhatenterprise8.10 ~]# cd /mariadb
[root@redhatenterprise8.10 mariadb]# ls -lrt
total 20
drwxrwxr-x. 12 1002 1002 4096 Nov 12 16:51 mariadb-11.6.2-linux-systemd-x86_64
`
```


#### Rename folder to basedir


```
`[root@redhatenterprise8.10 mariadb]# mv mariadb-11.6.2-linux-systemd-x86_64 basedir
`
```


#### Create additional folders.


```
`[root@redhatenterprise8.10 mariadb]# mkdir datadir errorlog config process tmpdir
[root@redhatenterprise8.10 mariadb]# ls -lrt
total 32
drwxrwxr-x. 12 1002 1002 4096 Nov 12 16:51 basedir
drwx------. 2 root root 16384 Jan 8 22:57 lost+found
drwxr-xr-x. 2 root root 4096 Jan 9 09:43 datadir
drwxr-xr-x. 2 root root 4096 Jan 9 09:43 errorlog
drwxr-xr-x. 2 root root 4096 Jan 9 09:43 config
drwxr-xr-x. 2 root root 4096 Jan 9 09:43 process
drwxr-xr-x. 2 root root 4096 Jan 9 09:43 tmpdir
`
```


#### Modify privileges


```
`cd /
sudo chown mysql:mysql -R mariadb

[root@redhatenterprise8.10 /]# cd /mariadb
[root@redhatenterprise8.10 mariadb]# ls -lrt
total 40
drwxrwxr-x. 12 mysql mysql 4096 Nov 12 16:51 basedir
drwx------. 2 mysql mysql 16384 Jan 8 22:57 lost+found
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 datadir
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 errorlog
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 config
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 tmpdir
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 process
`
```


#### Create symbolic link


```
`cd /mariadb
ln -s /mariadb/basedir/bin/mariadb mariadb
[root@redhatenterprise8.10 mariadb]# ls -lrt
total 32
drwxrwxr-x. 12 mysql mysql 4096 Nov 12 16:51 basedir
drwx------. 2 mysql mysql 16384 Jan 8 22:57 lost+found
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 datadir
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 errorlog
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 config
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 tmpdir
drwxr-xr-x. 2 mysql mysql 4096 Jan 9 09:27 process
lrwxrwxrwx. 1 root root 28 Jan 9 09:28 mariadb -> /mariadb/basedir/bin/mariadb
`
```


### Installing MariaDB as root


```
`cd /mariadb/basedir/scripts
./mariadb-install-db --user=mysql --basedir=/mariadb/basedir --datadir=/mariadb/datadir --verbose
`
```


```
`Installing MariaDB/MySQL system tables in &apos;/mariadb/datadir&apos; ...
2025-01-09 9:53:06 0 [Note] Starting MariaDB 11.6.2-MariaDB source revision d8dad8c3b54cd09fefce7bc3b9749f427eed9709 server_uid Zohdhf6Eu0IDEyATQuPOgRSt/GQ= as process 87181
2025-01-09 9:53:06 0 [Note] InnoDB: The first data file &apos;./ibdata1&apos; did not exist. A new tablespace will be created!
2025-01-09 9:53:06 0 [Note] InnoDB: Compressed tables use zlib 1.3.1
2025-01-09 9:53:06 0 [Note] InnoDB: Number of transaction pools: 1
2025-01-09 9:53:06 0 [Note] InnoDB: Using SSE4.2 crc32 instructions
2025-01-09 9:53:06 0 [Note] InnoDB: Using Linux native AIO
2025-01-09 9:53:06 0 [Note] InnoDB: Initializing buffer pool, total size = 128.000MiB, chunk size = 2.000MiB
2025-01-09 9:53:06 0 [Note] InnoDB: Completed initialization of buffer pool
2025-01-09 9:53:06 0 [Note] InnoDB: Setting file &apos;./ibdata1&apos; size to 12.000MiB. Physically writing the file full; Please wait ...
2025-01-09 9:53:06 0 [Note] InnoDB: File &apos;./ibdata1&apos; size is now 12.000MiB.
2025-01-09 9:53:06 0 [Note] InnoDB: File system buffers for log disabled (block size=512 bytes)
2025-01-09 9:53:06 0 [Note] InnoDB: Data file .//undo001 did not exist: new to be created
2025-01-09 9:53:06 0 [Note] InnoDB: Setting file .//undo001 size to 10.000MiB
2025-01-09 9:53:06 0 [Note] InnoDB: Database physically writes the file full: wait...
2025-01-09 9:53:06 0 [Note] InnoDB: Data file .//undo002 did not exist: new to be created
2025-01-09 9:53:06 0 [Note] InnoDB: Setting file .//undo002 size to 10.000MiB
2025-01-09 9:53:06 0 [Note] InnoDB: Database physically writes the file full: wait...
2025-01-09 9:53:06 0 [Note] InnoDB: Data file .//undo003 did not exist: new to be created
2025-01-09 9:53:06 0 [Note] InnoDB: Setting file .//undo003 size to 10.000MiB
2025-01-09 9:53:06 0 [Note] InnoDB: Database physically writes the file full: wait...
2025-01-09 9:53:06 0 [Note] InnoDB: Doublewrite buffer not found: creating new
2025-01-09 9:53:06 0 [Note] InnoDB: Opened 3 undo tablespaces
2025-01-09 9:53:06 0 [Note] InnoDB: 128 rollback segments in 3 undo tablespaces are active.
2025-01-09 9:53:06 0 [Note] InnoDB: Setting file &apos;./ibtmp1&apos; size to 12.000MiB. Physically writing the file full; Please wait ...
2025-01-09 9:53:06 0 [Note] InnoDB: File &apos;./ibtmp1&apos; size is now 12.000MiB.
2025-01-09 9:53:06 0 [Note] InnoDB: log sequence number 0; transaction id 3
2025-01-09 9:53:06 0 [Note] Plugin &apos;wsrep-provider&apos; is disabled.
OK

To start mariadbd at boot time you have to copy
support-files/mariadb.service to the right place for your system


Two all-privilege accounts were created.
One is root@localhost, it has no password, but you need to
be system &apos;root&apos; user to connect. Use, for example, sudo mysql
The second is mysql@localhost, it has no password either, but
you need to be the system &apos;mysql&apos; user to connect.
After connecting you can set the password, if you would need to be
able to connect as any of these users with a password and without sudo

See the MariaDB Knowledgebase at https://mariadb.com/kb

You can start the MariaDB daemon with:
cd &apos;/mariadb/basedir&apos; ; /mariadb/basedir/bin/mariadbd-safe --datadir=&apos;/mariadb/datadir&apos;

You can test the MariaDB daemon with mariadb-test-run.pl
cd &apos;/mariadb/basedir/mariadb-test&apos; ; perl mariadb-test-run.pl

Please report any problems at https://mariadb.org/jira

The latest information about MariaDB is available at https://mariadb.org/.

Consider joining MariaDB&apos;s strong and vibrant community:
https://mariadb.org/get-involved/

[root@redhatenterprise8.10 scripts]# 
`
```


#### Copy mariadb.service


```
`cd /mariadb/basedir/
cp support-files/systemd/mariadb.service /usr/lib/systemd/system/mariadb.service
`
```


#### MariaDB configuration file


```
`vi /mariadb/config/mariadb.cnf
`
```


and copy the following

```
`[mariadbd]
user = mysql
datadir = /mariadb/datadir/
basedir = /mariadb/basedir/
log_error = /mariadb/errorlog/mariadb.err
tmpdir = /mariadb/tmpdir
pid-file = /mariadb/process/mariadbd.pid
`
```


#### Starting MariaDB (as a test).


```
`cd /mariadb/basedir/bin
./mariadbd --defaults-file=/mariadb/config/mariadb.cnf
`
```


#### On another session


```
`[root@redhatenterprise8.10 mariadb]# pwd
/mariadb
[root@redhatenterprise8.10 mariadb]# ./mariadb
`
```


```
`Welcome to the MariaDB monitor. Commands end with ; or \g.
Your MariaDB connection id is 4
Server version: 11.6.2-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type &apos;help;&apos; or &apos;\h&apos; for help. Type &apos;\c&apos; to clear the current input statement.

MariaDB [(none)]> show variables like &apos;%dir&apos; ;
+---------------------------+----------------------------------+
| Variable_name | Value |
+---------------------------+----------------------------------+
| aria_sync_log_dir | NEWFILE |
| basedir | /mariadb/basedir/ |
| character_sets_dir | /mariadb/basedir/share/charsets/ |
| datadir | /mariadb/datadir/ |
| innodb_data_home_dir | |
| innodb_log_group_home_dir | ./ |
| innodb_tmpdir | |
| lc_messages_dir | |
| plugin_dir | /mariadb/basedir/lib/plugin/ |
| slave_load_tmpdir | /tmp |
| tmpdir | /tmp |
| wsrep_data_home_dir | /mariadb/datadir/ |
+---------------------------+----------------------------------+
12 rows in set (0.003 sec)
`
```


```
`[root@redhatenterprise8.10 mariadb]# cat /mariadb/errorlog/mariadb.err 
`
```


```
`2025-01-09 10:02:24 0 [Note] Starting MariaDB 11.6.2-MariaDB source revision d8dad8c3b54cd09fefce7bc3b9749f427eed9709 server_uid Zohdhf6Eu0IDEyATQuPOgRSt/GQ= as process 87218
2025-01-09 10:02:24 0 [Note] InnoDB: Compressed tables use zlib 1.3.1
2025-01-09 10:02:24 0 [Note] InnoDB: Number of transaction pools: 1
2025-01-09 10:02:24 0 [Note] InnoDB: Using SSE4.2 crc32 instructions
2025-01-09 10:02:24 0 [Note] InnoDB: Using Linux native AIO
2025-01-09 10:02:24 0 [Note] InnoDB: Initializing buffer pool, total size = 128.000MiB, chunk size = 2.000MiB
2025-01-09 10:02:24 0 [Note] InnoDB: Completed initialization of buffer pool
2025-01-09 10:02:24 0 [Note] InnoDB: File system buffers for log disabled (block size=512 bytes)
2025-01-09 10:02:24 0 [Note] InnoDB: End of log at LSN=47733
2025-01-09 10:02:24 0 [Note] InnoDB: Opened 3 undo tablespaces
2025-01-09 10:02:24 0 [Note] InnoDB: 128 rollback segments in 3 undo tablespaces are active.
2025-01-09 10:02:24 0 [Note] InnoDB: Setting file &apos;./ibtmp1&apos; size to 12.000MiB. Physically writing the file full; Please wait ...
2025-01-09 10:02:24 0 [Note] InnoDB: File &apos;./ibtmp1&apos; size is now 12.000MiB.
2025-01-09 10:02:24 0 [Note] InnoDB: log sequence number 47733; transaction id 14
2025-01-09 10:02:24 0 [Note] Plugin &apos;FEEDBACK&apos; is disabled.
2025-01-09 10:02:24 0 [Note] Plugin &apos;wsrep-provider&apos; is disabled.
2025-01-09 10:02:24 0 [Note] InnoDB: Loading buffer pool(s) from /mariadb/datadir/ib_buffer_pool
2025-01-09 10:02:24 0 [Note] InnoDB: Buffer pool(s) load completed at 250109 10:02:24
2025-01-09 10:02:27 0 [Note] Server socket created on IP: &apos;0.0.0.0&apos;.
2025-01-09 10:02:27 0 [Note] Server socket created on IP: &apos;::&apos;.
2025-01-09 10:02:27 0 [Note] mariadbd: Event Scheduler: Loaded 0 events
2025-01-09 10:02:27 0 [Note] ./mariadbd: ready for connections.
Version: &apos;11.6.2-MariaDB&apos; socket: &apos;/tmp/mysql.sock&apos; port: 3306 MariaDB Server
[root@redhatenterprise8.10 mariadb]# 
`
```


#### Copy mariadbd to sbin


```
`cp /mariadb/basedir/bin/mariadbd /usr/sbin/mariadbd
`
```


#### Now let&apos;s try using systemd


```
`mkdir /etc/systemd/system/mariadb.service.d/
`
```


```
`vi /etc/systemd/system/mariadb.service.d/mariadb.conf
`
```


and copy the following

```
`[Unit]
Description=MariaDB Community Server
After=network.target

[Service]
User=root
ExecStart=
ExecStart=/usr/sbin/mariadbd \
 --defaults-file=/mariadb/config/mariadb.cnf

[Install]
WantedBy=multi-user.target
`
```


#### Execute reload, start, status and enable.


```
`systemctl daemon-reload
systemctl start mariadb.service
systemctl status mariadb.service
systemctl enable mariadb.service
`
```


#### Let&apos;s test again


```
`export PATH=$PATH:/mariadb/basedir/bin/
[root@redhatenterprise8.10 mariadb.service.d]# mariadb
Welcome to the MariaDB monitor. Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 11.6.2-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type &apos;help;&apos; or &apos;\h&apos; for help. Type &apos;\c&apos; to clear the current input statement.
`
```


```
`MariaDB [(none)]> show variables like &apos;%dir%&apos; ;
+-----------------------------------------+----------------------------------+
| Variable_name | Value |
+-----------------------------------------+----------------------------------+
| aria_log_dir_path | /mariadb/datadir/ |
| aria_sync_log_dir | NEWFILE |
| basedir | /mariadb/basedir/ |
| binlog_direct_non_transactional_updates | OFF |
| character_sets_dir | /mariadb/basedir/share/charsets/ |
| datadir | /mariadb/datadir/ |
| ignore_db_dirs | |
| innodb_data_home_dir | |
| innodb_log_group_home_dir | ./ |
| innodb_max_dirty_pages_pct | 90.000000 |
| innodb_max_dirty_pages_pct_lwm | 0.000000 |
| innodb_tmpdir | |
| innodb_undo_directory | ./ |
| lc_messages_dir | |
| plugin_dir | /mariadb/basedir/lib/plugin/ |
| redirect_url | |
| slave_load_tmpdir | /mariadb/tmp |
| tmpdir | /mariadb/tmp |
| wsrep_data_home_dir | /mariadb/datadir/ |
| wsrep_dirty_reads | OFF |
+-----------------------------------------+----------------------------------+
20 rows in set (0.004 sec)

MariaDB [(none)]> 
`
```


References
[https://mariadb.com/kb/en/mysql_install_db/](https://mariadb.com/kb/en/mysql_install_db/)
[https://mariadb.org/wp-content/uploads/2022/06/MariaDBServerKnowledgeBase.pdf](https://mariadb.org/wp-content/uploads/2022/06/MariaDBServerKnowledgeBase.pdf)
[https://stackoverflow.com/questions/17005654/error-while-loading-shared-libraries-libncurses-so-5](https://stackoverflow.com/questions/17005654/error-while-loading-shared-libraries-libncurses-so-5)
[https://serverfault.com/questions/1024958/systemd-service-not-starting-failed-at-step-exec-spawning-permission-denied](https://serverfault.com/questions/1024958/systemd-service-not-starting-failed-at-step-exec-spawning-permission-denied)

---

*Originally published at: [https://blog.dbplatz.com/installing-mariadb-on-a-different-filesystem/](https://blog.dbplatz.com/installing-mariadb-on-a-different-filesystem/)*