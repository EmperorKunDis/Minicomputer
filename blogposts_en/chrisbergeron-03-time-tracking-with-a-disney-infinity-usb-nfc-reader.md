---
title: "Time Tracking with a Disney Infinity USB NFC Reader"
source: "Chris Bergeron's"
url: "https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/"
date: "January 8, 2022"
tag: "homelab"
categories: "Homelab, nfc, usb, disney"
---

# Time Tracking with a Disney Infinity USB NFC Reader

> **Source:** [Chris Bergeron's](https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/)  
> **Date:** January 8, 2022  
> **Tag:** `homelab`

---

Posted 01-08-2022Updated 04-01-2023[Homelab](/categories/Homelab/)

## Time Tracking with a Disney Infinity USB NFC Reader


While browsing my local thrift store, I stumbled upon a little gadget that I decided to repurpose:


![Disney Infinity USB NFC Reader](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


It was only **$6** USD, so I thought it would be a fun project.
I searched for ‘Disney Infinity Linux’ to see if any work had been done toward decoding it or making it work. I found various sources that suggested that Playstation or Wii versions work fine, but the X-Box version was challenging. Fortunately, among the 5 they had, one was the Wii/Playstation version so I bought it.


## [](#Hardware)Hardware


### [](#Disney-Infinity-USB-NFC-Reader)Disney Infinity USB NFC Reader


![Disney Infinity USB NFC Reader](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


Here you can see the NFC sticker.


![Inserting the NFC into](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


### [](#NFC-tags)NFC tags

I purchased a set of 10 NFC tags for this. After some reading, I decided on the [Thonsen 10PC NFC Stickers](https://amzn.to/3qYiSC0)
<<<<<<< HEAD


## [](#These-are-stickers-so-I-could-easily-just-stick-them-on-to-each-face-but-I-don’t-want-to-waste-the-dry-erase-capability-by-doing-that-so-I-insert-them-behind-the-dry-erase-part-of-the-cube-These-NFC-tags-are-universal-so-they-should-work-with-any-NFC-reader-I-was-able-to-read-them-on-my-iPhone-12-Pro-Max-with-the-NFC-Tools-app)These are stickers, so I could easily just stick them on to each face, but I don’t want to waste the dry erase capability by doing that, so I insert them behind the dry erase part of the cube. These NFC tags are universal so they should work with any NFC reader. I was able to read them on my iPhone 12 Pro Max with the NFC Tools app.

These are stickers, so I could easily just stick them on to each face, but I don’t want to waste the dry erase capability by doing that.
> 
> 
> 
> 
> 
> 
> 
> dde45fd09851c2f0153ec5ff62f8a2b4421bc0db
> 


### [](#Haptic-Toggle-Device)Haptic Toggle Device

I needed something more elegant than just swapping stickers onto the NFC Reader. My first thought was to make a [paper dodecahedron](https://www.polyhedra.net/en/model.php?name-en=dodecahedron), cube or something similar. I kept it in mind for my visits to the local thrift store figuring that I might find a toy or some other item that would work.
While browsing around my local dollar store, Shannon spotted the perfect item:
**A dry erase toy foam cube for $1 USD**
Being a cube meant that I would have six faces on which I could place an NFC tag. I couldn’t easily think of more than 6 modes of time to track, so it was perfect for the project. In hindsight, I should have picked up 3 of these cubes considering that the Disney Infinity has 3 NFC pads. That would provide me with 7 (one for each of the 6 sides, plus no-nfc tag present) possible modes on each of the 3 pads. My math is probably wrong, but I think this provides for 3^7 combinations, or *2,187*.
Since I only bought one cube, I’m not working with theory. The reality is that I have 7 time tracking modes possible (for now).
**They are:**


- Work

- Consulting

- Lunch

- Break

- Unassigned 1

- Unassigned 2

- Not tracking / No Tag


The other *really useful* feature of this foam cube is that it has dry erase areas on each side. This means I can draw unicorns, write words or symbols on each face and I can change them at any time.
I’ll have to coordinate each side/NFC tag ID with the writing on each face.
Someday I may get more granular by adding Project / Stories or Clients specific tags and adding more foam cubes.


## [](#Software)Software

Now that I have a haptic interface (foam cube) and an NFC reader (Disney Infinity), I need to integrate it all with some software.


### [](#HID-Driver)HID Driver

The first step after getting the device was to figure out what it was and how it worked. This is what came up in `lsusb`:

```
1
2
3
4
5
6
7
8

```

```
root@ns-01:~# lsusb
Bus 002 Device 003: ID 174c:55aa ASMedia Technology Inc. Name: ASM1051E SATA 6Gb/s bridge, ASM1053E SATA 6Gb/s bridge, ASM1153 SATA 3Gb/s bridge, ASM1153E SATA 6Gb/s bridge
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub

Bus 001 Device 003: ID 0e6f:0129 Logic3 # <----- This is the Disney Infinity device.

Bus 001 Device 002: ID 2109:3431 VIA Labs, Inc. Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub

```

The useful bit here is the ID: `0e6f:0129` That’s the VendorID:ProductID.
Probing further, I get this detail from `usb-devices`:

```
1
2
3
4
5
6
7
8

```

```
T: Bus=01 Lev=02 Prnt=02 Port=02 Cnt=01 Dev#= 3 Spd=12 MxCh= 0
D: Ver= 2.00 Cls=00(>ifc ) Sub=00 Prot=00 MxPS=32 #Cfgs= 1
P: Vendor=0e6f ProdID=0129 Rev=02.00
S: Manufacturer=Disney Interactive
S: Product=Disney Infinity Reader
S: SerialNumber=48EE62573139 Performance Designed Products
C: #Ifs= 1 Cfg#= 1 Atr=80 MxPwr=500mA
I: If#=0x0 Alt= 0 #EPs= 2 Cls=03(HID ) Sub=00 Prot=00 Driver=usbhid

```

<<<<<<< HEAD
I’m no computer expert, but it appears that Disney Interactive has their own USB Vendor ID. With that, they created this Product ID.


## [](#These-lines-break-down-as-follows)These lines break down as follows:

I’m no computer expert, but it appears that Disney Interactive has their own USB Vendor ID. From that they obviously created the Product ID.
These line break down as follows:
> 
> 
> 
> 
> 
> 
> 
> dde45fd09851c2f0153ec5ff62f8a2b4421bc0db
> 


- T: Bus, Speed and Port information

- D: USB Version and some other things I don’t know

- P: Vendor ID, Product ID, Revision

- S: Vendor / Manufacturer human readable text and Product human readable text strings

- C: Power information?

- I: Interface type. In this case I see HID which is Human Interface Device.


We can go further down the rabbit hole using `usbhid-dump`:

```
1
2
3
4

```

```
cbergeron@ns-01:~/github/infinity $ sudo usbhid-dump
001:005:000:DESCRIPTOR 1632199392.780032
 06 00 FF 09 01 A1 01 19 01 29 20 15 00 26 FF 00
 75 08 95 20 81 00 19 01 29 20 91 00 C0

```

This descriptor can be decoded using a [USB Descriptor and Request Parser](https://eleccelerator.com/usbdescreqparser/):

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18

```

```
0x06, 0x00, 0xFF, // Usage Page (Vendor Defined 0xFF00)
0x09, 0x01, // Usage (0x01)
0xA1, 0x01, // Collection (Application)
0x19, 0x01, // Usage Minimum (0x01)
0x29, 0x20, // Usage Maximum (0x20)
0x15, 0x00, // Logical Minimum (0)
0x26, 0xFF, 0x00, // Logical Maximum (255)
0x75, 0x08, // Report Size (8)
0x95, 0x20, // Report Count (32)
0x81, 0x00, // Input (Data,Array,Abs,No Wrap,Linear,Preferred State,No Null Position)
0x19, 0x01, // Usage Minimum (0x01)
0x29, 0x20, // Usage Maximum (0x20)
0x91, 0x00, // Output (Data,Array,Abs,No Wrap,Linear,Preferred State,No Null Position,Non-volatile)
0xC0, // End Collection

// 29 bytes

// best guess: USB HID Report Descriptor

```

Great. We’ve confirmed it’s an HID device. Let’s interact with it.


### [](#The-Glue)The Glue

Now that I had some working code to interface with the device, I needed some code to talk to it. Fortunately, there was some work done toward it, but it wasn’t comprehensive. I found come Python 2 code that I was able to easily update for Python 3.
You can view the code here in the [Disney Infinity USB Repo](https://github.com/chrisbergeron/di-usb-library).
The interactive example app here responds to device removal or replacement.

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27

```

```
<<<<<<< HEAD
cbergeron@hostname:~/github/di-usb-library/infinity $ python3 infinity.py

=======
>>>>>>> dde45fd09851c2f0153ec5ff62f8a2b4421bc0db
Connected to Disney Infinity USB Device 297

Activate Message = [40, 99, 41, 32, 68, 105, 115, 110, 101, 121, 32, 50, 48, 49, 51]
Leave construct_message with message = [0, 255, 17, 128, 1, 40, 99, 41, 32, 68, 105, 115, 110, 101, 121, 32, 50, 48, 49, 51, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Message is: [0, 255, 17, 128, 1, 40, 99, 41, 32, 68, 105, 115, 110, 101, 121, 32, 50, 48, 49, 51, 183, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Leave construct_message with message = [0, 255, 2, 161, 2, 164, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

Message is: [0, 255, 2, 161, 2, 164, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
Leave construct_message with message = [0, 255, 6, 144, 3, 1, 200, 0, 0, 97, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# Placed tag on Red square
Tags added or removed.
[171, 4, 1, 0, 0, 0, 176, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# Removed tag from Red square
Tags added or removed.
[171, 4, 1, 0, 0, 1, 177, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# Placed tag on 
Tags added or removed.
[171, 4, 2, 0, 0, 0, 177, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

```

I can also change the colors of the LEDS from the app based on events or os triggers. I’ll expand on this post in the future if there is interest.
<<<<<<< HEAD


## [](#The-Time-Tracker)The Time Tracker

=======
> 
> 
> 
> 
> 
> 
> 
> dde45fd09851c2f0153ec5ff62f8a2b4421bc0db
> 


## [](#Scope-Creep-Future-Features)Scope Creep / Future Features

NFCs are neat little radio devices. Most modern phones have NFC reading capability, so it would be easy to create a phone shortcut to read the cube and update the time app when I’m away from the Disney Infinity reader.
I could also add more granularity to the current time tracking capability. For example, If I used 3 cubes, I could have **Consulting**, **CLIENT NAME**, and project stage (DISCOVERY, IMPLEMENTATION, NEXT STEPS, etc).


## [](#Conclusion)Conclusion

I used this little gadget for a little time-tracking proof of concept project, but there are many other potential uses. A few that come to mind could be:


- A little device that sends your sweetie a text message (draw a smiley, a heart, or angry face)

- A childs learning toy

- An intrusion device (nfc sticker inside of a cabinet with a reader inside)


What would you do with 3 NFC readers and a few NFC readers? Feel free to Comment below 👇


Time Tracking with a Disney Infinity USB NFC Reader[https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/](https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/)


##### Author

Chris Bergeron


##### Posted on

01-08-2022


##### Updated on

04-01-2023


##### Licensed under

[**](https://creativecommons.org/)[**](https://creativecommons.org/licenses/by/4.0/)[**](https://creativecommons.org/licenses/by-nc/4.0/)

#[nfc](/tags/nfc/)[usb](/tags/usb/)[disney](/tags/disney/)

---

*Originally published at: [https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/](https://chrisbergeron.com/2022/01/08/Time-Tracking-with-a-Disney-Infinity-USB-NFC-Reader/)*