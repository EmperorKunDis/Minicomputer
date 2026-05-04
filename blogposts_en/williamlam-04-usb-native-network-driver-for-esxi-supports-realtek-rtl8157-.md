---
title: "USB Native Network Driver for ESXi supports Realtek RTL8157 & RTL8156BG"
source: "WilliamLam.com"
url: "https://williamlam.com/2026/02/usb-native-network-driver-for-esxi-supports-realtek-rtl8157-rtl8156bg.html"
date: "February 13, 2026"
author: "William Lam"
tag: "vmware"
categories: "ESXi, vSphere 8.0, vSphere 9.0, ESXi 8.0, ESXi 9.0"
---

# USB Native Network Driver for ESXi supports Realtek RTL8157 & RTL8156BG

> **Source:** [WilliamLam.com](https://williamlam.com/2026/02/usb-native-network-driver-for-esxi-supports-realtek-rtl8157-rtl8156bg.html)  
> **Date:** February 13, 2026  
> **Author:** William Lam  
> **Tag:** `vmware`

---

## USB Native Network Driver for ESXi supports Realtek RTL8157 &#038; RTL8156BG


02.13.2026 by [William Lam](https://williamlam.com/author/lamw) // [3 Comments](https://williamlam.com/2026/02/usb-native-network-driver-for-esxi-supports-realtek-rtl8157-rtl8156bg.html#comments) 

In response to community feedback, we are excited to announce an update to the popular [**USB Native Network Driver for ESXi Fling**](https://support.broadcom.com/group/ecx/productfiles?subFamily=Flings&displayGroup=USB%20Network%20Native%20Driver%20for%20ESXi&release=ESXi%208.0%20Update%203&os=&servicePk=540079&language=EN&freeDownloads=true) . This release is currently available for ESXi 8.0 Update 3 and adds support for the latest Realtek USB devices: [RTL8157 (5GbE)](https://www.realtek.com/Download/List?cate_id=585) & [RTL8156BG (2.5GbE)](https://www.realtek.com/Download/List?cate_id=585), bringing the [total number of supported chipsets to over 25+](https://williamlam.com/2025/04/supported-chipsets-for-the-usb-network-native-driver-for-esxi-fling.html). A similar update is also planned for ESX 9.0, which will be published hopefully in the next few weeks.
Several of you have asked about specific models compatible with the latest Realtek chipset. Below are the two I am currently using for testing, which you can find the links below. If you have other recommendations that work, feel free to share them in the comments.


- [UGREEN USB-A to 2.5GbE](https://amzn.to/3Zx2udz) (RTL8156BG)

- [UGREEN USB-C to 5GbE](https://amzn.to/4ah2Bjt) (RTL8157)


[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/usb-native-network-drier-for-esxi-rtl8156bg-and-rtl8157.jpg?resize=292%2C300&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/usb-native-network-drier-for-esxi-rtl8156bg-and-rtl8157.jpg?ssl=1)


##### **Download Updated USB Native Network Driver for ESXi:**


- [USB Native Network Driver for ESXi 8.0 Update 3 ](https://support.broadcom.com/group/ecx/productfiles?subFamily=Flings&displayGroup=USB%20Network%20Native%20Driver%20for%20ESXi&release=ESXi%208.0%20Update%203&os=&servicePk=540079&language=EN&freeDownloads=true)

- USB Native Network Driver for ESX 9.0 (Coming Soon)


##### **Install using Offline Bundle:**


esxcli software component apply -d /path/to/the/ESXi803-VMKUSB-NIC-FLING-93415869-component.zip


##### **Install using Free ESXi 8.0 Update3 ISO:**


- Please see this [blog post for more details](https://williamlam.com/2026/02/installing-realtek-network-driver-fling-using-free-esxi-8-0-update-3e-iso.html).


##### **Create Customized ESXi ISO:**


- Please see this [blog post for using either vSphere Lifecycle Manager (vLCM) UI or PowerCLI with vCenter Server](https://williamlam.com/2022/11/creating-custom-esxi-images-using-vsphere-lifecycle-manager-vlcm-ui-and-powercli-cmdlets-for-vsphere-8.html)

- Please see this [blog post for using PowerCLI without vCenter Server](https://williamlam.com/2022/02/how-to-create-a-customized-esxi-iso-without-vcenter-server.html)


Categories // [ESXi](https://williamlam.com/category/esxi-2), [vSphere 8.0](https://williamlam.com/category/vsphere-8-0), [vSphere 9.0](https://williamlam.com/category/vsphere-9-0) Tags // [ESXi 8.0](https://williamlam.com/tag/esxi-8-0), [ESXi 9.0](https://williamlam.com/tag/esxi-9-0)

---

*Originally published at: [https://williamlam.com/2026/02/usb-native-network-driver-for-esxi-supports-realtek-rtl8157-rtl8156bg.html](https://williamlam.com/2026/02/usb-native-network-driver-for-esxi-supports-realtek-rtl8157-rtl8156bg.html)*