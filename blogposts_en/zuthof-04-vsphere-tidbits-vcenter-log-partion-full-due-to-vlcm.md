---
title: "vSphere Tidbits: vCenter Log partion full due to vLCM"
source: "Zuthof.nl Blog"
url: "https://blog.zuthof.nl/2023/12/05/vsphere-tidbits-vcenter-log-partion-full-due-to-vlcm/"
date: "December 5, 2023"
author: "Daniël Zuthof"
tag: "vmware"
categories: "Homelab, Linux, VMware, vSphere, esxi"
---

# vSphere Tidbits: vCenter Log partion full due to vLCM

> **Source:** [Zuthof.nl Blog](https://blog.zuthof.nl/2023/12/05/vsphere-tidbits-vcenter-log-partion-full-due-to-vlcm/)  
> **Date:** December 5, 2023  
> **Author:** Daniël Zuthof  
> **Tag:** `vmware`

---

vCenter raised several alarms because its */storage/log* partition was full. The errors were:


- Alert: Log Disk Exhaustion


- Alert: RBD Health Alarm


- Warning: PostgreSQL Service Health Alarm


[

![vCenter error overview](https://zuthof.nl/wp-content/uploads/2023/12/vCenter-error-overview-1024x256.jpg)

](https://zuthof.nl/wp-content/uploads/2023/12/vCenter-error-overview.jpg)


### Find the large logs


Logging into the vCenter appliance using SSH is a good starting point for troubleshooting.


```
`root@vcenter &#91; ~ ]# df -h
Filesystem Size Used Avail Use% Mounted on
...
/dev/mapper/archive_vg-archive 49G 29G 19G 61% /storage/archive
/dev/mapper/core_vg-core 25G 2.6G 21G 11% /storage/core
***/dev/mapper/log_vg-log 9.8G 9.8G 5M 100% /storage/log***
/dev/mapper/db_vg-db 9.8G 698M 8.6G 8% /storage/db
/dev/mapper/seat_vg-seat 541G 279M 513G 1% /storage/seat
...`
```


When searching for the largest file in the */storage/log* partition it showed:


```
`root@vcenter &#91; /storage/log ]# find /storage/log -type f -size +25M
/storage/log/vmware/vc-ws1a-broker/federation-gc.log.1
/storage/log/vmware/vpxd/vpxd-34.log
/storage/log/vmware/vpxd/vpxd-profiler-126.log
/storage/log/vmware/wcp/stdstream.log-0.stderr
/storage/log/vmware/sso/vmware-identity-sts-default-9.log
/storage/log/vmware/vsphere-ui/logs/threadmonitor.log
/storage/log/vmware/vsphere-ui/logs/threadmonitor1.log
/storage/log/vmware/vsphere-ui/logs/vsphere_client_virgo.log
/storage/log/vmware/rbd/preUpgradeLogs.zip
*/storage/log/vmware/vmware-updatemgr/updatemgr-vmon.log.stderr*
/storage/log/vmware/procstate`
```


[

![](https://zuthof.nl/wp-content/uploads/2023/12/vCenter-large-logs.png)

](https://zuthof.nl/wp-content/uploads/2023/12/vCenter-large-logs.png)


Of the files listed above, the *updatemgr-vmon.log.stderr* file was by far the largest 


```
`-rw------- 1 updatemgr updatemgr **5.8G** Dec 4 01:51 updatemgr-vmon.log.stderr`
```


### Log cleanup


Now let’s delete all larger files in the /storage/logs/vmware directory


```
`find /storage/log/vmware -type f -size +25M -delete`
```


While browsing though the other directories and partions it showed that two others also contained old log files. I decided that all files older than 30 days can safely be removed.


The directories are:


- /storage/log/vmware/vc-ws1a-broker


- /storage/archive/vpostgres


```
`find /storage/log/vmware/vc-ws1a-broker -type f -mtime +30 -delete
find /storage/archive/vpostgres -type f -mtime +30 -delete`
```


### Cleanup result


Before:


```
`/dev/mapper/archive_vg-archive 49G 29G 19G **61%** /storage/archive
/dev/mapper/log_vg-log 9.8G 9.8G 5M **100%** /storage/log`
```


After:


```
`/dev/mapper/archive_vg-archive 49G 3.1G 44G **7%** /storage/archive
/dev/mapper/log_vg-log 9.8G 2.3G 7.1G **25%** /storage/log`
```


In total this saved about 33 GB of unneeded logs. But unfortunately the */storage/log* partition started filling quickly again at a rate of around 100MB per 15 min. It turned out the the *updatemgr-vmon.log.stderr* file started growing again since space was available again.


### Fixing the vLCM Baselines


While tailing (tail -f) the *updatemgr-vmon.log.stderr* file it showed that vLCM has severe issues compiling the vLCM image baseline for two of my clusters which flooded the screen with error logs. Unfortunately I do not have the exact logs anymore. It showed that vLCM had issues compiling the image baseline related to the Mellanox Connect-X (nmlx5_core) and Intel E810 (icen) ESXi driver 


I knew that I’ve added a couple of async drivers to the vLCM image baseline (using a custom json file) a while ago. That was done to make sure the hosts had the latest NIC drivers and VMware Tools.


After deleting both of the ESXi NIC drivers (nmlx5_core and icen) from the vLCM image baseline component list, the flooding of log messages stopped.


[

![](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-12-05-22-48-17-1024x334.png)

](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-12-05-22-48-17.png)


FYI: vCenter version 8.0 Update 1, was used while this issue showed.


![Avatar placeholder](images/zuthof-04-img04.jpg)

---

*Originally published at: [https://blog.zuthof.nl/2023/12/05/vsphere-tidbits-vcenter-log-partion-full-due-to-vlcm/](https://blog.zuthof.nl/2023/12/05/vsphere-tidbits-vcenter-log-partion-full-due-to-vlcm/)*