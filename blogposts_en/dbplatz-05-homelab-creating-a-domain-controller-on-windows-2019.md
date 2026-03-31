---
title: "HomeLab: Creating a Domain Controller on Windows 2019."
source: "DBplatz Blog"
url: "https://blog.dbplatz.com/homelab-creating-a-domain-controller/"
date: "October 5, 2021"
author: "DBplatz Support"
tag: "homelab"
categories: "homelab, windows2019, domaincontroller, windows"
---

# HomeLab: Creating a Domain Controller on Windows 2019.

> **Source:** [DBplatz Blog](https://blog.dbplatz.com/homelab-creating-a-domain-controller/)  
> **Date:** October 5, 2021  
> **Author:** DBplatz Support  
> **Tag:** `homelab`

---

![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img01.jpg)


Now that we know [how to create a VM using Hyper-V](https://blog.dbplatz.com/new-dc-for-sql-server-aog-2019/), let&apos;s configure a domain controller which is required for our HomeLab SQL Server Always On installation.

There is a [really helpful guide already](https://sqlundercover.com/2017/12/18/creating-a-sql-server-test-lab-on-your-workstation-part-one-installing-the-domain-controller/) here, but I&apos;ll be using Windows 2019 instead.

So, once our VM is up and running,

Let&apos;s open the Server Manager and click on **Add roles and features.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img02.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img03.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img04.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img05.png)


Click on **Active Directory Domain Services.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img06.png)


Click on **Add Features.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img07.png)


Once is clicked, click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img08.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img09.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img10.png)


Click on **Specify an alternate source path.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img11.png)


And add the path to your Sources.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img12.png)


Click **Install**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img13.png)


Once the installation is complete, click on **Promote this server to a domain controller.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img14.png)


Click on **Add a new forest** and specify the **domain name**: netplatz.local


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img15.png)


Click on **Domain Name System (DNS) server **and **provide a password.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img16.png)


Click on **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img17.png)


Provide the **domain name**, as shown below.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img18.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img19.png)


Click **Next**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img20.png)


and click **install**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img21.png)


**Note:** The Server reboots itself.


We login again ... but this time we see the domain\user


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img22.png)


So now if you want you can **rename **the hostname. 

Go to Control Panel -> System and Security -> System and click on **Change Settings.**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img23.png)


**Add **a computer name


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img24.png)


Click **OK**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img25.png)


and **reboot later**.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img26.png)


so the network can be configured. Go to Go to Control Panel -> Network and Internet -> Network Connections -> Properties.

Click on **IP Version 4 (tcp/ipv4)**


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img27.png)


and use the IPs below.


![HomeLab: Creating a Domain Controller on Windows 2019.](images/dbplatz-05-img28.png)


and that will conclude the configuration of the domain controller (DC).

---

*Originally published at: [https://blog.dbplatz.com/homelab-creating-a-domain-controller/](https://blog.dbplatz.com/homelab-creating-a-domain-controller/)*