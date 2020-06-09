1. `if`语句。

```jsx
let ele;
if (a) {
    ele = <div></div>
} else {
    ele = <span></span>
}

return (
    <div className="wrap">
        {ele}
    </div>
)
```

2. `&&`运算符和三元运算符

```jsx
return (
    <div>
        {this.state.isLogin &&
            <div className="item"></div>
        }
    </div>
)
```

```jsx
return (
    <div>
        {this.state.isLogin
        ? <div className="a"></div>
        : <span className="b"></span>
        }
    </div>
)

```