---
title: "Hands On with the Gigabyte Maple Ridge Thunderbolt 4 Card"
source: "Chris Bergeron's"
url: "https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/"
date: "August 23, 2021"
tag: "homelab"
categories: "Homelab, linux, thunderbolt, thunderbolt4, gigabyte"
---

# Hands On with the Gigabyte Maple Ridge Thunderbolt 4 Card

> **Source:** [Chris Bergeron's](https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/)  
> **Date:** August 23, 2021  
> **Tag:** `homelab`

---

[Chris Bergeron](https://chrisbergeron.com/)
 [Chris Bergeron
 

![Chris Bergeron](images/chrisbergeron-05-img01.png)

](https://chrisbergeron.com)
 [https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/](https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/)
 
 

![chris Bergeron](/chrisbergeron.png)


 [real@chrisbergeron.com](mailto:real@chrisbergeron.com)
 [Public PGP key](/pubkey.txt)
 
 

 


 Posted 08-23-2021Updated 09-02-2021[Homelab](/categories/Homelab/)
 
 

## Hands On with the Gigabyte Maple Ridge Thunderbolt 4 Card


 


 I’ve been exploring Thunderbolt quite a bit lately. As a follow up to my post about [using Thunderbolt in a NAS](/2021/07/25/Ultra-fast-Thunderbolt-NAS-with-Apple-M1-and-Linux/), I recently bought a Gigabyte Maple Ridge Thunderbolt 4 add on card. I’ve captured a few thoughts, observations and pics here.
 

## [](#Gigabyte-GC-Maple-Ridge)[Gigabyte GC-Maple Ridge](https://www.gigabyte.com/Motherboard/GC-MAPLE-RIDGE-rev-10#kf)


 

![GC-Maple Ridge Thunderbolt 4 Add-on Card](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)

 
 

## [](#Observations)Observations


 

### [](#Physical-Characteristics)Physical Characteristics


 The first thing I noticed about this card is that it’s nearly identical to it’s cousin, the Thunderbolt 3 Titan Ridge Card:
 

![GC-Maple Ridge](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


 The actual form factor is identical, including the etching on the PCI brackets. Under the aluminum shroud, however, lay obvious differences. Most relevant among them is the [Intel Thunderbolt&trade; JHL8540 Controller](https://ark.intel.com/content/www/us/en/ark/products/193684/intel-jhl8540-thunderbolt-4-controller.html) IC:
 

![JHL8540 Thunderbolt 4 Controller](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


 Additionally, the addition of a 100 Watt power delivery controller (*I think*):
 

![100 Watt power delivery controller](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


 I did not need to short the pins on the TB_HEADER that I did [in my previous post](/2021/07/25/Ultra-fast-Thunderbolt-NAS-with-Apple-M1-and-Linux/#Adding-a-Thunderbolt-4-PCIe-Add-on-Card) for the Titan Ridge card. I simply inserted the card into the server and booted it up. I haven’t made any BIOS changes either. I wanted to visually inspect the pinouts before shorting the pins, hence why I took pictures and removed the cover plate (shroud).
 I’m going to install the connector with the pins shorted (ground tied?) to see if anything changes with regards to capability or recognized features.
 

### [](#Operating-System-Support-Linux)Operating System Support (Linux)


 In Linux (Centos 7) the device was recognized as seen by the output from `lspci`:
 
 
 
 
```
1
2
3
4
5
6
7

```

 
```
02:00.0 PCI bridge: Intel Corporation Thunderbolt 4 Bridge [Maple Ridge 4C 2020] (rev 02)
03:00.0 PCI bridge: Intel Corporation Thunderbolt 4 Bridge [Maple Ridge 4C 2020] (rev 02)
03:01.0 PCI bridge: Intel Corporation Thunderbolt 4 Bridge [Maple Ridge 4C 2020] (rev 02)
03:02.0 PCI bridge: Intel Corporation Thunderbolt 4 Bridge [Maple Ridge 4C 2020] (rev 02)
03:03.0 PCI bridge: Intel Corporation Thunderbolt 4 Bridge [Maple Ridge 4C 2020] (rev 02)
04:00.0 USB controller: Intel Corporation Thunderbolt 4 NHI [Maple Ridge 4C 2020]
06:00.0 USB controller: Intel Corporation Thunderbolt 4 USB Controller [Maple Ridge 4C 2020]

```

 
 
 
 Since this card is Thunderbolt 4, it uses the thunderbolt and xhci_hcd kernel modules for the **USB4 Host Controller.** 
 `04:00.0 USB controller: Intel Corporation Thunderbolt 4 NHI [Maple Ridge 4C 2020] (prog-if 40 [USB4 Host Interface])`
 
`06:00.0 USB controller: Intel Corporation Thunderbolt 4 USB Controller [Maple Ridge 4C 2020] (prog-if 30 [XHCI])`
 I’ll explore that further and document it eventually.
 Here’s another pci tree view (`lspci -tv`):
 
 
 
 
```
1
2
3
4
5

```

 
```
\-[0000:00]-+-00.0 Intel Corporation Xeon E7 v3/Xeon E5 v3/Core i7 DMI2
 +-01.1-[02-07]----00.0-[03-07]--+-00.0-[04]----00.0 Intel Corporation Thunderbolt 4 NHI [Maple Ridge 4C 2020]
 | +-01.0-[05]--
 | +-02.0-[06]----00.0 Intel Corporation Thunderbolt 4 USB Controller [Maple Ridge 4C 2020]
 | \-03.0-[07]--

```

 
 
 
 Verbose output (`lspci -vvv`) can be [viewed here.](lspci-vvv-thunderbolt4-maple-ridge.txt)
 Here is the system device tree:
 
 
 
 
```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17

```

 
```
[user@nas-04:/sys/bus/thunderbolt] $ tree
.
├── devices
│ ├── 0-0 -> ../../../devices/pci0000:00/0000:00:01.1/0000:02:00.0/0000:03:00.0/0000:04:00.0/domain0/0-0
│ ├── 0-1 -> ../../../devices/pci0000:00/0000:00:01.1/0000:02:00.0/0000:03:00.0/0000:04:00.0/domain0/0-0/0-1
│ ├── 0-1.0 -> ../../../devices/pci0000:00/0000:00:01.1/0000:02:00.0/0000:03:00.0/0000:04:00.0/domain0/0-0/0-1/0-1.0
│ └── domain0 -> ../../../devices/pci0000:00/0000:00:01.1/0000:02:00.0/0000:03:00.0/0000:04:00.0/domain0
├── drivers
│ └── thunderbolt-net
│ ├── 0-1.0 -> ../../../../devices/pci0000:00/0000:00:01.1/0000:02:00.0/0000:03:00.0/0000:04:00.0/domain0/0-0/0-1/0-1.0
│ ├── bind
│ ├── module -> ../../../../module/thunderbolt_net
│ ├── uevent
│ └── unbind
├── drivers_autoprobe
├── drivers_probe
└── uevent

```

 
 
 
 I grabbed a dump of the nvm firmware at `/sys/bus/thunderbolt/devices/0-0/nvm_active0` using `dd`. I parsed it through various tools (`od`, `strings`, `binwalk`) but didn’t see anything notable. I also looked at it visually with `mc` just for grins.
 Here’s some other miscellaneous output:
 
 
 
 
```
1
2
3
4
5
6
7
8
9
10
11

```

 
```
root@nas-04:/sys/bus/thunderbolt/devices/0-0 # cat nvm_version
28.0

root@nas-04:/sys/bus/thunderbolt/devices/0-0 # cat vendor_name
GIGABYTE

root@nas-04:/sys/bus/thunderbolt/devices/0-0 # cat generation
4

root@nas-04:/sys/bus/thunderbolt/devices/0-0 # cat device_name
GC-MAPLE RIDGE

```

 
 
 
 I expect that since Centos 7 with Linux Kernel latest (at the time of this writing: `5.13.4-1.el7.elrepo.x86_64`) discovered the device, it should work in most Linux distributions with a newer linux kernel and fresh userspace tools.
 

## [](#Benchmarks)Benchmarks


 

### [](#Networking-Capability)Networking Capability


 I still only see about **16.8** Gigabit/sec when using the Thunderbolt4 network interface:
 
 
 
 
```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20

```

 
```
root@nas-04:~ # iperf3 -c 10.10.10.2
Connecting to host 10.10.10.2, port 5201
[ 4] local 10.10.10.4 port 34898 connected to 10.10.10.2 port 5201
[ ID] Interval Transfer Bandwidth Retr Cwnd
[ 4] 0.00-1.00 sec 1.91 GBytes 16.4 Gbits/sec 0 3.76 MBytes
[ 4] 1.00-2.00 sec 1.94 GBytes 16.7 Gbits/sec 0 3.76 MBytes
[ 4] 2.00-3.00 sec 1.95 GBytes 16.8 Gbits/sec 0 3.76 MBytes
[ 4] 3.00-4.00 sec 1.94 GBytes 16.7 Gbits/sec 0 3.94 MBytes
[ 4] 4.00-5.00 sec 1.95 GBytes 16.8 Gbits/sec 0 3.94 MBytes
[ 4] 5.00-6.00 sec 1.95 GBytes 16.8 Gbits/sec 0 3.94 MBytes
[ 4] 6.00-7.00 sec 1.95 GBytes 16.7 Gbits/sec 0 3.94 MBytes
[ 4] 7.00-8.00 sec 1.95 GBytes 16.8 Gbits/sec 0 3.94 MBytes
[ 4] 8.00-9.00 sec 1.94 GBytes 16.7 Gbits/sec 0 3.94 MBytes
[ 4] 9.00-10.00 sec 1.95 GBytes 16.8 Gbits/sec 0 3.94 MBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval Transfer Bandwidth Retr
[ 4] 0.00-10.00 sec 19.4 GBytes 16.7 Gbits/sec 0 sender
[ 4] 0.00-10.00 sec 19.4 GBytes 16.7 Gbits/sec receiver

iperf Done.

```

 
 
 
 I do see twice the number of lanes as compared to the Thunderbolt 3 card (**I think**):
 
 
 
 
```
1
2
3
4
5
6
7
8
9
10
11

```

 
```
root@nas-04:/sys/bus/thunderbolt/devices/0-3 # cat rx_lanes
2

root@nas-04:/sys/bus/thunderbolt/devices/0-3 # cat tx_lanes
2

root@nas-04:/sys/bus/thunderbolt/devices/0-3 # cat rx_speed
20.0 Gb/s

root@nas-04:/sys/bus/thunderbolt/devices/0-3 # cat tx_speed
20.0 Gb/s

```

 
 
 
 The PCIe limitation of 4 lanes is likely the reason for this.
 

### [](#Direct-Attached-Storage)Direct Attached Storage


 Unfortunately, I don’t have a benchmark for this yet. If you’re interested in Thunderbolt 3, you can see some [insane benchmarks using RAID-0 over here.](/2021/08/11/Fast-RAID-0-DAS-Using-Multiple-Thunderbolt-4-Busses/) I’ve connected the one of the same [aVolution Thunderbolt 3 disks](/2021/08/11/Fast-RAID-0-DAS-Using-Multiple-Thunderbolt-4-Busses/#The-aVolusion-Enclosure) to the controller using an active Thunderbolt 4 cable, but it doesn’t enumerate. I haven’t explored it beyond just seeing the outcome of plug-n-play. No dmesg output, nada. I’ll follow up on this and post an update later.
 

## [](#Additional-Pictures)Additional Pictures


 

![Maple Ridge Controller Boxed](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


 
 
 


 
 Hands On with the Gigabyte Maple Ridge Thunderbolt 4 Card
 [https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/](https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/)
 
 


 
 
 
 

##### Author


 [Chris Bergeron](https://chrisbergeron.com)
 
 
 


 
 

##### Posted on


 08-23-2021
 
 
 


 
 

##### Updated on


 09-02-2021
 
 
 


 
 

##### Licensed under


 [**](https://creativecommons.org/)[**](https://creativecommons.org/licenses/by/4.0/)[**](https://creativecommons.org/licenses/by-nc/4.0/)
 
 
 
 
 
 

#[thunderbolt](/tags/thunderbolt/)[thunderbolt4](/tags/thunderbolt4/)[gigabyte](/tags/gigabyte/)[maple ridge](/tags/maple-ridge/)[linux](/tags/linux/)

---

*Originally published at: [https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/](https://chrisbergeron.com/2021/08/23/Hands-On-with-the-Gigabyte-Maple-Ridge-Thunderbolt-4-Card/)*