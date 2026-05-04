---
title: "Gitea: Easy Self-Hosted Git Repositories!"
source: "Apalrd's Adventures"
url: "https://www.apalrd.net/posts/2023/ultimate_gitea/"
date: "September 7, 2023"
tag: "homelab"
categories: "homelab"
---

# Gitea: Easy Self-Hosted Git Repositories!

> **Source:** [Apalrd's Adventures](https://www.apalrd.net/posts/2023/ultimate_gitea/)  
> **Date:** September 7, 2023  
> **Tag:** `homelab`

---

## Contents[&#8983;](#contents) 


- [Video](/posts/2023/ultimate_gitea/#video)

- [Installation](/posts/2023/ultimate_gitea/#installation)

- [Configure HTTPS Self-Signed](/posts/2023/ultimate_gitea/#configure-https-self-signed)

- [Configure HTTPS Let&rsquo;s Encrypt](/posts/2023/ultimate_gitea/#configure-https-lets-encrypt)


## Video[&#8983;](#video) 


[

![Thumbnail](/posts/2023/ultimate_gitea/thumbnail.png)

](https://youtu.be/NaKExFTCKtg)


### Installation[&#8983;](#installation) 


I&rsquo;m using an LXC container in Proxmox running Debian 12. You&rsquo;re free to use any other Debian 12 system, and the instructions should still work. It&rsquo;s not particularly resource intensive, but you can monitor it to see if you need to increase the RAM/CPU allocations. I also added a second mount point to `/var/lib/gitea`, which is where all of the Gitea data will be stored. This just makes it easier to put the data and OS on separate storage locations, restore the entire Gitea install on another system later, or back it up separately.
Here are the commands to setup Gitea. Make sure you go to the [download site](https://dl.gitea.com/gitea/) and get the link to te latest version. The download is the binary (it&rsquo;s a Go static binary), so there&rsquo;s nothing to unzip, and no file extension. You probably want linux-amd64.

```
`#Install git
apt update && apt install git -y
#Get the correct download link for the latest version
wget https://dl.gitea.com/gitea/1.20.3/gitea-1.20.3-linux-amd64
#Move the binary to bin
mv gitea* /usr/local/bin/gitea
#Make executable
chmod +x /usr/local/bin/gitea
#Ensure it works
gitea --version
#Create the user/group for gitea to operate as
adduser --system --group --disabled-password --home /etc/gitea gitea
#Config directory was created by adduser
#Create directory structure (mountpoint should be /var/lib/gitea)
mkdir -p /var/lib/gitea/{custom,data,log}
chown -R gitea:gitea /var/lib/gitea/
chmod -R 750 /var/lib/gitea/
chown root:gitea /etc/gitea
chmod 770 /etc/gitea
`
```


After that, we need a Systemd Service: (`/etc/systemd/system/gitea.service`)


```
`[Unit]
Description=Gitea (Git with a cup of tea)
After=syslog.target
After=network.target

[Service]
# Uncomment the next line if you have repos with lots of files and get a HTTP 500 error because of that
# LimitNOFILE=524288:524288
RestartSec=2s
Type=notify
User=gitea
Group=gitea
#The mount point we added to the container
WorkingDirectory=/var/lib/gitea
#Create directory in /run
RuntimeDirectory=gitea
ExecStart=/usr/local/bin/gitea web --config /etc/gitea/app.ini
Restart=always
Environment=USER=gitea HOME=/var/lib/gitea/data GITEA_WORK_DIR=/var/lib/gitea
WatchdogSec=30s
#Capabilities to bind to low-numbered ports
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
`
```


Then run it:


```
`systemctl daemon-reload
systemctl enable --now gitea
`
```


Now you can access it via :3000 to do the intial setup.


### Configure HTTPS (Self-Signed)[&#8983;](#configure-https-self-signed) 


And finally, configure Gitea to use HTTPS and the usual ports (80/443) using a self-signed cert (or one you provide, old-school) by editing `/etc/gitea/app.ini`. I&rsquo;ve provided a `diff` below, the `+-` indicates what lines to add and remove.


```
` [server]
+PROTOCOL=https
+REDIRECT_OTHER_PORT=true
+CERT_FILE = /etc/gitea/cert.pem
+KEY_FILE = /etc/gitea/key.pem
 SSH_DOMAIN = gitea.palnet.net
 DOMAIN = gitea.palnet.net
-HTTP_PORT = 80
+HTTP_PORT = 443
 ROOT_URL = https://gitea.palnet.net/
 APP_DATA_PATH = /var/lib/gitea/data
 DISABLE_SSH = false
`
```


And then generate a self-signed certificate and restart the server:


```
`#Cd to the gitea directory
cd /etc/gitea
#sign cert
gitea cert --host teapot.apalrd.net
#Give gitea user read permissions
chown root:gitea cert.pem key.pem
chmod 640 cert.pem key.pem
#Restart gitea
systemctl restart gitea
`
```


To temporarily ignore certificates in Git (for testing), you can use the option `-c http.sslVerify=false` to `git`.


### Configure HTTPS (Let&rsquo;s Encrypt)[&#8983;](#configure-https-lets-encrypt) 


To use Let&rsquo;s Encrypt you need a few different options in `/etc/gitea/app.ini`:


```
` [server]
+PROTOCOL=https
+REDIRECT_OTHER_PORT=true
+ENABLE_ACME=true
+ACME_ACCEPTTOS=true
+ACME_DIRECTORY=https
+ACME_URL=https://acme-staging-v02.api.letsencrypt.org/directory
+ACME_EMAIL=adventure@apalrd.net
 SSH_DOMAIN = gitea.palnet.net
 DOMAIN = gitea.palnet.net
-HTTP_PORT = 80
+HTTP_PORT = 443
 ROOT_URL = https://gitea.palnet.net/
 APP_DATA_PATH = /var/lib/gitea/data
 DISABLE_SSH = false
`
```


I have the URL set to the let&rsquo;s encrypt staging repository as an example, you can use the directory URL of [your own private CA](/posts/2023/network_acme/), or leave it out entirely to use the let&rsquo;s encrypt production server, which is the default if you leave the option out entirely. And then of course restart:


```
`#Restart gitea
systemctl restart gitea
`
```


If Gitea can&rsquo;t get a cert from Let&rsquo;s Encrypt it *will* crash and you will have to look at `journactl -xeu gitea` to figure it out. Very frustrating. So make sure the Let&rsquo;s Encrypt challenges will work (port 80 + 443 are correctly allowed by your network firewall)

 

 
 


 
 read other posts
 
 
 


 
 
 [
 ←
 Mellanox NICs with VLAN-Aware Bridges on Linux
 ](https://www.apalrd.net/posts/2023/tip_mellanox/)
 
 
 
 
 [
 Should I use TAPE BACKUP in 2023? LTO-5 Drive with Proxmox Backup Server
 →
 ](https://www.apalrd.net/posts/2023/pbs_tape/)

---

*Originally published at: [https://www.apalrd.net/posts/2023/ultimate_gitea/](https://www.apalrd.net/posts/2023/ultimate_gitea/)*