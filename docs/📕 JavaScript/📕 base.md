### async、defer
---
- 如果依赖其他脚本和 DOM 结果，使用 defer
- 如果与 DOM 和其他脚本依赖不强时，使用 async

**script 引入方式**

- `html` 静态`<script>`引入
- `js` 动态插入`<script>`
- `<script defer>`: 异步加载，元素解析完成后执行
- `<script async>`: 异步加载，但执行时会阻塞元素渲染

### DOM 节点
---
- Document 节点，整个文档是一个文档节点
- Element 节点，每个HTML标签是一个元素节点
- Attribute 节点，每一个HTML属性是一个属性节点
- Text 节点，包含在HTML元素中的文本是文本节点

### 对象的几种创建方式
---
#### 工厂模式创建

```javascript
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        alert(this.name);
    };
}
var person1 = createPerson('da', 1, 'it');
var person2 = createPerson('dada', 2, 'it');
```

#### 构造函数模式创建

```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    };
}
var person1 = new Person('dada', 1, 'web');
var person2 = new Person('dada', 2, 'web');
console.log(person1);
console.log(person2);
```

