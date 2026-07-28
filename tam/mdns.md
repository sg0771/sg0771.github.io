在说mDNS之前，我们可以先来回顾一下什么是DNS，以及传统的DNS的实现原理。



DNS的全称是Domain Name Service。作用就是把难以记忆的IP地址，能翻译转换为方便记忆的名称。就相当于打电话使用的电话本，把姓名与电话号码联系在一起，方便人们在打电话（访问远程计算机）之前，根据姓名（计算机域名）来查找电话号码（计算机的IP地址）。



我们先从DNS的出身说起，在计算机的上古时期，根本就没有DNS这一说，全世界也就那么几台计算机连接在一起，需要访问的计算机也很少，只需要在经常要访问的计算机的IP地址，记录到小本本上，在访问之前查询一下就行了。这个小本本，在linux上就是/etc/hosts文件，在windows上就是C:\windows\System32\drivers\etc\hosts文件，这个文件里面就可以记录名称与IP地址对。在访问的时候，我们只要在浏览器中输入名称，操作系统就可以通过自动查找名称来访问对应的IP地址了。



后来，计算机网络飞速发展，计算机网络也越来越庞大，这个电脑上的小本本，显然不能满足要求了。这个时候呢，人们就想到了，在一台服务器上可以建立一个这样的服务，能提供DNS查询服务，访问者只需要知道DNS服务器的IP地址，就可以先连接DNS服务器，发送要查询的域名，来得到对应的IP地址了。所以我们在计算机手动设置或者通过DHCP自动分配IP的时候，都会得到一个网关地址和DNS服务器地址（通常情况下，网关一般都同时作为代理DNS服务器，可以转发缓存DNS请求响应，充当DNS服务器的角色）。



有了这个DNS服务器后，域名注册服务行业也应运而生，各个公司或者个人都可以注册域名，把自己的名称与IP地址登记到DNS服务器上，方便其他人查询访问。有了DNS，我们才能访问http://baidu.com、http://zhihu.com等网站，而不用记录背后对于的IP地址。



有了DNS后，就免去了记录IP地址的麻烦了。但是在局域网络中，或者临时搭建的家庭网络，局域网络中，我们去搭建维护这样的DNS服务还是比较麻烦，而且DNS服务还只能实现名称与IP地址的翻译，不能标记各种服务，比如自动发现查找打印机地址等待，这个时候mDNS就派上用场了。



mDNS优势就是不需要用户在局域网络中再去建立和维护这个的服务了，mDNS利用局域网的UDP组播，让每台加入网络中的设备，向网络组播发布自己的主机名与IP地址，并且组播和应答自己提供的服务的名称与端口等信息。 同一个局域网络下的设备，也通过组播发送请求，就能得到应答了。



mDNS的优势就是，自组织的网络，不需要单独的中心DNS和DHCP服务器了，也能够自动协商分配IP地址，建立名称与IP的映射服务，发布各种自定义的服务与端口等。



mDNS最早是apple公司发布并实现的，MAC系统内建了mDNS服务，并且提供系统API供应用程序访问，并且将这部分代码开源了。开源的代码，包括Mac/Windows/Posix(linux/unix)等操作系统的适配代码，可以移植编译到各个操作系统使用。Andriod也引入了mDNS，并提供系统层面的接口供应用程序使用。



以linux为例，应用程序使用可以通过采用后台进行和客户端的方式：



1、运行mdnsd后台程序，这个程序运行后，启动unix domain socket监听，接收并响应客户端的各种mDNS服务请求。



2、还有一个dns-sd客户端程序，可以使用各种参数给mdnsd后台发送请求，实现各种mDNS的功能。另外用户还可以在自己开发的应用程序中链接使用libmdns_sd.so来给mdnsd后台发送服务请求，实现和dns-sd类似的功能。



// 下面命令可以注册一个名称为test的_myservice._udp服务

// 在发布服务的时候还可以提供一些额外的参数，比如version,dsn,data等等，这些Key=Value的键值对可以自由定义

dns-sd -R "test" _myservice._udp local 12345 version=1 dsn=123456789 data=AABBCCDD



// 下面命令可以发布一条服务和一条主机名称与地址记录(myhost.local => 192.168.50.128)

dns-sd -P "testP" _myservice._tcp  local 2233 myhost.local "192.168.50.128" version=1 dsn=123456789 data=AABBCCDD



// 下面的命令可以查询_myservice._udp服务

dns-sd -Z _myservice._udp local



// ping myhost.local应该就可以收到来自主机192.168.50.128的ping响应，注意，此地址为示意，示意时需要用时间的地址。

查看dns-sd的响应的实现，可以发现上述过程注意使用了一下接口函数。



// 发布本机名称与IP地址记录

DNSServiceCreateConnection()

DNSServiceRegisterRecord()  



// 注册服务

TXTRecordCreate()

TXTRecordSetValue()

DNSServiceRegister()



// 取消发布与注册的服务

DNSServiceRefDeallocate();

另外，应用程序还可以参靠mDnsResponsePosix等程序的方式，把后台进程和客户端功能结合到一起，相当于应用程序直接自己在网络上监听端口，并响应对应的服务。

