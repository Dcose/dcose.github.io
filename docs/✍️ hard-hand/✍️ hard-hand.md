## 实现防抖函数（debounce）
---
1. 传入函数和时间
2. 设置定时标志
3. 进入即清除定时器
4. 设置定时器执行函数

```javascript
function debounce(func, wait) {
    let timer = 0;
    return function (...args) {
	    // 如果当前有个定时器 不管这个定时器有没有执行 先取消再说
	    // 如果已经执行 那取消了也不影响
	    // 如果没执行 那说明还在时间间隔内 正好需要取消
        if (timer) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        }
    };
}
```

#setTimeout #clearTimeout #apply 

## 实现节流函数（throttle）
---
1. 传入函数和时间
2. 设置定时器标志
3. 判断间隔时间是否大于传入时间
4. 更新定时器标志

```javascript
function throttle(func, wait) {
    let start = 0;
    return function (...args) {
        if (start === 0) {
            start = +new Date();
        } else {
            const now = +new Date();
            // 当前时间 - 上次函数运行时间 >= 节流间隔时间
            // 运行函数 并更新时间
            if (now - start >= wait) {
                func.apply(this, args);
                start = now;
            }
        }
    };
}
```

#setTimeout #apply #Date 

## 实现深拷贝（deepClone）
---
### 极简版

```javascript
const newObj = JSON.parse(JSON.stringify(oldObj));
```

**缺点**
- 克隆过程中会丢失函数、Date、Set等特殊对象
- 无法解决循环引用的问题
- 会丢失对象的 `constructor`

### 简版

```javascript
function deepClone(target) {
    // 如果不是基础类型，就需要详细处理
    if (target !== null && typeof target === 'object') {
        // 如果是数组，那么这个属性最开始是 []
        // 如果是对象，那么这个属性最开始是 {}
        const cloneObj = Array.isArray(target) ? [] : {};
        // 循环遍历整个数组或对象的元素，并且逐个深克隆
        for (let key in target) {
            // 原型链上的属性不用克隆
            // hasOwnProperty 自身属性中是否具有指定的属性
            if (target.hasOwnProperty(key)) {
                cloneObj[key] = deepClone(target[key]);
            }
        }
        return cloneObj;
    } else {
        // 如果是基础类型，直接返回
        return target;
    }
}
```

#typeof #isArray #hasOwnProperty 

## 实现 instanceOf
---
思路：
- 步骤1：先取得当前类的原型，当前实例对象的原型链
- 步骤 2：一直循环（执行原型链的查找机制）
- 取得当前实例对象原型链的原型链（`proto = proto.__proto__`，沿着原型链一直向上查找）
- 如果 当前实例的原型链 `__proto__` 上找到了当前类的原型 `prototype`，则返回 `true`
- 如果 一直找到 `Object.prototype.__proto__ == null`，`Object` 的基类 (`null`) 上面都没找到，则返回 `false`

```javascript
// 实例对象.__proto__ === 类.prototype
function myInstanceof(example, classFunc) {
    let proto = Object.getPrototypeOf(example);
    while (true) {
        // Object.prototype.__proto__ === null
        // 这个时候还没找到 返回 false
        if (proto == null) {
            return false;
        }
        // 在当前实例对象的原型链上，找到了当前类
        if (proto == classFunc.prototype) {
            return true;
        }
        // 沿着原型链__ptoto__一层一层向上查
        proto = Object.getPrototypeOf(proto);
    }
}
```

#Object  #getPrototypeOf 


## 实现 new
---
**new 操作符执行过程**
- 创建一个全新的对象 `Object.create()`
- 这个对象的 `__proto__` 要指向构造函数的原型 `prototype`
- 执行构造函数，使用 `call/apply` 改变 `this` 的指向
- 返回值为 `object` 类型则作为 `new` 方法的返回值返回，否则返回上述全新对象

```javascript
function myNew(fn, ...args) {
	// 新建一个对象并将 __proto__ 指向构造函数的 prototype
    let instance = Object.create(fn.prototype);
    // 将 this 绑定到新对象上
    let res = fn.apply(instance, args);
    // 确保返回的是一个对象(万一fn不是构造函数)
    return typeof res === 'object' ? res : instance;
}
```

