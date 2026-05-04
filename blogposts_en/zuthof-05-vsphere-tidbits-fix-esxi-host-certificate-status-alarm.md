---
title: "vSphere Tidbits: Fix ESXi Host Certificate Status alarm"
source: "Zuthof.nl Blog"
url: "https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/"
date: "December 4, 2023"
author: "Daniël Zuthof"
tag: "vmware"
categories: "Homelab, VMware, vSphere, certificate, esxi"
---

# vSphere Tidbits: Fix ESXi Host Certificate Status alarm

> **Source:** [Zuthof.nl Blog](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/)  
> **Date:** December 4, 2023  
> **Author:** Daniël Zuthof  
> **Tag:** `vmware`

---

When logging into my Lab vCenter the other day, I noticed one of my lab hosts showed an red “ESXi Host Certificate Status” alarm. That was the case because the host was 5 years connected to vCenter and therefore the hosts certificate was expired.


[

![](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-11-23-21-30-59-1024x614.png)

](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-11-23-21-30-59.png)


Luckily fixing the Host Certificate Status alarm is quite easy since the [**vSphere 6.x days**](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-ECFD1A29-0534-4118-B762-967A113D5CAA.html). Select the host and go to “Configure > System > Certificate” and use the “Renew” button.


[

![Renew ESXi Certificate](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-11-23-21-31-37-1024x360.png)

](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-11-23-21-31-37.png)


By using the “Renew” option, vCenter generates and **and** applies a new certificate to the host. During the process the host will briefly disconnected from vCenter. In my case about a second.


![Re-generated ESXi Host Certificate](https://zuthof.nl/wp-content/uploads/2023/12/Screenshot-from-2023-11-23-21-33-11-1024x306.png)


As can be seen it the latest screenshot, the certificate is renewed and lasts for another 5 years.


### Back in the days


In the vSphere 5.x and earliers days, the certificated could be generated in two ways:


- Disconnect the host from vCenter an re-connect


- On the (SSH) console of ESXi hosts re-create the certificates

Rename the certificate file and private key file


- Execute *sbin/generate-certificates*


- Restart ESXi Server management agents by executing */sbin/services.sh restart*


### Useful links


**[vSphere Documentation: Renew or Refresh ESXi Certificates](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-ECFD1A29-0534-4118-B762-967A113D5CAA.html)**

 


 
 
 Categories: [Homelab](https://blog.zuthof.nl/category/homelab/)[VMware](https://blog.zuthof.nl/category/vmware/)[vSphere](https://blog.zuthof.nl/category/vmware/vsphere/) 
 

Tags: [certificate](https://blog.zuthof.nl/tag/certificate/)[esxi](https://blog.zuthof.nl/tag/esxi/)[homelab](https://blog.zuthof.nl/tag/homelab/)[tidbits](https://blog.zuthof.nl/tag/tidbits/)[VMware](https://blog.zuthof.nl/tag/vmware/)[vSphere](https://blog.zuthof.nl/tag/vsphere/) 
 
 


 
 [
 
 ](https://www.facebook.com/sharer.php?u=https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/)
 
 [
 
 
 

 ](https://x.com/share?url=https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/&#038;text=vSphere%20Tidbits%3A%20Fix%20ESXi%20Host%20Certificate%20Status%20alarm)
 
 [
 
 ](mailto:?subject=vSphere%20Tidbits:%20Fix%20ESXi%20Host%20Certificate%20Status%20alarm&#038;body=https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/)
 
 
 
 


 
 
 
 

#### 
 4 Comments 


 
 [
 
 
 ]( )
 


 

##### 
 Petar Brcic 
 &#183; December 6, 2023 at 9:32 am 
 


 Great Daniel!

Important info regarding the issue that admins are not aware at the beginning.

And short effective operational procedure!

Thanks
 
 [
 Reply](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/?replytocom=99#respond) 
 
 
 

 


 [
 
 
 ](https://zuthof.nl )
 


 

##### 
 [Daniël Zuthof](https://zuthof.nl) 
 &#183; December 6, 2023 at 11:21 am 
 


 Thanks for the feedback, Petar. Appreciated.
 
 [
 Reply](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/?replytocom=100#respond) 
 
 
 


 


 [
 
 
 ]( )
 


 

##### 
 Tom Kristiansen 
 &#183; September 16, 2024 at 11:29 pm 
 


 Thanks for this info.
 
 [
 Reply](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/?replytocom=717#respond) 
 
 
 

 


 [
 
 
 ](https://zuthof.nl )
 


 

##### 
 [Daniël Zuthof](https://zuthof.nl) 
 &#183; September 17, 2024 at 4:29 pm 
 


 Thanks for the feedback, Tom. Appreciated.
 
 [
 Reply](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/?replytocom=719#respond) 
 
 
 


 
 


 
 

#### Leave a Reply [Cancel reply](/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/#respond)


![Avatar placeholder](images/zuthof-05-img04.jpg)


Your email address will not be published. Required fields are marked *

 Name * 


 Email * 


 Website 


 What&#039;s on your mind? 

 Save my name, email, and website in this browser for the next time I comment.


 


&#916;

---

*Originally published at: [https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/](https://blog.zuthof.nl/2023/12/04/vsphere-tidbits-fix-esxi-host-certificate-status-alarm/)*