---
title: "Monitoring Uptime Status with Github Actions"
source: "Chris Bergeron's"
url: "https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/"
date: "January 8, 2022"
tag: "homelab"
categories: "Software, github, observability, blog"
---

# Monitoring Uptime Status with Github Actions

> **Source:** [Chris Bergeron's](https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/)  
> **Date:** January 8, 2022  
> **Tag:** `homelab`

---

Posted 01-08-2022Updated 04-01-2023[Software](/categories/Software/)

## Monitoring Uptime Status with Github Actions


I was searching github for some uptime monitoring apps when I stumbled across a github actions based uptime and status page. 
It’s aptly named [upptime](https://github.com/upptime/upptime) and while it wasn’t what I was looking for, I found it to be novel and worth setting up:


![Status Page - Upptime](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAHlBMVEVHcExZWVnU1NSbm5toaGiAgIC1tbXv7+8/Pz8ZGRkzrvrZAAAAAXRSTlMAQObYZgAAAxRJREFUeNrt2M1T00AYx/HQt1x56Iscg4UZj40tVG+GFvFIhaLHVqb1WgbwXgfHcvfQ/LfublJwU3CGKWaifj8zfckzmdlfN/uS1HEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+jLclkq/qE7f1MxgoqxPrrL2JGhzyxllr9ciLHnvnSkoOB/uLuSsfTJ5hXzTkLTiem3pLjyXAjlVilQETKqtmS+pSqbt/XlbtYV+rQjH1d308p1lA645580LFOx74cOU5eKntnEtzG6nVGUpmY+rhV8VOJlZOaegvK6hJ91l82dNC2WhtkEUt35VAG+tvAcX1JJVZBGubIi/tO5dMZVcDbWKYD1VugfoBTTCfWUF8e1VgjLlfVxTyMBtIilqf7dD2u59KJ5ZfNuJc30eGaqJ5pLE5YvBxHhYnr6cTq1czUl2d6hdhVs1L13ODeWHE9nVhxK/qjrlcIUR3m3Rsrrqcdq6TWhedbGYkVbCwuop7/emwVHohVSDPW3ZD3a9GQLz4w5KO6m/YCYfrtXBaz0k/GiuopLRCXpg+GMomuzlBUf9RM88lYUT2l5bQk5fjNr5rtWvfTwNp8FiPKT2Xz6Wueakxv1Q1deTsODlSIKzUlRzJainWlt+ryn45leNGNTc2JbmyqOyqE29OV4lIsU2+nFMu56El0l1cPOoOS2QH17d5yLFWvvHTMfpA5rtq0M6ikb3Gy5zLasLPUUWoEur5ZfrPkvLqnbvb3s3b9zOStepmbhKMgfqIEAAAAAPwLXof2X1P52bX91OfP3ttP992OfcJOv20d55p7Kz/658NwbhVe3czWrRTT6bV1wna3e2Sl6PePrRPqzWZj1ViFMAytH/9xfvP11+PidDq1Tmh1u9Y/Dvl+v2/1zlmz2V411loy1rvZ/PGxvKeOVbynt77bY21zc5KIdWhd5WRv1Z8gVi4Mf1iFF7O5PXSm02/JsdX47di6aDYHK8/EbbHHZ+6k4yQmWiM50ZzEELdnpjv+xAIHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/2Ez8QiNuDAFljAAAAAElFTkSuQmCC)


## [](#📈-Live-Status-🟩-All-systems-operational)[📈 Live Status](https://chrisbergeron.github.io/upptime): **🟩 All systems operational**

This repository contains the open-source uptime monitor and status page for [Chris Bergeron’s Tech Blog](https://chrisbergeron.com), powered by [Upptime](https://github.com/upptime/upptime).
It’s a brutally honest uptime monitor because it’s automated, free and pipeline based. There are no “approvals” or signoffs required for this status page, so tread carefully if you use it professionally. There may be legal implications for SLA’s, etc.


### [](#⭐-How-it-works)⭐ How it works


- GitHub Actions is used as an uptime monitor
Every 5 minutes, a workflow visits your website to make sure it’s up

- Response time is recorded every 6 hours and committed to git

- Graphs of response time are generated every day


- GitHub Issues are used for incident reports

An issue is opened if an endpoint is down

- People from your team are assigned to the issue

- Incidents reports are posted as issue comments

- Issues are locked so non-members cannot comment on them

- Issues are closed automatically when your site comes back up

- Slack notifications are sent on updates


- GitHub Pages are used for the status website

A simple, beautiful, and accessible PWA is generated

- Built with Svelte and Sapper

- Fetches data from this repository using the GitHub API


Feel free to view the [interactive status and uptime page here.](https://cbergeron-status.netlify.app/)


URL
Status
History
Response Time
Uptime


![](https://favicons.githubusercontent.com/chrisbergeron.com)

 [Chris Bergeron’s Tech Blog](https://chrisbergeron.com)
🟩 Up
[chris-bergeron-s-tech-blog.yml](https://github.com/chrisbergeron/upptime/commits/HEAD/history/chris-bergeron-s-tech-blog.yml)


![Response time graph](./graphs/chris-bergeron-s-tech-blog/response-time-week.png)

 347ms
[

![Response time 359](images/chrisbergeron-02-img01.jpg)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![24-hour response time 304](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fresponse-time-day.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![7-day response time 347](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fresponse-time-week.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![30-day response time 359](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fresponse-time-month.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![1-year response time 359](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fresponse-time-year.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[100.00%](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)[

![All-time uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fuptime.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![24-hour uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fuptime-day.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![7-day uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fuptime-week.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![30-day uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fuptime-month.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)
[

![1-year uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fchris-bergeron-s-tech-blog%2Fuptime-year.json)

](https://cbergeron-status.netlify.app/history/chris-bergeron-s-tech-blog)


![](https://favicons.githubusercontent.com/holdingco.com)

 [The Holding Company](https://holdingco.com)
🟩 Up
[the-holding-company.yml](https://github.com/chrisbergeron/upptime/commits/HEAD/history/the-holding-company.yml)


![Response time graph](./graphs/the-holding-company/response-time-week.png)

 391ms
[

![Response time 417](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fresponse-time.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![24-hour response time 402](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fresponse-time-day.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![7-day response time 391](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fresponse-time-week.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![30-day response time 417](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fresponse-time-month.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![1-year response time 417](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fresponse-time-year.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[100.00%](https://cbergeron-status.netlify.app/history/the-holding-company)[

![All-time uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fuptime.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![24-hour uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fuptime-day.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![7-day uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fuptime-week.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![30-day uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fuptime-month.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)
[

![1-year uptime 100.00%](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fchrisbergeron%2Fupptime%2FHEAD%2Fapi%2Fthe-holding-company%2Fuptime-year.json)

](https://cbergeron-status.netlify.app/history/the-holding-company)


Monitoring Uptime Status with Github Actions[https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/](https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/)


##### Author

Chris Bergeron


##### Posted on

01-08-2022


##### Updated on

04-01-2023


##### Licensed under

[**](https://creativecommons.org/)[**](https://creativecommons.org/licenses/by/4.0/)[**](https://creativecommons.org/licenses/by-nc/4.0/)

#[github](/tags/github/)[observability](/tags/observability/)[blog](/tags/blog/)

---

*Originally published at: [https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/](https://chrisbergeron.com/2022/01/08/Monitoring-Uptime-Status-with-Github-Actions/)*