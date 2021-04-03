# 梳理 React 中与 Ref 相关的一些知识点

在 `React` 的官方文档中，分别对 `Refs转发` 、 `Refs & DOM` 以及 `Hooks` 中的 `UseRef()` 和 `useImperativeHandle()` 做了详细的介绍。

因为这些章节比较分散，对于想要系统学习 `Ref` 的同学来说，可能阅读成本比较高昂。加上这些知识之间的贯通性，放在一起做比较可以加深对它的理解。

接下来我会按照自己的理解组织文章脉络，有兴趣的小伙伴直接按顺序阅读即可，相信到最后会对 `Ref` 有新的认识。

先来看下 `ref` 出现的背景。

## 背景

在典型的 `React` 数据流中（自上而下），在父组件中想要更改子组件，则必须更改父组件的 `state` , 从而更改子组件接收到的 `props` ,触发子组件重新渲染。

但是在某些特殊情况下，我们想在父组件中直接更改子组件。被修改的子组件可以是一个 `react 组件` 也可以直接是一个 `DOM` 元素。如以下例子中，我想在页面初次渲染的时候，自动聚焦输入框：

```js
// 修改DOM元素
class Parent extends React.Component {
    render() {
        return <input />;
    }
}
```

```js
// 修改子组件
class Child extends React.Component {
    render() {
        return <input />;
    }
}
class Parent extends React.Component {
    render() {
        return <Child />;
    }
}
```

显然，我们需要拿到 `input` 元素，并执行其 `focus()` 方法。

`ref` 便是这一情况的一剂良方。

想要使用 `ref`,首先我们需要创建它。在 `React` 中，创建 `ref` 有三种方式：`React.createRef()`，`回调ref` 和 `Hook API: useRef()`。我们先看第一种。

## React.createRef()

```js
function Parent(props) {
    const myRef = React.createRef();
    return <input ref={myref} />;
}
```

通过 `React.createRef()` 创建 `ref`。并通过 `ref` 属性，附加到 `React元素`.

> `React` 会在组件挂载时给 `current` 属性传入 `DOM` 元素，并在组件卸载时传入 `null` 值。`ref` 会在 `componentDidMount` 或 `componentDidUpdate` 生命周期钩子触发前更新。

**现在通过 `myRef.current` 便可以拿到 `input` 元素**

`current` 是 `ref` 的一个属性，其值根据节点的类型而有所不同：

1. 当 `ref` 属性用于 `HTML` 元素时，其值就是这个元素。
2. 当 `ref` 属性用于自定义的 `class` 组件时，其值为组件实例。

好了，我们来实现上面说到的聚焦输入框吧～

```js
// 修改DOM元素
class Parent extends React.Component {
    myRef = React.createRef();
    componentDidMount() {
        this.myRef.current.focus();
    }
    render() {
        return <input ref={this.myRef} />;
    }
}
```

```js
// 修改子组件
class Child extends React.Component {
    myRef = React.createRef();
    focusInput() {
        this.myRef.current.focus();
    }
    render() {
        return <input ref={this.myRef} />;
    }
}
class Parent extends React.Component {
    myRef = React.createRef();
    componentDidMount() {
        this.myRef.current.focusInput();
    }
    render() {
        return <Child ref={this.myRef} />;
    }
}
```

需要注意的是，函数组件因为没有实例，所以不能将 `ref` 属性作用于函数组件。

```js
// 这段代码将不会生效，并且会报错
function Child(props) {
    const myRef = React.createRef();
    const focusInput = () => {
        myRef.current.focus();
    };
    return (
        <div>
            <input ref={myRef} />
            <input onClick={focusInput} />
        </div>
    );
}
class Parent extends React.Component {
    myRef = React.createRef();
    componentDidMount() {
        // 报错
        this.myRef.focusInput();
    }
    render() {
        return (
            // Child因为不是class组件，所以ref不会生效
            <Child ref={this.myRef} />
        );
    }
}
```

不过有变通的方法，后面会有。我们继续看第二种方法 `回调ref`👀 ～

## 回调 ref

`回调ref` 使用函数的形式。这给函数可以接收 `React组件实例` 或者 `HTML DOM` 作为参数。所以它和 `React.createRef()` 一样，也可以作用于 `class组件` 和 `DOM`。

我们将上面的例子改成用 `回调ref` 的方法。

```js
// 修改DOM元素
class Parent extends React.Component {
    myRef = null;
    setInputRef = (element) => {
        this.myRef = element;
    };
    componentDidMount() {
        // 注意这里的myRef就是DOM对象，不再有myRef.current
        this.myRef && this.myRef.focus();
    }
    render() {
        return <input ref={this.setInputRef} />;
    }
}
```

