因为render返回到jsx必须只有一个包裹元素

```jsx
render() {
    return (
        <ul>
            <ChildUl />
        <ul>
    )
}
```

```jsx
class ChildUl extends React.components {
    render() {
        return (
            <div>
                <li><li/>
                <li></li>
            </div>
        )
    }
}
```

以上代码会得到

```html
<ul>
    <div>
        <li></li>
        <li></li>
    </div>
</ul>
```

为了解决这个问题

`Fragment`出现了。相当于是一个无名的空的父元素标签。

现在在`ChildUl`里可以这样写：

```jsx
import {Fragment} from 'react';
class ChildUl extends React.components {
    render() {
        return (
            <Fragment>
                <li><li/>
                <li></li>
            </Fragment>
        )
    }
}
```

渲染出来是这样的

```html
<ul>
    <li></li>
    <li></li>
</ul>
```