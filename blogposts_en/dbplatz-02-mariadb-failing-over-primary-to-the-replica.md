---
title: "MariaDB failing over primary to the replica."
source: "DBplatz Blog"
url: "https://blog.dbplatz.com/mariadb-failing-over-primary-to-the-replica/"
date: "April 29, 2022"
author: "DBplatz Support"
tag: "homelab"
categories: "mariadb, replication, failover, takeover, centos"
---

# MariaDB failing over primary to the replica.

> **Source:** [DBplatz Blog](https://blog.dbplatz.com/mariadb-failing-over-primary-to-the-replica/)  
> **Date:** April 29, 2022  
> **Author:** DBplatz Support  
> **Tag:** `homelab`

---

![MariaDB failing over primary to the replica.](images/dbplatz-02-img01.jpg)


In a previous post, [we set up replication for MariaDB](https://blog.dbplatz.com/setting-up-replication-mariadb-10-5/). This time we are failing over manually from the Primary node (master) to the Replica node (slave).

#### Primary - mariadb01


We connect to mariadb01 as Primary.
```
`[centos@mariadb01 ~]$ mysql -u root -p --prompt "Primary> "`
```


We set all tables to be read-only.
```
`Primary> flush tables with read lock ;
Query OK, 0 rows affected (0.000 sec)
`
```


**Keep this session running** - exiting it will release the lock.

We get the position and file name. We will need this info later.
```
`Primary> show master status ;
+--------------------+----------+--------------+------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+--------------------+----------+--------------+------------------+
| master1-bin.000012 | 344 | | |
+--------------------+----------+--------------+------------------+
1 row in set (0.000 sec)`
```


#### Replica - mariadb02


We connect to mariadb02 as Replica
```
`[centos@mariadb02 ~]$ mysql -u root -p --prompt "Replica> "`
```


Check the status of the replica.
```
`Replica> show slave status \G
*************************** 1. row ***************************
 Slave_IO_State: Waiting for master to send event
 Master_Host: mariadb01
 Master_User: repluser
 Master_Port: 3306
 Connect_Retry: 10
 Master_Log_File: master1-bin.000012
 Read_Master_Log_Pos: 344
 Relay_Log_File: master1-relay-bin.000020
 Relay_Log_Pos: 645
 Relay_Master_Log_File: master1-bin.000012
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
 Exec_Master_Log_Pos: 344
 Relay_Log_Space: 1345
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
 Slave_SQL_Running_State: Slave has read all relay log; 
 waiting for the slave I/O thread to update it
 Slave_DDL_Groups: 0
Slave_Non_Transactional_Groups: 0
 Slave_Transactional_Groups: 0
1 row in set (0.000 sec)`
```


#### Primary - mariadb01


We shutdown mariadb01
```
`Master> shutdown ;
Query OK, 0 rows affected (0.000 sec)`
```


#### Replica - mariadb02


We stop all replicas and reset them.
```
`# Close threads for replicas
Secondary> stop all slaves ;
Query OK, 0 rows affected, 1 warning (0.006 sec)

# Release the replication position
Secondary> reset slave all ;
Query OK, 0 rows affected (0.002 sec)`
```


We check the status of the replica.
```
`Secondary> show master status ;
+--------------------+----------+--------------+------------------+
| File | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+--------------------+----------+--------------+------------------+
| master1-bin.000010 | 344 | | |
+--------------------+----------+--------------+------------------+
1 row in set (0.000 sec)`
```


Set this replica to read-only = 0 (can read/write).
```
`Secondary> set @@global.read_only=0 ;
Query OK, 0 rows affected (0.000 sec)

Secondary> quit`
```


#### New Primary - mariadb02


We now connect to mariadb02 as **Primary**, create the replication user and grant privileges.
```
`mysql -u root -p --prompt "Primary> "

Primary> CREATE USER &apos;repluser&apos;@&apos;%&apos; IDENTIFIED BY &apos;bigs3cret&apos;;
Query OK, 0 rows affected (0.000 sec)

Primary> GRANT REPLICATION SLAVE ON *.* TO &apos;repluser&apos;@&apos;%&apos;;
Query OK, 0 rows affected (0.000 sec)`
```


#### New replica - mariadb01


On the new replica - mariadb01. We start the MariaDB service.
```
`Master> quit
Bye
[centos@mariadb01 ~]$ sudo systemctl start mariadb
[sudo] password for centos:
`
```


We check the status of the service.
```
`[centos@mariadb01 ~]$ sudo systemctl status mariadb
&#x25CF; mariadb.service - MariaDB 10.3.34 database server
 Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; vendor preset: disabled)
 Drop-In: /etc/systemd/system/mariadb.service.d
 &#x2514;&#x2500;migrated-from-my.cnf-settings.conf
 Active: active (running) since Wed 2022-04-27 11:42:22 BST; 3s ago
 Docs: man:mysqld(8)`
```


We connect to mariadb01 as **Replica**
```
`mysql -u root -p --prompt "Replica> "`
```


We set the replica as read-only
```
`Replica> set @@global.read_only=1 ;
Query OK, 0 rows affected (0.000 sec)`
```


We stop all slaves and reset master.
```
`Replica> stop all slaves ;
Query OK, 0 rows affected, 1 warning (0.003 sec)

Replica> reset master ;
Query OK, 0 rows affected (0.012 sec)

Replica> reset slave all ;
Query OK, 0 rows affected (0.002 sec)`
```


We now set that the new primary is on mariadb02
```
`Replica> CHANGE MASTER TO MASTER_HOST=&apos;mariadb02&apos;,MASTER_USER=&apos;repluser&apos;,
MASTER_PASSWORD=&apos;bigs3cret&apos;,MASTER_PORT=3306,MASTER_LOG_FILE=&apos;master1-bin.0000012&apos;,MASTER_LOG_POS=344,MASTER_CONNECT_RETRY=10;
Query OK, 0 rows affected (0.023 sec)`
```


We start the slave
```
`Replica> start slave ;
Query OK, 0 rows affected (0.001 sec)`
```


and we check the status.
```
`Replica> show slave status \G
*************************** 1. row ***************************
 Slave_IO_State: Waiting for master to send event
 Master_Host: mariadb02
 Master_User: repluser
 Master_Port: 3306
 Connect_Retry: 10
 Master_Log_File: master1-bin.000012
 Read_Master_Log_Pos: 344
 Relay_Log_File: master1-relay-bin.000002
 Relay_Log_Pos: 645
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
 Exec_Master_Log_Pos: 12328408
 Relay_Log_Space: 864
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
 Master_Server_Id: 2
 Master_SSL_Crl:
 Master_SSL_Crlpath:
 Using_Gtid: No
 Gtid_IO_Pos:
 Replicate_Do_Domain_Ids:
 Replicate_Ignore_Domain_Ids:
 Parallel_Mode: conservative
 SQL_Delay: 0
 SQL_Remaining_Delay: NULL
 Slave_SQL_Running_State: Slave has read all relay log; 
 waiting for the slave I/O thread to update it
 Slave_DDL_Groups: 2
Slave_Non_Transactional_Groups: 0
 Slave_Transactional_Groups: 0
1 row in set (0.000 sec)

Replica>`
```


and as before, this 2 should be shown as yes.
```
` Slave_IO_Running: Yes
 Slave_SQL_Running: Yes`
```

---

*Originally published at: [https://blog.dbplatz.com/mariadb-failing-over-primary-to-the-replica/](https://blog.dbplatz.com/mariadb-failing-over-primary-to-the-replica/)*