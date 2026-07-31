# C++14 核心特性详解与资料整理

C++14 是在 C++11 基础上的一个“小版本”更新。它的主要目标是“查漏补缺”，即修复 C++11 中的一些痛点，放宽一些限制，并添加了一些让开发者编写代码更顺手的实用特性。

以下是 C++14 核心特性的分类整理：

## 1. 泛型与类型推导的强化

### 函数返回类型推导
在 C++11 中，如果使用 `auto` 作为返回类型，通常需要使用尾随返回类型（`-> decltype(...)`）。C++14 允许直接使用 `auto`，编译器会通过 `return` 语句自动推导。
```cpp
auto add(int a, int b) {
    return a + b; // 自动推导返回类型为 int
}
```

### 泛型 Lambda 表达式 (Generic Lambdas)
Lambda 表达式的参数现在可以使用 `auto`，这实际上是在底层生成了一个模板化的 `operator()`，使得 Lambda 更加灵活。
```cpp
auto print_and_add = [](auto x, auto y) {
    std::cout << x << ", " << y << '
';
    return x + y;
};
// 可以接受不同类型的参数
int sum1 = print_and_add(1, 2);
double sum2 = print_and_add(1.5, 2.5);
```

### 变量模板 (Variable Templates)
在 C++14 之前，模板只能用于类和函数。C++14 允许定义变量模板，这在定义数学常量或类型相关的常量时非常有用。
```cpp
template<typename T>
constexpr T pi = T(3.1415926535897932385);

int main() {
    float pi_f = pi<float>;
    double pi_d = pi<double>;
}
```

## 2. Lambda 与移动语义的结合

### Lambda 捕获初始化 (Lambda Capture Initializers)
在 C++11 中，Lambda 无法按移动语义捕获对象（比如 `std::unique_ptr`）。C++14 允许在捕获列表中初始化新变量，从而完美支持移动捕获。
```cpp
std::unique_ptr<int> ptr = std::make_unique<int>(10);
// 将 ptr 移动到 Lambda 内部的 p 中
auto lambda = [p = std::move(ptr)]() {
    std::cout << *p << '
';
};
```

## 3. `constexpr` 限制的放宽
C++11 中的 `constexpr` 函数非常严格，只能包含一个单一的 `return` 语句。C++14 大幅放宽了限制，允许在 `constexpr` 函数中使用：
* 局部变量声明（非 `static` 且需要初始化）。
* `if` 和 `switch` 分支语句。
* `for`、`while`、`do-while` 循环。
* 修改局部变量的值。
```cpp
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}
```

## 4. 标准库的实用扩充

### `std::make_unique`
这是 C++11 遗留的一个明显漏洞（C++11 引入了 `unique_ptr` 和 `make_shared`，却忘了 `make_unique`）。C++14 补齐了这一函数，现在我们可以完全摒弃裸的 `new` 操作符了。
```cpp
auto p = std::make_unique<std::vector<int>>(10, 20); // 推荐做法，异常安全
```

### 读写锁 (`std::shared_timed_mutex` & `std::shared_lock`)
为并发编程引入了读写锁机制，允许多个线程同时进行读操作，但在写操作时保持互斥。
```cpp
#include <shared_mutex>
std::shared_timed_mutex rw_mutex;

void reader() {
    std::shared_lock<std::shared_timed_mutex> lock(rw_mutex);
    // 执行只读操作
}

void writer() {
    std::unique_lock<std::shared_timed_mutex> lock(rw_mutex);
    // 执行写入操作
}
```

## 5. 语法糖与开发体验提升

### 数字分隔符 (Digit Separators)
允许在数字字面量中使用单引号 `'` 作为分隔符，增强长串数字的可读性。
```cpp
long long money = 1'000'000'000;
double pi_val = 3.1415'9265;
```

### 二进制字面量 (Binary Literals)
可以直接使用 `0b` 或 `0B` 前缀书写二进制数，底层开发或位操作时非常直观。
```cpp
int mask = 0b1010'1111;
```

### 标准自定义字面量 (Standard User-defined Literals)
C++14 在 `<string>` 和 `<chrono>` 等库中内置了便捷的字面量后缀：
* 字符串后缀 `s`: `auto str = "hello"s;` (类型为 `std::string`)
* 时间后缀 `ms`, `s`, `h`: `auto delay = 100ms;` (类型为 `std::chrono::milliseconds`)

### `[[deprecated]]` 属性
标准化了标记废弃接口的方式。如果开发者调用了被该属性标记的函数或类，编译器会发出警告。
```cpp
[[deprecated("Use new_function() instead")]]
void old_function() {}
```

---
*整理说明：C++14 虽然被视为 C++11 的“补丁包”，但其中的泛型 Lambda、`make_unique` 以及放宽的 `constexpr` 极大地改善了 C++ 代码的编写体验，是日常开发中不可或缺的利器。*
