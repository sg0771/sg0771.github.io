mDNS是什么,mDNS与DNS的关系？

mdns 即多播dns（Multicast DNS），mDNS主要实现了在没有传统DNS服务器的情况下使局域网内的主机实现相互发现和通信，使用的端口为5353，遵从dns协议，使用现有的DNS信息结构、名语法和资源记录类型。并且没有指定新的操作代码或响应代码。



mDNS的作用是？

在局域网中，设备和设备之前相互通信需要知道对方的ip地址的，大多数情况，设备的ip不是静态ip地址，而是通过dhcp 协议动态分配的ip 地址，要进行通信，就必须知道对方的ip地址，

mDNS的作用就是解决这个问题



mDNS工作原理

mdns 工作原理简单描述：



每个进入局域网内的主机，如果开启了 mDNS服务的话，都会向局域网内的所有主机组播一个消息，例如，我是谁以及我的IP地址是多少等，然后其他开启mDNS服务的主机就会发出响应，例如，我是谁以及我的IP地址是多少等。比如，A主机进入了局域网，开启了 mDNS服务，并向mDNS服务注册一下信息:我提供FTP服务，我的IP地址是192.168.1.101，端口号是21。当B主机进入局域网，并向B主机的mDNS服务请求，我要找局域网内FTP服务器，此时B主机的mDNS就会去局域网内向其他的mDNS询问，并且会告诉B主机，有一个IP地址为192.168.1.101，端口号是21的主机，也就是A主机提供FTP服务，所以B主机就知道了 A主机的IP地址和端口号了。



mDNS协议

QU:单播

QM:多播



A 记录:主机名称和IPV4之间的对应关系。

AAAA 记录:主机名称和IPV6之间的对应关系。

SRV 记录:标识服务实例名称对应哪一个主机名和端口号。

PTR 记录:标识服务实例名称和服务类型之间的对应关系，一般在查询具有相同服务类型的实例时使用。

TXT 记录:对某个服务实例提供的附加信息按照key/value形式给出。

ANY 记录:任意类型，一般用于查询中。



mdns步骤

1、发送一个 类型为PTR记录的 QM/QR 请求



Queries

_gavinMdnsTest._tcp.local: type PTR, class IN, "QM" question

Name: _gavinMdnsTest._tcp.local 需要查询的 服务.传输协议.域名

[Name Length: 25] 名字的长度 25bit

[Label Count: 3] 三个标签

Type: PTR (domain name PoinTeR) (12) 类型：PTR

.000 0000 0000 0001 = Class: IN (0x0001)

0… …. …. …. = "QU" question: False

—— or ——-

1… …. …. …. = "QU" question: True

2、QM响应，得到 完整实例名称



Answers

_gavinMdnsTest._tcp.local: type PTR, class IN, gavinDevice1000003130._gavinMdnsTest._tcp.local

Name: _gavinMdnsTest._tcp.local

Type: PTR (domain name PoinTeR) (12)

.000 0000 0000 0001 = Class: IN (0x0001)

0… …. …. …. = Cache flush: False

Time to live: 4488

Data length: 24

Domain Name: gavinDevice1000003130._gavinMdnsTest._tcp.local





DNS-SD协议

mDns协议规定了消息的基本格式和消息的收发的基本顺序，DNS-SD 协议在这基础上，首先对实例名，服务名称，域名长度/顺序等作出了具体的定义，然后规定了如何方便地进行服务发现和描述。



<instance>.<service>.<transport>.<domain>

instance表示服务的实例名

service表示的是要查询的服务，

transport表示的是传输的协议：TCP还是UDP，

domain表示查询的域，在mDNS中为.local，

eg:

test_1000003130._gavinMdnsTest._tcp.local

test_10002b10b4.test._tcp.local



服务类型表明该服务是使用什么协议实现的，由 _ 下划线和服务使用的协议名称组成，如大部分使用的 _tcp 协议，另外，可以同时使用多个协议标签，如: “_http._tcp” 就表明该服务类型使用了基于tcp的http协议。



域名一般都固定为 “local”



DNS-SD 协议使用了PTR、SRV、TXT 3种类型的资源记录来完整地描述了一个服务。当主机通过查询得到了一个PTR响应记录后，就获得了一个它所关心服务的实例名称，它可以同通过继续获取 SRV 和 TXT 记录来拿到进一步的信息。其中的 SRV 记录中有该服务对应的主机名和端口号。TXT 记录中有该服务的其他附加信息。