因为`react`是单向数据流。

每个组件里的`state`只能在本组件里用`setState`去改变。

于是想要和兄弟组件进行通信，只能通过借助一个父组件。

这种方式的名字叫做`状态提升`.意思是这个`state`本应该优先放在需要进行UI渲染的组件中。但是由于我需要进行兄弟组件的通信。于是我这个`state`被提升到了父组件中。始终保持`自上而下`的数据流。

以下是官方的温度计算案例

```jsx
// 首先，这是一个计算温度是否足够让水沸腾的组件

function BoilingVerdict(props) {
    if (props.celsius > 100) {
        return (
            <p>沸腾</p>
        )
    }
    return (
        <p>没沸腾</p>
    )
}

// 接下来我们有个计算组件

class Calculator extends React.components {
    constructor(props) {
        super(props);
        this.state = {
            celsius: '',
        };
    }
    handleCChange(e) {
        this.setState({
            celsius: e.target.value,
            fahrenheit: ((e.target.value * 9) / 5) + 32,
        });
    }
    handleFChange(e) {
        this.setState({
            fahrenheit: e.target.value,
            celsius: ((e.target.value - 32) * 5) / 9,
        });
    }
    render() {
        return (
            <input value={this.state.celsius} onChange={(e) => this.handleCChange(e)}>
            <input value={this.state.fahrenheit} onChange={(e) => this.handleFChange(e)}>
            <BoilingVerdict celsius={this.state.celsius}>
        )
    }
}
```