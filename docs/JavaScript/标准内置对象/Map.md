---
title: 🗺️ Map
tags: [Map 🗺️]
---

:::tip
Map 是一个带键的数据项的集合，就像一个 Object 一样。 但是它们最大的差别是 Map 允许任何类型的键（key）。
:::

它的方法和属性如下：

- new Map() —— 创建 map
- map.set(key, value) —— 根据键存储值
- map.get(key) —— 根据键来返回值，如果 map 中不存在对应的 key，则返回 undefined
- map.has(key) —— 如果 key 存在则返回 true，否则返回 false
- map.delete(key) —— 删除指定键的值
- map.clear() —— 清空 map
- map.size —— 返回当前元素个数
