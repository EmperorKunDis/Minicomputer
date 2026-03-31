---
title: "Nested VCF on Minisforum MS-A2 deployment time"
source: "Chrisdooks.com"
url: "https://chrisdooks.com/2026/01/07/nested-vcf-on-minisforum-ms-a2-deployment-time/"
date: "January 7, 2026"
author: "chris"
tag: "vmware"
categories: "Homelab, VCF, VMware, homelab, minisforum"
---

# Nested VCF on Minisforum MS-A2 deployment time

> **Source:** [Chrisdooks.com](https://chrisdooks.com/2026/01/07/nested-vcf-on-minisforum-ms-a2-deployment-time/)  
> **Date:** January 7, 2026  
> **Author:** chris  
> **Tag:** `vmware`

---

I’m not going to run any benchmarks as there’s plenty of information out there, but what I’m going to do is deploy VCF on a single MS-A2 and time it, I’ve included times for deploying onto a single NUC Extreme, as well as a single Xeon host for comparison. To keep things as fair as I can, all hosts are using dual 10 GbE interfaces, and the nested VCF VMs will be deployed onto the same Datastore where no other VMs are running. The storage is a Synology iSCSI LUN, using 4x 4TB SATA SSDs in Raid 5. All devices are connected via a UniFi Aggregation Pro switch.


Just to point out, I had to enable NVMe memory tiering on all devices to support the VCF deployment due to its heavy RAM requirements.


The VCF deployment is the following spec, using VCF 5.2 GA:


$NestedESXiMGMTvCPU = “8”
$NestedESXiMGMTvMEM = “64” #GB
$NestedESXiMGMTCachingvDisk = “4” #GB
$NestedESXiMGMTCapacityvDisk = “500” #GB
$NestedESXiMGMTBootDisk = “32” #GB


Times:


Single Xeon W-1290 workstation:
PowerCLI run time – 7 minutes and 14 seconds
Cloud Builder time – 1 hour, 40 minutes, and 55 seconds
Total time – 1 hour, 48 minutes, and 9 seconds


Single NUC11 Extreme:
PowerCLI run time – 7 minutes and 9 seconds
Cloud Builder time – 2 hours, 12 minutes, and 7 seconds
Total time – 2 hours, 19 minutes, and 16 seconds
Note: I had to restart the Cloud Builder tasks a few times due to running out of CPU resources


Single MS-A2:
PowerCLI run time – Duration: 7 minutes and 11 seconds
Cloud Builder time – Total time – 1 hour, 28 minutes, and 7 seconds
Total time – 1 hour, 36 minutes, and 44 seconds


Usability wise, the nested VCF deployment feels much more responsive than on either of the other two hosts, which is not surprising as it has more cores and the CPU is a much newer generation – Zen 4 and Zen 5 really are great performers.


Hopefully the above shows how capable the Minisforum MS-A2 is. I’ve since moved to bare metal install, so I won’t be doing any more nested testing.

---

*Originally published at: [https://chrisdooks.com/2026/01/07/nested-vcf-on-minisforum-ms-a2-deployment-time/](https://chrisdooks.com/2026/01/07/nested-vcf-on-minisforum-ms-a2-deployment-time/)*