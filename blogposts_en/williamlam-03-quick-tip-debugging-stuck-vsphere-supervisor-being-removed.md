---
title: "Quick Tip - Debugging \"stuck\" vSphere Supervisor being removed"
source: "WilliamLam.com"
url: "https://williamlam.com/2026/02/debugging-stuck-vsphere-supervisor-being-removed.html"
date: "February 19, 2026"
author: "William Lam"
tag: "vmware"
categories: "VMware Cloud Foundation, vSphere Kubernetes Service"
---

# Quick Tip - Debugging "stuck" vSphere Supervisor being removed

> **Source:** [WilliamLam.com](https://williamlam.com/2026/02/debugging-stuck-vsphere-supervisor-being-removed.html)  
> **Date:** February 19, 2026  
> **Author:** William Lam  
> **Tag:** `vmware`

---

## Quick Tip - Debugging "stuck" vSphere Supervisor being removed


02.19.2026 by [William Lam](https://williamlam.com/author/lamw) // [Leave a Comment](https://williamlam.com/2026/02/debugging-stuck-vsphere-supervisor-being-removed.html#respond) 

Disabling or deactivating vSphere Supervisor can take some time depending on the number of resources you may have deployed, which all need to be properly cleaned up.
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/debugging-stuck-vsphere-supervisor-removal.png?resize=300%2C116&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/debugging-stuck-vsphere-supervisor-removal.png?ssl=1)

In case the removal is taking longer than expected, there is not much information provided to the user in the vSphere UI.
However, I recently learned about a useful way to understand what is actually happening on the backend by looking at the vSphere Supervisor service logs, especially if you believe the operation is "stuck", which ended up being my situation.

**Step 1** - SSH to vCenter Server Appliance (VCSA) and grep for the following string "**Attempting to sync supervisor**"

```
grep "Attempting to sync supervisor" /var/log/vmware/wcp/wcpsvc.log
```

Look at the very last entry that matches our text ad make a note of the opID, which in my example is **69963fe4-c796cc96-1978-4920-b805-35398cdf11a3**
**Step 2** - Using the opID, we can now search for that string to understand what is actually happening:

```
grep "69963fe4-c796cc96-1978-4920-b805-35398cdf11a3" /var/log/vmware/wcp/wcpsvc.log
```

As you can see from the snippet below, the issue has to do with NSX clean up failing and timing out.

```
2026-02-19T03:28:05.358Z debug wcp [cleanup/vpc.go:169] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] NSX cleanup initiated
2026-02-19T03:30:49.513Z error wcp [cleanup/vpc.go:171] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] NSX cleanup failed: failed to clean up
2026-02-19T03:30:49.517Z error wcp [cleanup/vpc.go:77] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] Error cleaning NSX resources: NSX cleanup failed: failed to clean up
2026-02-19T03:30:49.517Z error wcp [kubelifecycle/controller.go:2539] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] Teardown of external appliance resources failed. Err: error cleaning NSX resources for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': failed to perform NSX cleanup for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': NSX cleanup failed for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': NSX cleanup failed: failed to clean up
2026-02-19T03:30:49.517Z warning wcp [kubelifecycle/controller.go:478] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] Unable to disable cluster domain-c10 because of the reason [FailedWithSystemError]. Err error cleaning NSX resources for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': failed to perform NSX cleanup for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': NSX cleanup failed for Supervisor 'c796cc96-1978-4920-b805-35398cdf11a3': NSX cleanup failed: failed to clean up
2026-02-19T03:30:49.517Z debug wcp [logger/trace.go:92] [opID=69963fe4-c796cc96-1978-4920-b805-35398cdf11a3] [ END ] [kubelifecycle.(*Controller).syncKubeInstanceState:436] [2m44.981015458s] supervisor=c796cc96-1978-4920-b805-35398cdf11a3

```

If this is a production environment, this is useful information to provide to Broadcom Support, which is also included as part of generating either vCenter Server or vSphere Supervisor Support Bundle, but at least you can quickly assess what is actually happening. There are scripts that support can provide to clean up these NSX resources, but only do so at the guidance of support.
I have already filed a feature enhancement to bubble up this useful information into vSphere UI, this way users can at least get an understanding of what is happening.


Categories // [VMware Cloud Foundation](https://williamlam.com/category/vmware-cloud-foundation), [vSphere Kubernetes Service](https://williamlam.com/category/vsphere-kubernetes-service) Tags // [vSphere Kubernetes Service](https://williamlam.com/tag/vsphere-kubernetes-service)

---

*Originally published at: [https://williamlam.com/2026/02/debugging-stuck-vsphere-supervisor-being-removed.html](https://williamlam.com/2026/02/debugging-stuck-vsphere-supervisor-being-removed.html)*