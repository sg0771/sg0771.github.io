# C++17 Filesystem (`<filesystem>`) 核心指南与用法总结

C++17 引入了 `<filesystem>` 标准库，为跨平台的文件系统操作提供了官方支持。它最初源于 Boost.Filesystem，现在已经成为 C++ 标准的一部分。通过它，开发者可以方便地进行路径解析、文件系统查询以及目录迭代等操作。

## 1. 基础信息

*   **头文件**: `#include <filesystem>`
*   **命名空间**: `std::filesystem` (通常为了简便，会使用别名 `namespace fs = std::filesystem;`)
*   **编译器标志**: 某些早期的编译器可能需要链接库，例如 GCC 8 之前需要 `-lstdc++fs`，但在完全支持 C++17 的现代编译器中，直接编译即可。

---

## 2. 核心类介绍

### 2.1 `std::filesystem::path`
`path` 是整个文件系统库的核心。它以系统无关的方式表示文件或目录的路径。支持不同操作系统的路径分隔符（Windows 的 `\` 和 POSIX 的 `/`）的自动转换。

**常用操作：**
*   **追加路径**: 使用 `operator/` 或 `append()`，会自动处理路径分隔符。
*   **获取路径各部分**:
    *   `p.filename()`: 获取文件名（含扩展名）。
    *   `p.stem()`: 获取文件名（不含扩展名）。
    *   `p.extension()`: 获取扩展名。
    *   `p.parent_path()`: 获取父目录路径。
*   **格式转换**: `p.string()` 转换为 `std::string`，`p.wstring()` 转换为宽字符串。

```cpp
#include <iostream>
#include <filesystem>

namespace fs = std::filesystem;

int main() {
    fs::path p1 = "/usr/local";
    fs::path p2 = p1 / "bin" / "gcc"; // 使用 / 运算符拼接路径
    
    std::cout << "完整路径: " << p2 << "\n";
    std::cout << "文件名: " << p2.filename() << "\n";
    std::cout << "父目录: " << p2.parent_path() << "\n";
    
    fs::path p3 = "test.txt";
    p3.replace_extension(".md"); // 修改扩展名
    std::cout << "新文件名: " << p3 << "\n";
    
    return 0;
}
```

### 2.2 目录迭代器
用于遍历目录中的文件和子目录。

*   **`directory_iterator`**: 单层目录遍历（不进入子目录）。
*   **`recursive_directory_iterator`**: 递归目录遍历（自动进入子目录）。

```cpp
// 遍历当前目录下的所有文件和文件夹（单层）
fs::path current_dir = fs::current_path();
std::cout << "当前目录内容:\n";
for (const auto& entry : fs::directory_iterator(current_dir)) {
    std::cout << entry.path().filename() << "\n";
}

// 递归遍历并打印所有以 .cpp 结尾的文件
for (const auto& entry : fs::recursive_directory_iterator(current_dir)) {
    if (entry.is_regular_file() && entry.path().extension() == ".cpp") {
        std::cout << entry.path() << "\n";
    }
}
```

---

## 3. 常用文件系统操作 (Functions)

`<filesystem>` 提供了大量非成员函数来执行实际的文件系统操作。

### 3.1 状态查询
*   `fs::exists(path)`: 判断路径是否存在。
*   `fs::is_directory(path)`: 判断是否为目录。
*   `fs::is_regular_file(path)`: 判断是否为普通文件。
*   `fs::is_symlink(path)`: 判断是否为符号链接。
*   `fs::is_empty(path)`: 判断文件或目录是否为空。

```cpp
fs::path p = "example.txt";
if (fs::exists(p)) {
    if (fs::is_regular_file(p)) {
        std::cout << p << " 是一个普通文件。\n";
    }
} else {
    std::cout << p << " 不存在。\n";
}
```

### 3.2 文件大小与时间
*   `fs::file_size(path)`: 返回文件大小（字节数）。注意：不能对目录调用。
*   `fs::last_write_time(path)`: 返回最后修改时间（返回 `fs::file_time_type`）。

```cpp
if (fs::exists(p) && fs::is_regular_file(p)) {
    std::cout << "文件大小: " << fs::file_size(p) << " bytes\n";
}
```

### 3.3 修改文件系统
*   **创建目录**:
    *   `fs::create_directory(path)`: 创建单层目录。
    *   `fs::create_directories(path)`: 递归创建多层目录（类似 `mkdir -p`）。
*   **复制**:
    *   `fs::copy_file(from, to, options)`: 复制文件。
    *   `fs::copy(from, to, options)`: 复制文件或目录。
*   **重命名/移动**:
    *   `fs::rename(old_p, new_p)`: 重命名或移动文件/目录。
*   **删除**:
    *   `fs::remove(path)`: 删除文件或空目录。
    *   `fs::remove_all(path)`: 递归删除目录及其所有内容（类似 `rm -rf`）。

```cpp
fs::path dir = "my_app_data/config";

// 创建目录
if (fs::create_directories(dir)) {
    std::cout << "目录创建成功！\n";
}

// 复制文件并覆盖已存在的文件
fs::copy_file("default.conf", dir / "app.conf", fs::copy_options::overwrite_existing);

// 重命名
fs::rename(dir / "app.conf", dir / "main.conf");

// 删除整个文件夹
std::uintmax_t deleted_count = fs::remove_all("my_app_data");
std::cout << "删除了 " << deleted_count << " 个文件或目录。\n";
```

### 3.4 路径获取
*   `fs::current_path()`: 获取或设置当前工作目录。
*   `fs::absolute(path)`: 获取绝对路径。
*   `fs::canonical(path)`: 获取规范绝对路径（解析符号链接，去除 `.` 和 `..`）。

```cpp
fs::path current = fs::current_path();
std::cout << "当前工作目录: " << current << "\n";

fs::path relative = "../test.txt";
std::cout << "绝对路径: " << fs::absolute(relative) << "\n";
```

---

## 4. 异常处理

默认情况下，`std::filesystem` 的函数在遇到错误时（如权限不足、文件不存在等）会抛出 `std::filesystem::filesystem_error` 异常（继承自 `std::system_error`）。

为了避免抛出异常，所有可能失败的操作都提供了带有 `std::error_code` 参数的重载版本。

**示例：使用 error_code 处理错误**

```cpp
#include <iostream>
#include <filesystem>
#include <system_error>

namespace fs = std::filesystem;

int main() {
    fs::path p = "/root/secret_file.txt"; // 假设没有权限访问
    std::error_code ec;
    
    // 不抛出异常，而是设置 ec
    auto size = fs::file_size(p, ec);
    
    if (ec) {
        std::cerr << "获取文件大小失败: " << ec.message() << "\n";
    } else {
        std::cout << "文件大小: " << size << "\n";
    }
    
    return 0;
}
```

## 5. 总结

C++17 的 `<filesystem>` 极大地简化了跨平台文件操作的代码编写。它的面向对象设计、重载的 `/` 运算符以及与 `std::string` 的无缝集成，使得路径操作直观且安全。在现代 C++ 开发中，应当优先使用 `<filesystem>` 替代过去的 C 风格文件操作 (`<dirent.h>` 或 `<sys/stat.h>`) 以及平台特有的 API (如 Windows 的 `FindFirstFile`)。
