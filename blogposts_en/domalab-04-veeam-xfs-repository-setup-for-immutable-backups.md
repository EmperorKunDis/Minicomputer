---
title: "Veeam XFS Repository setup for immutable backups"
source: "Domalab"
url: "https://domalab.com/2021/10/29/veeam-xfs-repository/"
date: "October 29, 2021"
author: "Michele Domanico"
tag: "vmware"
categories: "Data Protection, Backup & Recovery, Veeam"
---

# Veeam XFS Repository setup for immutable backups

> **Source:** [Domalab](https://domalab.com/2021/10/29/veeam-xfs-repository/)  
> **Date:** October 29, 2021  
> **Author:** Michele Domanico  
> **Tag:** `vmware`

---

The [first article](https://atomic-temporary-105482340.wpcomstaging.com/linux-ubuntu-setup/) and [video](https://youtu.be/1UrFiBMYrWM) in the series were showing the steps about preparing a linux ubuntu machine for a Veeam XFS Repository to serve immutable backups. In this second part the video covers the actual steps of making the linux machine “Veeam ready” by adding this one as a Managed Veeam Server. In practical terms what this part does is to make sure the minimum prerequisites are up and running. Essentially the SSH service to install the components and the Perl modules.


It is important to notice that the SSH is initially required for the first deployment. At a later stage the best practice is to disable this service on this box if not otherwise strictly required. In addition, Veeam has the capability of using a local user with Single-Use credentials. This prevents Veeam to store any credentials in its database and talk to the host machine with server certificates instead. Veeam does not require SSH to communicate with the host server as long as the Veeam components (Data Mover Service) is installed. Communication ports can be customised too.


In order to install the components via SSH, the Veeam installer will initially connect to the host server via SSH and leverage the following Perl modules:


- Constant

- Carp

- Cwd

- Data::Dumper

- Encode

- Encode::Alias

- Encode::Config

- Encode::Encoding

- Encode::MIME::Name

- Exporter

- Exporter::Heavy

- File::Path

- File::Spec

- File::Spec::Unix

- File::Temp

- List::Util

- Scalar::Util

- SOAP::Lite

- Socket

- Storable

- Threads


At the time of ubuntu 16.04 it was required a manual install of these modules as already covered in a [previous article](https://atomic-temporary-105482340.wpcomstaging.com/linux-backup-repository-veeam/). The great news is the current version of ubuntu 20.04 has all these Perl modules already installed. If for whatever reasons this is not the case or maybe using another distro these are not installed by default it is important to enabled the compatibility of Perl with x86 even if running in a x64 operating system. The video shows how to quickly check the version and location of Perl.


Once these components are up and running the Veeam wizard to add the ubuntu machine as Veeam Managed Server is very quick and easy to follow. When possible it is highly recommended to use the Single-Use as opposed to the traditional ones. One more thing to consider is that the same linux machine cannot be used as Veeam Repository and also as Backup Proxy. And this is primarily for security reasons where is not possible to mix standard (Data Mover) and hardened (Data Mover) together.


Next step is to add a new Veeam XFS Repository following the usual wizard and choosing the newly created mount point on the newly linux Veeam Managed Server. This process is not different from the usual ones in the Veeam console. It adds the ability to check both data de-duplication and immutability for the desired period. The XFS provides both capabilities and Veeam leverages these without the need of adding any extra layer or adding any appliance. Actually Veeam can run immutable backups on top of any commodity hardware supported by the chosen linux distribution.


Last important steps after creating the new Veeam Hardened Repository is to remove the linux user from the sudo group or equivalent (this prevents bad actors to run admin tasks) and disable the SSH access too (this prevents event the root account to access the linux server). Ideally only a local console (similar to ILO, iDRAC and others) should be able to access the linux server. In addition, for added security and auditing purposes it is recommended to install 2FA app on the linux server which would send a notification in case of remote access to the server.


Finally in the last part of the video the creation of a test backup job storing data on the Veeam Hardened Repository. It will not make any change and/or deletion even to Veeam admin managing the console.

---

*Originally published at: [https://domalab.com/2021/10/29/veeam-xfs-repository/](https://domalab.com/2021/10/29/veeam-xfs-repository/)*