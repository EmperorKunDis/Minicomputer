---
title: "Frequent Query container volume async Tasks in vSphere UI"
source: "WilliamLam.com"
url: "https://williamlam.com/2026/02/frequent-query-container-volume-async-tasks-in-vsphere-ui.html"
date: "February 20, 2026"
author: "William Lam"
tag: "vmware"
categories: "Kubernetes, VMware Cloud Foundation, vSphere Kubernetes Service"
---

# Frequent Query container volume async Tasks in vSphere UI

> **Source:** [WilliamLam.com](https://williamlam.com/2026/02/frequent-query-container-volume-async-tasks-in-vsphere-ui.html)  
> **Date:** February 20, 2026  
> **Author:** William Lam  
> **Tag:** `vmware`

---

## Frequent Query container volume async Tasks in vSphere UI 


02.20.2026 by [William Lam](https://williamlam.com/author/lamw) // [Leave a Comment](https://williamlam.com/2026/02/frequent-query-container-volume-async-tasks-in-vsphere-ui.html#respond) 

If you are running vSphere workloads that leverage [Cloud Native Storage (CNS)](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/9-0/vsphere-storage/getting-started-with-cloud-native-storage-in-vsphere/cloud-native-storage-concepts-and-terminology-in-vsphere/vsphere-cloud-native-storage-components.html), whether through upstream or third party Kubernetes, vSphere Kubernetes Service (VKS), vSAN File Services, or VCF Automation (VCFA), you have likely noticed recurring "Query container volume async" tasks appearing in the vCenter Recent Tasks pane.
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-0.png?resize=300%2C87&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-0-scaled.png?ssl=1)

I have generally treated these as informational events and ignored them, but during a recent VCFA upgrade I had noticed an uptick in the frequency of these tasks and wanted to understand where they were coming from and whether I could reduce the frequency of these events.

Since these were vCenter Tasks, but there was not much info in vSphere UI, I turned to vSphere API to see if I could get more information and with the following snippet:

```
$tasks = Get-VIEvent -MaxSamples 5000 | where {$_.GetType().Name -eq "TaskEvent" -and $_.FullFormattedMessage -eq "Task: Query container volume async"}

$results = @()
foreach ($task in $tasks) {
 $tmp = [pscustomobject] [ordered] @{
 Time = $task.CreatedTime
 OpID = $task.info.ActivationId
 }
 $results+=$tmp
}
$results | Sort-Object -Property Time
```

I was able to retrieve these tasks but also what looks to be OpID, which I can then use to investigate further from vCenter Server logs.
After a bit of grepping around, I came to find that these OpID were showing up in **/var/log/vmware/vsan-health/vsanvcmgmtd.log** which looks like the following:
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-2.png?resize=300%2C44&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-2-scaled.png?ssl=1)

It turns out this is part of the vSAN Health Check service that periodically runs every 5 minutes to ensure that underlying storage system is healthy. Interestingly, this is also not the only system that can generate these container volume requests, the underlying Container Storage Interface (CSI) for vSphere will also periodically perform its own health checks, especially when volumes are attached/detached from workloads.
This was evident when I was trying to reason about the timing in the vSAN logs until I realized there were actually two systems that were performing storage health checks, which also operated at 5 minute interval.
In the screenshot below, we can see that opID **08d9de3b** & **08d9e2f2 **are 5 minutes apart as well as **WorkQueue-31e724e8-deb5** & **WorkQueue-d1b023a-e3f7**
[

![](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-1.png?resize=300%2C54&#038;ssl=1)

](https://i0.wp.com/williamlam.com/wp-content/uploads/2026/02/frequent-query-container-volume-async-1-scaled.png?ssl=1)

Once I used the OpID to search the logs, I can see one was being initiated by the CSI driver while the other from vSAN, both serving different purposes but generating a simliar task event.
While you can tweak the CSI volume health check by going into the vSphere Supervisor, I found that it ran much far less frequent than the vSAN Health Check, which sadly is not configurable. In fact, I was able to confirm this theory by simply disabling the vSAN Health Check service in vCenter Server and the events basically stopped.
Of course, you should not disable the vSAN Health Check, but the frequent tasks is from vSAN itself and I have already filed an enhancement for this to be configurable at a minimum so it does not spam recent tasks. If anything, it should not even generate an event when the health check is successful and only when something goes wrong. Today, you can easily filter for specific events to show up, but there not a way to exclude certain events and display everything else. There is another enhancement request to support this use case as I can see this as just one example where that could come in handy.
For now, while this is a frequent task that will appear, it is normal. Hopefully in the future, we may omit the informational task and have more granular controls to specify the frequency of the health checks.


Categories // [Kubernetes](https://williamlam.com/category/kubernetes), [VMware Cloud Foundation](https://williamlam.com/category/vmware-cloud-foundation), [vSphere Kubernetes Service](https://williamlam.com/category/vsphere-kubernetes-service)

---

*Originally published at: [https://williamlam.com/2026/02/frequent-query-container-volume-async-tasks-in-vsphere-ui.html](https://williamlam.com/2026/02/frequent-query-container-volume-async-tasks-in-vsphere-ui.html)*