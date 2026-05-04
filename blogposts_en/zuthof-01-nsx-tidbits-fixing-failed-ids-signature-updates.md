---
title: "NSX Tidbits: Fixing failed IDS signature updates"
source: "Zuthof.nl Blog"
url: "https://blog.zuthof.nl/2024/01/15/nsx-tidbits-fixing-failed-ids-signature-updates/"
date: "January 15, 2024"
author: "Daniël Zuthof"
tag: "vmware"
categories: "Homelab, Networking, NSX, Security, VMware"
---

# NSX Tidbits: Fixing failed IDS signature updates

> **Source:** [Zuthof.nl Blog](https://blog.zuthof.nl/2024/01/15/nsx-tidbits-fixing-failed-ids-signature-updates/)  
> **Date:** January 15, 2024  
> **Author:** Daniël Zuthof  
> **Tag:** `vmware`

---

In my lab NSX Manager 4.1.x is deployed and licensed with a vExpert based NSX Enterprise evaluation license. In this case I wanted to check the IDS / IPS feature for testing. Part of the configuration consists of updating the IDS / IPS signature. Updating started with the message “*Updating IDS Signatures.*” but failed with the error “*Installation Failed.*“.


[

![](https://zuthof.nl/wp-content/uploads/2024/01/Screenshot-from-2024-01-15-14-10-10-1024x344.png)

](https://zuthof.nl/wp-content/uploads/2024/01/Screenshot-from-2024-01-15-14-10-10.png)


When this happens, the most probably reasons are:


- The NSX Manager cannot access the internet to download the signature file


- The appropriate NSX License is not added to NSX Manager or is expired


In my case it was the latter. The license “NSX Firewall with Advanced Thread Prevention” was not added to NSX Manager. It should look like this:


[

![](https://zuthof.nl/wp-content/uploads/2024/01/nsx-firewall-with-advanced-thread-protection-1024x620.jpg)

](https://zuthof.nl/wp-content/uploads/2024/01/nsx-firewall-with-advanced-thread-protection.jpg)


After adding the appropriate license, the IDS signature could be updated successfully. The current version of the signature file (in my case NSX 4.1.2) went from January 9, 2023 to January 15, 2024. Also the amount of Intrusion signatures rose from 6614 to 11574.


[

![](https://zuthof.nl/wp-content/uploads/2024/01/Screenshot-from-2024-01-15-14-19-48-1024x456.png)

](https://zuthof.nl/wp-content/uploads/2024/01/Screenshot-from-2024-01-15-14-19-48.png)


So in short, when signatures are not updating check for:


- Internet connection issues


- Correct NSX add-on license applied


- Expired NSX add-on license


The strange thing with this error is that it does not show in the UI an add-on license is required for IDS or Malvare prevention. For more information about NSX add-on licenses check the documentation in the next section.


### Useful links


**[NSX Documentation – License types](https://docs.vmware.com/en/VMware-NSX/4.1/administration/GUID-8C23836B-52A6-4014-A4E0-DC5A4C2787EF.html#GUID-8C23836B-52A6-4014-A4E0-DC5A4C2787EF)**


**[NSX Doucmentation – System Requirements for NSX IDS/IPS and NSX Malware Prevention](https://docs.vmware.com/en/VMware-NSX/4.1/administration/GUID-25376AC9-951B-4ACE-B617-820B3DA5C35B.html)**


![Avatar placeholder](images/zuthof-01-img04.jpg)

---

*Originally published at: [https://blog.zuthof.nl/2024/01/15/nsx-tidbits-fixing-failed-ids-signature-updates/](https://blog.zuthof.nl/2024/01/15/nsx-tidbits-fixing-failed-ids-signature-updates/)*