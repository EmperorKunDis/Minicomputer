---
title: "Unleash your Home Cameras with FRIGATE Self-Hosted AI Video Recorder! Install on Proxmox LXC"
source: "Apalrd's Adventures"
url: "https://www.apalrd.net/posts/2023/ultimate_frigate/"
date: "November 9, 2023"
tag: "homelab"
categories: "homelab"
---

# Unleash your Home Cameras with FRIGATE Self-Hosted AI Video Recorder! Install on Proxmox LXC

> **Source:** [Apalrd's Adventures](https://www.apalrd.net/posts/2023/ultimate_frigate/)  
> **Date:** November 9, 2023  
> **Tag:** `homelab`

---

Do you have security cameras at your house? Would you like to locally host all of your recording and analytics, to make sure nobody else has access to your video feeds and recordings? Would you also like to integrate with Home Assistant, the greatest open automation platform in the world? Then Frigate NVR is for you! In this video, I&rsquo;m going to go in depth to setup Frigate in an LXC container, for maximum efficiency. Using Podman Quadlet, I&rsquo;m going to manage the Frigate container in a sane way with normal systemd and journalctl tools. And I&rsquo;m going all-in on hardware passthrough, with my Coral TPU for advanced AI detections and person/cat/car counting, along with a basic Intel Quick Sync GPU to decode the video streams in hardware and reduce CPU load. So join me on this adventure!


### Contents[&#8983;](#contents) 


- [Video](/posts/2023/ultimate_frigate/#video)

- [Install Debian LXC](/posts/2023/ultimate_frigate/#install-debian-lxc)

- [Install Frigate](/posts/2023/ultimate_frigate/#install-frigate)

- [Install Caddy Reverse Proxy for TLS](/posts/2023/ultimate_frigate/#install-caddy-reverse-proxy-for-tls)

- [Install Coral TPU Drivers](/posts/2023/ultimate_frigate/#install-coral-tpu-drivers)

- [Passthrough Coral TPU to Container](/posts/2023/ultimate_frigate/#passthrough-coral-tpu-to-container)

- [Passthrough GPU Decode to Container](/posts/2023/ultimate_frigate/#passthrough-gpu-decode-to-container)

- [My Frigate Config](/posts/2023/ultimate_frigate/#my-frigate-config)


Let&rsquo;s make Frigate work on the ultimate home server


### Video[&#8983;](#video) 


[

![Thumbnail](/posts/2023/ultimate_frigate/thumbnail.png)

](https://youtu.be/sCkswrK0G3I)


### Install Debian LXC[&#8983;](#install-debian-lxc) 


Since I&rsquo;d like to use some fairly recent features of Podman, we MUST start with debian 12 (Bookworm) or 13 (Trixie) when it is released. In addition, I added a second mount point at `/var/frigate` for data. We need Nesting and FUSE enabled for this. I&rsquo;m using a privilaged container since I am passing in devices.
Be aware that enabling FUSE prevents Proxmox Backup (vzdump) from taking snapshot-style backups, it will get stuck trying to take the snapshot. You have to use suspend or stop mode. In this particular case, I&rsquo;ve decided to not back up this container, since the only important file to recreate it is the config.yml for Frigate and the video files aren&rsquo;t going to be backed up anyway.
If you are on Debian Bookworm, you will need to upgrade to Trixie to have Podman Quadlet. If Trixie is already released, you can skip this step:

```
`#Replace bookworm with trixie in sources.list
#Not needed if you are actually using Trixie (when it releases)
sed -i 's/bookworm/trixie/g' /etc/apt/sources.list
#Update and dist-upgrade to Trixe
#Answer yes to all prompts
apt update && apt dist-upgrade -y
`
```


And finally, let&rsquo;s install Podman, our container engine of choice:


```
`#Install Podman
apt install podman -y
`
```


You also might want to set the timezone, so your Frigate recordings are in local time instead of UTC:


```
`timedatectl set-timezone &#34;America/Detroit&#34;
`
```


### Install Frigate[&#8983;](#install-frigate) 


Now we&rsquo;re going to create the podman contaner file, which uses systemd syntax and lets us manage the container with systemd and avoid Docker nastiness.


First up, create the folders for Frigate to mount:


```
`#Create media and config directories
mkdir -p /var/frigate/{media,config}
`
```


At this point, put your Frigate config file in `/var/frigate/config/config.yml` in the container, read the frigate docs for that one (or see my own config later at the bottom).


Our Quadlet unit file is `/etc/containers/systemd/frigate.container` (You may need to create that directory, also):


```
`[Unit]
Description=Frigate video recorder
After=network-online.target

[Container]
#Basic setup
ContainerName=frigate
#Use LXC host networking
#To avoid any Docker network nonsense
Network=host
#How to add environment variables like passwords
Environment=FRIGATE_RTSP_PASSWORD=&#34;password&#34;
Environment=FRIGATE_MQTT_USER=&#34;user&#34;
Environment=FRIGATE_MQTT_PASSWORD=&#34;pass&#34;
#Mounted volumes
Volume=/var/frigate/media:/media
Volume=/var/frigate/config:/config
Volume=/etc/localtime:/etc/localtime:ro
#TempFS 
Mount=type=tmpfs,target=/tmp/cache,tmpfs-size=1000000000
ShmSize=64m
#The image itself
Image=ghcr.io/blakeblackshear/frigate:stable
#Auto-update from the registry
AutoUpdate=registry

[Service]
#Restart automatically
Restart=always
#Give it a 15 minutes to start
#Since any image pulls will take a long time
TimeoutStartSec=900

[Install]
# Start on boot (default.target is 'on boot')
WantedBy=multi-user.target default.target
`
```


And finally we can start the new service:


```
`systemctl daemon-reload
#The first time will take awhile since it pulls the image
systemctl start frigate
#We can't systemctl enable it since these units are dynamically generated
#So instead we WantedBy it, above
`
```


And view logs with `journalctl -xeu frigate`


In case you&rsquo;re curious or want to use Quadlet for your own containers, [here&rsquo;s a link to the docs on container units](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html).


### Install Caddy Reverse Proxy for TLS[&#8983;](#install-caddy-reverse-proxy-for-tls) 


While it would be nice if the Frigate devs didn&rsquo;t merge nginx with their own code so we could configure nginx for security, but we are stuck with their nginx config in their Docker image. As of now, this doesn&rsquo;t even support IPv6, so we need some sort of front end proxy, and we also probably want a TLS certificate. I&rsquo;ll show a self-signed cert in this example, but it&rsquo;s also easy to use Let&rsquo;s Encrypt.


So, installing Caddy:


```
`apt install debian-keyring debian-archive-keyring apt-transport-https -y
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/ caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy -y
`
```


And the `/etc/caddy/Caddyfile` I am using (delete the default and replace with this):


```
`# The Caddyfile is an easy way to configure your Caddy web server.
# Don't forget to put the hostname in DNS where it belongs
corona.palnet.net {
 #Address of backend
 reverse_proxy :5000
 #Settings for TLS
 #Internal means self-signed
 tls internal
}
`
```


And start it:


```
`systemctl enable --now caddy
`
```


### Install Coral TPU Drivers[&#8983;](#install-coral-tpu-drivers) 


Since LXC containers share a kernel with the host, we need to install the Coral TPU drivers on the Proxmox host, NOT in the container. Since these drivers are also not in-tree, we need to install them via apt and compile them for the Proxmox kernel using dkms. So let&rsquo;s do that now.


Also, if you are using a USB TPU instead of PCIe, you can skip down to the host bind mount point. [From the official Google docs](https://coral.ai/docs/m2/get-started#2a-on-linux):


```
`#Add coral edgetpu repository
echo &#34;deb https://packages.cloud.google.com/apt coral-edgetpu-stable main&#34; > /etc/apt/sources.list.d/coral-edgetpu.list
#Add GPG key from Google
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
#Apt update to pull the package list
apt update
#Install the DKMS driver (we do *not* need the headers / libs since the container needs those)
apt install gasket-dkms
`
```


**FYI: Google can&rsquo;t be bothered to update their repo with a build that works with recent Linux kernels**, so as of Proxmox 8.1 / Linux 6.5, the gasket-dkms package that we need is broken. The code has long been fixed in the [Github repo](https://github.com/google/gasket-driver) (thanks to open source contributors helping Google for free), but Google hasn&rsquo;t built and published the binaries. Until then, you&rsquo;ll have to compile it yourself, or [contact their support](https://coral.ai/support/) and tell them to fix it.


In the meantime, the amazing Proxmox community has [a solution to get it to work](https://forum.proxmox.com/threads/update-error-with-coral-tpu-drivers.136888/#post-608975), and the Linux community yeeted gasket out of the kernel for being unmaintained by Google. So you might want to migrate away from coral.ai before they end up on the [Killed By Google](https://killedbygoogle.com/) list.


Also, a very nice Github user @feranick has published deb packages you can use for now, do this instead of the real instructions above until Google fixes their life:


```
`#Download package
https://github.com/feranick/gasket-driver/releases/download/1.0-18.2/gasket-dkms_1.0-18.2_all.deb
#Install with apt
apt install ./gasket*.deb -y
`
```


In theory we should be able to `modprobe apex` now. However, if you get an error like this, you&rsquo;ll need to take a slight detour:


```
`dkms: autoinstall for kernel 6.2.16-19-pve was skipped since the kernel headers for this kernel do not seem to be installed.
`
```


That means we don&rsquo;t have headers installed. We can install them with `apt install pve-headers`, but that will install the latest headers, not the headers for our version of Proxmox. The safest way to deal with this is to completely upgrade the Proxmox system and then install headers for the latest kernel version, to make sure the minor versions are entirely correct (i.e. the 6.2.16-19-pve).


```
`apt update
apt install pve-headers -y
apt full-upgrade -y
#Now reboot, so the new kernel image is used (otherwise there will be a discrepancy between the kernel it is trying to build / the headers, and the running kernel)

#Then tell dkms to build and install the new modules (they are already installed, just not for this particular kernel version):
dkms autoinstall
`
```


And finally, after this, you an `modprobe apex`. At this point, you should have a `/dev/apex_0` for your TPU.


### Passthrough Coral TPU to Container[&#8983;](#passthrough-coral-tpu-to-container) 


Now that we have that device, let&rsquo;s pass it through to the container. Make sure the LXC container is *not running* and then edit its config file (`/etc/pve/lxc/<id>.conf`) to add this at the end:


```
`lxc.cgroup2.devices.allow: c 120:0 rwm
lxc.mount.entry: /dev/apex_0 dev/apex_0 none bind,optional,create=file
`
```


Of course if you have multiple TPUs you can add all of the apex devices here.


Now, start the container and we will deal with passing the device into Frigate.


Under the `[Container]` section of the frigate unit file, we need to add this:


```
`#Pass-through Coral TPU
AddDevice=/dev/apex_0
`
```


And finally, in our `config.yml` for Frigate, add the line to configure the Coral TPU:


```
`detectors:
 coral1:
 type: edgetpu
 device: pci:0
`
```


You can edit the `config.yml` from within the Frigate UI if you want.


### Passthrough GPU Decode to Container[&#8983;](#passthrough-gpu-decode-to-container) 


I only have an Intel GPU to test currently, so here&rsquo;s the config I am using. It should be *similar* but not identical for AMD GPUs. Nvidia can fuck right off with their proprietary container driver mess, I&rsquo;m not helping you guys with that one.


First, we pass through the hardware to the container from Proxmox. Assuming you only have one GPU, it will be renderD128. If you have more, you can figure out which is which on your own. Shutdown the container and add these lines to the end of the container config (`/etc/pve/lxc/<id>.conf`):


```
`lxc.cgroup2.devices.allow: c 226:128 rwm
lxc.mount.entry: /dev/dri/renderD128 dev/dri/renderD128 none bind,optional,create=file
`
```


Next, we need to add the device and also the perfmon capability to the Podman unit in the `[Container]` section:


```
`#Add device passthrough for render node
AddDevice=/dev/dri/renderD128
#Add capability for the container to monitor GPU performance
AddCapability=CAP_PERFMON
#If you are not using the iHD driver, you might need one of these options:
#Environment=LIBVA_DRIVER_NAME=&#34;radeonsi&#34;
#Environment=LIBVA_DRIVER_NAME=&#34;i965&#34;
`
```


And finally, we need to configure Frigate to actually use these, by adding a new section to the `config.yml`:


```
`#Use hardware acceleration for ffmpeg
ffmpeg:
 hwaccel_args: preset-intel-qsv-h264
 #Other options are preset-intel-qsv-h265
 #For AMD cards use preset-vaapi
`
```


If you are using a very modern Intel CPU, you might need to enable the &lsquo;guc&rsquo; microcode loading. Create the file `/etc/modprobe.d/i915.conf` and write in the following contents, then reboot:


```
`options i915 enable_guc=3
`
```


I have no idea exactly which CPUs and kernel versions are affected.


If you want to make sure your GPU is working, you can install either `intel_gpu_top` from the `intel-gpu-tools` package (Intel) or `radeontop` from the `radeontop` package and run it in the container.


### My Frigate Config[&#8983;](#my-frigate-config) 


This is sanitized, but close to what I actually have


```
`#MQTT server
mqtt:
 host: telstar.palnet.net
 #Use environment variable for these
 user: &#34;{FRIGATE_MQTT_USER}&#34;
 password: &#34;{FRIGATE_MQTT_PASSWORD}&#34;

#One single PCIe edge TPU
detectors:
 coral1:
 type: edgetpu
 device: pci:0

#Use hardware acceleration with h264 and intel quicksync vieo
ffmpeg:
 hwaccel_args: preset-intel-qsv-h264

#Recording options
record:
 enabled: True
 #Keep all recordings for 2 days
 retain:
 days: 2
 mode: all
 #Keep event recordings for 10 days
 events:
 pre_capture: 5
 post_capture: 5
 retain:
 default: 2
 mode: motion
 objects:
 person: 15
 #Cat is special
 cat: 15

#Camera configuration
cameras:
 # Back door camera
 back_door:
 ffmpeg:
 inputs:
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole4.palnet.net:554/cam/realmonitor?channel=1&subtype=00
 roles:
 - detect
 - record
 - rtmp
 detect:
 width: 2560
 height: 1440
 #Per camera object and filter settings
 objects:
 # Track persons and cats in only
 track:
 - person
 - cat 

 # Front door camera
 front_door:
 ffmpeg:
 inputs:
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole3.palnet.net:554/cam/realmonitor?channel=1&subtype=00
 roles:
 - detect
 - record
 - rtmp
 detect:
 width: 2560
 height: 1440
 #Per camera object and filter settings
 objects:
 # Track persons and cats in only
 track:
 - person
 - cat


 # Front Yard camera
 front_yard:
 ffmpeg:
 inputs:
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole2.palnet.net:554/cam/realmonitor?channel=1&subtype=00
 roles:
 - record
 - rtmp
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole2.palnet.net:554/cam/realmonitor?channel=1&subtype=01
 roles:
 - detect
 detect:
 width: 704
 height: 480
 #Per camera object and filter settings
 objects:
 # Track persons and cats in only
 track:
 - person
 - car

 # Driveway Camera (2 resolutions)
 driveway:
 ffmpeg:
 inputs:
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole1.palnet.net:554/cam/realmonitor?channel=1&subtype=00
 roles:
 - record
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}4@keyhole1.palnet.net:554/cam/realmonitor?channel=1&subtype=02
 roles:
 - detect
 - rtmp
 detect:
 width: 1280
 height: 720
 #Per camera object and filter settings
 objects:
 # Track everything
 track:
 - person
 - car
 - cat

 # Driveway Cars Camera
 driveway_cars:
 ffmpeg:
 inputs:
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole5.palnet.net:554/cam/realmonitor?channel=1&subtype=00
 roles:
 - record
 - rtmp
 - path: rtsp://admin:{FRIGATE_RTSP_PASSWORD}@keyhole5.palnet.net:554/cam/realmonitor?channel=1&subtype=01
 roles:
 - detect
 detect:
 width: 704
 height: 480
 #Per camera object and filter settings
 objects:
 # Track everything
 track:
 - person
 - car
 - cat
`
```

 

 
 


 
 read other posts
 
 
 


 
 
 [
 ←
 Proxmox Unprivilaged LXC Container Bind Mount UID/GID Mapping
 ](https://www.apalrd.net/posts/2023/tip_idmap/)
 
 
 
 
 [
 Installing Mikrotik RouterOS on Proxmox VE easily
 →
 ](https://www.apalrd.net/posts/2023/tip_routeros/)

---

*Originally published at: [https://www.apalrd.net/posts/2023/ultimate_frigate/](https://www.apalrd.net/posts/2023/ultimate_frigate/)*