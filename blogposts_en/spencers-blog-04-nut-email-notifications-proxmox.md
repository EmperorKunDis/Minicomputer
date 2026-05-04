---
title: "NUT Email Notifications / Proxmox"
source: "Spencer's Blog"
url: "https://blog.filegarden.net/2024/03/22/nut-email-notifications-proxmox/"
date: "March 22, 2024"
author: "Spencer LeB"
tag: "selfhosted"
categories: "Linux, Proxmox, Random"
---

# NUT Email Notifications / Proxmox

> **Source:** [Spencer's Blog](https://blog.filegarden.net/2024/03/22/nut-email-notifications-proxmox/)  
> **Date:** March 22, 2024  
> **Author:** Spencer LeB  
> **Tag:** `selfhosted`

---

![](images/spencers-blog-04-img01.jpg)

 
 
 
 
 NUT Email Notifications / Proxmox
 

## NUT Email Notifications / Proxmox


 
 


 

##### ** [March 22, 2024 ](https://blog.filegarden.net/2024/03/22/nut-email-notifications-proxmox/)**
[Spencer LeB](https://blog.filegarden.net/author/sleblanc/)


 
 

 


 


#### 1. Configure Email Settings:


##### a. Install an Email Transfer Agent (MTA):


To configure NUT (Network UPS Tools) to send email alerts, you need to set up the email notification feature in the NUT configuration files. Here’s a general guide to configuring email alerts with NUT:


#### 1. Configure Email Settings:


##### a. Install an Email Transfer Agent (MTA):


You need an MTA installed on your system to send emails. Common MTAs include Postfix, Sendmail, and Exim. Ensure that your MTA is properly configured and working.


##### b. Edit `upsmon.conf`:


- Open the `upsmon.conf` file (usually located in `/etc/nut/`).


- Add or modify the following lines to configure email settings:


```
`**NOTIFYCMD "/path/to/notify.sh**"
NOTIFYFLAG ONLINE SYSLOG+WALL+EXEC
NOTIFYFLAG ONBATT SYSLOG+WALL+EXEC
NOTIFYFLAG LOWBATT SYSLOG+WALL+EXEC
NOTIFYFLAG FSD SYSLOG+WALL+EXEC
NOTIFYFLAG COMMOK SYSLOG+WALL+EXEC
NOTIFYFLAG COMMBAD SYSLOG+WALL+EXEC
NOTIFYFLAG SHUTDOWN SYSLOG+WALL+EXEC
`
```


- Replace `/path/to/notify.sh` with the path to your notification script (explained below).


- Adjust the `NOTIFYFLAG` settings based on when you want to receive email alerts.


#### 2. Create Notification Script:


Create a script to handle email notifications. Here’s a simple example of a notification script (`notify.sh`):


```
`#!/bin/bash

# Email settings
EMAIL_SUBJECT="UPS Alert"
EMAIL_RECIPIENT="your@email.com"

# UPS event data
UPSEVENT=$1
UPSID=$2
UPSTEXT=$3

# Compose email message
MESSAGE="UPS Event: $UPSEVENT\nUPS ID: $UPSID\nMessage: $UPSTEXT"

# Send email using mail command
echo -e "$MESSAGE" | mail -s "$EMAIL_SUBJECT" "$EMAIL_RECIPIENT"
`
```


Make sure the script is executable:


```
`# Change group to nut
sudo chown :nut /etc/nut/notify.sh
# Add execution
sudo chmod 774 /etc/nut/notify.sh

# Restart the NUT services
sudo systemctl restart nut-server.service
sudo systemctl restart nut-driver.service
sudo systemctl restart nut-monitor.service`
```


#### 3. Testing:


- Restart the NUT services (`upsmon` and `upsd`) after making changes to the configuration files.


- Test the UPS events to verify that email alerts are sent correctly.


#### Note:


- Ensure that your MTA is properly configured to send emails. You may need to configure the MTA to relay emails through your SMTP server.


- Monitor system logs (`/var/log/syslog`, `/var/log/messages`, etc.) for any errors or warnings related to NUT and email alerts.


- Customize the notification script and email settings according to your requirements.


By following these steps, you should be able to configure NUT to send email alerts for UPS events effectively.


Additional Sources used for this page ChatGPT and 
https://www.networkshinobi.com/nut-email-notifications/

 

 
 

**
 [Linux](https://blog.filegarden.net/category/linux/), [Proxmox](https://blog.filegarden.net/category/proxmox/), [Random](https://blog.filegarden.net/category/uncategorized/)

---

*Originally published at: [https://blog.filegarden.net/2024/03/22/nut-email-notifications-proxmox/](https://blog.filegarden.net/2024/03/22/nut-email-notifications-proxmox/)*