#Object #create

## 实现原生 [[🔗 Ajax|Ajax]]
---
- 创建 `XMLHttpRequest` 实例
- 发出 HTTP 请求
- 服务器返回 XML 格式的字符串
- JS 解析 XML，并更新局部页面
- 不过随着历史进程的推进，XML 已经被淘汰，取而代之的是 JSON。

### 普通版本

```javascript
function ajax() {
    //实例化，以调用方法
    let xhr = new XMLHttpRequest();
    // open 方法设置请求参数 open(method, url, 是否异步)
    xhr.open('get', 'https://www.google.com');
    // 注册 `onreadystatechange` 事件，开启监听
    // 每当 readyState 属性改变时，就会调用该函数
    xhr.onreadystatechange = () => {
        // XMLHttpRequest 代理当前所处状态
        if (xhr.readyState === 4) {
            // 200-300请求成功
            if (xhr.status >= 200 && xhr.status < 300) {
                let string = request.responseText;
                // JSON.parse() 方法用来解析JSON字符串
                // 构造由字符串描述的JavaScript值或对象
                let object = JSON.parse(string);
            }
        }
    };
    // 用于实际发出 HTTP 请求。不带参数为GET请求
    request.send();
}
```

### Promise 版本

```javascript
// Promise 版本
function promiseAjax(url) {
    const p = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject('请求出错啦！！');
                }
            }
        };
        // 发送 http 请求
        xhr.send();
    });
    return p;
} 
let url = '/data.json';
promiseAjax(url)
    .then(res => {
        console.log(res);
    })
    .catch(reason => console.log(reason));
```

#Promise #JSON 

## 实现对象扁平化
---
```javascript
function objectFlat(source) {
    const res = {};
    function tool(obj = {}, parentKey = '') {
        Object.keys(obj).forEach(curKey => {
            const curVal = obj[curKey];
            if (typeof curVal === 'object' && curVal !== null) {
                tool(curVal, parentKey === '' ? curKey : `${parentKey}.${curKey}`);
            } else {
                res[`${parentKey}.${curKey}`] = curVal;
            }
        });
    }
    tool(source);
    return res;
}
const source = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
        e: 3,
    },
    f: {
        g: 2,
    },
};
console.log(objectFlat(source));
// 返回结果
{ 'a.b.c': 1, 'a.b.d': 2, 'a.e': 3, 'f.g': 2 }
```

#Object #keys 

## 实现一个 call
---
`call` 做了什么：
- 将函数设为对象的属性
- 执行&删除这个函数
- 指定 `this` 到函数并传入给定参数执行函数
- 如果不传入参数，默认指向为 `window`

```javascript
// 原理：利用 context.xxx = self obj.xx = func-->obj.xx()
Function.prototype.myCall = function (context = window, ...args) {
    // this-->func  context--> obj  args--> 传递过来的参数
    // 在context上加一个唯一值不影响context上的属性
    let key = Symbol('key');
    context[key] = this; // context为调用的上下文,this此处为函数，将这个函数作为context的方法
    // let args = [...arguments].slice(1)   //第一个参数为obj所以删除,伪数组转为数组
    let result = context[key](...args);
    delete context[key]; // 不删除会导致context属性越来越多
    return result;
};
function f(a, b) {
    console.log('result', a + b);
    console.log('this.name', this.name);
}
let obj = { name: 1 };
f(1, 2);
f.myCall(obj, 1, 2);
```

## 实现 [[🔖󠁽󠁽󠁽󠁽 Object#Object.create()|Object.create]]
---
`Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`

```javascript
function create(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}
```

## [[🌀 Promise|Promise]] 相关
---
### 实现 Promise 的 resolve

> 实现 resolve 静态方法有三个要点:

- 传参为一个 `Promise`, 则直接返回它。
- 传参为一个 `thenable` 对象，返回的 `Promise` 会跟随这个对象，采用它的最终状态作为自己的状态。
- 其他情况，直接返回以该值为成功状态的`promise`对象。