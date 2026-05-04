---
title: "Moving videos to Bunny Stream"
source: "Cavelab Blog"
url: "https://blog.cavelab.dev/2025/01/bunny-stream/"
date: "January 16, 2025"
tag: "homelab"
categories: "homelab"
---

# Moving videos to Bunny Stream

> **Source:** [Cavelab Blog](https://blog.cavelab.dev/2025/01/bunny-stream/)  
> **Date:** January 16, 2025  
> **Tag:** `homelab`

---

I&rsquo;ve looked into different [video solution for this blog](https://blog.cavelab.dev/2021/06/video-solutions-for-blog/) before — and, at the time, settled on using Coconut.co for encoding, AWS S3 for hosting, and Video.js for playing.


Bunny Stream was on the table back then, but I wanted a more *hands on solution*. Well — this time around I wanted a *hands off solution*, where the videos just work without me having to worry about it &#x1f642;


And for that — Bunny Stream is pretty awesome, so that&rsquo;s what I&rsquo;m using now &#x1f44d;

 
 
 Table of contents
 
 
 
 

 
- [Why change?](#why-change)
 
- [Uploading and encoding videos](#uploading-and-encoding-videos)
 
 [Bash script](#bash-script)
 
- [Python scripts](#python-scripts)
 
- [Master videos.json](#master-videosjson)
 
- [Caddy configuration](#caddy-configuration)
 

 
 
- [Using videos on this site](#using-videos-on-this-site)
 

 [Makefile](#makefile)
 
- [Blog videos.json](#blog-videosjson)
 
- [Hugo shortcode](#hugo-shortcode)
 

 
 
- [Why so complicated?](#why-so-complicated)
 
- [Conclusion](#conclusion)
 


### Why change? [

](#why-change)


Why did I decide to change my video solution in the first place?


One of my posts, the [RPi security alarm](https://blog.cavelab.dev/2022/12/rpi-security-alarm/), got featured on a Linux podcast/talk show video. They were discussing the post as they scrolled thought it, and when they got to a video — it didn&rsquo;t work &#x1f61e;


Extremely disappointing… That, and some other issues I experienced myself, led to the decision to outsource video — and let someone else worry about it.


This is a Twitter thread from November 2023, when I started looking into alternatives:
> 
> 

I discovered last week that some of the videos on my blog didn&rsquo;t work, froze on my phone, and random CORS errors &#x1f937; Down the rabbit-hole I went — looking for a video service, YouTube and Vimeo is out. I mainly looked at @MuxHQ and @BunnyCDN Stream.
> 

I really liked @MuxHQ, embedding videos without iFrame. Support was nice and helpful. But playback restrictions requires signed URLs, which is hard on a statically generated website. Streaming minutes are expensive, a bit scary with no way to prevent hot-linking.
> 

So I ended up with @BunnyCDN Stream, which is a lot cheaper, and supports playback restrictions. Nice dashboard, API and support. I think the iFrame player performance could be improved, I&rsquo;ve sent a support ticket about that. Currently migrating videos.
> 

I have tried @BunnyCDN Streams before, when it was in preview. It seems more polished now 🙂 I wrote about my previous video solution a few years ago.
> 


### Uploading and encoding videos [

](#uploading-and-encoding-videos)


Alright, enough of that — let&rsquo;s get info the details on how uploading and encoding happens.


This is the workflow:


- Copy the new video file into `videos/` folder

- Run the Bash script `all_videos.sh`


Let&rsquo;s go through the different steps, but first take a quick look at the `bunny-stream` project folder:


```
`bunny-stream
├── all_videos.sh
├── bunny.py
├── fetch.py
├── video -> ~/vault/Videos/Web
└── videos.json
`
```


#### Bash script [

](#bash-script)


The Bash script `all_videos.sh` checks all video files in the `video/` folder — if they are not defined in `videos.json`, they are passed to the Python script `fetch.py`:


```
`#!/bin/bash

masters=`find video/ -type f`

for master in $masters; do
 video_file=&#34;$(basename -- $master)&#34;
 if [ &#34;$( jq < videos.json &#34;has(\&#34;$video_file\&#34;)&#34;)&#34; == &#34;false&#34; ]; then
 echo $master
 sleep 2
 python3 fetch.py --video $master
 fi
done
`
```


#### Python scripts [

](#python-scripts)


First we need to take a quick look at `bunny.py` — a tiny wrapper for the Bunny Stream [fetch video API](https://docs.bunny.net/reference/video_fetchnewvideo) call:


```
`import requests
import json

api_key = &#34;xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxx-xxxx&#34;
lib_id = &#34;xxxxxx&#34;


def fetch_video(dl_url: str, dl_headers: dict) -> dict:
 url = f&#34;https://video.bunnycdn.com/library/{lib_id}/videos/fetch&#34;

 payload = json.dumps({
 &#34;url&#34;: dl_url,
 &#34;headers&#34;: dl_headers
 })
 headers = {
 &#34;accept&#34;: &#34;application/json&#34;,
 &#34;content-type&#34;: &#34;application/*+json&#34;,
 &#34;AccessKey&#34;: api_key
 }

 response = requests.post(url, data=payload, headers=headers)
 data = json.loads(response.text)

 return data
`
```


And now for the main event — `fetch.py`, this is the workflow:


- Check if the video is already defined in `videos.json` — if so: abort

- Call Bunny Stream, using `bunny.api`, to fetch video file from my web server

Using basic authentication


- Store the video file name, and Bunny Stream ID in `videos.json`


```
`import json
import argparse
import os
import bunny

parser = argparse.ArgumentParser()
parser.add_argument('--video', dest=&#34;filename&#34;, required=True)
args = parser.parse_args()


videos = {}

if __name__ == &#34;__main__&#34;:
 if args.filename == &#34;&#34;:
 raise ValueError(&#34;Input filename missing&#34;)

 video_path = args.filename.replace(&#34;video/&#34;, &#34;&#34;)
 video_folder = os.path.dirname(video_path)
 video_file = os.path.basename(video_path)

 with open('videos.json') as json_file:
 videos = json.load(json_file)

 if video_file in videos:
 raise SystemExit('Error: Video file already in database')

 dl_url = &#34;https://storage.my-web-server.com/videos/&#34; + video_path
 dl_headers = { &#34;Authorization&#34;: &#34;Basic xxxxxxxxxxxxxxxxxxxxxxxx&#34; }

 print(dl_url)

 bunny_stream = bunny.fetch_video(dl_url, dl_headers)

 print(json.dumps(bunny_stream, indent=4))

 videos[video_file] = {
 &#34;bunny_id&#34;: bunny_stream[&#34;id&#34;]
 }

 with open('videos.json', 'w') as outfile:
 json.dump(videos, outfile, indent=4)
`
```


Let&rsquo;s try that now — to see it in action:


```
`$ cd ~/dev/bunny-stream
$ python3 fetch.py --video video/homelab/file-server/file-server-blinkenlights.mp4 
https://storage.my-web-server.com/videos/homelab/file-server/file-server-blinkenlights.mp4
{
 &#34;id&#34;: &#34;3f6e1d45-796b-4638-9af7-f7b4c884ce31&#34;,
 &#34;success&#34;: true,
 &#34;message&#34;: &#34;OK&#34;,
 &#34;statusCode&#34;: 200
}
`
```


#### Master videos.json [

](#master-videosjson)


Sweet — the `fetch.py` completed successfully, and a new entry was added to `bunny-stream/videos.json`. Let&rsquo;s have a look:


```
`{
 &#34;file-server-blinkenlights.mp4&#34;: {
 &#34;bunny_id&#34;: &#34;3f6e1d45-796b-4638-9af7-f7b4c884ce31&#34;
 }
}
`
```


The video file name, and Bunny Stream ID, was added to the file &#x1f44d;


#### Caddy configuration [

](#caddy-configuration)


Just a quick detour to view the Caddy configuration for my storage web server:


```
`:80 {
 root * /usr/share/caddy

 basic_auth /videos/* {
 user xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 }

 file_server browse
}
`
```


Very basic stuff… No HTTPS, because that is handled by the reverse proxy.


The `videos` folder is added to the LXC container as a read-only mount point in Proxmox:


```
`# pct set 102 -mp0 /srv/tank0/vault/Videos/Web,mp=/usr/share/caddy/videos,ro=1
`
```


Okay, back to the main topic!


### Using videos on this site [

](#using-videos-on-this-site)


Now; with the video uploaded to, and processed by, Bunny Stream — it can be used on this site. We now leave the `bunny-stream` project folder, and enter the project folder for this blog — with the following workflow:


- Run command `make new-video path=video/path/to/file.mp4`

- A new video ID is generated and appended to `data/videos.json`, along with the video path as specified


#### Makefile [

](#makefile)


The Makefile for this blog has many rules, but the one we are interested in is `new-video`, which is basically one really long `jq` command:


```
`.PHONY: new-video
new-video:
ifdef path
 cat data/videos.json | jq '.&#34;${shell uuidgen}&#34; += {&#34;path&#34;: &#34;${path}&#34;, &#34;bunny&#34;: &#34;$(shell cat ../bunny-stream/videos.json | jq -r '.&#34;$(notdir ${path})&#34;'.bunny_id)&#34;}' > data/videos.json.tmp
 mv data/videos.json.tmp data/videos.json
 cat data/videos.json | jq 'to_entries | .[-1:] | from_entries'
else
 $(error path is not set)
endif
`
```


Let&rsquo;s try it for the video we previously uploaded:


```
`$ cd ~/dev/cavelab-blog
$ make new-video path=video/homelab/file-server/file-server-blinkenlights.mp4
cat data/videos.json | jq '.&#34;2586cbcb-7353-4190-9d83-1cf8de1bd862&#34; += {&#34;path&#34;: &#34;video/homelab/file-server/file-server-blinkenlights.mp4&#34;, &#34;bunny&#34;: &#34;3f6e1d45-796b-4638-9af7-f7b4c884ce31&#34;}' > data/videos.json.tmp
mv data/videos.json.tmp data/videos.json
cat data/videos.json | jq 'to_entries | .[-1:] | from_entries'
{
 &#34;2586cbcb-7353-4190-9d83-1cf8de1bd862&#34;: {
 &#34;path&#34;: &#34;video/homelab/file-server/file-server-blinkenlights.mp4&#34;,
 &#34;bunny&#34;: &#34;3f6e1d45-796b-4638-9af7-f7b4c884ce31&#34;
 }
}
`
```


#### Blog videos.json [

](#blog-videosjson)


The new video we added was now appended to `data/videos.json`. It contains the newly created video ID, the video path, and Bunny Stream ID. As was printed in the command above:


```
`{
 &#34;2586cbcb-7353-4190-9d83-1cf8de1bd862&#34;: {
 &#34;path&#34;: &#34;video/homelab/file-server/file-server-blinkenlights.mp4&#34;,
 &#34;bunny&#34;: &#34;3f6e1d45-796b-4638-9af7-f7b4c884ce31&#34;
 }
}
`
```


With the video ID separated from the Bunny Stream ID — we&rsquo;re not vendor locked to Bunny Stream. The video ID will never change, but the properties of the video might. More on that later &#x1f447;


#### Hugo shortcode [

](#hugo-shortcode)


Now for the final piece of the puzzle; a Hugo shortcode takes the video ID as an argument, looks up the Bunny Stream ID and inserts the embedded video player.


```
`{{- $id := .Get &#34;id&#34; -}}
{{- $bunny_id := (index $.Site.Data.videos $id).bunny -}}

<figure class=&#34;center&#34;>
 {{- if $bunny_id -}}
 <div style=&#34;position:relative;padding-top:56.25%;&#34;>
 <iframe
 src=&#34;https://iframe.mediadelivery.net/embed/xxxxxx/{{$bunny_id}}?autoplay=false&loop=false&muted=false&preload=true&#34;
 loading=&#34;lazy&#34;
 style=&#34;border:0;position:absolute;top:0;height:100%;width:100%;&#34; 
 allow=&#34;accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;&#34; 
 allowfullscreen=&#34;true&#34;>
 </iframe>
 </div>
 {{- else -}}
 {{- errorf &#34;Missing Bunny Stream ID on video %s&#34; $id -}}
 {{- end -}}
 {{- if .Get &#34;caption&#34; -}}
 <figcaption class=&#34;center&#34;>{{ .Get &#34;caption&#34; | markdownify }}</figcaption>
 {{- end -}}
</figure>
`
```


##### Using the shortcode [

](#using-the-shortcode)


```
`{{< video id=&#34;2586cbcb-7353-4190-9d83-1cf8de1bd862&#34; caption=&#34;Video caption&#34; >}}
`
```
Video caption


### Why so complicated? [](#why-so-complicated)


This may seem overly complicated, especially the part where a video has two IDs — one video ID, and one Bunny Stream ID. But as I mentioned; there is a good reason for this.


It prevents vendor lock-in — and makes it much easier to reupload videos, move to a different video solution, or even use multiple solutions at once.


I&rsquo;ve changed my video solution a few times, and I may do so in the future. Having an immutable video ID means I only have to update the `videos.json` file and my shortcode. Not the content of my posts.


As a theoretical example of using multiple solutions; if a video doesn&rsquo;t have a Bunny Stream ID, but a MUX ID — the MUX player can be embedded instead &#x1f642;


### Conclusion [

](#conclusion)


I&rsquo;m very happy with Bunny Stream, it just works. And if it stops working — well, that is someone else&rsquo;s problem &#x1f642;


I have no intention of migrating away from Bunny Stream, but should I ever need to — I&rsquo;ll be glad I decided to have immutable video IDs.


This post got pretty long and technical, I also have a Python script to mass update the blog data file with Bunny Stream IDs — but I feel that is outside the scope of this post.


&#x1f596;

---

*Originally published at: [https://blog.cavelab.dev/2025/01/bunny-stream/](https://blog.cavelab.dev/2025/01/bunny-stream/)*