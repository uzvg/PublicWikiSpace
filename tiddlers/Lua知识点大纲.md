## 一、Lua概述

* Lua简介

  * 轻量级、嵌入式脚本语言
  * 主要应用：游戏开发（如《魔兽世界》插件）、脚本扩展、配置
* 特点

  * 小巧高效
  * 简单灵活
  * 易嵌入C/C++程序
  * 协程（coroutine）支持

## 二、基本语法

* 注释

  * 单行注释：`--`
  * 多行注释：`--[[ ]]`
* 变量

  * 全局变量（默认）
  * 局部变量：`local`
* 数据类型

  * `nil`
  * `boolean`
  * `number`
  * `string`
  * `table`
  * `function`
  * `userdata`（C数据）
  * `thread`（协程）
* 类型检查

  * `type()`

## 三、运算符

* 算术运算符

  * `+ - * / % ^`
* 关系运算符

  * `== ~= < > <= >=`
* 逻辑运算符

  * `and or not`
* 连接运算符

  * `..`（字符串拼接）
* 表长度

  * `#table`

## 四、流程控制

* 条件语句

  * `if...then...elseif...else...end`
* 循环

  * `while...do...end`
  * `repeat...until`
  * `for` 数值循环

    ```lua
    for i = 1, 10, 2 do
      -- body
    end
    ```
  * `for` 泛型循环（配合迭代器）
* `break`退出循环
* `goto`（Lua 5.2+）

## 五、函数

* 定义函数

  ```lua
  function foo(a, b)
    return a + b
  end
  ```
* 可变参数

  ```lua
  function sum(...)
    local args = {...}
  end
  ```
* 匿名函数

  ```lua
  local f = function(x) return x*x end
  ```
* 递归函数
* 闭包（Closure）

## 六、表（table）

> Lua中唯一的数据结构（数组、字典、对象都用table表示）

* 创建表

  ```lua
  local t = {}
  ```
* 索引与赋值

  ```lua
  t["key"] = value
  t.key = value
  ```
* 数组部分

  ```lua
  t = {10, 20, 30}
  ```
* 表遍历

  * `pairs()`
  * `ipairs()`
* 元表（metatable）

  * `setmetatable()`
  * `getmetatable()`
  * 元方法（\_\_index、\_\_newindex、\_\_add、\_\_tostring等）
* 表操作函数

  * `table.insert`
  * `table.remove`
  * `table.concat`
  * `table.sort`

## 七、字符串操作

* 基本操作

  * 拼接 `..`
  * 长度 `#`
* 字符串库

  * `string.len`
  * `string.sub`
  * `string.upper` / `string.lower`
  * `string.find`
  * `string.gsub`
  * `string.format`
* 模式匹配（简单的正则表达式）

## 八、模块与包

* 模块定义
* `require`
* `package.path`
* `package.loaded`
* 返回模块表

  ```lua
  local M = {}
  function M.hello()
    print("Hello")
  end
  return M
  ```

## 九、协程（Coroutine）

* 基本概念（用户态线程）
* 创建与运行

  * `coroutine.create`
  * `coroutine.resume`
  * `coroutine.yield`
  * `coroutine.status`
  * `coroutine.wrap`
* 协程示例

## 十、错误处理

* `error()`
* `assert()`
* 保护模式

  * `pcall()`（保护调用）
  * `xpcall()`

## 十一、I/O操作

* 简单I/O

  * `io.write`
  * `io.read`
* 文件操作

  * `io.open`
  * `file:read`
  * `file:write`
  * `file:close`

## 十二、垃圾回收

* 自动内存管理
* `collectgarbage`

## 十三、C API（嵌入与扩展）

* 嵌入Lua到C程序
* 在Lua中调用C函数
* userdata
* 注册模块

## 十四、实用示例

* 配置文件编写
* 脚本热更新
* 简单面向对象（利用表+元表）
* 简单事件系统
* 游戏脚本系统