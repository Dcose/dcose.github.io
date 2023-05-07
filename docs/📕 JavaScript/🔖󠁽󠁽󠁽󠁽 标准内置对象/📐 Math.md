### Math.random\*

返回一个从 0 到 1 的随机数（不包括 1）。

```javascript
alert(Math.random()); // 0.1234567894322
alert(Math.random()); // 0.5435252343232
alert(Math.random()); // ... (任何随机数)
```

### Math.floor\*

向下舍入：3.1 变成 3，-1.1 变成 -2。

### Math.ceil

向上舍入：3.1 变成 4，-1.1 变成 -1。

### Math.round

向最近的整数舍入：3.1 变成 3，3.6 变成 4，中间值 3.5 变成 4。

### Math.trunc（IE 浏览器不支持这个方法）

移除小数点后的所有内容而没有舍入：3.1 变成 3，-1.1 变成 -1。
