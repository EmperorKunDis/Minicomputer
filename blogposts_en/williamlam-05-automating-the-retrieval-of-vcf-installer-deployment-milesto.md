---
title: "Automating the Retrieval of VCF Installer Deployment Milestones"
source: "WilliamLam.com"
url: "https://williamlam.com/2026/02/automating-the-retrieval-of-vcf-installer-deployment-milestones.html"
date: "February 10, 2026"
author: "William Lam"
tag: "vmware"
categories: "VMware Cloud Foundation, VCF 9.0"
---

# Automating the Retrieval of VCF Installer Deployment Milestones

> **Source:** [WilliamLam.com](https://williamlam.com/2026/02/automating-the-retrieval-of-vcf-installer-deployment-milestones.html)  
> **Date:** February 10, 2026  
> **Author:** William Lam  
> **Tag:** `vmware`

---

## Automating the Retrieval of VCF Installer Deployment Milestones


02.10.2026 by [William Lam](https://williamlam.com/author/lamw) // [Leave a Comment](https://williamlam.com/2026/02/automating-the-retrieval-of-vcf-installer-deployment-milestones.html#respond) 

When deploying a new VMware Cloud Foundation (VCF) instance, whether converting an existing vSphere based environment or deploying a net new setup, the [VCF Installer](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/deployment/what-is-the-vcf-installer-.html) provides a graphical view of the current milestones and the individual tasks within each milestone.
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/vcf-installer-deployment-milestone-0.png?resize=300%2C171&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/vcf-installer-deployment-milestone-0-scaled.png?ssl=1)

While you likely will not sit and watch the progress of each step, you may want to retrieve the the progress programmatically, which can be accomplished by using the [VCF Installer API](https://developer.broadcom.com/xapis/vcf-installer-api/latest).
Similar to the VCF Installer UI, we can also retrieve the individual milestones and get some additional useful information such as the start and end time for a given milestone. This can be handy if you want to understand how long each milestone is taking, which is not a view you can quickly find in the UI. To understand the duration for a given milestone with the UI, you need to look at the first and last task to understand the milestone duration.

However, the VCF Installer API does provide the start and end time at the milestone level, so we can easily retrieve this information. To demonstrate the VCF Installer API, I have created the following PowerShell script [**get_vcf_installer_deployment_milestone.ps1**](https://github.com/lamw/vmware-scripts/blob/master/powershell/get_vcf_installer_deployment_milestone.ps1) which will simply requires the FQDN of the VCF Installer and the credentials for the admin user.
Here is an example screenshot where I had ran through a convergence of an existing vSphere-based deployment, displaying the same milestones as shown in the VCF Installer UI but now it includes start/end time and I was then able to use that to calculate the duration for each milestone along with aggregating the total deployment time.
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/vcf-installer-deployment-milestone-1.png?resize=300%2C76&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/vcf-installer-deployment-milestone-1-scaled.png?ssl=1)


Categories // [VMware Cloud Foundation](https://williamlam.com/category/vmware-cloud-foundation) Tags // [VCF 9.0](https://williamlam.com/tag/vcf-9-0)

---

*Originally published at: [https://williamlam.com/2026/02/automating-the-retrieval-of-vcf-installer-deployment-milestones.html](https://williamlam.com/2026/02/automating-the-retrieval-of-vcf-installer-deployment-milestones.html)*