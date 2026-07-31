# C++11 核心特性详解与资料整理

C++11 是 C++ 语言历史上的一次重大更新，被广泛认为是“现代 C++ (Modern C++)”的开端。它不仅修复了传统 C++ 的诸多痛点，还大幅提升了语言的安全性、可读性和性能。

以下是 C++11 核心特性的分类整理：

## 1. 类型推导 (Type Inference)

### `auto` 关键字
让编译器根据初始化表达式自动推导变量的类型。极大地简化了复杂类型的书写（尤其是迭代器）。
```cpp
std::vector<int> v = {1, 2, 3};
for (auto it = v.begin(); it != v.end(); ++it) {
    // 处理迭代器
}
```

### `decltype` 关键字
用于在编译期推导表达式的类型，常用于泛型编程和模板中。
```cpp
int x = 0;
decltype(x) y = 1; // y 的类型是 int
```

## 2. 内存管理：智能指针 (Smart Pointers)
引入了 `<memory>` 头文件中的智能指针，用于自动管理动态分配的内存，基本取代了裸指针的 `new` 和 `delete`，有效防止内存泄漏。

* **`std::unique_ptr`**: 独占所有权的智能指针。不能被拷贝，只能被移动 (`std::move`)。
* **`std::shared_ptr`**: 共享所有权的智能指针。基于引用计数，当计数为 0 时自动释放内存。
* **`std::weak_ptr`**: 与 `shared_ptr` 配合使用，解决循环引用问题，不增加引用计数。

```cpp
std::unique_ptr<int> p1(new int(10));
std::shared_ptr<int> p2 = std::make_shared<int>(20); // 推荐的创建方式
```

## 3. 右值引用与移动语义 (Rvalue References & Move Semantics)
C++11 性能提升的基石。允许资源的所有权从一个对象“移动”到另一个对象，而不是进行昂贵的深度拷贝。

* **右值引用 (`&&`)**: 绑定到临时对象（右值）。
* **`std::move`**: 将左值无条件转换为右值引用，从而触发移动构造函数或移动赋值运算符。

```cpp
std::string str1 = "Hello C++11";
std::string str2 = std::move(str1); // str1 的内容被移动到 str2，避免了拷贝开销
```

## 4. 函数与回调：Lambda 表达式
允许在代码内部定义匿名的内联函数（闭包），非常适合与 STL 算法结合使用。

**语法**: `[捕获列表](参数列表) -> 返回类型 { 函数体 }`

```cpp
std::vector<int> v = {4, 1, 3, 5, 2};
// 使用 lambda 进行降序排序
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a > b; 
});
```

## 5. 并发编程 (Concurrency)
C++11 首次在语言标准层面引入了多线程支持，不再依赖平台特定的 API (如 pthreads 甚至 Windows API)。

* **`<thread>`**: 线程管理。
* **`<mutex>`**: 互斥锁，用于保护多线程环境下的共享数据。
* **`<condition_variable>`**: 条件变量，用于线程间同步。
* **`<future>` & `<async>`**: 异步任务执行与结果获取。

```cpp
#include <thread>
#include <iostream>

void task() { std::cout << "Thread is running
"; }

int main() {
    std::thread t(task);
    t.join(); // 等待子线程结束
    return 0;
}
```

## 6. 语法糖与日常开发改进

* **基于范围的 for 循环 (Range-based for loop)**:
  ```cpp
  std::vector<int> v = {1, 2, 3};
  for (const auto& item : v) { 
      std::cout << item << " "; 
  }
  ```
* **`nullptr`**: 强类型空指针常量，完全取代容易引发歧义的宏 `NULL`。
* **`constexpr`**: 声明常量表达式，指示编译器在编译期计算其值，提升运行时性能。
* **`enum class`**: 强类型枚举，解决了传统枚举作用域泄漏和隐式类型转换的问题。
* **`override` 与 `final`**: `override` 明确虚函数的重写意图，防止拼写或参数错误；`final` 防止类被继承或虚函数被进一步重写。
* **类型别名 (`using`)**: 替代 `typedef`，语法更清晰，且完美支持模板。
  ```cpp
  template <typename T>
  using StringMap = std::map<std::string, T>;
  ```

## 7. 核心标准库扩充
* **`<unordered_map>` / `<unordered_set>`**: 基于哈希表实现的高效关联容器，查找时间复杂度接近 O(1)。
* **`<array>`**: 封装了原生定长数组，提供 STL 风格的接口并具备边界检查功能。
* **`<tuple>`**: 可以将多个不同类型的值组合在一起（本质上是 `std::pair` 的泛化版本）。

---
*整理说明：C++11 是理解所有后续现代 C++ 版本（14/17/20/23）的基础，熟练掌握以上内容能够大幅提升代码质量和工程效率。*
