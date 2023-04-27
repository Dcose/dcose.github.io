#### 数组求和
##### 描述
计算并返回给定数组 arr 中所有元素的总和
##### 输入：[ 1, 2, 3, 4 ]
##### 输出：10

```js
function sum(arr) {
    let result = 0;
    arr.map((item) => (result += item));
    return result;
} 

arr = [1, 2, 3, 4];
console.log(sum(arr));
```

---
#### 移除数组中的元素
##### 描述
移除数组 arr 中的所有值与 item 相等的元素，直接在给定的 arr 数组上进行操作，并将结果数组返回
##### 输入：[1, 2, 2, 3, 4, 2, 2], 2
##### 输出：[1, 3, 4]

```js
function remove(arr, item) {
    // result = [];
    // for (const k in arr) {
    //  console.log(k);
    //  if (arr[k] !== item) {
    //      result.push(arr[k]);
    //  }
    // }
    // return result;
    
    return arr.filter((i) => {
        return i !== item;
    });
}

arr = [1, 2, 3, 4, 2];
console.log(remove(arr, 2));
```

---
#### 移除数组中的元素
##### 描述
移除数组 arr 中的所有值与 item 相等的元素，直接在给定的 arr 数组上进行操作，并将结果数组返回
##### 输入：[1, 2, 2, 3, 4, 2, 2], 2
##### 输出：[1, 3, 4]

```js
function removeWithoutCopy(arr, item) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            arr.splice(i, 1);
            i--; // 索引值减一，以便继续处理下一个元素
        }
    }
    return arr;
}

arr = [1, 2, 3, 4, 2];
console.log(removeWithoutCopy(arr, 2));
```

---
#### 添加元素
##### 描述
##### 输入:
##### 输出:

#### 
##### 描述
##### 输入:
##### 输出:

#### 
##### 描述
##### 输入:
##### 输出:

#### 
##### 描述
##### 输入:
##### 输出: