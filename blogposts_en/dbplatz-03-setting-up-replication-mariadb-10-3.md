---
title: "Setting Up Replication - MariaDB 10.3"
source: "DBplatz Blog"
url: "https://blog.dbplatz.com/setting-up-replication-mariadb-10-5/"
date: "April 5, 2022"
author: "DBplatz Support"
tag: "homelab"
categories: "mariadb, replication, centos, homelab, primary"
---

# Setting Up Replication - MariaDB 10.3

> **Source:** [DBplatz Blog](https://blog.dbplatz.com/setting-up-replication-mariadb-10-5/)  
> **Date:** April 5, 2022  
> **Author:** DBplatz Support  
> **Tag:** `homelab`

---

![Setting Up Replication - MariaDB 10.3](images/dbplatz-03-img01.jpg)


In a previous post we learned [how to install MariaDB on Centos](https://blog.dbplatz.com/how-to-install-mariadb-on-centos/). In this one we are setting up replication.

Official docs are [here](https://mariadb.com/kb/en/setting-up-replication/).

So, let&apos;s get to it.

### Installing MariaDB


I&apos;ve used this [guide ](https://blog.dbplatz.com/how-to-install-mariadb-on-centos/)to install MariaDB 10.3 on 2 Hyper-V VM servers called **mariadb01** (PRIMARY) and **mariadb02 **(REPLICA). 

The link above is to install MariaDB 10.5, however, installing MariaDB 10.3 is as simple as just changing the base URL in the MariaDB.repo file to 10.3 as shown below.
```
`baseurl = http://yum.mariadb.org/10.3/centos8-amd64`
```


### Securing MariaDB


Once we&apos;ve installed MariaDB on both nodes 01/02, it is really important to secure them running the **mysql_secure_installation** script.
```
`[centos@mariadb01/02 ~]$ mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
 SERVERS IN PRODUCTION USE! PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we&apos;ll need the current
password for the root user. If you&apos;ve just installed MariaDB, and
you haven&apos;t set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.

Set root password? [Y/n] y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them. This is intended only for testing, and to make the installation
go a bit smoother. You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] y
 ... Success!

Normally, root should only be allowed to connect from &apos;localhost&apos;. This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] y
 ... Success!

By default, MariaDB comes with a database named &apos;test&apos; that anyone can
access. This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] y
 ... Success!

Cleaning up...

All done! If you&apos;ve completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
[centos@localhost ~]$`
```


### Firewall rules


It is important to open port **3306** on both nodes 01/02 so they can communicate to each other.
```
`[centos@mariadb01/02 ~]$ sudo firewall-cmd --state
running
[centos@mariadb01/02 ~]$ firewall-cmd --get-active-zones
public
 interfaces: eth0
[centos@mariadb01/02 ~]$ sudo firewall-cmd --zone=public --add-port=3306/tcp --permanent
success`
```


### Creating a database.


I&apos;ve created a database called sportsdb_qa on **both nodes 01/02**.
```
`[centos@mariadb01/02 ~]$ sudo mysql -u root -p
Enter password:
Welcome to the MariaDB monitor. Commands end with ; or \g.
Your MariaDB connection id is 24
Server version: 10.3.34-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type &apos;help;&apos; or &apos;\h&apos; for help. Type &apos;\c&apos; to clear the current input statement.

MariaDB [(none)]> create database sportsdb_qa ;
Query OK, 1 row affected (0.000 sec)`
```


and then imported data.
```
`[centos@mariadb01/02 ~]$ sudo mysql -u root -p sportsdb_qa < mlb-samples-2008.09.19.sql
Enter password:

[centos@mariadb01/02 ~]$ sudo mysql -u root -p
Enter password:
MariaDB [(none)]> show databases ;
+--------------------+
| Database |
+--------------------+
| information_schema |
| mysql |
| performance_schema |
| sportsdb_qa |
+--------------------+
4 rows in set (0.003 sec)`
```


### Configuring the Primary


Add this to the your configuration file on **mariadb01 **and reboot.
```
`[centos@mariadb01 my.cnf.d]$ sudo vi /etc/my.cnf.d/server.cnf
[mariadb]
log-bin
server_id=1
log-basename=master1
binlog-format=mixed`
```


#### Create a replication user and grant privileges


```
`[centos@mariadb01 my.cnf.d]$ sudo mysql -u root -p
Enter password:
Welcome to the MariaDB monitor. Commands end with ; or \g.
Your MariaDB connection id is 8
Server version: 10.3.34-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type &apos;help;&apos; or &apos;\h&apos; for help. Type &apos;\c&apos; to clear the current input statement.

MariaDB [(none)]> CREATE USER &apos;repluser&apos;@&apos;%&apos; IDENTIFIED BY &apos;bigs3cret&apos;;
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> GRANT REPLICATION SLAVE ON *.* TO &apos;repluser&apos;@&apos;%&apos;;
Query OK, 0 rows affected (0.000 sec)`
```


On the primary, flush and lock all tables! Keep this session running - exiting it will release the lock.> When [FLUSH TABLES WITH READ LOCK](https://mariadb.com/kb/en/flush/) returns, all write access to tables are blocked and all tables are marked as &apos;properly closed&apos; on disk. The tables can still be used for read operations.

```
`MariaDB [(none)]> FLUSH TABLES WITH READ LOCK ;
Query OK, 0 rows affected (0.000 sec)

MariaDB [(none)]> SHOW MASTER STATUS;
+--------------------+----------+--------------+------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+--------------------+----------+--------------+------------------+
| master1-bin.000001 | 330 | | |
+--------------------+----------+--------------+------------------+
1 row in set (0.000 sec)`
```


Now, with the lock still in place, copy the data from the primary to the replica.

Note for live databases: You just need to make a local copy of the data, you don&apos;t need to keep the primary locked until the replica has imported the data.

Once the data has been copied, you can release the lock on the primary.
```
`MariaDB [(none)]> UNLOCK TABLES ;
`
```


### Configuring the Replica


Add this to your configuration file on **mariadb02 **and reboot.
```
`[centos@mariadb02 my.cnf.d]$ sudo vi /etc/my.cnf.d/server.cnf
[mariadb]
log-bin
server_id=2
log-basename=master1
binlog-format=mixed`
```


#### Starting replication


Make sure these match with the Primary node.

MASTER_LOG_FILE = master1-bin.000001

MASTER_LOG_POS = 330
```
`MariaDB [(none)]> CHANGE MASTER TO
 -> MASTER_HOST=&apos;mariadb01&apos;,
 -> MASTER_USER=&apos;repluser&apos;,
 -> MASTER_PASSWORD=&apos;bigs3cret&apos;,
 -> MASTER_PORT=3306,
 -> MASTER_LOG_FILE=&apos;master1-bin.000001&apos;,
 -> MASTER_LOG_POS=330,
 -> MASTER_CONNECT_RETRY=10;
Query OK, 0 rows affected (0.023 sec)`
```


#### Starting the Replica


We can now start the replica.
```
`MariaDB [(none)]> start slave ;`
```


#### Checking the replica status


```
`MariaDB [(none)]> SHOW SLAVE STATUS \G
*************************** 1. row ***************************
 Slave_IO_State: Waiting for master to send event
 Master_Host: mariadb01
 Master_User: repluser
 Master_Port: 3306
 Connect_Retry: 10
 Master_Log_File: master1-bin.000001
 Read_Master_Log_Pos: 330
 Relay_Log_File: master1-relay-bin.000002
 Relay_Log_Pos: 631
 Relay_Master_Log_File: master1-bin.000001
 Slave_IO_Running: Yes
 Slave_SQL_Running: Yes
 Replicate_Do_DB:
 Replicate_Ignore_DB:
 Replicate_Do_Table:
 Replicate_Ignore_Table:
 Replicate_Wild_Do_Table:
 Replicate_Wild_Ignore_Table:
 Last_Errno: 0
 Last_Error:
 Skip_Counter: 0
 Exec_Master_Log_Pos: 330
 Relay_Log_Space: 942
 Until_Condition: None
 Until_Log_File:
 Until_Log_Pos: 0
 Master_SSL_Allowed: No
 Master_SSL_CA_File:
 Master_SSL_CA_Path:
 Master_SSL_Cert:
 Master_SSL_Cipher:
 Master_SSL_Key:
 Seconds_Behind_Master: 0
 Master_SSL_Verify_Server_Cert: No
 Last_IO_Errno: 0
 Last_IO_Error:
 Last_SQL_Errno: 0
 Last_SQL_Error:
 Replicate_Ignore_Server_Ids:
 Master_Server_Id: 1
 Master_SSL_Crl:
 Master_SSL_Crlpath:
 Using_Gtid: No
 Gtid_IO_Pos:
 Replicate_Do_Domain_Ids:
 Replicate_Ignore_Domain_Ids:
 Parallel_Mode: conservative
 SQL_Delay: 0
 SQL_Remaining_Delay: NULL
 Slave_SQL_Running_State: Slave has read all relay log; waiting for the slave I/O thread to update it
 Slave_DDL_Groups: 0
Slave_Non_Transactional_Groups: 0
 Slave_Transactional_Groups: 0
1 row in set (0.000 sec)`
```


If replication is running correctly you should see these 2 as YES
```
`Slave_IO_Running: Yes
Slave_SQL_Running: Yes`
```

---

*Originally published at: [https://blog.dbplatz.com/setting-up-replication-mariadb-10-5/](https://blog.dbplatz.com/setting-up-replication-mariadb-10-5/)*