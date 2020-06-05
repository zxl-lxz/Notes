```jsx
// 箭头函数的方式
class Toggle extends React.component {
    constructor(props) {
        super(props);
        this.state = {
            a: 1,
        };
    }
    handleClick(id) {
        console.log(this.state.a, id);
    }
    render() {
        return (
            <div onclick={(e) => this.handleClick(1, e)}></div>
        )
    }
}
```

```jsx
// bind
class Toggle extends React.component {
    constructor(props) {
        super(props);
        this.state = {
            a: 1,
        };
    }
    handleClick(id) {
        console.log(this.state.a, id);
    }
    render() {
        return (
            <div onclick={this.handleClick.bind(this, 1)}></div>
        )
    }
}
```