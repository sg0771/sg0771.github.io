# C++11 多线程与并发编程指南

C++11 标准库引入了强大的并发编程支持，使得开发者可以跨平台地编写多线程程序。本文档整理了 C++11 中最常用的并发库组件：`std::thread`、`std::mutex`、`std::condition_variable`、`std::future` 以及 `std::async` 的核心内容与用法。

---

## 1. `std::thread` (线程)

`std::thread` 用于创建和管理线程。它是 C++ 并发编程的基础。

### 1.1 创建线程
可以通过普通函数、Lambda 表达式或类成员函数来创建线程。

```cpp
#include <iostream>
#include <thread>

void print_hello(int n) {
    std::cout << "Hello from thread! n = " << n << std::endl;
}

int main() {
    // 1. 使用普通函数创建线程，并传递参数
    std::thread t1(print_hello, 42);

    // 2. 使用 Lambda 表达式创建线程
    std::thread t2([]() {
        std::cout << "Hello from lambda thread!" << std::endl;
    });

    // 必须在 thread 对象销毁前调用 join() 或 detach()
    t1.join(); // 阻塞当前主线程，直到 t1 执行完毕
    t2.join();

    return 0;
}
```

### 1.2 `join()` 与 `detach()`
- **`join()`**: 阻塞当前线程，直到被调用的线程执行完毕。
- **`detach()`**: 将线程与当前 thread 对象分离，使其在后台独立运行（成为守护线程）。一旦 detach，就无法再通过该对象控制或等待该线程。

**注意**: 必须在 `std::thread` 对象生命周期结束前调用两者之一，否则会触发 `std::terminate()` 导致程序崩溃。

---

## 2. `std::mutex` (互斥量) 与锁

`std::mutex` 用于保护共享数据，避免多个线程同时访问导致的数据竞争问题。

### 2.1 基础互斥量 `std::mutex`
可以使用 `lock()` 和 `unlock()` 手动控制，但不推荐，因为如果在两者之间发生异常，会导致死锁。

### 2.2 RAII 锁机制 (推荐)
C++11 提供了两种常用的 RAII (Resource Acquisition Is Initialization) 锁封装，确保离开作用域时自动释放锁。

#### `std::lock_guard`
轻量级，构造时加锁，析构时解锁。不能手动解锁或拷贝。

```cpp
#include <iostream>
#include <thread>
#include <mutex>

int shared_data = 0;
std::mutex mtx;

void add_data() {
    for (int i = 0; i < 1000; ++i) {
        // 自动加锁，离开作用域自动解锁
        std::lock_guard<std::mutex> lock(mtx);
        shared_data++;
    }
}
```

#### `std::unique_lock`
比 `lock_guard` 更灵活，支持手动加锁/解锁、延迟加锁等，并且是配合 `std::condition_variable` 的必备工具。开销略微大一点。

```cpp
void process_data() {
    std::unique_lock<std::mutex> lock(mtx); // 构造时加锁
    shared_data++;
    lock.unlock(); // 允许提前手动解锁
    // do some non-critical work...
    lock.lock(); // 再次加锁
}
```

---

## 3. `std::condition_variable` (条件变量)

`std::condition_variable` 用于线程间的同步通信。它允许一个线程挂起（等待），直到另一个线程唤醒它（满足特定条件）。

### 3.1 核心方法
- **`wait(lock, predicate)`**: 阻塞当前线程，直到收到通知且 `predicate`（条件谓词，通常是 Lambda）返回 `true`。等待时会自动释放锁，被唤醒时会自动重新获取锁。
- **`notify_one()`**: 随机唤醒一个正在等待的线程。
- **`notify_all()`**: 唤醒所有等待的线程。

### 3.2 使用示例 (生产者-消费者模型)

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> data_queue;
bool finished = false;

// 生产者
void producer() {
    for (int i = 1; i <= 5; ++i) {
        std::this_thread::sleep_for(std::chrono::milliseconds(100)); // 模拟工作
        {
            std::lock_guard<std::mutex> lock(mtx);
            data_queue.push(i);
            std::cout << "Produced: " << i << std::endl;
        }
        cv.notify_one(); // 通知消费者
    }
    
    {
        std::lock_guard<std::mutex> lock(mtx);
        finished = true;
    }
    cv.notify_all();
}

