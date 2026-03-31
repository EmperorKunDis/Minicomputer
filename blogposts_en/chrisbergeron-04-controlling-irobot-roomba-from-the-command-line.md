---
title: "Controlling iRobot Roomba from the Command Line"
source: "Chris Bergeron's"
url: "https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/"
date: "January 8, 2022"
tag: "homelab"
categories: "Home, irobot, roomba, cli, linux"
---

# Controlling iRobot Roomba from the Command Line

> **Source:** [Chris Bergeron's](https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/)  
> **Date:** January 8, 2022  
> **Tag:** `homelab`

---

Posted 01-08-2022Updated 04-01-2023[Home](/categories/Home/)

## Controlling iRobot Roomba from the Command Line


If you’re a heavy command line (cli) user in Macos, Linux or WSL, you may it convenient to easily start or stop your robot from it’s cleaning cycle. In this post I’ll you fellow keyboard jockeys how to control and even view your robot as is cleans.


![There's more than one way to skin a robot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


## [](#Utilities-Tools-Apps-and-Endpoints)Utilities, Tools, Apps and Endpoints

There are a few tools I use to communicate with the Roomba. They’re like *yin* and *yang*. One is a library called **dorita980**. It provides a lower level of communication to the Roomba on your LAN (local network). The other, **rest980** provides an API layer.


### [](#Rest-980)Rest 980

rest980 create a http server to map all dorita980 methods in a REST API to control your iRobot Roomba 900 series 980 / i7 / i7+ via HTTP requests.
[https://github.com/koalazak/rest980](https://github.com/koalazak/rest980)
Again, this is from my notes. Please refer to the official README at the repo link above for proper documentation and examples.


#### [](#Start-the-Server)Start the Server

If you have node (nodeJS) installed you can just clone the repo and start the server:

```
1
2
3
4
5
6

```

```
cbergeron@cb-mbp rest980 (master) $ DEBUG=rest980:* npm start

> rest980@2.1.0 start
> node ./bin/www

 rest980:server Listening on port 3000 +0ms

```

This will start the node/Express server on localhost port 3000: `localhost:3000` or `127.0.0.1:3000` / `127.0.1.1:3000`


#### [](#Verify-the-Server-API-Endpoint-is-running)Verify the Server (API Endpoint) is running

You can now check to see the API endpoint is running by connecting to `port 3000`. You can do this in a browser or using a tool like `httpie` or `curl`:

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

```

```
cbergeron@cb-mbp dorita980 (master) $ http http://localhost:3000

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 89
Content-Type: application/json; charset=utf-8
Date: Sun, 15 Aug 2021 00:30:25 GMT
ETag: W/"59-pSgrD/pK10leEJPjrIwFdVOiqIE"
X-Powered-By: Express

{
 "documentation": "https://github.com/koalazak/rest980",
 "pong": "2021-08-15T00:30:25.000Z"
}


```

This is the json object we received from the endpoint:

```
1
2
3
4

```

```
{
 "documentation": "https://github.com/koalazak/rest980",
 "pong": "2021-08-15T00:28:25.844Z"
}

```

You should also see a `GET` request to the server in the output if you ran it in `DEBUG` mode like I did here.

```
1

```

```
GET / 200 0.546 ms - 89

```

Once you have the REST API connected to your robot on your local network, you can start interacting with it. Here’s the output from the `/api/local/config/preferences` API route:

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

```

```
curl "http://localhost:3000/api/local/config/preferences" | jq .

{
 "netinfo": {
 "dhcp": true,
 "addr": 167772192,
 "mask": 4294967040,
 "gw": 167772161,
 "dns1": 167772161,
 "dns2": 0,
 "bssid": "9c:3d:cf:cf:6c:1a",
 "sec": 4
 },
# ... TRUNCATED BY CB ...

```

Another simple way to do this is with a simple app that will start a roomba cleaning cycle.


#### [](#Create-a-Simple-Test-App)Create a Simple Test App

Create a basic `myapp.js` file with these contents:

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

```

```
var dorita980 = require('dorita980');

var myRobotViaLocal = new dorita980.Local('`31E8442031030170`', ':1:1608793068:UUyR5cdy7e4k3Jae', '10.0.0.129'); // robot IP address

myRobotViaLocal.on('connect', init);

function init () {
 myRobotViaLocal.clean()
 .then(() => myRobotViaLocal.end()) // disconnect to leave free the channel for the mobile app.
 .catch(console.log);
}

```

On line 3, we’re connecting to the robot on the IP: **10.0.0.129** which is the last argument. The first two are the **BID** and **password**, respectively.


#### [](#Run-the-Test-App)Run the Test App


```
1
2
3
4
5

```

```
cbergeron@cb-mbp dorita980 (master) $ node myapp.js
cbergeron@cb-mbp dorita980 (master) $ echo $?
0

# Your Roomba should start to run 

```

Now that you can talk to your Roomba using the API, we can use **Dorita 980** for mapping


### [](#Dorita-980)Dorita 980

dorita980 is an unofficial iRobot Roomba node.js library (SDK).
With this library you can send commands to your wifi enabled Roomba through the iRobot cloud API or directly from your LAN and integrate your roboot with your own Home Automation or IoT project.
[https://github.com/koalazak/dorita980](https://github.com/koalazak/dorita980)
The information below is from my notes. Please refer to the official README at the repo link above for proper documentation.


#### [](#Configuration)Configuration

To run Dorita, you need to get the **BID** (Bot ID) and **password** from your Roomba. The **BID** is encoded as a string in a format like this: `31E8442031030170` and the **password**: `:1:1608793068:UUyR5cdy7e4k3Jae`. To get these you can run the included 


## [](#MagicMirror-Module)MagicMirror Module

There’s also a MagicMirror Module that uses this API for displaying the robot’s status. Different robots will have varying degress of support ranging from Charge Level, Charge State and Bin Full Status.


![Roomba Magic Mirror Module](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


The code for this module can be found [over on github.](https://github.com/relm923/MMM-Roomba)


## [](#Other)Other

The second Roomba I had got scratched up quite easily from normal usage. If you’re interested in protecting yours, there are quite a quite a few [Roomba protective and decorative skins](https://www.amazon.com/gp/product/B07NXVV8G8/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=chrisberg-20&creative=9325&linkCode=as2&creativeASIN=B07NXVV8G8&linkId=ad9f2d8bdf3f12e8594d7a38e5b1d5b0) available.


Controlling iRobot Roomba from the Command Line[https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/](https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/)


##### Author

Chris Bergeron


##### Posted on

01-08-2022


##### Updated on

04-01-2023


##### Licensed under

[**](https://creativecommons.org/)[**](https://creativecommons.org/licenses/by/4.0/)[**](https://creativecommons.org/licenses/by-nc/4.0/)

#[irobot](/tags/irobot/)[roomba](/tags/roomba/)[cli](/tags/cli/)[linux](/tags/linux/)[macos](/tags/macos/)[magicmirror](/tags/magicmirror/)[dorita](/tags/dorita/)[rest980](/tags/rest980/)

---

*Originally published at: [https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/](https://chrisbergeron.com/2022/01/08/Controlling-iRobot-Roomba-from-the-command-line/)*