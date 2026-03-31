---
title: "UGreen NASync DXP4800 Plus Teardown"
source: "Apalrd's Adventures"
url: "https://www.apalrd.net/posts/2024/storage_ugreen/"
date: "March 28, 2024"
tag: "homelab"
categories: "homelab"
---

# UGreen NASync DXP4800 Plus Teardown

> **Source:** [Apalrd's Adventures](https://www.apalrd.net/posts/2024/storage_ugreen/)  
> **Date:** March 28, 2024  
> **Tag:** `homelab`

---

I did a full teardown of this unit, see the video below. This page also has the &rsquo;extra info&rsquo; (pci, cpu, ..) for you.


## Video[&#8983;](#video) 


Click on the thumbnail to view the video on Youtube
[

![Thumbnail](/posts/2024/storage_ugreen/thumbnail.png)

](https://youtu.be/R8t-Wqx_E3U)


## Hardware Info[&#8983;](#hardware-info) 


All of this was taken via an Debian 12 system (Bookworm / kernel 6.1), so your kernel may be configured slightly differently


### lscpu[&#8983;](#lscpu) 


```
`Architecture: x86_64
CPU op-mode(s): 32-bit, 64-bit
Address sizes: 39 bits physical, 48 bits virtual
Byte Order: Little Endian
CPU(s): 6
On-line CPU(s) list: 0-5
Vendor ID: GenuineIntel
BIOS Vendor ID: Intel(R) Corporation
Model name: Intel(R) Pentium(R) Gold 8505
BIOS Model name: Intel(R) Pentium(R) Gold 8505 To Be Filled By O.E.M. CPU @ 4.3GHz
BIOS CPU family: 11
CPU family: 6
Model: 154
Thread(s) per core: 2
Core(s) per socket: 5
Socket(s): 1
Stepping: 4
CPU(s) scaling MHz: 13%
CPU max MHz: 4400.0000
CPU min MHz: 400.0000
BogoMIPS: 4992.00
Flags: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat
 pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx 
 pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good 
 nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni 
 pclmulqdq dtes64 monitor ds_cpl vmx est tm2 ssse3 sdbg fma cx16 xtpr 
 pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave 
 avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb ssbd ibrs 
 ibpb stibp ibrs_enhanced tpr_shadow vnmi flexpriority ept vpid ept_ad 
 fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdseed adx smap 
 clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsaves 
 split_lock_detect avx_vnni dtherm ida arat pln pts hwp hwp_notify 
 hwp_act_window hwp_epp hwp_pkg_req hfi umip pku ospke waitpkg gfni 
 vaes vpclmulqdq rdpid movdiri movdir64b fsrm md_clear serialize 
 arch_lbr ibt flush_l1d arch_capabilities
Virtualization: VT-x
L1d cache: 176 KiB (5 instances)
L1i cache: 288 KiB (5 instances)
L2 cache: 3.3 MiB (2 instances)
L3 cache: 8 MiB (1 instance)
NUMA node(s): 1
NUMA node0 CPU(s): 0-5
Vulnerability Gather data sampling: Not affected
Vulnerability Itlb multihit: Not affected
Vulnerability L1tf: Not affected
Vulnerability Mds: Not affected
Vulnerability Meltdown: Not affected
Vulnerability Mmio stale data: Not affected
Vulnerability Retbleed: Not affected
Vulnerability Spec rstack overflow: Not affected
Vulnerability Spec store bypass: Mitigation; Speculative Store Bypass disabled via prctl
Vulnerability Spectre v1: Mitigation; usercopy/swapgs barriers and __user pointer sanitization
Vulnerability Spectre v2: Mitigation; Enhanced IBRS, IBPB conditional, RSB filling, PBRSB-eIBRS SW sequence
Vulnerability Srbds: Not affected
Vulnerability Tsx async abort: Not affected
`
```
CPU is very modern with virtualization support. 1 P-core (2 threads) + 4 E-cores (4 threads) gives us the weird number of 5 cores and 6 threads. Linux is of course very good at scheduling across P/E cores.


### lspci[&#8983;](#lspci) 


```
`00:00.0 Host bridge: Intel Corporation Device 4619 (rev 04)
 IOMMU group: 1
00:02.0 VGA compatible controller: Intel Corporation Alder Lake-UP3 GT1 [UHD Graphics] (rev 0c) (prog-if 00 [VGA controller])
 IOMMU group: 0
00:06.0 PCI bridge: Intel Corporation 12th Gen Core Processor PCI Express x4 Controller #0 (rev 04) (prog-if 00 [Normal decode])
 IOMMU group: 2
00:06.2 PCI bridge: Intel Corporation 12th Gen Core Processor PCI Express x4 Controller #2 (rev 04) (prog-if 00 [Normal decode])
 IOMMU group: 3
00:0d.0 USB controller: Intel Corporation Alder Lake-P Thunderbolt 4 USB Controller (rev 04) (prog-if 30 [XHCI])
 IOMMU group: 4
00:14.0 USB controller: Intel Corporation Alder Lake PCH USB 3.2 xHCI Host Controller (rev 01) (prog-if 30 [XHCI])
 IOMMU group: 5
00:14.2 RAM memory: Intel Corporation Alder Lake PCH Shared SRAM (rev 01)
 IOMMU group: 5
00:15.0 Serial bus controller: Intel Corporation Alder Lake PCH Serial IO I2C Controller #0 (rev 01)
 IOMMU group: 6
00:16.0 Communication controller: Intel Corporation Alder Lake PCH HECI Controller (rev 01)
 IOMMU group: 7
00:1c.0 PCI bridge: Intel Corporation Device 51b8 (rev 01) (prog-if 00 [Normal decode])
 IOMMU group: 8
00:1c.4 PCI bridge: Intel Corporation Device 51bc (rev 01) (prog-if 00 [Normal decode])
 IOMMU group: 9
00:1d.0 PCI bridge: Intel Corporation Alder Lake PCI Express Root Port (rev 01) (prog-if 00 [Normal decode])
 IOMMU group: 10
00:1d.2 PCI bridge: Intel Corporation Device 51b2 (rev 01) (prog-if 00 [Normal decode])
 IOMMU group: 11
00:1f.0 ISA bridge: Intel Corporation Alder Lake PCH eSPI Controller (rev 01)
 IOMMU group: 12
00:1f.3 Audio device: Intel Corporation Alder Lake PCH-P High Definition Audio Controller (rev 01)
 IOMMU group: 12
00:1f.4 SMBus: Intel Corporation Alder Lake PCH-P SMBus Host Controller (rev 01)
 IOMMU group: 12
00:1f.5 Serial bus controller: Intel Corporation Alder Lake-P PCH SPI Controller (rev 01)
 IOMMU group: 12
02:00.0 Non-Volatile memory controller: Phison Electronics Corporation PS5013 E13 NVMe Controller (rev 01) (prog-if 02 [NVM Express])
 Subsystem: Phison Electronics Corporation PS5013-E13 PCIe3 NVMe Controller (DRAM-less)
 IOMMU group: 13
 Region 0: Memory at 80e00000 (64-bit, non-prefetchable) [size=16K]
 Capabilities: [80] Express (v2) Endpoint, MSI 00
 LnkCap: Port #1, Speed 8GT/s, Width x4, ASPM L1, Exit Latency L1 unlimited
 ClockPM- Surprise- LLActRep- BwNot- ASPMOptComp+
 LnkCtl: ASPM Disabled; RCB 64 bytes, Disabled- CommClk+
 ExtSynch- ClockPM- AutWidDis- BWInt- AutBWInt-
 LnkSta: Speed 8GT/s, Width x4
 TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
 Kernel driver in use: nvme
 Kernel modules: nvme

03:00.0 Ethernet controller: Aquantia Corp. Device 04c0 (rev 03)
 Subsystem: Aquantia Corp. Device 0001
 IOMMU group: 14
 Capabilities: [70] Express (v2) Endpoint, MSI 00
 LnkCap: Port #0, Speed 16GT/s, Width x4, ASPM not supported
 ClockPM+ Surprise- LLActRep- BwNot- ASPMOptComp+
 LnkCtl: ASPM Disabled; RCB 64 bytes, Disabled- CommClk+
 ExtSynch- ClockPM+ AutWidDis- BWInt- AutBWInt-
 LnkSta: Speed 8GT/s (downgraded), Width x2 (downgraded)
 TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
 Kernel driver in use: atlantic
 Kernel modules: atlantic

04:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller SM981/PM981/PM983 (prog-if 02 [NVM Express])
 Subsystem: Samsung Electronics Co Ltd SSD 970 EVO
 IOMMU group: 15
 Capabilities: [70] Express (v2) Endpoint, MSI 00
 LnkCap: Port #0, Speed 8GT/s, Width x4, ASPM L1, Exit Latency L1 <64us
 ClockPM+ Surprise- LLActRep- BwNot- ASPMOptComp+
 LnkCtl: ASPM Disabled; RCB 64 bytes, Disabled- CommClk+
 ExtSynch- ClockPM+ AutWidDis- BWInt- AutBWInt-
 LnkSta: Speed 8GT/s, Width x4
 TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
 Kernel driver in use: nvme
 Kernel modules: nvme

05:00.0 SATA controller: ASMedia Technology Inc. Device 1164 (rev 02) (prog-if 01 [AHCI 1.0])
 Subsystem: ASMedia Technology Inc. Device 2116
 IOMMU group: 16
 Capabilities: [80] Express (v2) Endpoint, MSI 00
 LnkCap: Port #0, Speed 8GT/s, Width x2, ASPM L0s L1, Exit Latency L0s <4us, L1 <64us
 ClockPM+ Surprise- LLActRep- BwNot- ASPMOptComp+
 LnkCtl: ASPM Disabled; RCB 64 bytes, Disabled- CommClk+
 ExtSynch- ClockPM+ AutWidDis- BWInt- AutBWInt-
 LnkSta: Speed 8GT/s, Width x2
 TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
 Kernel driver in use: ahci
 Kernel modules: ahci

06:00.0 Ethernet controller: Intel Corporation Ethernet Controller I226-V (rev 08)
 Subsystem: Intel Corporation Ethernet Controller I226-V
 IOMMU group: 17
 Capabilities: [a0] Express (v2) Endpoint, MSI 00
 LnkCap: Port #0, Speed 5GT/s, Width x1, ASPM L1, Exit Latency L1 <4us
 ClockPM- Surprise- LLActRep- BwNot- ASPMOptComp+
 LnkCtl: ASPM Disabled; RCB 64 bytes, Disabled- CommClk+
 ExtSynch- ClockPM- AutWidDis- BWInt- AutBWInt-
 LnkSta: Speed 5GT/s, Width x1
 TrErr- Train- SlotClk+ DLActive- BWMgmt- ABWMgmt-
 Kernel driver in use: igc
 Kernel modules: igc
`
```
The two NICs are an Intel i226 (2.5G) and Aquantia AQC113 (10G NBase-T). Neither are limited in PCIe bandwidth. SATA is via an ASMedia controller off PCIe. The extra NVMe drive I added (Samsung) is in a different IOMMU group, in fact both of the NICs and both of the SSDs are in their own IOMMU group if you want to pass any of them through to VMs.

 

 
 


 
 read other posts
 
 
 


 
 
 [
 ←
 Proxmox Backup Auto-Shutdown
 ](https://www.apalrd.net/posts/2024/pbs_hibernate/)
 
 
 
 
 [
 All About SUBNETTING your Networks! &#43; Setup in OPNsense
 →
 ](https://www.apalrd.net/posts/2023/opnsense_subnet/)

---

*Originally published at: [https://www.apalrd.net/posts/2024/storage_ugreen/](https://www.apalrd.net/posts/2024/storage_ugreen/)*