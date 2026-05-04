---
title: "Proxmox Unprivilaged LXC Container Bind Mount UID/GID Mapping"
source: "Apalrd's Adventures"
url: "https://www.apalrd.net/posts/2023/tip_idmap/"
date: "November 12, 2023"
tag: "homelab"
categories: "homelab"
---

# Proxmox Unprivilaged LXC Container Bind Mount UID/GID Mapping

> **Source:** [Apalrd's Adventures](https://www.apalrd.net/posts/2023/tip_idmap/)  
> **Date:** November 12, 2023  
> **Tag:** `homelab`

---

This is a snippet of my [Personal Server Migration](/posts/2023/ultimate_migrate/), but I thought it would be more useful as a stand-alone tutorial.
One of the challenges in dealing with unprivilaged LXC containers is that the UIDs/GIDs are mapped to 100000 in the host. This is a security feature, so the root user in the container doesn&rsquo;t have root access if they are able to escape their container, but it&rsquo;s also kinda a pain when sharing files between the host and container. So, to solve this, I created a user and group on host and on guest with the same uid (in my case, 1000) to access my shares. I can then add users in the container to group 1000 so they have access to the files.
So I added these lines to the LXC config ()`/etc/pve/lxc/<id?.conf`):

```
`lxc.idmap: u 0 100000 1000
lxc.idmap: g 0 100000 1000
lxc.idmap: u 1000 1000 1
lxc.idmap: g 1000 1000 1
lxc.idmap: u 1001 101001 64535
lxc.idmap: g 1001 101001 64535
`
```


Just to walk through what this does:


- There are IDs 0 through 65535 (total of 65536 entires) which must exist on the guest, for both User and Group

- These lines configure how to map IDs in the host to IDs in the guest

- The first line maps 0 on guest -> 100000 on host quantity 1000 sequential IDs, for Users

- The second line does the same for Groups

- Then we map user 1000 on guest -> 1000 on host quantity 1 sequential ID, again for User then Group

- Finally we map user 1001 on guest -> 101001 on host quantity 64535 (65536 total - 1000 - 1 already mapped) for the rest of the IDs
We need to make sure that no IDs are listed twice on the guest side, there are no gaps on the guest side, and the total of UIDs and GIDs is 65536 on the guest side. The CT will fail to start if you get this wrong.


In my case, I created a regular user + group (so not a system user) and it is 1000 on both sides, so I can map 1000 to 1000. If they are different, you&rsquo;ll need to change them of course.


To allow the host&rsquo;s IDs to be passed into a container, we need to give permissions to a host user to do the mapping. Since root creates the container, the user root needs to be able to subuid / subgid for the users / groups that we are idmapping into the container. This is set by the files `/etc/subuid` and `/etc/subgid`. I added this line to both files:


```
`root:1000:1
`
```


This command allows the host user root to idmap {user, group} id 1000 quantity 1 sequential ID. Adjust as required for your setup.


After doing this, I did a recursive chown of the data directories to 1000:1000 *on host* and this also makes the guest&rsquo;s user 1000 have access (since it&rsquo;s idmapped).


To actually pass the directory into the container, I use `pct` like this:


```
`pct set 100 -mp0 /data/video,mp=/mnt/video
`
```


where `100` is the ID of the container, `mp0` is the mount point ID that Proxmox keeps track of, `/data/video` is the path on host, and `/mnt/video` is the path in the container.


Good luck with your containers!

 

 
 


 
 read other posts
 
 
 


 
 
 [
 ←
 All About SUBNETTING your Networks! &#43; Setup in OPNsense
 ](https://www.apalrd.net/posts/2023/opnsense_subnet/)
 
 
 
 
 [
 Unleash your Home Cameras with FRIGATE Self-Hosted AI Video Recorder! Install on Proxmox LXC
 →
 ](https://www.apalrd.net/posts/2023/ultimate_frigate/)

---

*Originally published at: [https://www.apalrd.net/posts/2023/tip_idmap/](https://www.apalrd.net/posts/2023/tip_idmap/)*