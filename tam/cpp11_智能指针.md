# C++11 智能指针 (Smart Pointers) 详解

在 C++11 之前，程序员需要手动管理动态分配的内存（使用 `new` 和 `delete`），这很容易导致**内存泄漏**或**悬空指针**。C++11 引入了智能指针，利用 **RAII**（资源获取即初始化）原则，在对象超出作用域时自动释放内存，极大地提升了代码的安全性和可维护性。

C++11 提供的智能指针都定义在 `<memory>` 头文件中，主要包含三种类型：
1. `std::unique_ptr`
2. `std::shared_ptr`
3. `std::weak_ptr`

> **注意：** C++98 中的 `std::auto_ptr` 在 C++11 中已被弃用，并在 C++17 中被完全移除，请避免在现代 C++ 中使用它。

---

## 1. 独占型智能指针：`std::unique_ptr`

`std::unique_ptr` 是一种**独占所有权**的智能指针。这意味着在任何给定时刻，只能有一个 `unique_ptr` 指向同一个对象。

### 核心特性：
* **不可复制**：不能使用拷贝构造函数或赋值运算符复制 `unique_ptr`，这保证了独占性。
* **可移动**：可以使用 `std::move` 将所有权转移给另一个 `unique_ptr`。
* **轻量高效**：在默认情况下，`unique_ptr` 的大小与裸指针相同，几乎没有额外的性能开销。

### 基本用法：

```cpp
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "MyClass Created\n"; }
    ~MyClass() { std::cout << "MyClass Destroyed\n"; }
    void doSomething() { std::cout << "Doing something\n"; }
};

int main() {
    // 1. 创建 unique_ptr
    std::unique_ptr<MyClass> ptr1(new MyClass());
    ptr1->doSomething();

    // 2. 尝试复制（编译报错）
    // std::unique_ptr<MyClass> ptr2 = ptr1; // 错误！禁止拷贝

    // 3. 转移所有权 (Move)
    std::unique_ptr<MyClass> ptr3 = std::move(ptr1);
    if (!ptr1) {
        std::cout << "ptr1 is now null.\n";
    }
    ptr3->doSomething();

    // ptr3 超出作用域，MyClass 自动析构
    return 0;
}
```

*(注：`std::make_unique` 是在 C++14 中引入的，但在实际开发中强烈建议使用它来代替直接 `new` 以提升安全性。)*

---

## 2. 共享型智能指针：`std::shared_ptr`

`std::shared_ptr` 允许多个智能指针共享同一个对象的所有权。它通过**引用计数（Reference Counting）**来管理内存。

### 核心特性：
* **引用计数**：内部维护一个计数器，记录有多少个 `shared_ptr` 指向该对象。
* **自动释放**：当最后一个指向该对象的 `shared_ptr` 被销毁（即引用计数降为 0）时，对象才会被自动释放。
* **线程安全性**：控制块（包含引用计数）的增减是线程安全的，但对所指对象本身的并发访问仍需自己加锁。

### 基本用法：

```cpp
#include <iostream>
#include <memory>

int main() {
    // 推荐使用 std::make_shared，比直接 new 效率更高，且避免内存碎片
    std::shared_ptr<int> sp1 = std::make_shared<int>(100);
    std::cout << "sp1 use_count: " << sp1.use_count() << "\n"; // 输出 1

    {
        std::shared_ptr<int> sp2 = sp1; // 共享所有权
        std::cout << "sp1 use_count: " << sp1.use_count() << "\n"; // 输出 2
        std::cout << "sp2 use_count: " << sp2.use_count() << "\n"; // 输出 2
    } // sp2 离开作用域，引用计数减 1

    std::cout << "sp1 use_count: " << sp1.use_count() << "\n"; // 输出 1

    return 0;
}
```

---

## 3. 弱引用智能指针：`std::weak_ptr`

`std::weak_ptr` 是为了配合 `std::shared_ptr` 而设计的。它提供对 `shared_ptr` 管理的对象的**弱引用**，不会增加或减少引用计数。

### 核心特性：
* **打破循环引用**：这是 `weak_ptr` 最主要的作用。如果两个对象通过 `shared_ptr` 互相引用，会导致引用计数永远无法降为 0，从而产生内存泄漏。使用 `weak_ptr` 可以打破这个死结。
* **不能直接访问对象**：`weak_ptr` 没有重载 `*` 和 `->` 运算符。如果要访问对象，必须先通过 `lock()` 方法提升为 `shared_ptr`。

### 解决循环引用示例：

```cpp
#include <iostream>
#include <memory>

class B; // 前置声明

class A {
public:
    std::shared_ptr<B> b_ptr;
    ~A() { std::cout << "A destroyed\n"; }
};

class B {
public:
    // 如果这里使用 shared_ptr，会导致 A 和 B 互相引用，无法析构
    // std::shared_ptr<A> a_ptr; 
    
    std::weak_ptr<A> a_ptr; // 使用 weak_ptr 打破循环
    ~B() { std::cout << "B destroyed\n"; }
};

int main() {
    std::shared_ptr<A> a = std::make_shared<A>();
    std::shared_ptr<B> b = std::make_shared<B>();

    a->b_ptr = b;
    b->a_ptr = a;

    // 当离开作用域时，a 和 b 能被正确析构
    return 0;
}
```

### 使用 `lock()` 访问数据：

```cpp
std::weak_ptr<int> wp;
{
    std::shared_ptr<int> sp = std::make_shared<int>(42);
    wp = sp;
    
    // 提升为 shared_ptr 才能使用
    if (std::shared_ptr<int> locked_sp = wp.lock()) {
        std::cout << "Value is " << *locked_sp << "\n";
    }
}
// 此时 sp 已销毁，wp.expired() 为 true
if (wp.expired()) {
    std::cout << "Object has been destroyed.\n";
}
```

---

## 总结与对比

| 特性 | `std::unique_ptr` | `std::shared_ptr` | `std::weak_ptr` |
| :--- | :--- | :--- | :--- |
| **所有权模型** | 独占所有权 | 共享所有权 | 无所有权（观察者） |
| **复制/赋值** | ❌ 禁用（仅支持 `std::move`） | ✅ 允许（引用计数+1） | ✅ 允许（从 shared 复制） |
| **性能开销** | 极低（等同于裸指针） | 中等（需维护引用计数控制块） | 极低 |
| **主要使用场景** | 默认首选，明确对象仅由单一实体管理 | 需要多方共享数据生命周期时 | 打破循环引用，缓存，观察对象状态 |
