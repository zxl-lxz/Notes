# HOC

高阶组件并不是 `React` 提供的特殊的 `API` 。它只是结合了 `React` 的特性的一种设计模式。

其核心思想是：一个参数为组件，返回值为新组件的函数。

`const componentB = hocFun(componentA)`

其作用类似 `Mixin` 。将一些逻辑抽离出来复用。

举一个最简单的例子。

```js
// A
class ComponentA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'a',
        };
    }

    componentDidMount() {
        console.log(this.state.a);
    }

    render() {
        return <div>{this.state.a}</div>;
    }
}

// B
class ComponentB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'b',
        };
    }

    componentDidMount() {
        console.log(this.state.title);
    }

    render() {
        return <div>{this.state.title}</div>;
    }
}
```

我们可以抽离 `componentDidMount` 的逻辑。

```js
const HocFun = function (Componnet, title) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                title,
            };
        }

        componentDidMount() {
            console.log(this.state.title);
        }

        render() {
            return <Componnet title={this.state.title} {...this.props} />;
        }
    };
};

const HocComponentA = HocFun(ComponentA, 'a');
const HocComponentB = HocFun(ComponentB, 'b');
```

所以，其核心作用是，将一些公用的逻辑，状态抽离出来，复用。
