## API

### React.createElement

**创建并返回指定类型的新 [React 元素](https://zh-hans.reactjs.org/docs/rendering-elements.html)**
```react
React.createElement(
	type,
	[props],
	[...children]
)
```
参数：

- type：其中的类型参数既可以是标签名字符串（如 `'div'` 或 `'span'`），也可以是 [React 组件](https://zh-hans.reactjs.org/docs/components-and-props.html) 类型 （class 组件或函数组件），或是 [React fragment](https://zh-hans.reactjs.org/docs/react-api.html#reactfragment) 类型。
- [props] ：一个对象，在 dom 类型中为标签属性，在组件类型中为 props。
- [...children]：依次为 children，根据顺序排列。

[[❓ react Q&A#^4393e3|Q&A]]

### React.Children.toArray

**扁平化 `children` 组成的数组，并为每个子节点分配一个 key**

### React.Children.forEach

**遍历子节点**

### React.isValidElement

**验证对象是否为 React 元素，返回值为 `true` 或 `false`**

### React.cloneElement

**以 `element` 元素为样板克隆并返回新的 React 元素。**

---

## 组件

> 组件本质上就是类和函数，但是与常规的类和函数不同的是，**组件承载了渲染视图的 UI 和更新视图的 setState 、 useState 等方法**。React 在底层逻辑上会像正常实例化类和正常执行函数那样处理的组件。

> [!note] 
> UI + update + 常规的类和函数 = React 组件 

### 类（class）组件

#### 处理流程

```javascript
function constructClassInstance (
	workInProgress, // 当前正在工作的 fiber 对象 
	ctor, // 我们的类组件 
	props // props
) {
	/* 实例化组件，得到组件实例 instance */ 
	const instance = new ctor(props, context)
}
```

#### react 底层定义组件流程

```javascript
function Component(props, context, updater) {
    this.props = props; //绑定props
    this.context = context; //绑定context
    this.refs = emptyObject; //绑定ref
    this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function (partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
```

如上可以看出 Component 底层 React 的处理逻辑是
1. 类组件执行构造函数过程中会在**实例**上绑定 props 和 context ，初始化置空 refs 属性
2. **原型链**上绑定setState、forceUpdate 方法
3. 对于 **updater**，React 在实例化类组件之后会单独绑定 update 对象。

[[❓ react Q&A#^edecf0|Q&A]]

#### 各部分功能

```javascript
class Index extends React.Component {
    constructor(...arg) {
        super(...arg); /* 执行 react 底层 Component 函数 */
    }
    state = {}; /* state */
    static number = 1; /* 内置静态属性 */
    handleClick = () =>
        console.log(111); /* 方法： 箭头函数方法直接绑定在this实例上 */
    componentDidMount() {
        /* 生命周期 */
        console.log(Index.number, Index.number1); // 打印 1 , 2
    }
    render() {
        /* 渲染函数 */
        return (
            <div style={{ marginTop: '50px' }}>
                hello,React!
                <button onClick={this.handleClick}>click me</button>
            </div>
        );
    }
}
Index.number1 = 2; /* 外置静态属性 */
Index.prototype.handleClick = () =>
    console.log(222); /* 方法: 绑定在 Index 原型链的 方法*/
export default Index;
```


#### 函数（Function）组件

**处理流程**

```javascript
function renderWithHooks (
	current, // 当前函数组件对应的 `fiber`， 初始化 
	workInProgress, // 当前正在工作的 fiber 对象 
	Component, // 我们函数组件 
	props, // 函数组件第一个参数 
	props secondArg, // 函数组件其他参数 
	nextRenderExpirationTime, //下次渲染过期时间
) {
	/* 执行我们的函数组件，得到 return 返回的 React.element对象 */ let children = 
	Component(props, secondArg);
}

```

---

### 组件通信方式

#### 1. props 和 callback 方式

props 和 callback 可以作为 React 组件最基本的通信方式，父组件可以通过 props 将信息传递给子组件，子组件可以通过执行 props 中的回调函数 callback 来触发父组件的方法，实现父与子的消息通讯。

**父组件 -> 通过改变自身 state，重新渲染，传递 props -> 通知子组件**

**子组件 -> 通过调用父组件 props 中的回调 -> 通知父组件**

```javascript
import React, { useState } from 'react';

function Son(props) {
    const { fatherSay, sayFather } = props;
    return (
        <div className="son">
            我是子组件
            <div>父组件对我说：{fatherSay}</div>
            <input
                placeholder="我对父组件说"
                onChange={e => sayFather(e.target.value)}
            />
        </div>
    );
}  

function Father() {
    const [childSay, setChildSay] = useState('');
    const [fatherSay, setFatherSay] = useState('');
    return (
        <div className="box father">
            我是父组件
            <div>子组件对我说：{childSay}</div>
            <input
                placeholder="我对子组件说"
                onChange={e => setFatherSay(e.target.value)}
            />
            <Son fatherSay={fatherSay} sayFather={setChildSay} />
        </div>
    );
}
  
function LearnComponent() {
    return <Father />;
}  

export default LearnComponent;
```

#### 2. ref 方式
#### 3. React-redux 或 React-mobx 状态管理方式
#### 4. context 上下文方式
#### 5. event bus 事件总线

优点：
- 跨层级，不受 React 父子组件层级的影响
**致命**缺点：
- 需要手动绑定和解绑
- 对于小型项目还好，但是对于中大型项目，这种方式的组件通信，会造成牵一发动全身的影响，而且后期难以维护，组件之间的状态也是未知的。
- 一定程度上违背了 React 数据流向原则。

所以！！非要用 eventBus 的话，更适合用在 React 做基础构建的小程序，比如 Taro。

### 组件的强化方式

#### 类组件继承

因为 React 中的类组件，有良好的继承属性，所以可以针对一些基础组件，首先实现一部分基础功能，再针对项目要求进行有方向的**改造**、**强化**、**添加额外功能**。优势：

1.  可以控制父类 render，还可以添加一些其他的渲染内容；
2.  可以共享父类方法，还可以添加额外的方法和属性。

注意：state 和生命周期会被继承后的组件修改。

#### 函数组件自定义 Hooks

#### HOC 高阶组件

## State
#state

> [!question] 
>  **state 到底是同步还是异步的？**

### setState
#### setState 更新流程

![[setState更新流程图.xmind]]

#### 批量更新规则

```javascript
function batchedEventUpdates(fn, a) {
    /* 开启批量更新  */
    isBatchingEventUpdates = true;
    try {
        /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
        return batchedEventUpdatesImpl(fn, a, b);
    } finally {
        /* try 里面 return 不会影响 finally 执行  */
        /* 完成一次事件，批量更新  */
        isBatchingEventUpdates = false;
    }
}
```
如上可以分析出流程，在 React 事件执行之前通过 `isBatchingEventUpdates=true` 打开开关，开启事件批量更新，当该事件结束，再通过 `isBatchingEventUpdates = false;` 关闭开关，然后在 scheduleUpdateOnFiber 中根据这个开关来确定是否进行批量更新。

### useState

```javascript
[state , dispatch ] = useState(initData)
```

[[❓ react Q&A#^48ff5f||Q&A]]

---

## props

对于在 React 应用中写的子组件，无论是函数组件 `FunComponent` ，还是类组件 `ClassComponent` ，父组件绑定在它们标签里的属性/方法，最终会变成 props 传递给它们。但是这也不是绝对的，对于一些特殊的属性，比如说 ref 或者 key ，React 会在底层做一些额外的处理。

```javascript
import React from 'react';
/* children 组件 */
function ChildrenComponent() {
    return <div> In this chapter, let's learn about react props ! </div>;
}
/* props 接受处理 */
class PropsComponent extends React.Component {
    componentDidMount() {
        console.log(this, '_this');
    }
    render() {
        const { children, mes, renderName, say, Component } = this.props;
        const renderFunction = children[0];
        const renderComponent = children[1];
        /* 对于子组件，不同的props是怎么被处理 */
        return (
            <div>
                {renderFunction()}
                {mes}
                {renderName()}
                {renderComponent}
                <Component />
                <button onClick={() => say()}> change content </button>
            </div>
        );
    }
}
/* props 定义绑定 */
class Index extends React.Component {
    state = {
        mes: 'hello,React',
    };
    node = null;
    say = () => this.setState({ mes: 'let us learn React!' });
    render() {
        return (
            <div>
                <PropsComponent
                    mes={this.state.mes} // 1. props 作为一个渲染数据源
                    say={this.say} // 2. props 作为一个回调函数 callback
                    Component={ChildrenComponent} // 3. props 作为一个组件
                    renderName={() => <div> my name is alien </div> } 
                    // 4. props 作为渲染函数
                >
                    {() => <div>hello,world</div>} {/* 5. render props */}
                    <ChildrenComponent /> {/* 6. render component */}
                </PropsComponent>
            </div>
        );
    }
}
```

如上看一下 props 可以是什么？

1. props 作为一个子组件渲染数据源
2. props 作为一个通知父组件的回调函数
3. props 作为一个单纯的组件传递
4. props 作为渲染函数
5. render props ， 和 4 的区别是放在了 children 属性上
6. render component 插槽组件

### 实现一个简单的 `<Form> <FormItem>`嵌套组件

**用于表单状态管理的`<Form>` 和 `<FormItem>` 组件**

-   `<Form>`用于管理表单状态；
-   `<FormItem>`用于管理`<Input>`输入框组件。,

编写的组件能够实现的功能是：

- `Form` 组件可以被 ref 获取实例。然后可以调用实例方法 `submitForm` 获取表单内容，用于提交表单，`resetForm` 方法用于重置表单。
- `Form`组件自动过滤掉除了`FormItem`之外的其他React元素
- `FormItem` 中 name 属性作为表单提交时候的 key ，还有展示的 label 。
- `FormItem` 可以自动收集 `<Input/>` 表单的值。

#### 1. 编写 `<Form>`

![[Form.js]]

##  lifeCycle

![[lifecycle.png]]