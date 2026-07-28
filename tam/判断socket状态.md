# 怎样实时判断socket连接状态？ 

对端正常close socket，或者进程退出（正常退出或崩溃），对端系统正常关闭

这种情况下，协议栈会走正常的关闭状态转移，使用epoll的话，一般要判断如下几个情况
处理可读事件时，在循环read后，返回结果为0

处理可写事件时，write返回-1，errno为EPIPE

EPOLLERR或EPOLLHUP或事件

对端非正常断开，比如服务器断电，网线被拔掉

这种情况下，协议栈无法感知，SO_KEEPALIVE这个选项的超时事件太长并不实用，一般还是以应用层的heartbeat来及时发现。
下面来罗列一下判断远端已经断开的方法：
法一：
当recv()返回值小于等于0时，socket连接断开。但是还需要判断 errno是否等于 EINTR，如果errno == EINTR 则说明recv函数是由于程序接收到信号后返回的，socket连接还是正常的，不应close掉socket连接。
法二：
struct tcp_info info; 
  int len=sizeof(info); 
  getsockopt(sock, IPPROTO_TCP, TCP_INFO, &info, (socklen_t *)&len);
  if((info.tcpi_state==TCP_ESTABLISHED))  则说明未断开  else 断开
函数封装，单独使用（没有使用read、write、select时），判读网络是否断开。
法三：
若使用了select等系统函数，若远端断开，则select返回1，recv返回0则断开。其他注意事项同法一。
法四：
int keepAlive = 1; // 开启keepalive属性
int keepIdle = 60; // 如该连接在60秒内没有任何数据往来,则进行探测
int keepInterval = 5; // 探测时发包的时间间隔为5 秒
int keepCount = 3; // 探测尝试的次数.如果第1次探测包就收到响应了,则后2次的不再发.
setsockopt(rs, SOL_SOCKET, SO_KEEPALIVE, (void *)&keepAlive, sizeof(keepAlive));
setsockopt(rs, SOL_TCP, TCP_KEEPIDLE, (void*)&keepIdle, sizeof(keepIdle));
setsockopt(rs, SOL_TCP, TCP_KEEPINTVL, (void *)&keepInterval, sizeof(keepInterval));
setsockopt(rs, SOL_TCP, TCP_KEEPCNT, (void *)&keepCount, sizeof(keepCount));
设置后，若断开，则在使用该socket读写时立即失败，并返回ETIMEDOUT错误
任何一端有数据发送就不会启动keepalive，参考：通过设置TCP_USER_TIMEOUT参数来判断tcp连接是否断开。
unsigned int timeout = 1000; //值为数据包被发送后未接收到ACK确认的最大时长，以毫秒

//为单位，例如设置为timeout时，代表如果发送出去的数据包

//在timeout毫秒内未收到ACK确认，则下一次调用send或者recv，

//函数会返回-1，errno设置为ETIMEOUT，代表connection timeout。

//使用TCP Keep-alive加上TCP_USER_TIMEOUT机制，就可以完美解

//决通信对端异常断网、掉电的情况下，连接被长期挂起的问题了。

setsockopt(socket_fd, IPPROTO_TCP, 18, &timeout, sizeof(timeout));

//setsockopt(socket_fd, IPPROTO_TCP, TCP_USER_TIMEOUT, &timeout, sizeof(timeout));

法五：
自己实现一个心跳检测，一定时间内未收到自定义的心跳包则标记为已断开。
参考：
1. 知乎：怎样实时判断socket链接状态？
2. 知乎：socket长连接是否会超时？连接中断，客户端或者服务器端是否一定能得到通知呢？
3. 如何判断SOCKET已经断开
4. TCP socket如何判断连接断开
5. 服务器中判断客户端socket断开连接的方法
6. tcp 服务端如何判断客户端断开连接