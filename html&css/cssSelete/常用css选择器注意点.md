- [x] 逗号`a, b`

```css
div, p {color: red;}
.div1, .div2 {color: red;}
#div1, #div2 {color: red;}
...
```

- [x] 选择后代`a b`

```css
div p {color: #333333;}
.div1 .div2 {color: #222222;}
.div1 #div3 {color: #ffffff;}
⚠️注意：只要b是a的后代元素即可。不论是几代。
```

- [x] 大于号  `a > b`

```css
div > p {color: red;}
.div1 > .div2 {color: green;}
⚠️注意：a一定要是b的父元素。只能一代。
```

- [x] 加号 `a + b`

```html
<style>
    .div2 + p {
        color: red;
    }
</style>

<div class="div2">222</div>
<p>111</p> // 我是红色
<p>111</p> // 我不是红色
<div class="div2">222</div>
<p>111</p> // 我是红色
⚠️注意：只有紧跟在a后面的第一个b元素才生效。
```

- [x] 伪类`:`

```css
a:link {color: blue;} // 没有被访问的样式
a:hover {color: green;} // 鼠标放上去的样式
a:visited {color: red;} // 被访问过后的样式
a:active {color: yellow;} // 正被点击的时候的样式
input:focus {border: none;} // 获得焦点的时候的样式
p:first-letter {font-size: 32px;background-color: grey;} // 第一个字样式,可设置背景色
p:first-line {color: red;} // 第一行的样式
p:before {content: '注意：'} // 在P内容之前插入内容，所有内容在P内。
p:after {content: '。。。'} //在内容最后插入，所有内容在P内。
.div1:first-child {color: red} // ⚠️寻找所有.div1的父元素，如果.div1是其父元素的第一个子元素，才应用样式。
.div1:last-child {color: red} // ⚠️寻找所有.div1的父元素，如果.div1是其父元素的最后一个子元素，才应用样式.
.div:nth-child(odd/even/number) {color: red} // ⚠️都要找到父元素哦，odd奇数，even偶数
```

```html
<head>
<style>
p:first-child
{
background-color:yellow;
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
```

```html
<head>
<style> 
p:nth-child(2)
{
background:#ff0000;
}
</style>
</head>
<body>

<h1>这是标题</h1>
<p>第一个段落。</p> // 变色
<p>第二个段落。</p>
<p>第三个段落。</p>
<p>第四个段落。</p>

```