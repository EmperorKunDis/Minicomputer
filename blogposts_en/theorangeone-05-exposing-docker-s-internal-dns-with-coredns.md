---
title: "Exposing Docker's internal DNS with CoreDNS"
source: "TheOrangeOne"
url: "https://theorangeone.net/posts/expose-docker-internal-dns/?utm_medium=rss"
date: "January 17, 2024"
tag: "selfhosted"
categories: "dns, docker"
---

# Exposing Docker's internal DNS with CoreDNS

> **Source:** [TheOrangeOne](https://theorangeone.net/posts/expose-docker-internal-dns/?utm_medium=rss)  
> **Date:** January 17, 2024  
> **Tag:** `selfhosted`

---

<div class="block-rich_text"><p data-block-key="0q0iq">Whilst Docker is a containerisation technology, it's not just about running applications - there's also networking. When you add a container to a docker network, it magically becomes discoverable by other containers on the same network with DNS. All containers use Docker's magical internal DNS server to achieve this. However, whilst Docker networks are accessible to the host (unless you set <a href="https://docs.docker.com/engine/reference/commandline/network_create/#internal"><code>internal: true</code></a>), the same isn't true for the DNS server - which is only accessible from inside the Docker network.</p><p data-block-key="6home">For reasons I won't go into (at least in this post), I needed access to Docker's internal DNS …</p></div><p><a href="https://theorangeone.net/posts/expose-docker-internal-dns/">Continue Reading…</a></p>


![](images/theorangeone-05-img01.jpg)

---

*Originally published at: [https://theorangeone.net/posts/expose-docker-internal-dns/?utm_medium=rss](https://theorangeone.net/posts/expose-docker-internal-dns/?utm_medium=rss)*