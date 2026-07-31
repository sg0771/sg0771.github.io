# C++11 (现代 C++ 的黎明)
2011
这是一次堪称“重造语言”的跨越式更新，奠定了现代 C++ 的基础：

auto 类型推导：让编译器自动推导变量类型。

智能指针：引入 std::unique_ptr、std::shared_ptr 和 std::weak_ptr，取代容易内存泄漏的裸指针。

Lambda 表达式：支持在代码中定义匿名函数（闭包）。

右值引用与移动语义 (&&)：避免了不必要的深拷贝，大幅提升性能。

基于范围的 for 循环：for (auto& item : container)，让遍历容器更简洁。

nullptr：取代宏定义 NULL，提供类型安全的空指针。

多线程库：首次在标准层面引入 <thread>、<mutex> 和 <future>。

constexpr：支持编译期常量表达式计算。

# C++14 (查漏补缺与完善)
2014
C++14 是一个“小版本”更新，主要用于完善 C++11 中的不足：

泛型 Lambda：Lambda 表达式的参数可以使用 auto（如 [](auto x, auto y) { return x + y; }）。

返回类型推导：普通函数也可以使用 auto 作为返回类型，由编译器推导。

放宽 constexpr 限制：在 constexpr 函数内允许使用局部变量、循环和分支语句。

变量模板：允许定义模板化的变量（如 template<typename T> constexpr T pi = T(3.1415);）。

std::make_unique：补充了 C++11 中缺失的 unique_ptr 安全创建函数。

# C++17 (实用的工程化更新)
2017
C++17 引入了大量能让日常开发更舒适的语法糖和标准库组件：

结构化绑定：可以直接将元组或结构体解包到多个变量中（如 auto [x, y] = point;）。

if constexpr：编译期条件分支，极大简化了模板元编程。

折叠表达式：简化可变参数模板的处理。

内联变量 (inline)：允许在头文件中直接定义并初始化全局变量，无需在 .cpp 文件中单独定义。

带初始化的 if / switch：if (auto it = m.find(key); it != m.end()) { ... }。

新标准库词汇类型：引入 std::optional（可能无值）、std::variant（类型安全的联合体）、std::any（容纳任意类型）。

文件系统与字符串视图：正式引入 std::filesystem 库和零拷贝字符串 std::string_view。

# C++20 (四大核心特性与巨变)
2020
自 C++11 以来最大的更新版本，带来了改变编程范式的“四大件”：

概念 (Concepts)：用于在编译期对模板参数进行约束（代替了晦涩的 SFINAE），让模板错误信息更加人类可读。

模块 (Modules)：彻底改变了传统的 #include 头文件机制，大幅提升编译速度并解决宏污染问题。

协程 (Coroutines)：原生支持异步编程，引入 co_await、co_yield 和 co_return 关键字。

范围库 (Ranges)：支持对容器进行组合式、惰性求值的视图操作（如 views::filter(...)| views::transform(...)）。

三路比较运算符 (<=>)：被称为“飞船运算符”，一次定义即可自动生成所有比较运算符（<, >, ==, <=, >=, !=）。

consteval 与 constinit：强制函数必须在编译期求值，以及强制常量必须在编译期初始化。

std::format：类似 Python 的安全、高效的字符串格式化库。

C++23 (标准库完善与开发者体验)
2023
C++23 继续打磨标准库，提供了更好的开发者人体工程学设计：

标准库模块：支持直接导入整个标准库 import std;，进一步加快编译速度。

显式 this 参数 (Deducing this)：通过显式传递 this 参数，优雅解决 CRTP（奇异递归模板模式）和成员函数 const/引用限定符的重复代码问题。

std::expected：更好的错误处理机制，取代传统的异常或错误码返回（类似 Rust 的 Result）。

多维数组下标与视图：允许重载多参数的 operator[]（如 matrix[x, y]），并引入了多维数组视图 std::mdspan。

std::print 和 std::println：结合了 std::format 和控制台输出，无需再写 std::cout。

Monadic 操作：为 std::optional 和 std::expected 增加了链式调用支持（and_then, transform, or_else）。