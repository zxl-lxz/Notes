1. 函数组件

```jsx
function CreateElement(props) {
    return (<div className="a">{props.name}</div>);
}
```

2. ES6的class组件

```jsx
class CreateElement extends React.Component {
    render() {
        return (<div className="a">{this.props.name}</div>);
    }
}
```

3. react元素可以是组件

```jsx
function CreateElement(props) {
    return (<div className="a">{props.name}</div>);
}
const ele = <CreateElement name="a" />;

ReactDOM.render(
    ele,
    document.getElementById('root');
);
```

> React 非常灵活，但它也有一个严格的规则：所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。