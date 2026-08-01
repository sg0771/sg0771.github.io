# C++11 `std::array` 用法详解

在 C++11 中，`std::array` 是一个封装了固定大小数组的容器。它结合了 C 风格数组的性能（零开销）和 C++ 标准模板库（STL）容器的优点（如提供大小信息、支持迭代器、不会自动退化为指针等）。

## 1. 头文件与基本声明

要使用 `std::array`，需要包含 `<array>` 头文件。

```cpp
#include <array>

// 声明语法：std::array<数据类型, 数组大小> 变量名;
std::array<int, 5> arr;
```

> **注意：** `std::array` 的大小在编译时必须是已知常量。

## 2. 初始化

`std::array` 支持聚合初始化和列表初始化。

```cpp
// 1. 列表初始化
std::array<int, 5> arr1 = {1, 2, 3, 4, 5};
std::array<int, 5> arr2 {1, 2, 3, 4, 5}; // 省略等号

// 2. 部分初始化（剩余元素自动初始化为0）
std::array<int, 5> arr3 = {1, 2}; // 结果: {1, 2, 0, 0, 0}

// 3. 空初始化（所有元素为0）
std::array<int, 5> arr4 = {}; 

// 4. 未初始化（如果是局部变量，元素值将是不确定的）
std::array<int, 5> arr5; 
```

## 3. 访问元素

`std::array` 提供了多种访问元素的方法：

- **`operator[]`**: 下标访问。与 C 风格数组一样，**不提供越界检查**，速度快。
- **`at()`**: 带有越界检查的访问。如果越界，会抛出 `std::out_of_range` 异常。
- **`front()`**: 返回第一个元素的引用。
- **`back()`**: 返回最后一个元素的引用。
- **`data()`**: 返回指向底层数组数据的裸指针（`T*`）。

```cpp
std::array<int, 5> arr = {10, 20, 30, 40, 50};

int a = arr[1];       // a = 20
int b = arr.at(2);    // b = 30
int f = arr.front();  // f = 10
int bk = arr.back();  // bk = 50
int* p = arr.data();  // p 指向 10
```

## 4. 迭代器支持

作为 STL 容器，`std::array` 完美支持各类迭代器，可以方便地与基于范围的 `for` 循环及 STL 算法结合使用。

- **正向迭代器**: `begin()`, `end()`
- **常量正向迭代器**: `cbegin()`, `cend()`
- **反向迭代器**: `rbegin()`, `rend()`
- **常量反向迭代器**: `crbegin()`, `crend()`

```cpp
std::array<int, 5> arr = {1, 2, 3, 4, 5};

// 1. 基于范围的 for 循环 (C++11)
for (int& x : arr) {
    x *= 2; // 将每个元素翻倍
}

// 2. 使用迭代器
for (auto it = arr.begin(); it != arr.end(); ++it) {
    std::cout << *it << " ";
}
```

## 5. 容量相关

- **`empty()`**: 检查数组是否为空（仅当大小为 0 时返回 `true`，即 `std::array<T, 0>`）。
- **`size()`**: 返回数组中元素的个数。
- **`max_size()`**: 返回数组可容纳的最大元素个数（对于 `std::array` 来说，等于 `size()`）。

```cpp
std::array<int, 5> arr;
std::cout << "Size: " << arr.size() << std::endl; // 输出: Size: 5
```

## 6. 修改操作

- **`fill(val)`**: 将数组中的所有元素赋值为 `val`。
- **`swap(other_array)`**: 交换两个相同类型和大小的 `array` 的内容。性能开销与数组大小成正比（线性时间复杂度 `O(N)`）。

```cpp
std::array<int, 3> arr1 = {1, 2, 3};
std::array<int, 3> arr2 = {7, 8, 9};

arr1.swap(arr2); 
// arr1 现在是 {7, 8, 9}, arr2 是 {1, 2, 3}

arr1.fill(0);
// arr1 现在是 {0, 0, 0}
```

## 7. 为什么要用 std::array 代替 C 风格数组？

1. **更安全**：支持 `at()` 进行边界检查，避免缓冲区溢出漏洞。
2. **不退化为指针**：当把 C 风格数组传递给函数时，它会退化为指针，丢失了大小信息。而 `std::array` 作为对象按值或按引用传递时，始终保留自身的大小信息（通过 `size()`）。
3. **STL 兼容性**：完全兼容 STL 算法（如 `std::sort`, `std::find`, `std::transform` 等）。
4. **支持赋值**：可以直接将一个 `std::array` 赋值给另一个同类型的 `std::array`（`arr1 = arr2;`），而 C 风格数组无法直接赋值。

## 8. 多维数组

可以嵌套使用来创建多维数组：

```cpp
// 声明一个 3x4 的二维数组
std::array<std::array<int, 4>, 3> matrix = {{
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
}};

// 访问元素
int val = matrix[1][2]; // 访问第 2 行第 3 列的元素，值为 7
```

## 9. 综合示例代码

```cpp
#include <iostream>
#include <array>
#include <algorithm>

int main() {
    std::array<int, 5> arr = {5, 2, 8, 1, 9};

    // 使用 STL 算法排序
    std::sort(arr.begin(), arr.end());

    std::cout << "Sorted array: ";
    for (const auto& val : arr) {
        std::cout << val << " ";
    }
    std::cout << "\n";

    // 使用 fill 填充
    arr.fill(10);
    
    std::cout << "After fill(10): ";
    for (const auto& val : arr) {
        std::cout << val << " ";
    }
    std::cout << "\n";

    return 0;
}
```
