---
title: "Deploying Argo CD as a vSphere Supervisor Service"
source: "mpoore.io"
url: "https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/"
date: "May 24, 2025"
tag: "vmware"
categories: "vmware"
---

# Deploying Argo CD as a vSphere Supervisor Service

> **Source:** [mpoore.io](https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)  
> **Date:** May 24, 2025  
> **Tag:** `vmware`

---

## 
 Deploying Argo CD as a vSphere Supervisor Service
 


 


 


 
 


 


 


 
 
 24 May 2025&middot;6 mins
 

 
 


 
 
 
 
 
 
 
 
 
 ArgoCD
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 Supervisor
 

 
 
 
 
 
 VKS
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 


 

 
 
 
 
 

 

 
 
 

 

 

 

 
 
 


 
 
 

 
 
 Table of Contents
 
 
 
 

 
- [Argo CD Operator](#argo-cd-operator)
 
- [Supervisor Namespace](#supervisor-namespace)
 
- [ArgoCD Deployment](#argocd-deployment)
 
- [TLS Configuration](#tls-configuration)
 
- [Summary and Next Steps](#summary-and-next-steps)
 


 


 
 Table of Contents
 
 
 
 

 
- [Argo CD Operator](#argo-cd-operator)
 
- [Supervisor Namespace](#supervisor-namespace)
 
- [ArgoCD Deployment](#argocd-deployment)
 
- [TLS Configuration](#tls-configuration)
 
- [Summary and Next Steps](#summary-and-next-steps)
 


 


 
 
 

 
 
 


 
 
 


 

 

 
 

 


 

 Photo by [Kobby Mendez](https://unsplash.com/@kobbymendez?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/white-and-brown-robot-toy-d0oYF8hm4GI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)


I&rsquo;m intending for this article to be more of a &ldquo;how&rdquo; than a &ldquo;why&rdquo;. I wrote a [brief introduction to the vSphere Supervisor and the vSphere Kubernetes Service (VKS)](/posts/2024/an-introduction-to-vsphere-supervisor-and-vsphere-kubernetes-service-vks/) last year that might be helpful reading, but the short version of &ldquo;why&rdquo; is that instead of creating a cluster using the Supervisor and VKS to run Argo CD, I&rsquo;m going to run it in the Supervisor cluster itself. Very briefly, I want to do this because I&rsquo;m going to use Argo CD to manage all of the other applications (e.g. PostgreSQL, Vault, Gitlab) that I want to use in my homelab without having Argo CD in the clusters where these applications will run. Effectively I want to make Argo CD a single source of management for all Kubernetes applications.


### Argo CD Operator 
 
 
 
 [#](#argo-cd-operator)
 
 


The Argo CD Operator manages the lifecycle of an Argo CD deployment. The product team for vSphere have made it available as a service that can be installed into the vSphere Supervisor. At the time of writing, all such services are available from a Github page. Specifically, the Argo CD Operator service can be found [here](https://vsphere-tmm.github.io/Supervisor-Services/#argocd-operator).


![Screenshot showing the Argo CD Operator download links.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image01.png)


*Figure 1: The Argo CD Operator service can be downloaded from a public website.*

The YAML file for the operator (v0.12.0 in the screenshot above) can be downloaded and created as a Supervisor service using the vCenter UI.


![Screenshot showing the registration of Argo CD Operator as a Supervisor service.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image02.png)


*Figure 2: Registering the Argo CD Operator as a service to be applied to a Supervisor cluster.*

Once applied to a Supervisor, a new namespace will be created for the service. In my homelab, that ended up being &ldquo;svc-argocd-operator-domain-c9&rdquo;, whcih is an automatically generated name.


### Supervisor Namespace 
 
 
 
 [#](#supervisor-namespace)
 
 


Now that the Argo CD Operator is running in the Supervisor, I need somewhere for an Argo CD instance to run. I need a Namespace in the Supervisor. This is easy to create using the vCenter UI.


- Navigate to Workload Management in the vCenter UI.

- Click the option to create a &ldquo;New Namespace&rdquo;.


![Screenshot showing creation of a new namespace.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image03.png)


*Figure 3: Creation of a new namespace with the DNS-compliant name of &lsquo;argocd&rsquo;.*


- The namespace needs a DNS-compliant name, I went with &ldquo;argocd&rdquo;.

- The namespace is quickly created, but there are two configurations that I need to make before I can use it.


![Screenshot showing the created namespace in the vCenter UI. Options to assign permissions and storage policies are highlighted.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image04.png)


*Figure 4: The created namespace. Options to configure user permissions and storage policies are highlighted.*


- Assign a user to have permissions to the namespace:


![Screenshot showing a user being assigned to the namespace.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image05.png)


*Figure 5: Assigning a user with permissions to the Supervisor namespace.*


- Assign a storage policy to the namespace so that the pods in the Argo CD instance can consume storage.


![Screenshot showing a storage policy being selected for the namespace.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image06.png)


*Figure 6: Selecting a storage policy to be usable by the namespace.*

That&rsquo;s all the configuration that we need. Now I can go ahead and deploy Argo CD.


### ArgoCD Deployment 
 
 
 
 [#](#argocd-deployment)
 
 


As with most operators, they&rsquo;re configured to monitor namespaces and look for the creation or modification of specific resources. In this case I will create an Argo CD resource that the operator will then react to and deploy Argo CD.


```
` 1
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
`
```


```
`apiVersion: argoproj.io/v1beta1
kind: ArgoCD
metadata:
 name: argocd
 labels:
 example: basic
spec:
 nodePlacement:
 nodeSelector:
 kubernetes.io/os: CRX
 server:
 service:
 type: LoadBalancer
# Currently Redis images are downloaded from Dockerhub and may be subject to download rate limits. 
# To overcome this, use a proxy cache or host the image on another registry.
# In such scenarios, uncomment the next two lines, and update the registry image path accordingly. 
# redis:
# image: my-registry/proxy-cache/library/redis
`
```


The only change that I made from the actual sample was to change the value in the &ldquo;name&rdquo; field (line 4). The sample uses &ldquo;my-demo-argocd&rdquo; as the name and this value is reflected in all of the resources that are created. So for me, just &ldquo;argocd&rdquo; is fine!
The deployment is simple. You can see below the steps that I went through, but I&rsquo;ll detail them afterwards.


![Screenshot showing terminal commands and results for deploying Argo CD.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image07.png)


*Figure 7: Terminal commands and results of deploying Argo CD.*

The first step is authenticating to the Supervisor cluster. Here I have a [profile function that I use](/posts/2025/profile-function-for-authenticating-to-vmware-vks/). As you can see, it returns a list of the contexts that I have access to.
The second step is to select the correct context to use. This is the &ldquo;argocd&rdquo; namespace that I created above.

```
`k config use-context argocd
`
```
The deployment itself just requires applying the instance yaml that I created above:

```
`k apply -f argocd-instance.yaml
`
```
The final step is just to examine the resources that have been provisioned:

```
`k get all
`
```
You can see the services, pods, deployments etc that have been created in the earlier screenshot. Most importantly, the external IP address for the &ldquo;argocd-server&rdquo; service (which I highlighted above), this can be used to create a DNS record for Argo CD.
With that done, it&rsquo;s simply a matter of pointing a browser at the chosen URL:


![Screenshot showing the Argo CD login screen.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image08.png)


*Figure 8: The Argo CD splash / login screen.*

To login to Argo CD, the default username is &ldquo;admin&rdquo; and the corresponding password can be found by running the following command:

```
`kubectl -n argocd get secret argocd-cluster -o jsonpath='{.data.admin\.password}' | base64 -d
`
```


### TLS Configuration 
 
 
 
 [#](#tls-configuration)
 
 


Now that the deployment has been completed, I wanted to take care of the TLS configuration. By default, a self-signed certificate is automatically generated for use by Argo CD. Of course it&rsquo;s not trusted by any browser aside from the obvious security concerns, it&rsquo;s plain annoying!
The certificate in question gets created in a secret called &ldquo;argocd-tls&rdquo;. Here it is as viewed through k9s.


![Screenshot showing the decoded argocd-tls secret in k9s.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image09.png)


*Figure 9: The argocd-tls secret is inspected using the k9s tool.*

It would be nice to use cert-manager and my Vault PKI to replace the certificate, but I don&rsquo;t have cert-manager available in the Supervisor cluster at present. I can generate a trusted certificate in Vault though.


![Screenshot showing the new certificate generated in the Vault UI.](/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/images/image10.png)


*Figure 10: The new cert is saved from Vault as tls.crt and the corresponding key as tls.key.*

Having stored the certificate and key locally as the files tls.crt and tls.key, I can update the secret in the argocd namespace using the following command:

```
`kubectl create secret tls argocd-tls --save-config --dry-run=client --key tls.key --cert tls.crt -o yaml | kubectl apply -f -
`
```
Just like that, TLS is for Argo CD is using a trusted certificate and I can start using it to manage applications and clusters.


### Summary and Next Steps 
 
 
 
 [#](#summary-and-next-steps)
 
 


To summarise, I have deployed the Argo CD Operator as a Supervisor Service and used it to create an instance of Argo CD. That instance is automatically made available externally to the Supervisor cluster as an application using the NSX and Avi networking. I subsequently replaced the self-signed TLS certificate with a trusted one. Argo CD is now ready to start managing applications.

 
 
 
 
 
 

 
 
 
 
 
 
 [
 

 
 

 


 ](https://www.linkedin.com/shareArticle?mini=true&url=https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/&title=Deploying%20Argo%20CD%20as%20a%20vSphere%20Supervisor%20Service)
 
 
 
 [
 

 
 
 


 ](https://bsky.app/intent/compose?text=Deploying%20Argo%20CD%20as%20a%20vSphere%20Supervisor%20Service&#43;https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)
 
 
 
 [
 

 
 
 


 ](https://twitter.com/intent/tweet/?url=https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/&text=Deploying%20Argo%20CD%20as%20a%20vSphere%20Supervisor%20Service)
 
 
 
 [
 

 
 

 


 ](https://reddit.com/submit/?url=https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/&resubmit=true&title=Deploying%20Argo%20CD%20as%20a%20vSphere%20Supervisor%20Service)
 
 
 
 [
 

 
 

 


 ](https://pinterest.com/pin/create/bookmarklet/?url=https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/&description=Deploying%20Argo%20CD%20as%20a%20vSphere%20Supervisor%20Service)
 
 
 
 [
 

 
 

 


 ](/cdn-cgi/l/email-protection#7b4419141f0246130f0f0b08415454160b1414091e551214540b14080f0854494b494e541f1e0b17140212151c561a091c1456181f561a08561a560d080b131e091e56080e0b1e090d1208140956081e090d12181e545d1a160b40080e19111e180f463f1e0b17140212151c5e494b3a091c145e494b383f5e494b1a085e494b1a5e494b0d280b131e091e5e494b280e0b1e090d120814095e494b281e090d12181e)
 
 
 


 


### Related


 
 

 [
 
 
 
 
 
 

 

 
 Profile function for authenticating to VMware VKS
 

 
 


 


 


 
 
 28 January 2025&middot;3 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VKS
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VMware
 

 
 
 
 
 
 Script
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 vSphere
 

 
 
 
 
 
 Supervisor
 

 
 
 
 
 
 LazyOps
 

 
 
 
 
 


 

 
 
 The vSphere plugin for kubectl allows you to authenticate to VMware VKS clusters with ease, but what if you&rsquo;re a lazy typist? Lighten the load with this function!
 
 
 
 

 
 
 ](/posts/2025/profile-function-for-authenticating-to-vmware-vks/)

 
 

 [
 
 
 
 
 
 

 

 
 Profile function for authenticating to VMware CCI
 

 
 


 


 


 
 
 28 January 2025&middot;2 mins
 

 
 


 
 
 
 
 
 
 
 
 
 VCF Automation
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 vExpert
 

 
 
 
 
 
 VMware
 

 
 
 
 
 
 Script
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 vSphere
 

 
 
 
 
 
 CCI
 

 
 
 
 
 
 LazyOps
 

 
 
 
 
 


 

 
 
 If you thought that using the vSphere plugin for kubectl required some typing, the CCI plugin requires more! Let&rsquo;s simplify that process…
 
 
 
 

 
 
 ](/posts/2025/profile-function-for-authenticating-to-vmware-cci/)

 
 

 [
 
 
 
 
 
 

 

 
 Supervisor cluster running out of disk space in /dev/root
 

 
 


 


 


 
 
 25 January 2025&middot;4 mins
 

 
 


 
 
 
 
 
 
 
 
 
 vSphere
 

 
 
 
 
 
 Supervisor
 

 
 
 
 
 
 VKS
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 VMware
 

 
 
 
 
 
 vExpert
 

 
 
 
 
 
 Homelab
 

 
 
 
 
 
 Kubernetes
 

 
 
 
 
 


 

 
 
 What do you do in the /dev/root filesystem in your Supervisor cluster is running out of room? Log a support request! But there is a short-term fix that I can share.
 
 
 
 

 
 
 ](/posts/2025/supervisor-cluster-running-out-of-disk-space-in-dev-root/)

 


 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 

 
 
 
 
 
 


 
 
 
 
 [
 &larr;
 &rarr;
 
 Using descriptions AND source control for VCF Automation templates
 
 
 19 February 2025
 
 
 
 ](/posts/2025/using-descriptions-and-source-control-for-vcf-automation-templates/)
 
 
 
 
 [
 
 phpIPAM integration for VMware VCF Automation 8.x
 
 
 31 December 2025
 
 
 
 &rarr;
 &larr;
 ](/posts/2025/phpipam-integration-for-vmware-vcf-automation-8-x/)
 
 
 
 
 


 
 
 


 
 
 


[comments powered by Disqus](https://disqus.com)

---

*Originally published at: [https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/](https://mpoore.io/posts/2025/deploying-argo-cd-as-a-vsphere-supervisor-service/)*