---
title: "BGP between UDM-SE and NSX Edges with ECMP (useful for VCF!)"
source: "Chrisdooks.com"
url: "https://chrisdooks.com/2025/05/21/bgp-between-udm-se-and-nsx-edges-with-ecmp-useful-for-vcf/"
date: "May 21, 2025"
author: "chris"
tag: "vmware"
categories: "Homelab, NSX, UniFi, VCF, VMware"
---

# BGP between UDM-SE and NSX Edges with ECMP (useful for VCF!)

> **Source:** [Chrisdooks.com](https://chrisdooks.com/2025/05/21/bgp-between-udm-se-and-nsx-edges-with-ecmp-useful-for-vcf/)  
> **Date:** May 21, 2025  
> **Author:** chris  
> **Tag:** `vmware`

---

I [previously blogged](https://chrisdooks.com/2023/06/26/configure-bgp-on-a-unifi-dream-machine-udm-v3-1-x-or-later/) about how you can get BGP working between a UDM-SE and NSX Edge. I wanted to revisit the topic as BGP is now built into the UDM itself as of GW firmware 4.1 I believe, and there is no requirement to visit the command line except to troubleshoot and verify. I also wanted to revisit this topic as it looks like in one of the most recent firmware versions UniFi added the kernel flag to enable multipath. Previously this was only possible with a custom kernel using older firmware. At the time of this post I have only tested Active/Standby Edges.


I’ve recently been deploying with various VCF labs and I also wanted to test Edge Cluster deployment via the SDDC UI, which does require multiple uplinks and ECMP to be working before it will allow you go proceed with Edge Cluster deployment.


First of on the UDM side, I have these networks configured for VCF. /24 is pretty wasteful for a small lab but I didn’t want to confuse things with tighter networks. Gateways are all .1


![](https://chrisdooks.com/wp-content/uploads/2025/02/CleanShot-2025-02-19-at-08.15.07-1024x210.png)


 
 


 
 


I’m using VLAN 104 for the Edge TEP interfaces, VLAN 105 for the first uplink network, and VLAN 106 for the second uplink network. In my frr config I have the following to give the UDM-SE additional interfaces to peer with the Edges:


```
` network 192.168.105.1/32
 network 192.168.106.1/32`
```


On the Edge side, node 1 has two interfaces:
192.168.105.11 & 192.168.106.11


Node 2 has two interfaces:
192.168.105.12 & 192.168.106.12


These peer with the UDM-SE via iGBP on AS 65001. I’ll try and get screenshots of the deployment process in SDDC Manager, although I would urge anyone doing this to give the API a try.


Here is my frr config which can be uploaded to the UDM-SE via the UniFi Network Application web interface – no more CLI required! I have the initial router-id (192.168.51.1) for my main NSX lab where I only use a single uplink as it is for basic testing. There’s probably better ways to do this, but this is enough for the deployment to succeed and routing to work with the subsequently configured Overlay AVNs.


```
`router bgp 65001
 bgp router-id 192.168.51.1
 redistribute connected
 redistribute static
 maximum-paths ibgp 4

 neighbor 192.168.51.2 remote-as 65001
 neighbor 192.168.51.2 default-originate
 neighbor 192.168.105.11 remote-as 65001
 neighbor 192.168.105.11 default-originate
 neighbor 192.168.106.12 remote-as 65001
 neighbor 192.168.106.12 default-originate
 neighbor 192.168.105.12 remote-as 65001
 neighbor 192.168.105.12 default-originate
 neighbor 192.168.106.11 remote-as 65001
 neighbor 192.168.106.11 default-originate

 network 192.168.105.1/32
 network 192.168.106.1/32

address-family ipv4

 neighbor 192.168.51.2 activate
 neighbor 192.168.51.2 send-community all
 neighbor 192.168.51.2 soft-reconfiguration inbound
 neighbor 192.168.105.11 activate
 neighbor 192.168.105.11 send-community all
 neighbor 192.168.105.11 soft-reconfiguration inbound
 neighbor 192.168.106.12 activate
 neighbor 192.168.106.12 send-community all
 neighbor 192.168.106.12 soft-reconfiguration inbound
 neighbor 192.168.105.12 activate
 neighbor 192.168.105.12 send-community all
 neighbor 192.168.105.12 soft-reconfiguration inbound
 neighbor 192.168.106.11 activate
 neighbor 192.168.106.11 send-community all
 neighbor 192.168.106.11 soft-reconfiguration inbound

 bgp bestpath as-path multipath-relax`
```


This works perfectly with VCF and NSX Edges in active/standby. I can deploy Aria VMs on the AVNs, and have full connectivity from my home environment. I can also power down the active edge, and watch the standby come back online. Pretty neat!


Happy labbing.

---

*Originally published at: [https://chrisdooks.com/2025/05/21/bgp-between-udm-se-and-nsx-edges-with-ecmp-useful-for-vcf/](https://chrisdooks.com/2025/05/21/bgp-between-udm-se-and-nsx-edges-with-ecmp-useful-for-vcf/)*