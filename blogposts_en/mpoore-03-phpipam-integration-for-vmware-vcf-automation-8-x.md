---
title: "phpIPAM integration for VMware VCF Automation 8.x"
source: "mpoore.io"
url: "https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/"
date: "December 31, 2025"
tag: "vmware"
categories: "vmware"
---

# phpIPAM integration for VMware VCF Automation 8.x

> **Source:** [mpoore.io](https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/)  
> **Date:** December 31, 2025  
> **Tag:** `vmware`

---

## 
 phpIPAM integration for VMware VCF Automation 8.x
 


 


 


 
 


 


 


 
 
 31 December 2025&middot;3 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VCF Automation
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 phpIPAM
 

 
 
 
 
 


 

 
 
 
 
 

 

 
 
 

 

 

 

 
 
 


 
 

 
 
 


 
 
 


 

 

 
 

 


 

 Photo by [Kira auf der Heide](https://unsplash.com/@kadh?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/person-showing-brown-gift-box-IPx7J1n_xUc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)


 You know when you&rsquo;re looking for something that you&rsquo;re sure must exist out there on the internet somewhere? Sometimes you can&rsquo;t find it, sometimes you find something like it, and sometimes you find it but it&rsquo;s not quite right. Maybe it doesn&rsquo;t work how you want it to, hasn&rsquo;t been updated or maintained, perhaps it doesn&rsquo;t have any documentation (which is all too common). That&rsquo;s what this brief article is about!


I have been kind of quiet lately, but that doesn&rsquo;t mean that I haven&rsquo;t been busy. Quite the opposite in fact! After my summer holiday (vacation) I was working on another project for which I needed to test with machines created with static IP addresses. If you&rsquo;re at all familiar with VMware VCF Automation (formerly VMware Aria Automation) then you know that you can use its built-in IPAM provider to hand out static IP addresses to provisioned VMs fairly easily. Since I have phpIPAM running in my homelab though, I thought that it&rsquo;s be nicer to integrate with that.
A bit of searching later and I had found a couple of older implementations that hadn&rsquo;t been updated for some time. One didn&rsquo;t seem to install or work properly and documentation was very thin on the ground. Inevitably I got a little sidetracked from my original work and started looking at the IPAM SDK for VCF Automation and the API Guide for phpIPAM. Could I do better and brush up on my Python programming skills at the same time?
The answer was yes, and I made sure to write some slighty more comprehensive documentation too!


![Screenshot showing the selection of the phpIPAM provider.](/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/images/image1.png)


*Figure 1: Selecting the phpIPAM provider for use as a new IPM integration in VCF Automation 8.x.*

Once I had a basic version working, I wanted to make sure that it was possible to filter networks as well as enable on-demand networking in conjunction with VMware NSX as well. In the end there are a number of customisable options available.


![Screenshot showing the customisable integration options.](/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/images/image2.png)


*Figure 2: The integration configuration page showing examples for subnet filtering and on-demand network configuration.*

Overall I&rsquo;m very pleased with the finished solution. I&rsquo;ve been meaning to write about it for a couple of months now, but then I got sidetracked by what I was originally trying to do again! So now I&rsquo;m presenting it as an end of year gift to anyone that uses VCF Automation 8.x and would like to use phpIPAM as well. Just head to the repository below to get started.
[
 

 
 
 

 
 

 


 
 
 mpoore/phpipam-vcf-automation
 
 

 
 This integration allows VMware VCF Automation 8.x to use phpIPAM for assigning static IP addresses to provisioned virtual machines and on-demand networks.
 

 

 
 
 Python 
 

 
 

 
 
 


 
 
 0
 

 
 

 
 
 


 
 
 0
 

 

 
 
](https://github.com/mpoore/phpipam-vcf-automation)

 
 
 
 
 
 

 
 
 
 
 
 
 [
 

 
 

 


 ](https://www.linkedin.com/shareArticle?mini=true&url=https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/&title=phpIPAM%20integration%20for%20VMware%20VCF%20Automation%208.x)
 
 
 
 [
 

 
 
 


 ](https://bsky.app/intent/compose?text=phpIPAM%20integration%20for%20VMware%20VCF%20Automation%208.x&#43;https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/)
 
 
 
 [
 

 
 
 


 ](https://twitter.com/intent/tweet/?url=https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/&text=phpIPAM%20integration%20for%20VMware%20VCF%20Automation%208.x)
 
 
 
 [
 

 
 

 


 ](https://reddit.com/submit/?url=https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/&resubmit=true&title=phpIPAM%20integration%20for%20VMware%20VCF%20Automation%208.x)
 
 
 
 [
 

 
 

 


 ](https://pinterest.com/pin/create/bookmarklet/?url=https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/&description=phpIPAM%20integration%20for%20VMware%20VCF%20Automation%208.x)
 
 
 
 [
 

 
 

 


 ](/cdn-cgi/l/email-protection#be81dcd1dac783d6cacacecd849191d3ced1d1ccdb90d7d191ced1cdcacd918c8e8c8b91ced6ced7cedfd393d7d0cadbd9ccdfcad7d1d093d8d1cc93c8d3c9dfccdb93c8ddd893dfcbcad1d3dfcad7d1d0938693c69198dfd3ce85cdcbdcd4dbddca83ced6cef7eefff39b8c8ed7d0cadbd9ccdfcad7d1d09b8c8ed8d1cc9b8c8ee8f3c9dfccdb9b8c8ee8fdf89b8c8effcbcad1d3dfcad7d1d09b8c8e8690c6)
 
 
 


 


### Related


 
 

 [
 
 
 
 
 
 

 

 
 Profile function for authenticating to VMware CCI
 

 
 


 


 


 
 
 28 January 2025&middot;2 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VCF Automation
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VMware
 

 
 
 
 
 
 Script
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 vSphere
 

 
 
 
 
 
 CCI
 

 
 
 
 
 
 LazyOps
 

 
 
 
 
 


 

 
 
 If you thought that using the vSphere plugin for kubectl required some typing, the CCI plugin requires more! Let&rsquo;s simplify that process…
 
 
 
 

 
 
 ](/posts/2025/profile-function-for-authenticating-to-vmware-cci/)

 
 

 [
 
 
 
 
 
 

 

 
 Coming Soon - My plans for 2026
 

 
 


 


 


 
 
 31 December 2025&middot;3 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Personal
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VCF
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 Packer
 

 
 
 
 
 
 HashiCorp
 

 
 
 
 
 
 Certification
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 


 

 
 
 I&rsquo;ve done a few retrospectives over the years, but I haven&rsquo;t often written about my plans for the coming year. It&rsquo;s time that I changed my approach. Besides, one of my plans is already in the oven and should be baked soon!
 
 
 
 

 
 
 ](/posts/2025/coming-soon-my-plans-for-2026/)

 
 

 [
 
 
 
 
 
 

 

 
 Deploying Argo CD as a vSphere Supervisor Service
 

 
 


 


 


 
 
 24 May 2025&middot;6 mins
 

 
 


 
 
 
 
 
 
 
 
 
 ArgoCD
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 Supervisor
 

 
 
 
 
 
 VKS
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 


 

 
 
 How to deploy Argo CD into a vSphere Supervisor namespace using the Argo CD operator Supervisor Service.
 
 
 
 

 
 
 ](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)

 


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 
 


 
 
 
 
 [
 &larr;
 &rarr;
 
 Deploying Argo CD as a vSphere Supervisor Service
 
 
 24 May 2025
 
 
 
 ](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)
 
 
 
 
 [
 
 Coming Soon - My plans for 2026
 
 
 31 December 2025
 
 
 
 &rarr;
 &larr;
 ](/posts/2025/coming-soon-my-plans-for-2026/)
 
 
 
 
 


 
 
 


 
 
 


[comments powered by Disqus](https://disqus.com)

---

*Originally published at: [https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/](https://mpoore.io/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/)*