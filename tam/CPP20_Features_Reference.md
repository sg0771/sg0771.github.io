# C++20 核心特性详解与资料整理

C++20 是自 C++11 以来规模最大的一次语言升级。它不仅包含大量细节优化，更引入了被称为“四大件”的核心特性，彻底改变了现代 C++ 的编程范式与架构设计方式。

以下是 C++20 核心特性的分类整理：

## 1. 改变规则的“四大核心特性” (The Big Four)

### 模块 (Modules)
这是对传统 `#include` 机制的革命性替代。模块显著提高了编译速度，彻底消除了宏定义的泄漏与冲突问题。
```cpp
// math.ixx (模块定义文件)
export module math; // 声明模块
export int add(int a, int b) { return a + b; } // 导出的接口

// main.cpp
import math; // 导入模块，不再需要预处理器的文本展开
int main() {
    return add(2, 3);
}
```

### 概念 (Concepts)
为模板引入了类型约束。以前的模板错误信息往往是数百行的“天书”，而使用 Concepts 可以让编译器在参数不满足约束时直接给出清晰、易读的报错。
```cpp
#include <concepts>

// 定义一个概念：要求 T 必须是整数类型
template<typename T>
concept Integral = std::is_integral_v<T>;

// 使用概念约束模板参数
template<Integral T>
T add(T a, T b) {
    return a + b;
}
// add(1.5, 2.5); // 编译错误：double 不满足 Integral 概念
```

### 协程 (Coroutines)
语言级支持无栈协程，使异步编程变得像同步代码一样直观。引入了三个新关键字：`co_await`（挂起并等待结果）、`co_yield`（产出值）、`co_return`（协程返回）。
```cpp
// 示例（需要配合协程返回类型库如 cppcoro 或手写 promise_type）
Generator<int> generate_numbers() {
    for (int i = 0; i < 5; ++i) {
        co_yield i; // 产出值并暂停执行
    }
}
```

### 范围库 (Ranges)
对 STL 算法库的全面重构。它引入了“视图 (Views)”的概念，支持惰性求值和函数式编程的管道操作符 (`|`)，彻底告别了每次都要写 `.begin(), .end()` 的痛苦。
```cpp
#include <ranges>
#include <vector>
#include <iostream>

std::vector<int> numbers = {1, 2, 3, 4, 5, 6};
auto even_squares = numbers 
                  | std::views::filter([](int n){ return n % 2 == 0; })
                  | std::views::transform([](int n){ return n * n; });

for (int n : even_squares) {
    std::cout << n << " "; // 输出 4 16 36
}
```

## 2. 语法与核心机制改进

### 三路比较运算符 (`<=>` Spaceship Operator)
被称为“飞船运算符”。只需重载这一个运算符，编译器就能自动生成所有的比较运算符 (`<`, `>`, `<=`, `>=`, `==`, `!=`)。
```cpp
struct Point {
    int x, y;
    auto operator<=>(const Point&) const = default; // 自动按成员字典序比较
};
```

### `consteval` 与 `constinit`
* **`consteval`**: 产生一个立即函数（Immediate function），强制要求该函数**必须**在编译期求值，否则编译失败（比 `constexpr` 更严格）。
* **`constinit`**: 强制要求变量具有静态初始化（编译期初始化），解决“静态初始化顺序惨案 (SIOF)”问题。
```cpp
consteval int sqr(int n) {
    return n * n;
}
int main() {
    constexpr int r = sqr(100); // 必须在编译期计算
}
```

### 指定初始化器 (Designated Initializers)
借鉴自 C 语言，可以在初始化聚合体（结构体）时显式指定成员名称，增强代码可读性。
```cpp
struct Config {
    int width;
    int height;
    bool fullscreen;
};
Config cfg = {.width = 1920, .height = 1080, .fullscreen = true};
```

## 3. 标准库的重磅扩充

### `std::format`
现代化的字符串格式化库，吸取了 Python `format` 的经验，既有 `printf` 的高效，又有 C++ `iostream` 的类型安全，而且速度通常比两者都快。
```cpp
#include <format>
#include <iostream>

std::string s = std::format("Hello {}, you have {} messages.", "Alice", 5);
std::cout << s << '\n';
```

### `std::span`
轻量级的、非拥有 (non-owning) 的连续内存视图。它是 `std::string_view` 在普通数组、`std::vector` 和 `std::array` 上的通用等价物，专门用于安全地替代 C 风格的指针加长度参数传递。
```cpp
#include <span>
void process_data(std::span<int> data) {
    for (int v : data) std::cout << v << " ";
}

std::vector<int> vec = {1, 2, 3};
int arr[] = {4, 5, 6};
process_data(vec); // 无拷贝传递
process_data(arr); // 安全传递 C 数组
```

### `<chrono>` 的日历与时区支持
时间库得到了极大增强，现在可以轻松处理年月日、时区转换以及节假日计算。
```cpp
#include <chrono>
using namespace std::chrono;
year_month_day today = floor<days>(system_clock::now());
std::cout << "Today is: " << (int)today.year() << "-" << (unsigned)today.month() << "\n";
```

---
*整理说明：C++20 的“四大件”对项目架构有着深远影响。Modules 将逐步改变项目的构建流，Ranges 和 Concepts 大幅改善了泛型编程体验，而协程则为高并发场景提供了语言级的底层支持。掌握 C++20 将标志着进入了最高阶的现代 C++ 开发领域。*
