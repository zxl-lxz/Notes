1. 在`JSX`中，`class`变成了`className`

```jsx
const ele = <div className="a">some thing<div/>
```

2. 假设一个标签里没有内容，那么其可以自闭和。

```jsx
const ele = <img src={a} />
```

3. 渲染

```jsx
const ele = (<div className={a}>{a}</div>)
ReactDom.render(ele, document.getElementById('root'));
```