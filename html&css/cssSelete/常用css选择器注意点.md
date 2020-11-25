# 选择器优先级

优先级可以用四位数来表示。默认是 `0 0 0 0` 。

各选择器权重如下：

`style内联样式` 的权重为 `1 0 0 0` 。

```html
<div style="width: 100px"></div>
```

`ID选择器` 的权重为 `0 1 0 0` 。

```css
#div1 {
    width: 100px;
}
```

`class类选择器` 、 `属性选择器` 、 `伪类选择器` 这三者的权重为 `0 0 1 0` 。

```css
.div1 {
    width: 100px;
}

/* 0 0 2 0 */
.div1[name='div1'] {
    width: 100px;
}

/* 0 0 2 0 */
.div1:hover {
    width: 100px;
}
```

`元素选择器` 、 `伪元素选择器` 这两者的权重为 `0 0 0 1` 。

```css
div {
    width: 100px;
}
/* 0 0 0 2 */
div::before {
    width: 100px;
}
```

`通配符选择器` 、 `关系选择器` 对权重不造成影响。

```css
* {
    width: 100px;
}

/* 0 0 0 2 */
div > p {
    width: 100px;
}
```

`!imoprant` 不属于权重计算范畴。但却拥有覆盖一切的能力。

以下的 `div1` 最终展示 `200px` 宽度。

```css
/* 0 1 0 0 */
#div1 {
    width: 100px;
}

/* 0 0 1 0 */
.div1 {
    width: 200px !important;
}
```

# 需要注意的选择器使用

> 分组 `a, b`

```css
div,
p {
    color: red;
}
```

> 后代 `a b`

只要 b 是 a 的后代元素即可。不论是几代。

```css
div p {
    color: #333333;
}
```

> 直接子代 `a > b`

a 一定要是 b 的父元素。只能一代。

```css
div > p {
    color: red;
}
```

> 紧邻兄弟 `a + b`

只有紧跟在 a 后面的第一个 b 元素才生效。

```html
<style>
    .div2 + p {
        color: red;
    }
</style>

<div class="div2">222</div>
<!-- 我是红色 -->
<p>111</p>

<!-- 我不是红色 -->
<p>111</p>

<div class="div2">222</div>
<!-- 我是红色 -->
<p>111</p>
```

> 伪类 `:`

```css
/* 没有被访问的样式 */
a:link {
    color: blue;
}

/* 鼠标放上去的样式 */
a:hover {
    color: green;
}

/* 被访问过后的样式 */
a:visited {
    color: red;
}

/* 正被点击的时候的样式 */
a:active {
    color: yellow;
}

/* 获得焦点的时候的样式 */
input:focus {
    border: none;
}

/* 第一个字样式,可设置背景色 */
p:first-letter {
    font-size: 32px;
    background-color: grey;
}

/* 第一行的样式 */
p:first-line {
    color: red;
}

/* 在P内容之前插入内容，所有内容在P内。 */
p:before {
    content: '注意：';
}

/* 在内容最后插入，所有内容在P内。 */
p:after {
    content: '。。。';
}

/* 寻找所有.div1的父元素，如果.div1是其父元素的第一个子元素，才应用样式。 */
.div1:first-child {
    color: red;
}

/* 寻找所有.div1的父元素，如果.div1是其父元素的最后一个子元素，才应用样式. */
.div1:last-child {
    color: red;
}

/* 都要找到父元素哦，odd奇数，even偶数 */
.div:nth-child(odd/even/number) {
    color: red;
}
```

```html
<head>
    <style>
        p:first-child {
            background-color: yellow;
        }
    </style>
</head>
<body>
    <p>这个段落是其父元素（body）的首个子元素。</p>

    <h1>欢迎访问我的主页</h1>
    <p>这个段落不是其父元素的首个子元素。</p>

    <div>
        <p>这个段落是其父元素（div）的首个子元素。</p>
        <p>这个段落不是其父元素的首个子元素。</p>
    </div>
</body>
```

```html
<head>
    <style>
        p:nth-child(2) {
            background: #ff0000;
        }
    </style>
</head>
<body>
    <h1>这是标题</h1>
    <p>第一个段落。</p>
    // 变色
    <p>第二个段落。</p>
    <p>第三个段落。</p>
    <p>第四个段落。</p>
</body>
```
