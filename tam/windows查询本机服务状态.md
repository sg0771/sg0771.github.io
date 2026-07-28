

~~~cpp
#include <iostream>
#include <tchar.h>
#include <Windows.h>
using namespace std;
/*  检查Windows服务状态信息
    使用API:
    OpenSCManager
    OpenService
    QueryServiceStatusEx
*/
int main(void)
{
    TCHAR szSvcName[]       = _T("HistorySvr");
    SC_HANDLE schSCManager  = NULL;
    SC_HANDLE schService    = NULL;
    SERVICE_STATUS_PROCESS ssStatus;
    DWORD dwOldCheckPoint   = 0;
    DWORD dwStartTickCount  = 0;
    DWORD dwWaitTime        = 0;
    DWORD dwBytesNeeded     = 0;
    // Get a handle to the SCM database.
    schSCManager = OpenSCManager(
                       NULL,                                // local computer
                       NULL,                                // ServicesActive database
                       SC_MANAGER_ALL_ACCESS);              // full access rights
    if (NULL == schSCManager)
    {
        printf("OpenSCManager failed (%d) ", GetLastError());
    }
    // Get a handle to the service.
    schService = OpenService(
                     schSCManager,                      // SCM database
                     szSvcName,                         // name of service
                     SERVICE_QUERY_STATUS |
                     SERVICE_ENUMERATE_DEPENDENTS);     // full access
    if (schService == NULL)
    {
        printf("OpenService failed (%d) ", GetLastError());
        CloseServiceHandle(schSCManager);
    }
    // Check the status in case the service is not stopped.
    if (!QueryServiceStatusEx(
                schService,                         // handle to service
                SC_STATUS_PROCESS_INFO,             // information level
                (LPBYTE) &ssStatus,                 // address of structure
                sizeof(SERVICE_STATUS_PROCESS),     // size of structure
                &dwBytesNeeded ) )                  // size needed if buffer is too small
    {
        printf("QueryServiceStatusEx failed (%d) ", GetLastError());
        CloseServiceHandle(schService);
        CloseServiceHandle(schSCManager);
    }
    else
    {
        // Check if the service is already running. It would be possible
        // to stop the service here, but for simplicity this example just returns.
        printf("Service status: ");
        switch(ssStatus.dwCurrentState)
        {
        case SERVICE_STOPPED:
        case SERVICE_STOP_PENDING:
            printf("Stop");
            break;
        case SERVICE_PAUSED:
        case SERVICE_PAUSE_PENDING:
            printf("Pause");
            break;
        case SERVICE_CONTINUE_PENDING:
        case SERVICE_RUNNING:
        case SERVICE_START_PENDING:
            printf("Running");
            break;
        }
        cout << endl;
    }
    cin.get();
    return 0;
}
~~~