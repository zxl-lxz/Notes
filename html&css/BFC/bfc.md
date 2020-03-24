# 什么是BFC？

翻译：块级格式化上下文

BFC是块盒子的布局区域，是浮动元素与其它元素交互的区域。它规定了内部的块盒子如何布局，并且与外部毫不相干。

# BFC的特性

1. 属于同一个BFC的两个相邻的Box会在垂直方向上发生margin重叠。
2. 一个BFC内如果存在浮动盒子，默认情况，浮动盒子会与其它盒子重叠。当给其它盒子触发BFC时，则可以避免这种情况。
3. 计算BFC的高度时，浮动元素也会计算在内。

# 如何触发BFC？

- 根元素（html）本身就是一个BFC
- 浮动元素（float值为left/right）
- 绝对定位元素（position值为absolute/fixed）
- overflow取值不为visible
- display的值取以下值
    - `inline-block`
    - `table-cell`,`table-caption`,`table`,`table-row`,`table-row-group`,`table-header-group`,`table-footer-group`
    - `flow-root`
    - `flex`
    - `grid`
- contain值取以下值
    - `layout`,`content`,`paint`

# BFC的应用

> 解决垂直方向margin重叠的问题

`属于同一个BFC的两个相邻的Box会在垂直方向上发生margin重叠。`。那么只要再创建一个BFC，让两个元素不再属于同一个BFC即可。

外边距重叠的例子：

两个盒子同属于`html`这个BFC。所以最终两个盒子垂直方向上间隔为`10px`而不是`20px`.

```html
<div class="blue"></div>
<div class="red"></div>
```

```css
.blue {
    margin: 10px 0;
}
.red {
    margin: 10px 0;
}
```

解决方法：

给`red`单独的父元素，并给这个父元素触发BFC。现在，两个盒子垂直方向间距为`20px`.

```html
<div class="blue"></div>
<div class="red-wrap">
    <div class="red"></div>
</div>
```

```css
.blue {
    margin: 10px 0;
}
.red-wrap {
    display: flow-root;
}
.rec {
    margin: 10px 0;
}
```

> 一边定宽，一边自适应

`一个BFC内如果存在浮动盒子，默认情况，浮动盒子会与其它盒子重叠。当给其它盒子触发BFC时，则可以避免这种情况。`

```html
<img src="a.png" alt="image" class="image">
<p class="text">我是一段文字</p>
```

```css
.image {
    width: 200px;
    height: 200px;
    float: left;
}
.text {
    display: inline-block;
}
```

> 解决浮动元素造成父元素高度塌陷问题

`计算BFC的高度时，浮动元素也会计算在内。`

```html
<div class="box">
    <div class="float-box"></div>
</div>
```

```css
.box {
    overflow: hidden;
}
.float-box {
    float: left;
    width: 200px;
    height: 200px;
}
```