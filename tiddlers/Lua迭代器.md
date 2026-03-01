## 🌟 一、常见迭代器

### 1️⃣ `pairs`

✅ **作用**
遍历表中的**所有键值对**，包括：

* 数组部分（整数键）
* 哈希部分（字符串/其他键）

✅ **使用案例**

```lua
local t = {a=1, b=2, [10]=3}

for k, v in pairs(t) do
  print(k, v)
end
```

**输出（无特定顺序）：**

```
a	1
b	2
10	3
```

✅ **注意事项**

* 遍历顺序不保证。
* 会遍历**所有键**，包括非整数键。

### 2️⃣ `ipairs`

✅ **作用**
用于遍历表的**数组部分**（连续整数键），按顺序从1开始，遇到第一个`nil`就停止。

✅ **使用案例**

```lua
local t = {10, 20, nil, 40}

for i, v in ipairs(t) do
  print(i, v)
end
```

**输出：**

```
1	10
2	20
```

（第三个位置是`nil`，所以中断）

✅ **注意事项**

* 不会遍历“稀疏索引”（中间有nil时后面都忽略）。
* 不会遍历字符串键。

### 3️⃣ `string.gmatch`

✅ **作用**
对字符串进行**模式匹配**，返回一个迭代器，每次返回一个匹配结果。

✅ **使用案例**

```lua
local s = "apple,banana,orange"
for word in string.gmatch(s, "[^,]+") do
  print(word)
end
```

**输出：**

```
apple
banana
orange
```

✅ **注意事项**

* 第二个参数是模式（Lua简易正则）。
* 返回的是**迭代器函数**。

### 4️⃣ `next`

✅ **作用**
`pairs`内部其实调用`next`来迭代表。

✅ **使用案例**

```lua
local t = {x=100, y=200}

local k, v = next(t)
while k do
  print(k, v)
  k, v = next(t, k)
end
```

**输出：**

```
x	100
y	200
```

✅ **注意事项**

* 第一次调用`next(t)`，返回第一个键值对。
* 后续调用`next(t, key)`，返回下一个键值对。
* 如果没有更多键，返回`nil`。

一般直接用`pairs`更简洁。

## 🌟 二、自定义迭代器

✅ **原理**
你可以写一个函数返回**迭代器函数**，供`for`循环使用。
`for`会不断调用它，直到它返回`nil`。

✅ **案例1：简单迭代器**

**功能：迭代1到N**

```lua
function count_to(n)
  local i = 0
  return function()
    i = i + 1
    if i <= n then
      return i
    end
  end
end

for v in count_to(3) do
  print(v)
end
```

**输出：**

```
1
2
3
```

✅ **案例2：多返回值迭代器**

```lua
function square_iter(n)
  local i = 0
  return function()
    i = i + 1
    if i <= n then
      return i, i*i
    end
  end
end

for k, v in square_iter(3) do
  print(k, v)
end
```

**输出：**

```
1	1
2	4
3	9
```

✅ **注意事项**

* 自定义迭代器必须返回`nil`作为结束信号。
* 可以返回多个值。
* 每次迭代都调用迭代器函数。

✅ **进阶：使用协程做迭代器**

**示例：**

```lua
function my_iter()
  return coroutine.wrap(function()
    for i = 1, 3 do
      coroutine.yield(i)
    end
  end)
end

for v in my_iter() do
  print(v)
end
```

**输出：**

```
1
2
3
```

## 🌟 三、小结

✅ 常用迭代器：

* `pairs`：遍历所有键值对。
* `ipairs`：遍历数组部分（按顺序）。
* `string.gmatch`：字符串分割。
* `next`：底层遍历。

✅ 自定义迭代器：

* 返回一个函数，每次返回下一个值。
* 协程可实现更灵活的迭代逻辑。

如需更深入的**模式匹配、协程迭代器、闭包实现**，可以随时告诉我！