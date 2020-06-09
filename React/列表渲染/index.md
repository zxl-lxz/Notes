使用`map`进行渲染

```jsx
let ele = this.state.numbers.map((num, index) => 
    <li key={index}>{num}</li>
)
render(
    <ul>{ele}</ul>
)
```

```jsx
render() {
    return (
        numbers.map((num) => 
            <li>{num}</li>
        )
    )
}

```