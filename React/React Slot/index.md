`React`没有`插槽`的概念。所有东西都可以通过`props`传递.

`props.children`是一个特殊的数据。类似默认插槽。

```jsx
function A(props) {
    return (
        <div>
            {props.children}
        </div>
    )
}

function B() {
    return (
        <A>
        <p>aaa</p>
        </A>
    )
}
```

还有类似“具名插槽”

```jsx
function A(props) {
    return (
        <div>
            {props.left}
            {props.right}
        </div>
    )
}

function B() {
    return (
        <A
        left={
            <h1></h1>
        }
        right={
            <h2></h2>
        }
        >
        </A>
    )
}
```