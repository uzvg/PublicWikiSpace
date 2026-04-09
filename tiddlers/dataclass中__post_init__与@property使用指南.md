# 一、核心结论（先建立全局认知）

在 `dataclass` 中：

* `__post_init__` → **初始化阶段执行（一次性）**
* `@property` → **访问时执行（动态）**

👉 它们是**互补关系，而不是替代关系**

---

# 二、两者本质区别

| 特性              | `__post_init__` | `@property`   |
| --------------- | --------------- | ------------- |
| 执行时机            | 初始化后立即执行        | 每次访问时执行       |
| 是否存储结果          | ✔ 是             | ❌ 默认不存（可手动缓存） |
| 是否属于字段系统        | ✔ 是             | ❌ 否           |
| 是否参与 `__init__` | ✔ 间接参与          | ❌ 不参与         |
| 是否随数据变化自动更新     | ❌ 不会            | ✔ 会           |

---

# 三、`__post_init__` 的作用与场景

## 1️⃣ 本质

> 在 `dataclass` 自动生成的 `__init__` 执行之后，补充自定义初始化逻辑

---

## 2️⃣ 常见使用场景

### （1）派生属性（一次性计算）

```python
def __post_init__(self):
    self.full_name = f"{self.first} {self.last}"
```

---

### （2）数据校验

```python
def __post_init__(self):
    if self.age < 0:
        raise ValueError("年龄不能为负")
```

---

### （3）类型转换 / 数据标准化

```python
def __post_init__(self):
    self.tags = list(self.tags)
```

---

### （4）复杂初始化 / 缓存

```python
def __post_init__(self):
    self._cache = self._build_cache()
```

---

### （5）配合 `field(init=False)`

```python
from dataclasses import dataclass, field

@dataclass
class Rectangle:
    width: int
    height: int
    area: int = field(init=False)

    def __post_init__(self):
        self.area = self.width * self.height
```

👉 `area`：

* 不允许外部传入
* 只能内部计算

---

# 四、`@property` 的作用与场景

## 1️⃣ 本质

> 用方法实现“看起来像属性”的访问接口

---

## 2️⃣ 基本用法

```python
@dataclass
class Rectangle:
    width: int
    height: int

    @property
    def area(self):
        return self.width * self.height
```

---

## 3️⃣ 特点

* 不属于字段（field）
* 不参与 `__init__`
* 不参与 `repr` / 比较
* 每次访问都会执行

---

## 4️⃣ 常见使用场景

### （1）纯派生数据（推荐）

```python
@property
def full_name(self):
    return f"{self.first} {self.last}"
```

---

### （2）依赖可变数据

```python
@property
def area(self):
    return self.width * self.height
```

👉 修改 `width` 后自动更新

---

# 五、组合使用（非常常见）

## ✅ 模式：dataclass + property + 缓存

```python
from dataclasses import dataclass, field

@dataclass
class Data:
    values: list[int]
    _sum: int | None = field(default=None, init=False)

    @property
    def total(self):
        if self._sum is None:
            print("计算一次")
            self._sum = sum(self.values)
        return self._sum
```

👉 特点：

* 数据结构：dataclass
* 访问接口：property
* 性能优化：缓存

---

## ✅ 进阶：自动失效缓存

```python
@dataclass
class Data:
    _values: list[int]
    _sum: int | None = field(default=None, init=False)

    @property
    def values(self):
        return self._values

    @values.setter
    def values(self, v):
        self._values = v
        self._sum = None  # 缓存失效

    @property
    def total(self):
        if self._sum is None:
            self._sum = sum(self._values)
        return self._sum
```

👉 工程级写法（非常推荐）

---

# 六、常见错误（必须避免）

## ❌ 错误1：property 覆盖字段

```python
@dataclass
class A:
    x: int

    @property
    def x(self):  # ❌ 冲突
        return 42
```

---

## ❌ 错误2：用 property 做重计算（无缓存）

```python
@property
def big_data(self):
    return expensive_operation()  # ❌ 每次都执行
```

---

## ❌ 错误3：property 有副作用

```python
@property
def send_request(self):  # ❌
    ...
```

👉 用户不会预期访问属性会触发行为

---

# 七、决策模型（实战最重要）

## 👉 用 `__post_init__`：

* 初始化时必须完成
* 计算成本高
* 结果不会变

---

## 👉 用 `@property`：

* 是派生数据
* 可能随字段变化
* 计算轻量 or 可接受

---

## 👉 两者结合：

* 想要“懒加载 + 缓存”

---

# 八、设计建议（结合实际项目）

对于数据建模（如 Anki / TiddlyWiki）：

👉 推荐模式：

* `dataclass` → 描述数据结构
* `__post_init__` → 校验 & 初始化
* `@property` → 提供派生视图

---

# 九、一句话总结

> `__post_init__` 负责“初始化时确定的东西”，
> `@property` 负责“访问时动态计算的东西”。
