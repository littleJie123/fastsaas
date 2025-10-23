# Mapper.ts `init` 方法详解

`Mapper` 类中的 `init` 方法的核心目标是**将一个扁平的对象数组，转换成一个多层级、树状的嵌套对象结构**，以便于后续通过键（key）快速地进行数据检索。

该方法是一个递归函数，我们通过一个具体的例子来理解它的执行过程。

### 1. 示例数据

假设我们有以下原始数据数组 `datas`：

```javascript
const datas = [
  { id: 1, type: 'fruit',  color: 'red',    name: 'apple' },
  { id: 2, type: 'fruit',  color: 'yellow', name: 'banana' },
  { id: 3, type: 'veg',    color: 'green',  name: 'cabbage' },
  { id: 4, type: 'fruit',  color: 'red',    name: 'grape' },
];
```

我们希望按照 `['type', 'color']` 这两个键的顺序来组织这些数据。

所以，`Mapper` 的构造函数被这样调用：
`new Mapper(datas, ['type', 'color'])`

这将触发第一次调用 `init` 方法：
`init(datas, this.mapper, ['type', 'color'], 0)`
其中 `this.mapper` 初始时是一个空对象 `{}`。

---

### 2. 递归过程详解

#### 第1层递归 (index = 0, key = 'type')

1.  **分组**: 方法首先根据 `keys[0]`（也就是 `'type'`）对 `datas` 进行分组。`ArrayUtil.groupBy` 会找到 `'type'` 的所有唯一值，这里是 `'fruit'` 和 `'veg'`。
2.  **处理 'fruit' 分组**:
    *   `e` (当前键值) = `'fruit'`
    *   `array` (该分组的数据) = `[{apple...}, {banana...}, {grape...}]`
    *   **判断**: 当前 `index` (0) 小于 `keys.length - 1` (1)，所以进入 `else` 逻辑（递归分支）。
    *   **创建下一层**: `map[e] = {}`，这使得 `this.mapper` 变为 `{ fruit: {} }`。
    *   **进入下一层递归**: 调用 `init( [ {apple...}, {banana...}, {grape...} ], map['fruit'], ['type', 'color'], 1 )`。

3.  **处理 'veg' 分组**:
    *   `e` = `'veg'`
    *   `array` = `[{cabbage...}]`
    *   **判断**: `index` (0) 仍然小于 1，进入 `else` 逻辑。
    *   **创建下一层**: `map[e] = {}`，这使得 `this.mapper` 变为 `{ fruit: {...}, veg: {} }`。
    *   **进入下一层递归**: 调用 `init( [ {cabbage...} ], map['veg'], ['type', 'color'], 1 )`。

#### 第2层递归 (index = 1, key = 'color')

现在我们有两个并行的递归分支：一个处理 `fruit` 数据，一个处理 `veg` 数据。

**分支A: 处理 `fruit` 分组**
`init` 被调用时，参数为：`datas`=`[{apple...}, {banana...}, {grape...}]`, `map`=`this.mapper.fruit`, `keys`=`['type', 'color']`, `index`=`1`。

1.  **分组**: 根据 `keys[1]`（也就是 `'color'`）对这3个水果进行分组。唯一值是 `'red'` 和 `'yellow'`。
2.  **处理 'red' 子分组**:
    *   `e` = `'red'`
    *   `array` = `[{apple...}, {grape...}]`
    *   **判断**: 当前 `index` (1) 等于 `keys.length - 1` (1)，满足 `if` 条件（递归终点）。
    *   **赋值**: `map[e] = array`。这里的 `map` 是 `this.mapper.fruit`，所以 `this.mapper.fruit` 变为 `{ red: [ {apple...}, {grape...} ] }`。
3.  **处理 'yellow' 子分组**:
    *   `e` = `'yellow'`
    *   `array` = `[{banana...}]`
    *   **判断**: `index` (1) 满足 `if` 条件。
    *   **赋值**: `map[e] = array`。`this.mapper.fruit` 最终变为 `{ red: [...], yellow: [...] }`。

**分支B: 处理 `veg` 分组**
`init` 被调用时，参数为：`datas`=`[{cabbage...}]`, `map`=`this.mapper.veg`, `keys`=`['type', 'color']`, `index`=`1`。

1.  **分组**: 根据 `'color'` 对这1个蔬菜分组，唯一值是 `'green'`。
2.  **处理 'green' 子分组**:
    *   `e` = `'green'`
    *   `array` = `[{cabbage...}]`
    *   **判断**: `index` (1) 满足 `if` 条件。
    *   **赋值**: `map[e] = array`。`this.mapper.veg` 变为 `{ green: [ {cabbage...} ] }`。

---

### 3. 最终产生的结构

所有递归结束后，`this.mapper` 属性会变成下面这个样子：

```json
{
  "fruit": {
    "red": [
      { "id": 1, "type": "fruit", "color": "red", "name": "apple" },
      { "id": 4, "type": "fruit", "color": "red", "name": "grape" }
    ],
    "yellow": [
      { "id": 2, "type": "fruit", "color": "yellow", "name": "banana" }
    ]
  },
  "veg": {
    "green": [
      { "id": 3, "type": "veg", "color": "green", "name": "cabbage" }
    ]
  }
}
```

### 总结

`init` 方法产生的是一个**树状的嵌套对象**。

*   **树的层级**由 `keys` 数组的长度决定。
*   **每个层级的节点**是 `keys` 数组中对应位置的属性值。
*   **树的叶子节点**是一个数组，包含了所有路径与该节点匹配的原始对象。

这个结构使得后续的 `get(['fruit', 'red'])` 操作可以像访问对象属性一样，实现 `O(k)` 复杂度的快速查找（k是keys的长度），而不需要遍历整个原始数组。
