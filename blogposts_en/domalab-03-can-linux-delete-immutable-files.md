---
title: "Can Linux delete immutable files?"
source: "Domalab"
url: "https://domalab.com/2021/10/29/linux-delete-immutable-files/"
date: "October 29, 2021"
author: "Michele Domanico"
tag: "vmware"
categories: "Data Protection, Backup & Recovery, Veeam"
---

# Can Linux delete immutable files?

> **Source:** [Domalab](https://domalab.com/2021/10/29/linux-delete-immutable-files/)  
> **Date:** October 29, 2021  
> **Author:** Michele Domanico  
> **Tag:** `vmware`

---

In this final part of the article series dedicated to [immutability](https://atomic-temporary-105482340.wpcomstaging.com/linux-ubuntu-setup/), this article shows the most important bits when it comes down to hardening the security on the linux servers hosting the immutable backups. So how is it possible for bad actors (users and apps) to prevent linux delete immutable files?


Primarily connectivity and permissions.


From a connectivity perspective the first and most obvious is to disable SSH access. Otherwise this could let unauthorised access from unsolicited or compromised accounts. Ideally the servers should be secured in a locked down server room. The only access available is through “local” consoles like ILO, iDRAC and similar.


From a permissions point of view the least the better. Also the user intended to connect to the linux server should not be part of the sudo group or equivalent. This prevents a compromised user (that can still remotely connect when SSH is left unattended) to run admin commands.


In the case of Veeam Immutable backups, data is transported using the Data Mover service (veeamtransport). A special and separate service (immunereposvc) is responsible to check and set the immutable bit on the required files (full and incremental backup files) plus the special file .veeam.N.lock which is updated with the immutability time period for each file in the backup chain (Full .vbk – Incremental .vib)


Moreover, assuming other local accounts gain access to the linux server are not able to list, change or modify any file and folder. This is possible when the ownership and access control for the immutable files location is configured only for the intended account. As long as the permissions remain intact, even the root account will receive the “Permission denied” when trying to delete or change any of these files.


The root account, as special user has the ability to add/remove the “i” bit for immutability by mean of the “chattr” change attribute command. As soon as the attribute is removed, the files can be deleted from the root user again. So the following is a best practice:


- Avoid leaving the SSH service running unattended

- Only use “local console” to connect to the linux server

- Employ Single-Use credentials for the user intended to connect to the linux server

- Deploy the necessary components

- Remove the user from the sudo group (in case SSH is still on)

- Disable the SSH service when the install has completed

- Install a [2FA solution](https://duo.com/resources/ebooks/two-factor-authentication-evaluation-guide?key=sgoog1481a&utm_source=google&utm_medium=paid_search&utm_campaign=GO_UK_S_2FA_T2&utm_content=Tier2&_bk=2fa&_bg=122827424877&_bn=g&_bm=p&_bt=524040844218&gclid=Cj0KCQjwt-6LBhDlARIsAIPRQcKpvwmuIzuwmDymumwOS7Htc4XbCYXXuAYDKZy6mWICT0CnWAriNh4aAr65EALw_wcB) for increased security


Veeam Hardened Repositories follow the Sec 17a-4, FINRA 4511 CFTC 1.31 regulations with regards to W.O.R.M storage (Write Once Read Many). Configuring the Hardened Repositories with the principles above ensures the highest level of protection and safeguard of the backup data.

---

*Originally published at: [https://domalab.com/2021/10/29/linux-delete-immutable-files/](https://domalab.com/2021/10/29/linux-delete-immutable-files/)*