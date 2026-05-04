---
title: "Minio Bucket Policy Notes"
source: "Spencer's Blog"
url: "https://blog.filegarden.net/2025/02/09/minio-bucket-policy-notes/"
date: "February 10, 2025"
author: "Spencer LeB"
tag: "selfhosted"
categories: "Linux"
---

# Minio Bucket Policy Notes

> **Source:** [Spencer's Blog](https://blog.filegarden.net/2025/02/09/minio-bucket-policy-notes/)  
> **Date:** February 10, 2025  
> **Author:** Spencer LeB  
> **Tag:** `selfhosted`

---

![](images/spencers-blog-02-img01.png)

 
 
 
 
 Minio Bucket Policy Notes
 

## Minio Bucket Policy Notes


 
 


 

##### ** [February 9, 2025 ](https://blog.filegarden.net/2025/02/09/minio-bucket-policy-notes/)**
[Spencer LeB](https://blog.filegarden.net/author/sleblanc/)


 
 

 


 
Minio is a really cool opensource project which democratizes cloud storage. The feature that I love most about it is S3 compatibility which means that you can use it with the AWS CLI or any other AWS SDK. Companies can use this to run their own distributed object storage systems.


I use this at home with my server to make available multiple terabytes of storage to myself and my family. I’ve connected 3 hard drives of **4, 2 and 1 TB** respectively and make these available wirelessly over my home internet as well as the public internet. Think of this as my secure self hosted private S3.


Even though this is a private storage service, I wouldn’t feel comfortable exposing all the drives to anyone with a single Access and Secret Key pair. It becomes too risky and any user could accidentally wipe everyones data. Thankfully permissions in minio are modelled similarly to S3, the documentation however is a little sparse and hard to find. Therefore I’m documenting my workflow, this might help you if you’re trying to do something similar and will definitely help me avoid searching through my shell history.


A sample use-case is that I want to grant access to a family member to access their own private bucket.


#### Step 1 – Create the bucket


`mc mb local/wifey`


#### Step 2 – Create the credentials pair


`mc admin user add local wifey-user wife-top-secret-key`


#### Step 3 – Create the policy to grant access to the bucket


```
`{
 "Version": "2012-10-17",
 "Statement": &#91;
 {
 "Action": &#91;
 "s3:ListBucket",
 "s3:PutObject",
 "s3:GetObject",
 "s3:DeleteObject"
 ],
 "Effect": "Allow",
 "Resource": &#91;
 "arn:aws:s3:::wifey/*", "arn:aws:s3:::wifey"
 ],
 "Sid": "BucketAccessForUser"
 }
 ]
}
`
```


The version name here isn’t today’s date, so don’t be changing that. I did at first and discovered that this was the version which defines the syntax that is supported for IAM policies.


Save this file somewhere, we’ll add this policy to the minio instance next.


#### Step 4 – Add policy to your minio instance


`mc admin policy add local wifey-bucket-policy /tmp/sample-bucket-policy.txt`


Replace the path to the file.


#### Step 5 – Associate policy with your user


`mc admin policy set local wifey-bucket-policy user=wifey-user`


And that’s it, there are definitely a few hoops to jump through but this is consistent with other permission management systems. Now the credentials that you share with a user will only allow them to access this one bucket.


You can verify that everything is setup as you’d expect by running this –


```
`mc admin user info local wifey-user

AccessKey: wifey-user
Status: enabled
PolicyName: wifey-bucket-policy 
MemberOf:
`
```


It’s easy enough to also give multiple people access using similar policies and to also create read only policies so that everyone can see all the latest baby pictures but not add or delete them.


**Original blog author / Source –** [https://blog.nikhilbhardwaj.in/2020/02/25/minio-bucket-policy/](https://blog.nikhilbhardwaj.in/2020/02/25/minio-bucket-policy/)

 

 
 

**
 [Linux](https://blog.filegarden.net/category/linux/)

---

*Originally published at: [https://blog.filegarden.net/2025/02/09/minio-bucket-policy-notes/](https://blog.filegarden.net/2025/02/09/minio-bucket-policy-notes/)*