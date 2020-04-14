首先需要清楚的是，盒模型。

盒子占的宽度是它的`content`+`padding`+`border`

我们设置元素的`width`在标准盒模型下，其实是设置盒子的`content`

清楚了这些，看下面例子

```html
<div class="wrap">
    <div class="item"></div>
</div>
```

```css
.wrap {
    width: 100px;
    padding: 10px;
}
.item {
    width: 100%;
    padding: 10px;
}
```

这个例子里，父元素的`content`为100，`padding`为20，总宽度为120.

子元素的`width`设置的是`100%`。那么，子元素的`content`会严格等于父元素的`content`.

所以，最终，子元素占的宽度是`cintent`的100加上`padding`的20，合计120.

再看下面这个例子

```css
.wrap {
    width: 100px;
    padding: 10px;
}
.item {
    width: auto;
    padding: 10px;
    margin: 10px;
}
```

这里，子元素的`width`设置为了`auto`.

除非恶意为之（将子元素的的padding或者border设置的超大）,否则，子元素所占的横向空间（包括`content,padding,margin`）永远只能填满父元素的`content`内容。

所以，子元素最终的`content`为60，`padding`为20，`margin`为20.盒子总宽度为80.横向所占空间为100.