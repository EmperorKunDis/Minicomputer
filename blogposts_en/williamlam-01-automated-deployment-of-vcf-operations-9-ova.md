---
title: "Automated Deployment of VCF Operations 9 OVA"
source: "WilliamLam.com"
url: "https://williamlam.com/2026/02/automated-deployment-of-vcf-operations-9-ova.html"
date: "February 27, 2026"
author: "William Lam"
tag: "vmware"
categories: "VCF Operations, VMware Cloud Foundation, VCF 9.0"
---

# Automated Deployment of VCF Operations 9 OVA

> **Source:** [WilliamLam.com](https://williamlam.com/2026/02/automated-deployment-of-vcf-operations-9-ova.html)  
> **Date:** February 27, 2026  
> **Author:** William Lam  
> **Tag:** `vmware`

---

## Automated Deployment of VCF Operations 9 OVA


02.27.2026 by [William Lam](https://williamlam.com/author/lamw) // [Leave a Comment](https://williamlam.com/2026/02/automated-deployment-of-vcf-operations-9-ova.html#respond) 

After receiving an email asking about automating the deployment of VCF Operations 9.0 using the OVA image, I remembered that I had previously written a [blog post on this topic back in 2014](https://williamlam.com/2014/12/automate-deployment-configuration-of-vrealize-operations-manager-6-0-part-1.html). Revisiting that article, it was clear the content needed to be refreshed, especially the OVF properties used within the script.
Since I have a written (not using AI) numerous deployment scripts over the years, I was able to quickly adapt the VCF Operations 9.0 changes and also enhance it a bit further.
Here is both PowerShell (using PowerCLI) and Bash Script (using OVFTool) to automate the deployment of VCF Operations 9.0 OVA


- **PowerShell** - [deploy_vcf_operations.ps1](https://github.com/lamw/vmware-scripts/blob/master/powershell/deploy_vcf_operations.ps1)

- **Bash** - [deploy_vcf_operations.sh](https://github.com/lamw/vmware-scripts/blob/master/shell/deploy_vcf_operations.sh)


[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/automate-vcf-operations-9-ova.png?resize=300%2C129&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/automate-vcf-operations-9-ova.png?ssl=1)

In addition to deploying the VCF Operations OVA, it will power on the appliance and wait for the /admin URL endpoint to be ready before completing.
**Note:** Since the bash script uses OVFTool, there is a hidden OVF property that allows you to enable SSH if you need. This option is not available with the PowerShell script.
For additional VCF Operations configurations post-deployment, you can refer to the [VCF Operations API](https://developer.broadcom.com/xapis/vcf-operations-api/latest/).


Categories // [VCF Operations](https://williamlam.com/category/vcf-operations), [VMware Cloud Foundation](https://williamlam.com/category/vmware-cloud-foundation) Tags // [VCF 9.0](https://williamlam.com/tag/vcf-9-0)

---

*Originally published at: [https://williamlam.com/2026/02/automated-deployment-of-vcf-operations-9-ova.html](https://williamlam.com/2026/02/automated-deployment-of-vcf-operations-9-ova.html)*