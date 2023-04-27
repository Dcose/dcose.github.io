# JSX
[[❓ react Q&A#^834f2e|Q&A ]]

# 函数组件 & class组件

> [!note]
> 如果你想写的组件只包含一个  `render`  方法，并且不包含 state，那么使用**函数组件**就会更简单。

我们不需要定义一个继承于  `React.Component`  的类，我们可以定义一个函数，这个函数接收  `props`作为参数，然后返回需要渲染的元素。函数组件写起来并不像 class 组件那么繁琐，很多组件都可以使用函数组件来写。

## 将函数组件转换为类组件

1. 创建一个同名的`ES6 class`，并且继承于`React.Component`
2. 添加一个空的`render()`方法
3. 将功函数体移动到`render()`方法中
4. 在`render()`方法中使用`this.props`替换`props`
5. 删除剩余的空函数声明

## 正确的使用 `State`

- **不要直接修改 State**

直接修改`state`不会重新渲染组件：
```JavaScript
// Wrong
this.state.comment = 'Hello';
```

应该使用`setState()`：
```JavaScript
// Correct
this.setState({comment: 'Hello'});
```

**构造函数是唯一可以给 `this.state` 赋值的地方**

- **`State`的更新可能是异步的**

出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。
因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
[外链](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous)

- **`State`的更新会被合并**

当你调用 `setState()` 的时候，React 会把你提供的对象合并到当前的 state。
[外链](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html#state-updates-are-merged)

---
-  **数据是向下流动的**

组件可以选择把它的`state`作为`props`向下传递到它的子组件中：
```JavaScript
<FormattedDate date={this.state.date} />
```

`FormattedDate` 组件会在其 props 中接收参数 `date`，但是组件本身无法知道它是来自于 `Clock` 的 state，或是 `Clock` 的 props，还是手动输入的：
```JavaScript
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```
[外链](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down)

# 事件处理

-   React 事件的**命名采用小驼峰式**（camelCase），而不是纯小写。
-   使用 JSX 语法时你**需要传入一个函数作为事件处理函数**，而不是一个字符串。
# 条件渲染
- `if`
- 与运算符`&&`
- 三目运算符

# 表单

## 受控组件


## 非受控组件

# Refs

# 生命周期

componentDidMount()

componentDidUpdate()


# 高阶组件

# Hook

**Hook 不能在 class 中使用**

## useState

## useEffect
