![image](http://udh.oss-cn-hangzhou.aliyuncs.com/224c748e-e0ac-4239-8646-c7aaa0fdbb5e1605664023018WX202011180946412x.png)

1. state

```jsx
class Clock extends React.component {
    constructor(props) {
        super(props);
        // 仅仅在构造函数里，state可以这样写，其它地方更改，需要用setState()
        this.state = {
            date: new Date(),
        };
    }
    render() {
        return <div>{this.state.date.toLocaleTimeString()}</div>;
    }
}
```

2. 生命周期

```jsx
class Clock extends React.component {
    constructor(props) {
        super(props);
        // 仅仅在构造函数里，state可以这样写，其它地方更改，需要用setState()
        this.state = {
            date: new Date(),
        };
    }

    // 组件已经被渲染到DOM之后，运行此钩子函数
    componentDidMount() {
        this.timerId = setInterval(() => {
            this.tick;
        }, 1000);
    }
    // 当组件被销毁时，执行此钩子函数
    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    tick() {
        this.setState({
            date: new Date(),
        });
    }
    render() {
        return <div>{this.state.date.toLocaleTimeString()}</div>;
    }
}
```
