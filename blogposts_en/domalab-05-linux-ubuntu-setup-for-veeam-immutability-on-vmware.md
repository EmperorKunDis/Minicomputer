---
title: "Linux ubuntu setup for Veeam Immutability on VMware"
source: "Domalab"
url: "https://domalab.com/2021/10/29/linux-ubuntu-setup/"
date: "October 29, 2021"
author: "Michele Domanico"
tag: "vmware"
categories: "HowTo, Ubuntu"
---

# Linux ubuntu setup for Veeam Immutability on VMware

> **Source:** [Domalab](https://domalab.com/2021/10/29/linux-ubuntu-setup/)  
> **Date:** October 29, 2021  
> **Author:** Michele Domanico  
> **Tag:** `vmware`

---

Immutable backups are among the most effective protections available against the increasing and targeted cyber attacks. To a point where some of these specialise in deleting also the backup files along with encrypting the live production data with a custom key. Unfortunately not all victims from ransomware attacks managed to get their data back even after paying for the ransom. Even worsts some of the victims have been hit multiple times. The purpose of this article is to present a quick way to deploy a linux ubuntu setup that can be used to prepare a Veeam Hardened Repository.


Veeam Hardened Repositories provide “immutable backups” by mean of W.O.R.M. (Write Once Read Many) approach. In addition, Veeam Hardened Repositories adhere to the FINRA and SEC-17a regulations just using commodity hardware and further expanding on the agnostic approach, which also brings no vendor lock-in.


The linux ubuntu setup for Veeam immutability consists in running a linux machine with restricted access to the storage where the backups will be stored. On top of that, Veeam also controls the retention period for which these files are set as immutable. During such period the backup files cannot have any change and or deletion. Not even from the Veeam administrator account or the root user. These includes malicious users or applications trying to delete or change the backup file.


This article series shows 3 steps for the linux ubuntu setup:


- Create linux ubuntu machine in a VMware homelab (this article)

- [Setup the linux partition or disk with XFS file system](https://atomic-temporary-105482340.wpcomstaging.com/veeam-xfs-repository/)

- [Show what happens when hardening is not done right](https://atomic-temporary-105482340.wpcomstaging.com/linux-delete-immutable-files/)


The series also shows the creation of a backup job with [Veeam Backup and Replication](https://atomic-temporary-105482340.wpcomstaging.com/tag/veeam-backup-and-replication/), how to make data immutable, what happens when data gets deleted during the retention period and finally some practical considerations on how to harden the linux ubuntu setup. It is also worth noting, a similar setup can run on other linux distros. It is always important to check the OS compatibility with the available hardware. In this case the homelab is running on a VMware environment and the disk used to store immutable data is directly attached to the VM as a SCSi disk. Of course it is also possible to present to the linux ubuntu iSCSI disks connected to a SAN.


For example to check the hardware compatibility this ubuntu page lists the [certified hardware](https://ubuntu.com/certified/servers?q=&limit=20&release=20.04+LTS) with the latest ubuntu 20.04 release. In a similar fashion other linux distros can be used as Veeam Hardened Repositories including but not limited to RedHat, Debian, CentOS, SLES Linux and more. In general the ones with linux kernel 5.4 and later ship with latest version of the XFS, which is essential to provide both the data de-duplication and immutability options.

---

*Originally published at: [https://domalab.com/2021/10/29/linux-ubuntu-setup/](https://domalab.com/2021/10/29/linux-ubuntu-setup/)*