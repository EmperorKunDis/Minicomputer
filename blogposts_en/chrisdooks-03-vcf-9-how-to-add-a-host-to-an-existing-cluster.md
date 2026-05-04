---
title: "VCF 9 – how to add a host to an existing cluster?"
source: "Chrisdooks.com"
url: "https://chrisdooks.com/2025/09/23/vcf-9-how-to-add-a-host-to-an-existing-cluster/"
date: "September 23, 2025"
author: "chris"
tag: "vmware"
categories: "Homelab, Microsoft, VCF, VCF 9, VMware"
---

# VCF 9 – how to add a host to an existing cluster?

> **Source:** [Chrisdooks.com](https://chrisdooks.com/2025/09/23/vcf-9-how-to-add-a-host-to-an-existing-cluster/)  
> **Date:** September 23, 2025  
> **Author:** chris  
> **Tag:** `vmware`

---

I’ve been experimenting with VCF 9 in my homelab recently and I’ve been trying out some day 2 activities. Invariably, with homelabs you end up having to rebuild some (or all) of it as you experiment, and I found myself in that position. I do intend on writing a blog covering how my lab is set up with VCF 9 <at some point>, but in short I have the following configuration:


VCF Mgmt Domain: 3x Minisforum MS-A2’s with vSAN ESA
VI WLD: 3x Intel NUC 11 Extreme’s with NFS storage


For whatever reason I needed to rebuild the VI WLD. I figured I’d initially add 2x hosts, and then work out in the new way of the world how to add a 3rd host. Deploying the VI WLD was simple, and once deployed I ensured that my VCF SSO user (not to be confused with vSphere SSO!) was in the vsphere.local\administrators group. Then, with vCenter Linking/groups configured, I was able to log into both the Mgmt and the VI WLDs and see the other VC like ELM in VCF 5 and below – no doubt without the associated offline snapshot ELM headaches I might add!


The next step is to log into the Management vCenter, right click on the <VI WLD> cluster, and add unassigned host (the third was already commissioned into VCF), but I faced an error message:


![](https://chrisdooks.com/wp-content/uploads/2025/09/CleanShot-2025-09-23-at-20.56.48-1024x592.png)


This reminded me a little of days gone by working with Microsoft software where you face an error and it says to speak to the administrator. I am the administrator! I looked at the documentation but couldn’t see anything definitive, I even tried ChatGPT and Grok for some assistance but given how new VCF 9 is they weren’t much help.


Looking in hosts under global inventory lists I saw the error:


![](https://chrisdooks.com/wp-content/uploads/2025/09/CleanShot-2025-09-23-at-20.57.20-1024x452.png)


I then spent a bit of time looking in VCF Operations and ensuring that everything was set up right under Administration > Access Control, but I eventually gave up and logged into SDDC Manager directly to see if I could do it there and I could! Not to be beaten, since Broadcom documentation clearly suggests it can be done in the vSphere UI, I took at look at Single Sign On and saw the vsphere.local\sddcadmins group. Clearly there is some demarkation in administrative rights regarding what you can do traditionally in vSphere as a VI admin, and SDDC Manager operations – which makes total sense as we don’t want all VI admins to be able to do host/cluster level ‘stuff’ right?


![](https://chrisdooks.com/wp-content/uploads/2025/09/CleanShot-2025-09-23-at-21.30.38-1024x443.png)


Once I added my (VCF) SSO user account to this group, and logging out and in again for good measure, I was finally presented with the add host UI via vSphere.


![](https://chrisdooks.com/wp-content/uploads/2025/09/CleanShot-2025-09-23-at-21.34.02-1024x700.png)


TL;DR – it looks like the VCF SSO user needs to be in vsphere.local\sddcadmins to be able to add a new host.


Admittedly I need to take a deeper dive into the documentation to see if this is mentioned, but figured this might help someone out.

---

*Originally published at: [https://chrisdooks.com/2025/09/23/vcf-9-how-to-add-a-host-to-an-existing-cluster/](https://chrisdooks.com/2025/09/23/vcf-9-how-to-add-a-host-to-an-existing-cluster/)*