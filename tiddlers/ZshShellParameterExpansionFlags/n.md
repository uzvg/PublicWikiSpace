## 功能说明:

`n` flag用于对十进制整数进行数值排序。当两个测试字符串的第一个不同字符不是数字时，排序方式为字典序。该flag的特殊处理规则包括：'+' 和 '-' 不被特殊对待，它们被视为普通非数字字符；具有更多前导零的整数会排在具有较少或没有前导零的整数之前。

<<twks-alerter "tip" """
字典序说明: 字典序（Lexicographic Order）是按照字母表顺序进行排序的方式，类似于字典中单词的排列顺序。在ASCII码中，字符按照其编码值排序，例如：数字0-9 < 大写字母A-Z < 小写字母a-z，特殊字符根据其ASCII值位置排序。""">>

## 实际应用示例:

### 基本数值排序

```bash
# 基本数值排序示例
numbers=("10" "2" "100" "1" "20")
sorted_numbers=(${(on)numbers})
echo ${sorted_numbers[@]}
# 输出: 1 2 10 20 100

# 对比不使用 n flag 的普通排序
normal_sort=(${(o)numbers})
echo ${normal_sort[@]}
# 输出: 1 10 100 2 20
```

### 文件名数值排序

```bash
# 处理带数字的文件名
files=("file10.txt" "file2.txt" "file1.txt" "file20.txt")
sorted_files=(${(on)files})
echo ${sorted_files[@]}
# 输出: file1.txt file2.txt file10.txt file20.txt

# 版本号排序
versions=("v1.10" "v1.2" "v1.1" "v2.0")
sorted_versions=(${(on)versions})
echo ${sorted_versions[@]}
# 输出: v1.1 v1.2 v1.10 v2.0
```

### 前导零处理和特殊字符

```bash
# 演示前导零的排序规则和特殊字符处理
items=("foo+24" "foo1" "foo02" "foo2" "foo3" "foo20" "foo23")
sorted_items=(${(on)items})
echo ${sorted_items[@]}
# 输出: foo1 foo02 foo2 foo+24 foo3 foo20 foo23

# 分析排序逻辑:
# 1. foo1, foo02, foo2 - 数字1和2，前导零多的(foo02)排在前面
# 2. foo+24 - '+'不是数字，按字典序排序
# 3. foo3 - 数字3
# 4. foo20, foo23 - 数字20和23按数值排序
```

### 更多前导零示例

```bash
# 更详细的前导零处理
zero_items=("item001" "item01" "item1" "item10")
sorted_zero_items=(${(on)zero_items})
echo ${sorted_zero_items[@]}
# 输出: item001 item01 item1 item10
# 前导零越多的排在前面: 001 < 01 < 1

# 特殊字符与数字混合
special_mix=("test+5" "test-3" "test10" "test2")
sorted_special=(${(on)special_mix})
echo ${sorted_special[@]}
# 输出: test2 test10 test-3 test+5
# 数字部分先按数值排序，然后是特殊字符按字典序排序
```

### 与其他flags组合使用

```bash
# 与 i flag 组合进行大小写不敏感的数值排序
mixed_case=("File10.txt" "file2.TXT" "FILE1.txt" "file20.TXT")
sorted_mixed=(${(oin)mixed_case})
echo ${sorted_mixed[@]}
# 输出: FILE1.txt file2.TXT File10.txt file20.TXT

# 与 O flag 组合进行降序数值排序
numbers=("5" "50" "500" "5000")
reverse_sorted=(${(Oin)numbers})
echo ${reverse_sorted[@]}
# 输出: 5000 500 50 5
```

### 实际应用场景

```bash
# 日志文件排序
log_files=("app.log.1" "app.log.10" "app.log.2" "app.log.20")
sorted_logs=(${(on)log_files})
echo "Processing logs in order:"
for log in "${sorted_logs[@]}"; do
    echo "  $log"
done

# 备份文件排序
backups=("backup_2023_12_1.tar" "backup_2023_12_10.tar" "backup_2023_12_2.tar")
sorted_backups=(${(on)backups})
echo "Latest backup: ${sorted_backups[-1]}"
```

### 复杂排序示例

```bash
# 演示数字和非数字字符的混合排序
complex=("item1a" "item1+" "item1-" "item2" "item10" "item1")
sorted_complex=(${(on)complex})
echo ${sorted_complex[@]}
# 输出: item1 item1+ item1- item1a item2 item10
# 相同数字部分时，按字典序排序非数字部分
```

## 技术要点:

- n flag的语法是`${(on)array}`或`${(n)array}`用于排序
- 数字部分按数值大小排序，非数字部分按字典序排序
- 前导零会影响排序顺序，更多前导零的排在前面
- '+' 和 '-' 符号不被特殊处理，视为普通字符
- 数字字符优先按数值排序，非数字字符按字典序排序
- 可与 i flag（大小写不敏感）和 O flag（降序）组合使用
- 特别适用于文件名、版本号、日志文件等包含数字的字符串排序