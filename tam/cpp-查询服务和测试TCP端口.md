~~~cpp

#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <libusb.h>
#include <libimobiledevice/libimobiledevice.h>
#include <libimobiledevice/lockdown.h>
#include <stdio.h>
#pragma comment(lib, "ws2_32.lib")

// 检查 AppleMobileDeviceService 是否运行
static bool amds_service_running(void)
{
    SC_HANDLE hSCM = OpenSCManagerA(NULL, NULL, SC_MANAGER_CONNECT);
    if (!hSCM) return false;
    SC_HANDLE hService = OpenServiceA(hSCM, "AppleMobileDeviceService", SERVICE_QUERY_STATUS);
    if (!hService) {
        CloseServiceHandle(hSCM);
        return false;
    }
    SERVICE_STATUS status;
    QueryServiceStatus(hService, &status);
    CloseServiceHandle(hService);
    CloseServiceHandle(hSCM);
    return status.dwCurrentState == SERVICE_RUNNING;
}

// 探测 usbmux 27015端口连通性
static bool amds_usbmux_port_ok(void)
{
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2,2), &wsaData) != 0)
        return false;
    SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET) {
        WSACleanup();
        return false;
    }
    u_long mode = 1;
    ioctlsocket(sock, FIONBIO, &mode);
    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(27015);
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);
    connect(sock, (struct sockaddr*)&addr, sizeof(addr));
    fd_set wfds;
    FD_ZERO(&wfds);
    FD_SET(sock, &wfds);
    struct timeval tv = {0, 100000};
    int ret = select(0, NULL, &wfds, NULL, &tv);
    closesocket(sock);
    WSACleanup();
    return ret > 0;
}

~~~
