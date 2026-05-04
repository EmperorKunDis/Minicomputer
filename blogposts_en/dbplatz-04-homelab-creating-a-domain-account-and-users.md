---
title: "HomeLab: Creating a domain account and users."
source: "DBplatz Blog"
url: "https://blog.dbplatz.com/homelab-creating-a-domain-account-and-users/"
date: "January 4, 2022"
author: "DBplatz Support"
tag: "homelab"
categories: "homelab, windows, microsoft, domaincontroller, access"
---

# HomeLab: Creating a domain account and users.

> **Source:** [DBplatz Blog](https://blog.dbplatz.com/homelab-creating-a-domain-account-and-users/)  
> **Date:** January 4, 2022  
> **Author:** DBplatz Support  
> **Tag:** `homelab`

---

![HomeLab: Creating a domain account and users.](images/dbplatz-04-img01.jpg)


In a previous article we saw [how to create a domain controller](https://blog.dbplatz.com/homelab-creating-a-domain-controller/), now let&apos;s create domain users.

Let&apos;s click on Start and then **Server Manager**.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img02.png)


Go to **Tools **and then to **Active Directory Users and Computers**.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img03.png)


Click on the **domain **(netplatz) and then go to **users **and right-click **User**.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img04.png)


Provide the details and a logon name and click next.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img05.png)


Provide a secure password 


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img06.png)


and once you click next the domain user will be created.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img07.png)


So, since the target is to use these users for [SQL Server](https://www.microsoft.com/en-GB/sql-server/sql-server-downloads), lets create a couple more.

One for the instance,


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img08.png)


and another one for the agent.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img09.png)


And as shown below, all users were created successfully.


![HomeLab: Creating a domain account and users.](images/dbplatz-04-img10.png)

---

*Originally published at: [https://blog.dbplatz.com/homelab-creating-a-domain-account-and-users/](https://blog.dbplatz.com/homelab-creating-a-domain-account-and-users/)*