// 消费者
void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        // 阻塞等待：直到队列不为空，或者生产者已完成
        cv.wait(lock, []{ return !data_queue.empty() || finished; });
        
        while (!data_queue.empty()) {
            int val = data_queue.front();
            data_queue.pop();
            std::cout << "Consumed: " << val << std::endl;
        }
        
        if (finished && data_queue.empty()) break;
    }
}

int main() {
    std::thread prod(producer);
    std::thread cons(consumer);
    prod.join();
    cons.join();
    return 0;
}
```
*注：`wait` 使用 Lambda 表达式作为第二个参数是为了防止**虚假唤醒** (Spurious wakeup)。*

---

## 4. 异步编程: `std::future` 与 `std::async`

当我们不仅需要执行多线程任务，还需要获取任务的**返回值**或捕捉**异常**时，直接使用 `std::thread` 会比较麻烦。C++11 提供了 `<future>` 头文件来实现异步编程。

### 4.1 `std::async`
`std::async` 是一个高级模板函数，用于异步启动一个任务（可能在新线程中，也可能在同一线程中延迟执行），并返回一个 `std::future` 对象用于获取结果。

```cpp
#include <iostream>
#include <future>
#include <thread>

int complex_calculation(int a, int b) {
    std::this_thread::sleep_for(std::chrono::seconds(2)); // 模拟耗时任务
    return a + b;
}

int main() {
    // 异步启动任务
    // 启动策略: std::launch::async (强制创建新线程) 或 std::launch::deferred (延迟到 get() 时在当前线程执行)
    std::future<int> result_future = std::async(std::launch::async, complex_calculation, 10, 20);

    std::cout << "Doing other work in main thread..." << std::endl;

    // 获取异步执行的结果
    // .get() 会阻塞当前线程，直到异步任务完成并返回结果
    int result = result_future.get();
    
    std::cout << "Result: " << result << std::endl;
    return 0;
}
```

### 4.2 `std::future`
`std::future` 提供了一种访问异步操作结果的机制。
- **`get()`**: 获取结果。只能调用一次，调用后 `future` 对象即变为无效状态。
- **`wait()`**: 等待异步操作完成，但不获取结果。
- **`wait_for()`**: 等待指定的时间间隔。可用于检查任务状态（如超时机制）。

### 4.3 进阶：`std::promise` 与 `std::packaged_task`
除了 `std::async`，C++11 还提供了其他获取 `std::future` 的方式：
- **`std::promise`**: 允许你在某个线程中手动设置一个值或异常，在另一个线程中通过与之关联的 `std::future` 获取。
- **`std::packaged_task`**: 包装任何可调用对象（函数、Lambda等），以便它可以被异步调用。它的执行结果会自动被设置到关联的 `std::future` 中。

```cpp
// std::promise 示例
void do_work(std::promise<int>& prom) {
    std::this_thread::sleep_for(std::chrono::seconds(1));
    prom.set_value(100); // 存入结果
}

int main() {
    std::promise<int> prom;
    std::future<int> fut = prom.get_future(); // 获取关联的 future
    
    std::thread t(do_work, std::ref(prom));
    
    std::cout << "Promise result: " << fut.get() << std::endl; // 阻塞等待获取 100
    t.join();
    return 0;
}
```

---

## 总结

C++11 提供的并发组件形成了一个完整而强大的体系：
1. **`std::thread`**: 提供底层的线程创建和管理能力。
2. **`std::mutex` & 锁**: 提供底层的数据保护。通过 `std::lock_guard` / `std::unique_lock` 实现安全的 RAII 管理。
3. **`std::condition_variable`**: 解决线程间复杂的等待和同步问题。
4. **`std::async` & `std::future`**: 提供更高阶的抽象，让我们只需关注"任务"及其"返回值"，免去了手动管理线程和同步共享结果（锁/条件变量）的繁琐。
