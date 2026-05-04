---
title: "Using descriptions AND source control for VCF Automation templates"
source: "mpoore.io"
url: "https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/"
date: "February 19, 2025"
tag: "vmware"
categories: "vmware"
---

# Using descriptions AND source control for VCF Automation templates

> **Source:** [mpoore.io](https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/)  
> **Date:** February 19, 2025  
> **Tag:** `vmware`

---

## 
 Using descriptions AND source control for VCF Automation templates
 


 


 


 
 


 


 


 
 
 19 February 2025&middot;4 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VCF Automation
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 GitLab
 

 
 
 
 
 
 GitHub
 

 
 
 
 
 
 IaC
 

 
 
 
 
 


 

 
 
 
 
 

 

 
 
 

 

 

 

 
 
 


 
 

 
 
 


 
 
 


 

 

 
 

 


 

 Photo by [Caleb White](https://unsplash.com/@caleb_white?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/man-wearing-t-shirt-and-eyeglasses-standing-and-facing-back-NLE9RCsxX3c?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)


 Much as I love working with VMware products, and VCF Automation in particular, it does have a couple of annoying issues that have never been properly addressed in version 8.x. The source control integration is one of those things.


I keep my templates for VCF Automation in a source control repository. (Specifically, it&rsquo;s a GitLab repository hosted within my Homelab and replicated out to GitHub for good measure.) The repository is the source of truth for such templates. If I ever need to redeploy VCF Automation, or if I ever need to share a template, then they&rsquo;re in a safe place. In terms of my template development process, I tend to work in the Assembler UI first until I have the bones of what I want to achieve and then I move the template code into GitLab and work from there.
It&rsquo;s not the most efficient process but that&rsquo;s because the source control integration for VCF Automation templates is uni-directional. It imports from source control but can&rsquo;t make changes. Quite frustrating but I have learned to live with it!
Once my templates are in my GitLab repository, they show up in Assembler looking like the image below.


![Screenshot showing VCF Automation templates added from GitLab source control.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image01.png)


*Figure 1: Newly added templates in VCF Automation Assembler*

Notice the nice green ticks against each template. It gives you a warm, fuzzy feeling that everything is right with the world.
With the templates imported from GitLab, we can release them to Service Broker to be consumed by users. However, by default the templates don&rsquo;t have a description so how is anyone supposed to know what they&rsquo;re for? (Ok, in the image below you can take an informed guess but they are simple templates. Anything more complicated might not be adequately described by the item name alone.)


![Screenshot showing VCF Automation templates released to the Service Broker catalog.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image02.png)


*Figure 2: Newly added catalog items in VCF Automation Service Broker*

If you head back into Assembler, the description for the templates can be set by editing each one and typing (or pasting) in a description.


![Screenshot showing a VCF Automation template being edited to add a description.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image03.png)


*Figure 3: Templates can be edited to add a description*

With a description added to the &ldquo;Ubuntu&rdquo; template, we&rsquo;re starting to get a better looking and more useful catalog.


![Screenshot showing VCF Automation templates released to the Service Broker catalog.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image04.png)


*Figure 4: One of the templates has a description now!*

So far, so simple. But here is where the annoying little problem comes in. What if I want to make a change to my template in GitLab and have it updated in VCF Automation? To demonstrate what happens, I&rsquo;m just going to increment the version of the template and commit the change.


![Screenshot showing the YAML of a VCF Automation template with an update to the version number.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image05.png)


*Figure 5: Changing the template by incrementing the version number in VS Code.*

If we check back in Assembler, the updated version is found and imported ok, but the warm fuzzy feeling that we had earlier with the raft of green ticks is gone!


![Screenshot showing VCF Automation templates added / updated from GitLab source control.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image06.png)


*Figure 6: One of the templates now carries a warning.*

By clicking on the orange exclamation mark you get to see the following text:
`Draft not updated as content has diverged from latest version.`
It&rsquo;s important to note that this doesn&rsquo;t affect your ability to release versions of the templates out to the Service Broker catalog. That still works. The description that was applied is persisted too. The only thing that&rsquo;s wrong is that little orange exclamation symbol. It bugs me though so I had to find a way to get rid of it.
What&rsquo;s actually happening is that adding the description has created a modified &ldquo;current draft&rdquo; version of the template. Assembler is just complaining about that. So how do we make it go away?
Ideally, Assembler would read the description of the template from the YAML file in source control, but it doesn&rsquo;t. Instead we must work around the limitation using the following steps:


- In the assembler UI, create a new version of the template. In the the example my last version in GitLab was 0.1.2 so I&rsquo;m going to create 0.1.3.


![Screenshot showing the creation of a new template version in the Assembler UI.](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/images/image07.png)


*Figure 7: Creating a new template version in the Assembler UI.*


- Update the template version in GitLab to 0.1.4. Commit the change and let Assembler sync the template.


Voila! The template&rsquo;s latest version is from GitLab. The template has a description associated with it. The template has a green tick again. Fans of warm fuzzy feelings can rejoice!

 
 
 
 
 
 

 
 
 
 
 
 
 [
 

 
 

 


 ](https://www.linkedin.com/shareArticle?mini=true&url=https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/&title=Using%20descriptions%20AND%20source%20control%20for%20VCF%20Automation%20templates)
 
 
 
 [
 

 
 
 


 ](https://bsky.app/intent/compose?text=Using%20descriptions%20AND%20source%20control%20for%20VCF%20Automation%20templates&#43;https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/)
 
 
 
 [
 

 
 
 


 ](https://twitter.com/intent/tweet/?url=https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/&text=Using%20descriptions%20AND%20source%20control%20for%20VCF%20Automation%20templates)
 
 
 
 [
 

 
 

 


 ](https://reddit.com/submit/?url=https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/&resubmit=true&title=Using%20descriptions%20AND%20source%20control%20for%20VCF%20Automation%20templates)
 
 
 
 [
 

 
 

 


 ](https://pinterest.com/pin/create/bookmarklet/?url=https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/&description=Using%20descriptions%20AND%20source%20control%20for%20VCF%20Automation%20templates)
 
 
 
 [
 

 
 

 


 ](/cdn-cgi/l/email-protection#69560b060d1054011d1d191a534646041906061b0c4700064619061a1d1a465b595b5c461c1a00070e440d0c1a0a1b00191d0006071a4408070d441a061c1b0a0c440a06071d1b0605440f061b441f0a0f44081c1d0604081d000607441d0c041905081d0c1a464f080419521a1c0b030c0a1d543c1a00070e4c5b590d0c1a0a1b00191d0006071a4c5b5928272d4c5b591a061c1b0a0c4c5b590a06071d1b06054c5b590f061b4c5b593f2a2f4c5b59281c1d0604081d0006074c5b591d0c041905081d0c1a)
 
 
 


 


### Related


 
 

 [
 
 
 
 
 
 

 

 
 Using 'substring' in VCF Automation cloud templates
 

 
 


 


 


 
 
 7 November 2024&middot;3 mins
 

 
 


 
 
 
 
 
 
 
 
 
 Automation
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VCF Automation
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 YAML
 

 
 
 
 
 
 IaC
 

 
 
 
 
 
 GitLab
 

 
 
 
 
 


 

 
 
 Using the &lsquo;substring&rsquo; expression in a VCF Automation template caused me a small issue recently. The fix is very simple!
 
 
 
 

 
 
 ](/posts/2024/using-substring-in-vcf-automation-cloud-templates/)

 
 

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
 
 
 
 
 
 

 

 
 Profile function for authenticating to VMware VKS
 

 
 


 


 


 
 
 28 January 2025&middot;3 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VKS
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VMware
 

 
 
 
 
 
 Script
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 vSphere
 

 
 
 
 
 
 Supervisor
 

 
 
 
 
 
 LazyOps
 

 
 
 
 
 


 

 
 
 The vSphere plugin for kubectl allows you to authenticate to VMware VKS clusters with ease, but what if you&rsquo;re a lazy typist? Lighten the load with this function!
 
 
 
 

 
 
 ](/posts/2025/profile-function-for-authenticating-to-vmware-vks/)

 


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 
 


 
 
 
 
 [
 &larr;
 &rarr;
 
 Profile function for authenticating to VMware CCI
 
 
 28 January 2025
 
 
 
 ](/posts/2025/profile-function-for-authenticating-to-vmware-cci/)
 
 
 
 
 [
 
 Deploying Argo CD as a vSphere Supervisor Service
 
 
 24 May 2025
 
 
 
 &rarr;
 &larr;
 ](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)
 
 
 
 
 


 
 
 


 
 
 


[comments powered by Disqus](https://disqus.com)

---

*Originally published at: [https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/](https://mpoore.io/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/)*