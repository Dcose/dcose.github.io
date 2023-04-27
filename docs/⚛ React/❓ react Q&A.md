1. 问：老版本的 React 中，为什么写 jsx 的文件要默认引入 React?  
如下 ^834f2e
```react
import React from 'react'
function Index() {
	return <div>hello,world</div>;
}
```
答：因为 jsx 在被 **babel 编译**后，写的 jsx 会变成上述 React.createElement 形式，所以需要引入 React，防止找不到 React 引起报错。

---

2. 问: React.createElement 和 React.cloneElement 到底有什么区别呢? ^4393e3

答: 可以完全理解为，一个是用来创建 element 。另一个是用来修改 element，并返回一个新的 React.element 对象。

---

3. 问：如果没有在 constructor 的 super 函数中传递 props，那么接下来 constructor 执行上下文中就获取不到 props ，这是为什么呢？ ^edecf0
```react
/* 假设我们在 constructor 中这么写 */ 
constructor(){ 
	super();
	console.log(this.props); // 打印 undefined 为什么?
}
```

答：**绑定 props 是在父类 Component 构造函数中，执行 super 等于执行 Component 函数**，此时 props 没有作为第一个参数传给 super() ，在 Component 中就会找不到 props 参数，从而变成 undefined ，在接下来 constructor 代码中打印 props 为 undefined 。

```react
/* 解决问题 */
constructor(props) {
	super(props);
}
```

---

4. 函数组件和类组件本质的区别是什么呢？

答：对于类组件来说，底层只需要实例化一次，实例中保存了组件的 state 等状态。对于**每一次更新只需要调用 render 方法以及对应的生命周期**就可以了。但是在函数组件中，**每一次更新都是一次新的函数执行**，一次函数组件的更新，里面的变量会重新声明。

---

5. 类组件中的 `setState` 和函数组件中的 `useState` 有什么异同？ ^48ff5f

**相同点：**
-   首先从原理角度出发，setState和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规
**不同点**
-   在不是 pureComponent 组件模式下， setState 不会浅比较两次 state 的值，只要调用 setState，在没有其他优化手段的前提下，就会执行更新。但是 useState 中的 dispatchAction 会默认比较两次 state 是否相同，然后决定是否更新组件。
-   setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。
-   setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。