## 理解 this 指向

:::tip

始终坚持一个原理：this 永远指向 **最后调用** 它的那个对象。

:::

```javascript
// 例1
var name = 'windowsName';
function a() {
	var name = 'Cherry';
	console.log(this.name); // windowsName
	console.log('inner:' + this); // inner: Window
}
a();
console.log('outer:' + this); // outer: Window
```

1.  根据“this 永远指向 **最后调用** 它的那个对象”，最后调用 `a` 的地方 `a();` ，前面没有调用的对象，那么调用的对象就是全局对象 `Window`，相当于 `Window.a();`

:::caution

注意：此处没有使用严格模式，如果使用严格模式，全局对象就是 `undefined`，报错 `Uncaught TypeError: Cannot read property 'name' of undefined`

:::

```javascript
// 例2
var name = 'windowsName';
var a = {
	name: 'Cherry',
	fn: function () {
		console.log(this.name); // Cherry
	},
};
a.fn();
```

2.  此处的 `fn` 是对象 `a` 调用的，所以打印的值就是 `a` 中的 `name` 的值。

```javascript
// 例3
var name = 'windowsName';
var a = {
	name: 'Cherry',
	fn: function () {
		console.log(this.name); // Cherry
	},
};
window.a.fn();
```

3.  再次根据“this 永远指向 **最后调用** 它的那个对象”，此处最后调用 `fn` 的对象仍是对象 `a`。

```javascript
// 例4
var name = 'windowsName';
var a = {
	// name: "Cherry",
	fn: function () {
		console.log(this.name); // undefined
	},
};
window.a.fn();
```

4.  这里为什么会打印 `undefined` 呢？这是因为调用 `fn` 的是 `a` 对象，也就是说 `fn` 的内部的 `this` 对象是 `a`，而对象 `a` 中并没有对 `name` 进行定义，所以 `log` 的 `this.name` 的值是 `undefined`。

:::note

这个例子还说明了“this 永远指向 **最后调用** 它的那个对象”，因为最后调用 `fn` 的对象是 `a`，所以就算 `a` 中没有这个属性，也不会继续向上一个对象寻找 `this.name`，而是直接输出 `undefined`。

:::

```javascript
// 例5
var name = 'windowsName';
var a = {
	name: null,
	// name: "Cherry",
	fn: function () {
		console.log(this.name); // windowsName
	},
};

var f = a.fn;
f();
```

5.  此处为什么不是打印 `Cherry` 呢？虽然已经将 `a` 对象的 `fn` 方法复制给变量 `f` 了，但是 `f` 是没有调用的，又一次根据“this 永远指向 **最后调用** 它的那个对象”，由于 `f` 并没有调用，所以 `fn()` 最后仍然是被 `window` 调用的。所以 `this` 指向的也就是 `window`。

:::note
由以上的例子可以看出，`this` 的指向并不是在创建的时候就可以确定的，在 ES5 中，永远是“this 永远指向**最后调用**它的那个对象”。
:::

```javascript
// 例6
var name = 'windowsName';
function fn() {
	var name = 'Cherry';
	innerFunction();
	function innerFunction() {
		console.log(this.name); // windowsName
	}
}
fn();
```

6.  相当于 `window.fn();`，`this` 指向的是 `window`，而 `window` 对象上 `name` 属性的值是 `windowsName`。

---

## 改变 this 指向

:::tip

- 使用 ES6 的箭头函数
- 在函数内部使用 `_this = this`
- 使用 `apply`、`call`、`bind`
- new 实例化一个对象

:::

```javascript
// 例1
var name = 'windowsName';
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		setTimeout(function () {
			this.func1();
		}, 100);
	},
};
a.func2(); // this.func1 is not a function
```

在不使用箭头函数的情况下会报错，是因为最后调用 `setTimeout` 的对象是 `window`（ `setTimeout` 里的 `this` 指向 `window`），但是在`window`中并没有 `func1` 函数。

### 1. 箭头函数

---

:::info
众所周知，ES6 的箭头函数是可以避免 ES5 中使用 this 的坑的。**箭头函数的 this 始终指向函数定义时的 this，而非执行时。**使用箭头函数需要记着这句话：“箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined”。
:::

```javascript
// 例2
var name = 'windowsName';
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		setTimeout(() => {
			this.func1();
		}, 100);
	},
};
a.func2(); // Cherry
```

### 2. \_this

---

:::info

如果不使用 ES6，那么这种方式应该是最简单的不会出错的方式了，我们是先将调用这个函数的对象保存在变量 \_this 中，然后在函数中都使用这个 \_this，这样 \_this 就不会改变了。

:::

```javascript
// 例3
var name = 'windowsName';
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		var _this = this;
		setTimeout(function () {
			_this.func1();
		}, 100);
	},
};
a.func2(); // Cherry
```

在这里的 `func2` 中，首先设置 `_this = this;`，这里的 `this` 指向调用 `func2` 的对象 `a`（先保存起来），为防止在 `func2` 中的 `setTimeout` 被 `window` 调用而指向 `window`。在 `func2` 中使用 `_this`，指向的也是对象 `a` 了。

### 3. apply、call、bind

---

#### 使用 apply

```javascript
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		setTimeout(
			function () {
				this.func1();
			}.apply(a),
			100
		);
	},
};
a.func2(); // Cherry
```

#### 使用 call

```javascript
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		setTimeout(
			function () {
				this.func1();
			}.call(a),
			100
		);
	},
};
a.func2(); // Cherry
```

#### 使用 bind

```javascript
var a = {
	name: 'Cherry',
	func1: function () {
		console.log(this.name);
	},
	func2: function () {
		setTimeout(
			function () {
				this.func1();
			}.bind(a)(),
			100
		);
	},
};
a.func2(); // Cherry
```
