---
title: "PowerCLI 13 installation hurdles on Linux"
source: "Zuthof.nl Blog"
url: "https://blog.zuthof.nl/2024/01/04/powercli-13-installation-hurdles-on-linux/"
date: "January 4, 2024"
author: "Daniël Zuthof"
tag: "vmware"
categories: "Homelab, Linux, PowerCLI, PowerShell, VMware"
---

# PowerCLI 13 installation hurdles on Linux

> **Source:** [Zuthof.nl Blog](https://blog.zuthof.nl/2024/01/04/powercli-13-installation-hurdles-on-linux/)  
> **Date:** January 4, 2024  
> **Author:** Daniël Zuthof  
> **Tag:** `vmware`

---

In November 2022, I wrote a post on my endeavor about installing PowerCLI on my Windows box. I needed PowerCLI 13 ImageBuilder feature, which was the only way to add the **[USB Network Native Driver for ESXi](https://flings.vmware.com/usb-network-native-driver-for-esxi)** fling to a custom ESXi ISO image.


Check these posts here:


**[PowerCLI 13 update and installation hurdles on Windows](https://zuthof.nl/2022/11/30/powercli-13-update-and-installation-hurdles-on-windows/)**


**[Create ESXi 8 Customized ISO Installer](https://zuthof.nl/2022/12/07/create-esxi-8-customized-iso-installer/)**


Over a year has passed and I wanted to do the same on my **[Ubuntu 23.10 (Mantic Minotaur)](https://releases.ubuntu.com/mantic/)** based Linux laptop. I quickly found out it’s the same hassle with little documentation from VMware.


Installing PowerCLI is the easy part. Configuring it to create ESXi ISO’s with ImageBuilder is another thing. This post shows you how to install PowerCLI and configure Python and OpenSSL.


### Required software


**[PowerCLI 13.2.1](https://blogs.vmware.com/PowerCLI/2023/11/introducing-powercli-13-2.html)** (which is the latest at time of writing, released 27 November 2023) **[requires](https://developer.vmware.com/doc/preview?id=19320)** the following software:


- Python 3.7.1 or later, including pip and some additional packages

six


- psutil


- lxml


- pyopenssl


- OpenSSL 1.1 or later


- PowerShell 7.x


.Net Core 3.1


### Installing prerequisite software


The important thing here is to install all the required software from the Ubuntu repositories to prevent breaking package dependencies. Make sure to first update your Ubuntu system with the latest updates before going ahead.


#### Install Python and related packages


In my case Python 3.11 was already installed, but not all the **[additional Python packages](https://developer.vmware.com/docs/15315/GUID-9081EBAF-BF85-48B1-82A0-D1C49F3FF1E8.html)**. Install them via:


```
`user@host:~$ **sudo apt install python3 python3-pip python3-six python3-psutil python3-lxml python3-openssl**`
```


#### Downgrade OpenSSL


All Ubuntu versions as of 22.04 (Jammy Jellyfish) are using OpenSSL 3.x packages. ImageBuilder in PowerCLI only supports OpenSSL 1.1.x. If not, an error is thrown which pretty much says that OpenSSL 1.1.x is not installed.


**[VMware KB 93110: ImageBuilder Error – “failing to load VibSign Python module](https://kb.vmware.com/s/article/93110)**


The full error message is:


```
`Get-DepotBaseImages: Failed to initialize the VMware.ImageBuilder PowerCLI module because of error: Failed to load VibSign Python module. Make sure OpenSSL 1.1 is installed.

Make sure that Python 3.7.1 or higher is installed and that you have set the path to the Python executable by using Set-PowerCLIConfiguration -PythonPath <executable_path>. See the PowerCLI Compatibility Matrixes for information on the Python requirements.`
```


The workaround for this is to downgrade the OpenSSL packages to 1.1.x using Ubuntu Focal packages. Secondly the downgraded version need to be holded, so they’re not upgraded during the next Ubuntu patch cycle.


Be aware that the holded OpenSSL packages are not updated anymore and software that expects OpenSSL 3.x could throw errors.


##### 1: Download old OpenSSL packages


```
`[openssl_1.1.1f-1ubuntu2.20_amd64.deb](https://packages.ubuntu.com/focal/amd64/openssl/download)
[libssl-dev_1.1.1f-1ubuntu2.20_amd64.deb](https://packages.ubuntu.com/focal/amd64/libssl-dev/download)
[libssl1.1_1.1.1f-1ubuntu2.20_amd64.deb](https://packages.ubuntu.com/focal/amd64/libssl1.1/download)`
```


##### 2: Install replace OpenSSL packages


```
`**sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.20_amd64.deb
sudo dpkg -i libssl-dev_1.1.1f-1ubuntu2.20_amd64.deb
sudo dpkg -i openssl_1.1.1f-1ubuntu2.20_amd64.deb**`
```


##### 3: Hold OpenSSL packages to prevent updates


```
`**sudo apt-mark hold libssl1.1
sudo apt-mark hold libssl-dev
sudo apt-mark hold openssl**`
```


#### Install PowerShell


There are two ways to install PowerShell on Ubuntu.


##### Option 1: Via packages


The first is to use the package based variant as described in the PowerShell documentation.


**[Installing PowerShell on Ubuntu](https://learn.microsoft.com/en-us/powershell/scripting/install/install-ubuntu?view=powershell-7.4)**


##### Option 2: Via Snaps


The second variant is to install PowerShell via Ubuntu App Center and search for *PowerShell*. This way, PowerShell is installed as a **[Snap](https://ubuntu.com/core/services/guide/snaps-intro)**.


[

![](https://zuthof.nl/wp-content/uploads/2024/01/powershell-snap-1024x449.png)

](https://zuthof.nl/wp-content/uploads/2024/01/powershell-snap.png)


Either way works, it’s up to you.


### Install and configure PowerCLI


The installation of PowerCLI itself is pretty simple and is described in the documentation.


**[PowerCLI User’s Guide – Install PowerCLI](https://developer.vmware.com/docs/15315/GUID-ACD2320C-D00F-4CCE-B968-B3C41A95C085.html)**


Now a couple of settings need to be configured in PowerShell.


#### 1: Configure response to untrusted certificates


For Linux, only the “*Fail*” and “*Ignore*” options are supported as mentioned in the documentation.


**[PowerCLI User’s Guide – Configure the PowerCLI Response to Untrusted Certificates](https://developer.vmware.com/docs/15315/GUID-875C2A87-0AC9-4B28-9361-5B283AFE114E.html)**


Let’s go for “*Fail*” which is the safest option:


```
`user@host:~$ **pwsh**
PowerShell 7.4.0
PS /home/user> **Set-PowerCLIConfiguration -InvalidCertificateAction Fail**
`
```


#### 2: Configure Python Path


First determine the Python path.


```
`user@host:~$ **which python3**
/usr/bin/python3`
```


Second configure the Python path and exit PowerShell afterwards.


```
`user@host:~$ **pwsh**
PowerShell 7.4.0
PS /home/user> **Set-PowerCLIConfiguration -PythonPath /usr/bin/python3**
...
PS /home/user> **exit**
user@host:~$ `
```


#### 3: Get rid of the CEIP message


Set the VMware Customer Experience Improvement Program (CEIP) message to *“true”* or “*false”*. Personally I prefer *“false”*.


```
`user@host:~$ **pwsh**
PowerShell 7.4.0
PS /home/user> **Set-PowerCLIConfiguration -ParticipateInCeip $false**`
```


### Using ImageBuilder


All steps are now done to get ImageBuilder working in Ubuntu. To test if an ESXi Base Image can be read from a ZIP based Depot, I’ve download the latest ESXi 8 patch to test.


#### Show the ESXi Base Image


```
`PS /home/user> Get-DepotBaseImages -Depot /home/user/Downloads/VMware-ESXi-8.0U2-22380479-depot.zip

**Version Vendor Release date
------- ------ ------------
8.0.2-0.0.22380479 VMware, Inc. 09/21/2023 00:00:00**`
```


That looks just fine. If any of the previous step were not performed, an error would be thrown by now.


To go ahead and create custom ISO file, take a look at my previous post below.


**[Create ESXi 8 Customized ISO Installer](https://zuthof.nl/2022/12/07/create-esxi-8-customized-iso-installer/)**


### To conclude


For getting PowerCLI ImageBuilder to work, I needed to read quite some blogs and documentation pages. Getting something so “basic” to work should not be needed.


Anyway, I hope it helps fixing you issues with PowerCLI on your favorite Ubuntu version.


Cheers, Daniël


### Useful links


#### Related Info on my blog


**[PowerCLI 13 update and installation hurdles on Windows](https://zuthof.nl/2022/11/30/powercli-13-update-and-installation-hurdles-on-windows/)**


**[Create ESXi 8 Customized ISO Installer](https://zuthof.nl/2022/12/07/create-esxi-8-customized-iso-installer/)**


#### Fixing the issues


**[TizuTech Blog – Installing VMware PowerCLI on Linux or macOS](https://tizutech.com/installing-vmware-powercli-on-linux-or-macos/)**


**[GeeksforGeeks Blog – How to Install Python Six Module on Linux](https://www.geeksforgeeks.org/how-to-install-python-six-module-on-linux/)**


**[DeviceTest Website – Use OpenSSL 1.1.1 in Ubuntu 22.04](https://devicetests.com/using-openssl-ubuntu)**


**[StackOverflow – How do I know python path on linux ubuntu](https://stackoverflow.com/questions/20424111/how-do-i-know-python-path-on-linux-ubuntu)**


**[AskUbuntu – How to prevent updating of a specific package](https://askubuntu.com/questions/18654/how-to-prevent-updating-of-a-specific-package)**


#### PowerShell Info


**[PowerShell documentation – Install PowerShell on Ubuntu](https://learn.microsoft.com/en-us/powershell/scripting/install/install-ubuntu?view=powershell-7.4)**


#### PowerCLI Info


**[PowerCLI 13.2 release blog](https://blogs.vmware.com/PowerCLI/2023/11/introducing-powercli-13-2.html)**


**[PowerCLI 13.2.1 change log](https://developer.vmware.com/docs/15353/#VMware%20PowerCLI%20Change%20Log-VMware%20PowerCLI%2013.2.1)**


**[PowerCLI Compatibility Matrixes](https://developer.vmware.com/doc/preview?id=19320)**


**[PowerCLI documentation](https://developer.vmware.com/docs/15315/powercli-user-s-guide/GUID-ACD2320C-D00F-4CCE-B968-B3C41A95C085.html)**


**[PowerCLI Documentation – Install Python on Windows](https://developer.vmware.com/docs/15315/powercli-user-s-guide/GUID-F98FF88D-D31F-48F0-8C3A-1C6492CD8AFB.html)**


![Avatar placeholder](images/zuthof-03-img02.jpg)

---

*Originally published at: [https://blog.zuthof.nl/2024/01/04/powercli-13-installation-hurdles-on-linux/](https://blog.zuthof.nl/2024/01/04/powercli-13-installation-hurdles-on-linux/)*