---
title: "Migrating my PERSONAL SERVER from TrueNAS to Proxmox"
source: "Apalrd's Adventures"
url: "https://www.apalrd.net/posts/2023/ultimate_migrate/"
date: "September 20, 2023"
tag: "homelab"
categories: "homelab"
---

# Migrating my PERSONAL SERVER from TrueNAS to Proxmox

> **Source:** [Apalrd's Adventures](https://www.apalrd.net/posts/2023/ultimate_migrate/)  
> **Date:** September 20, 2023  
> **Tag:** `homelab`

---

Today I&rsquo;m taking my 10 servers and hopefully working that list down to just 7! JUST SEVEN!
So, driven by my desire to consolidate my critical services into one box so I can lab away with the rest of the boxes, I am taking the time to shut down some of the most critical servers in the house and re-home them, then disassemble the parts for the next project.
Come along with me on this adventure!


## Contents[&#8983;](#contents) 


- [Video](/posts/2023/ultimate_migrate/#video)

- [My Servers](/posts/2023/ultimate_migrate/#my-servers)

- [Unprivilaged Container Bind Mount UID/GID Mapping](/posts/2023/ultimate_migrate/#unprivilaged-container-bind-mount-uidgid-mapping)

- [Large Dataset Backups to Proxmox Backup Server](/posts/2023/ultimate_migrate/#large-dataset-backups-to-proxmox-backup-server)

- [Sanoid for Snapshots](/posts/2023/ultimate_migrate/#sanoid-for-snapshots)

- [Shadow Copy with Sanoid](/posts/2023/ultimate_migrate/#shadow-copy-with-sanoid)


## Video[&#8983;](#video) 


[

![Thumbnail](/posts/2023/ultimate_migrate/thumbnail.jpg)

](https://youtu.be/_D6VVlqWwSA)


## My Servers[&#8983;](#my-servers) 


So anyway here&rsquo;s the list of what I have now and their current jobs:


- Iridium - TrueNAS SCALE - It&rsquo;s just doing Samba, nothing else at this point. I kinda hate the TrueNAS dev&rsquo;s highly restrictive attitude.

- Minilab - my Ryzen 2400G mini-PC - It&rsquo;s doing *mission critical* VMs and CTs like Home Assistant. It also has some Coral TPU cards for Frigate.

- Terra - This is the Terramaster NAS from another video. It&rsquo;s currently only used for filming videos, but it&rsquo;s cheap and low-power.

- Corona - Runs Frigate and was formerly a VM on Minilab, but I moved it to the ZimaBoard so I can do a test of different acceleration methods for an upcoming video.

- Megalab - This is the PC on a box that you see in a lot of my vieos.

- pve1,pve2,pve3 - This is my 3-node cluster from the cluster series

- My firewall router running OPNsense - nothing will change here

- Bigstor, my Proxmox Backup Server (also feat. LTO Tapes) - nothing will change here either


Today, I have a few tasks all happening at once, to minimize downtime:


- Purge everything off Terra and remove the spinning drive pool and drives

- Migrate all of the workloads on Minilab to Terra and bring them back up, especially home automation, with minimal downtime

- Spin down the TrueNAS SCALE server and migrate those Samba datasets to a container in Proxmox on Minilab, similar to my [Pretty Good NAS](/posts/2023/ultimate_nas/) video.

- Properly deal with file permissions when passing datasets into a container via bind mounts, since I glossed over permissions in the previous video.

- Setup proper backups to my [Proxmox Backup Server](/posts/2023/pbs_intro/) from the Cockpit+Samba container, in a way that is scalable and lets me configure the frequency and stuff for each dataset, and get the full benefit of file-based recovery from PBS.

- Setup snapshots of the zfs dataset in Proxmox (like I had in TrueNAS), more for accidental deletion prevention than long term backups. These should be done extrmely frequently.

- Setup Shadow Copy so I can access accidentally deleted files myself without going to the backup server


I&rsquo;m not including separate sections in the blog on the pruging / migration since it was unremarkable. I shutdown the VM/CT on Minilab, ran a backup in the Proxmox UI to the PBS server, and restored the backup on Terra. It just worked.
Likewise, importing the zfs pool from TrueNAS to Proxmox was also fairly straightforward, I did a `zpool import -f` to get the name of the pool and then `zpool import -f poolname` to import it despite warnings that it was exported on a different system. All done, it imports automatically now. No need to even mention the names of the disks, zfs figures it all out.


## Unprivilaged Container Bind Mount UID/GID Mapping[&#8983;](#unprivilaged-container-bind-mount-uidgid-mapping) 


One of the challenges in dealing with unprivilaged LXC containers is that the UIDs/GIDs are mapped to 100000 in the host. This is a security feature, so the root user in the container doesn&rsquo;t have root access if they are able to escape their container, but it&rsquo;s also kinda a pain when sharing files between the host and container. So, to solve this, I created a user and group on host and on guest with the same uid (in my case, 1000) to access my shares. I can then map the Samba users in the container to this group to get permissions to the files.
So I added these lines to the LXC config (in my case `/etc/pve/lxc/104.conf`, replace `104` with your CT ID):

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


## Large Dataset Backups to Proxmox Backup Server[&#8983;](#large-dataset-backups-to-proxmox-backup-server) 


One challenge with Proxmox Backup Server is that it&rsquo;s not particularly good at large host backups. It&rsquo;s very optimied for VMs, where the qemu dirty bitmask is used to know which static blocks have changed and must be reuploaded, but for file-based backups it reads all of the files and uploads chunks which have changed. This &lsquo;read all the files&rsquo; takes awhile. I also have different backup requirements for each of my datasets, and PBS has a requirement that all backups for a single VM/CT/Host are done together, since all of the differend disks end up as different entries in the same backup.


So, with all of these requirements, I wrote some systemd scripts to do my large dataset file backups. Instead of doing a single backup of all of the datasets, I name each backup &lsquo;host&rsquo; after the dataset - so in PBS it shows up as host/video, host/media, … instead of host/iridium with separate datasets for video and media. This means I can backup each dataset on its own time, separately. I&rsquo;m happy with this. I also structured all of my datasets so they are located at /mnt/, which means I can rely on this path in the backup scripts (name -> path translation means adding /mnt in front, no path lookups).


First step is to install the Proxmox Backup Client *within the container*. Proxmox provides a Debian repository for the backup client only, which you can add [following their instructions](https://pbs.proxmox.com/docs/installation.html#debian-package-repositories). Then `apt install proxmox-backup-client`. Yay! Now create an API user and key and all that jazz and get ready to copy it into the backup script.


Here&rsquo;s the systemd script I wrote to do a single backup. It&rsquo;s instanced, so it has @ at the end, and you pass a parameter for the backup you want to do (i.e. pbs-client@video). It goes in `/etc/systemd/system/pbs-client@.service`. Make sure your backup user has read permissions to the data at least.


```
`[Unit]
Description=Run Backups

[Service]
Type=oneshot
#Run as backup
User=backup
Group=backup
#Allow up to 15% CPU
CPUQuota=15%
#Backup settings
Environment=PBS_REPOSITORY=user@pbs@dns_name.lan:datastore
Environment=PBS_PASSWORD=api_key
Environment=PBS_FINGERPRINT=&#34;fingerprint&#34;
#Run proxmox backup client for the passed directory
ExecStart=proxmox-backup-client backup %i.pxar:/mnt/%i --all-file-systems true --backup-id &#34;%i&#34;

[Install]
WantedBy=default.target
`
```


After a `systemctl daemon-reload` you are ready to do manual backups! Just `systemctl start pbs-client@video` and it will create a backup id &lsquo;video&rsquo; with the file &lsquo;video.pxar&rsquo; from the path &lsquo;/mnt/video&rsquo;. Since Cockpit is amazing, you can watch the progress by going to the Services tab, finding that specific service, and viewing the logs. Awesome!


Now we just need to time it to run regularly. Here&rsquo;s a unit I use for that (`/etc/systemd/system/pbs-video.timer`):


```
`[Unit]
Description=Backup Video Data
RefuseManualStart=no
RefuseManualStop=no

[Timer]
#Run at 4am EST / 09 UTC some days
OnCalendar=Mon,Wed,Fri *-*-* 09:00:00
Unit=pbs-client@video.service

[Install]
WantedBy=timers.target
`
```


Now enable the timer with `systemctl enable pbs-video.timer` and it will run on schedule. You can again monitor it from the Cockpit services tab.


## Sanoid for Snapshots[&#8983;](#sanoid-for-snapshots) 


Avoiding the issue of delegating zfs permissions into a container, I am installing [Sanoid](https://github.com/jimsalterjrs/sanoid) on the Proxmox host to take snapshots of the datasets used by the container. It&rsquo;s a tool designed to take snapshots of zfs datasets basically, and it&rsquo;s good at it. It&rsquo;s also in the Debian repos, so we can just `apt install sanoid` and edit the config file. Since this is mostly for Shadow Copy, I&rsquo;m using the &lsquo;frequently&rsquo; snapshots due to naming convention quirks making it harder to use all of the different time steps in Shadow Copy.


Users can still mount their own snapshots by browsing to the `.zfs` folder in any directory, including within the container, and permissions are maintained for snapshots. So the container can now read snapshots of its own mounts, automatically.


Here&rsquo;s the `/etc/sanoid/sanoid.conf` snippet:

```
`# you can also handle datasets recursively in an atomic way without the possibility to override settings for child datasets.
[data/video]
 use_template = production
 recursive = zfs
[data/media]
 use_template = production
 recursive = zfs


#############################
# templates below this line #
#############################

# name your templates template_templatename. you can create your own, and use them in your module definitions above.

# Using a lot of frequently at 30min for Shadow Copy, since it isn't a fan of the differently named snapshots.
[template_production]
 frequently = 144
 frequent_period = 30
 hourly = 0
 daily = 30
 monthly = 3
 yearly = 0
 autosnap = yes
 autoprune = yes
`
```


## Shadow Copy with Sanoid[&#8983;](#shadow-copy-with-sanoid) 


In Cockpit File Sharing, I enabled the &lsquo;Shadow Copy&rsquo; and &lsquo;MacOS Share&rsquo; options, since I want Shadow copy and also want the shares to work well with my iphone and mac. Here are the &lsquo;advanced options&rsquo; for each share:


```
`shadow:snapdir = .zfs/snapshot
shadow:sort = desc
shadow:format = autosnap_%Y-%m-%d_%H:%M:%S_frequently
vfs objects = catia fruit streams_xattr shadow_copy2
fruit:encoding = native
fruit:metadata = stream
fruit:zero_file_id = yes
fruit:nfs_aces = no
`
```


Of note, the shadow:format means it will be taking Sanoid&rsquo;s `frequently` snapshots as the source of Shadow Copy. This works well, I am pleased.

 

 
 


 
 read other posts
 
 
 


 
 
 [
 ←
 REALLY Persistent Ethernet Interfaces on Linux
 ](https://www.apalrd.net/posts/2023/tip_link/)
 
 
 
 
 [
 Mellanox NICs with VLAN-Aware Bridges on Linux
 →
 ](https://www.apalrd.net/posts/2023/tip_mellanox/)

---

*Originally published at: [https://www.apalrd.net/posts/2023/ultimate_migrate/](https://www.apalrd.net/posts/2023/ultimate_migrate/)*