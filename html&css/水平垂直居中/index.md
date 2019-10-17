# 水平垂直居中

```html
<div class="box">
    <div class="item"></div>
</div>
```

1. `flex`

```css
.box {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

```css
.box {
    display: flex;
}
.item {
    margin: auto;
}
```

2. `grid`

```css
.box {
    display: grid;
}
.item {
    justify-self: center;
    align-self: center;
}
```

3. `position: absolute`

```css
.box {
    position: relative;
}
.item {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

```css
.box {
    position: relative;
}
.item {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
}
```

```css
.box {
    position: relative;
}
.item {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```