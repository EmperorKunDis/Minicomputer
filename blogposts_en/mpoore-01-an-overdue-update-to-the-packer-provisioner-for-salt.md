---
title: "An overdue update to the Packer Provisioner for Salt"
source: "mpoore.io"
url: "https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/"
date: "December 31, 2025"
tag: "vmware"
categories: "vmware"
---

# An overdue update to the Packer Provisioner for Salt

> **Source:** [mpoore.io](https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/)  
> **Date:** December 31, 2025  
> **Tag:** `vmware`

---

## 
 An overdue update to the Packer Provisioner for Salt
 


 


 


 
 


 


 


 
 
 31 December 2025&middot;2 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Salt
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 HashiCorp
 

 
 
 
 
 
 Packer
 

 
 
 
 
 


 

 
 
 
 
 

 

 
 
 

 

 

 

 
 
 


 
 

 
 
 


 
 
 


 

 

 
 

 


 

 Photo by [Kira auf der Heide](https://unsplash.com/@kadh?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/person-showing-brown-gift-box-IPx7J1n_xUc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)


 I began working on the Packer Provisioner for Salt in the middle of 2024 and launched the first version just as my role ended at Broadcom. At the time I had a few roadmap items that I wanted to complete. Guess what? There&rsquo;s an update!


The original post that I published at the time tells you more about the Provisioner for Salt and provides a high-level overview of Salt. If you&rsquo;re not familiar with it, I&rsquo;d suggest starting there.


 
 
 
 


 [
 
 
 
 
 
 
 
 Introducing the Packer Provisioner for Salt
 
 
 
 
 
 


 


 


 
 
 26 June 2024&middot;9 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Projects
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Salt
 

 
 
 
 
 
 HashiCorp
 

 
 
 
 
 
 Packer
 

 
 
 
 
 
 Golang
 

 
 
 
 
 
 Plugin
 

 
 
 
 
 
 Community
 

 
 
 
 
 
 Provisioner
 

 
 
 
 
 


 
 
 
 As a long time user of Salt and HashiCorp Packer, I wanted to combine these two technologies. My Packer plugin for Salt is the result. Find out more about it!
 
 
 
 ](/posts/2024/introducing-the-packer-provisioner-for-salt/)

 
 


At the time I mentioned that one of my roadmap items was to provide support for using pillar data. With the latest update (0.5.6 at the time of writing) that is now a reality! Take a look at the plugin documentation on the [HashiCorp developer site](https://developer.hashicorp.com/packer/integrations/mpoore/salt/latest/components/provisioner/salt) and you will see the pillar_files, pillar_tree, and pillar_directory options described there.


Installation / update of the plugin is simple, just include the required_plugins stanza in your HCL file:

```
`packer {
 required_plugins {
 salt = {
 version = &#34;>= 0.5.6&#34;
 source = &#34;github.com/mpoore/salt&#34;
 }
 }
}
`
```


And use the *packer init* command to have the latest plugin downloaded.


I know what you&rsquo;re thinking. &ldquo;That&rsquo;s great, but are there any examples?&rdquo; Don&rsquo;t worry, I&rsquo;ve got you covered! My Packer repository has a growing number of examples.
[
 


 
 
 

 
 

 


 
 
 mpoore/packer
 
 

 


 Packer build repository
 

 


 
 
 HCL 
 

 
 

 
 
 


 
 


 6
 

 
 

 
 
 


 
 


 0
 

 

 
 
](https://github.com/mpoore/packer)

 
 
 
 
 
 

 
 
 
 


 
 
 [
 

 
 

 


 ](https://www.linkedin.com/shareArticle?mini=true&url=https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/&title=An%20overdue%20update%20to%20the%20Packer%20Provisioner%20for%20Salt)
 
 
 
 [
 

 
 
 


 ](https://bsky.app/intent/compose?text=An%20overdue%20update%20to%20the%20Packer%20Provisioner%20for%20Salt&#43;https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/)
 
 
 
 [
 

 
 
 


 ](https://twitter.com/intent/tweet/?url=https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/&text=An%20overdue%20update%20to%20the%20Packer%20Provisioner%20for%20Salt)
 
 
 
 [
 

 
 

 


 ](https://reddit.com/submit/?url=https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/&resubmit=true&title=An%20overdue%20update%20to%20the%20Packer%20Provisioner%20for%20Salt)
 
 
 
 [
 

 
 

 


 ](https://pinterest.com/pin/create/bookmarklet/?url=https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/&description=An%20overdue%20update%20to%20the%20Packer%20Provisioner%20for%20Salt)
 
 
 
 [
 

 
 

 


 ](/cdn-cgi/l/email-protection#0d326f626974306579797d7e372222607d62627f68236462227d627e797e223f3d3f38226c6320627b687f69786820787d696c796820796220796568207d6c6e66687f207d7f627b647e646263687f206b627f207e6c6179222b6c607d367e786f67686e79304c63283f3d627b687f697868283f3d787d696c7968283f3d7962283f3d796568283f3d5d6c6e66687f283f3d5d7f627b647e646263687f283f3d6b627f283f3d5e6c6179)
 
 
 


 


### Related


 
 

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
 
 
 
 
 
 

 

 
 Introducing the Packer Provisioner for Salt
 

 
 


 


 


 
 
 26 June 2024&middot;9 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Projects
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Salt
 

 
 
 
 
 
 HashiCorp
 

 
 
 
 
 
 Packer
 

 
 
 
 
 
 Golang
 

 
 
 
 
 
 Plugin
 

 
 
 
 
 
 Community
 

 
 
 
 
 
 Provisioner
 

 
 
 
 
 


 

 
 
 As a long time user of Salt and HashiCorp Packer, I wanted to combine these two technologies. My Packer plugin for Salt is the result. Find out more about it!
 
 
 
 

 
 
 ](/posts/2024/introducing-the-packer-provisioner-for-salt/)

 
 

 [
 
 
 
 
 
 

 

 
 Elevating Enterprise Compliance - Bitnami's game changing Salt integration unveiled
 

 
 


 


 


 
 
 14 June 2024&middot;6 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Salt
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 Tanzu
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Bitnami
 

 
 
 
 
 
 OSS
 

 
 
 
 
 
 Compliance
 

 
 
 
 
 


 

 
 
 Bitnami have embedded the Salt Minion into every single OVA and cloud image in the Bitnami Application Catalog - this is a good thing!
 
 
 
 

 
 
 ](/posts/2024/elevating-enterprise-compliance-bitnamis-game-changing-salt-integration-unveiled/)

 


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 
 


 
 
 
 
 [
 &larr;
 &rarr;
 
 Coming Soon - My plans for 2026
 
 
 31 December 2025
 
 
 
 ](/posts/2025/coming-soon-my-plans-for-2026/)
 
 
 
 
 
 
 
 


 
 
 


 
 
 


[comments powered by Disqus](https://disqus.com)

---

*Originally published at: [https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/](https://mpoore.io/posts/2025/an-overdue-update-to-the-packer-provisioner-for-salt/)*