```js
// 修改子组件
class Child extends React.Component {
    myRef = null;
    setInputRef = (element) => {
        this.myRef = element;
    };
    focusInput() {
        this.myRef.focus();
    }
    render() {
        return <input ref={this.setInputRef} />;
    }
}
class Parent extends React.Component {
    myRef = null;
    setInputRef = (component) => {
        this.myRef = component;
    };
    componentDidMount() {
        this.myRef && this.myRef.focusInput();
    }
    render() {
        return <Child ref={this.setInputRef} />;
    }
}
```

在修改子组件的例子中，我们在 `Parent` 中调用 `Child` 的方法，实现功能。这是因为我们通过 `ref` 获取到了子组件实例。但是，其实 `回调ref` 可以直接 `获取子组件中的DOM节点`.

```js
// 修改子组件
function Child(props) {
    return <input ref={props.inputRef} />;
}
class Parent extends React.Component {
    myRef = null;
    setInputRef = (element) => {
        this.myRef = element;
    };
    componentDidMount() {
        this.myRef && this.myRef.focusInput();
    }
    render() {
        return <Child inputRef={this.setInputRef} />;
    }
}
```

在上面的例子中,将函数作为 `props` 传递给了子组件。现在 `this.myRef` 将直接是 `input` 元素。

那既然这样，思考如下代码：

```js
// 修改子组件
function Child(props) {
    return <input ref={props.inputRef} />;
}
class Parent extends React.Component {
    myRef = React.createRef();
    componentDidMount() {
        this.myRef.current.focusInput();
    }
    render() {
        return <Child inputRef={this.myRef} />;
    }
}
```

显然，会报错的～

那如何在使用 `React.createRef()` 的情况下，也能够在父组件中直接获取子组件的 `DOM` 元素而不是组件实例呢？

这就要说到前面卖的关子了。前面说过，有方法将 `ref` 作用于函数组件。同样是这个方法，可以获取到子组件里的 `DOM` 元素。这个方法就是 `React.forwardRef()`。

## React.forwardRef()

`forward`顾名思义，就是将我们创建的 `ref` 转发到子组件中的任意位置。来看一下它的用法。

```js
// Child
const Child = React.forwardRef((props, ref) => <input ref={ref} />);

export default Child;
```

```js
// Parent
class Parent extends React.Component {
    myRef = React.createRef();
    render() {
        return <Child ref={this.myRef} />;
    }
}
```

`Child` 的 `ref` 是我们创建的 `ref`。这个 `ref` 将作为 `React.forwardRef` 的函数参数的第二个参数传递给 `input` , 作为其 `ref` 属性的值。这就是其透传的作用。

上面说了两种创建 `ref` 的方法，以及直接获取子组件的 `DOM` 元素的方法。最后还有一种创建 `ref` 的方法属于 `React Hook API: useRef()`。

## useRef()

`useRef` 和 `React.createRef` 大同小异。都是用来创建 `ref` 对象。

```js
function test(props) {
    const myRef = useRef(null);
    useEffect(() => {
        myRef.current.focus();
    }, []);
    return <input ref={myRef} />;
}
```

然而，`useRef` 强大之处在于，其可以很方便的保存任何值。因为它本质上就是一个普通的 JS 对象。并且，无论组件如何重新渲染，`useRef` 都会返回同一个对象。

我们来看一下它的巧用。

```js
function Test(props) {
    const ref = useRef(null);
    useEffect(() => {
        const id = setInterval(() => {});
        ref.current = id;
        return () => {
            clearInterval(ref.current);
        };
    });
    const clear = () => {
        clearInterval(ref.current);
    };
    return (
        <div>
            <button onClick={clear}>clear</button>
        </div>
    );
}
```

以上基本以及介绍完了关于 `React Ref` 的知识。还有一些不常用的没有介绍。我将官网链接按照逻辑顺序依次放在下面。想再系统地跟着官网过一遍的同学请可以按照这个顺序学习。

[1. React.createref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)

这一章说明的 `ref` 出现的背景，为什么需要使用它。如何创建，以及在 `DOM、class组件`中使用。

[2. React.forwardRef](https://zh-hans.reactjs.org/docs/forwarding-refs.html)

这一章节主要介绍了 `React.createRef()` 的使用。如何利用它将我们创建的 `ref` 绑定到我们想要的任何子组件的任何`DOM` 元素上。

[3. Hook 中的 ref](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)

这里主要介绍了 `useRef 和 useImperativeHandle` 的用法。

以上便是全部内容了，希望对你有所帮助，谢谢阅读～
