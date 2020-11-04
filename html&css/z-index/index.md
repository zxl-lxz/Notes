# z-index

`z-index` 并不是想象中那么简单的属性。想要了解详细表现的可以移步 MDN。

[理解 CSS 的 z-index 属性](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index)

本文只对说一下其比较重要的两个特点。

## 只对定位元素生效

仅仅对设置了 `position` 属性，且是以下取值之一的元素生效：

-   `relative`
-   `absolute`
-   `stiky`
-   `fixed`

其它取值,例如 `static,unset,initial,inherit` 都不生效。

## 先比较父等级再比较自己

```html
<div class="wrap">
    <div class="item1"></div>
    <div class="item2"></div>
</div>

<div class="content">
    <div class="item3"></div>
</div>
```

```less
.wrap {
    position: relative;
    z-index: 1;
    .item1 {
        position: absolute;
        z-index: 9;
    }
    .item2 {
        position: absolute;
        z-index: 99;
    }
}
.content {
    position: relative;
    z-index: 2;
    .item3 {
        position: absolute;
        z-index: 1;
    }
}
```

上面的例子中，如果元素发生重叠。其视觉顺序是 `item3 > item2 > item1`.

> 为什么 `item3 > item2` ?

这就是为什么我要说 `先比较父等级`。

`z-index` 的取值为整数的时候，会创建一个新的 `堆叠上下文` 。

这里不解释 `堆叠上下文` 是什么意思。

打个比方，它就是身份牌。设置了`z-index` 为整数的元素会获得国王身份。这个元素的子元素都是这个国王的臣民。在比较先后顺序的时候，如果比较的双方不是同一个国家的，那么先比较哪个国王的国家更厉害。

如果我的国家比你的国家更强大（父元素的 `z-index` 大）,那你根本没有资格跟我比了，我在视觉上一定比你更靠近屏幕。哪怕你的 `z-index` 是 `9999` 而我的是 `-9999`.

如果两个国家一样强大。那再来比较自己的。

## `z-index: auto VS z-index: 0`

这两者有着本质的区别。

### `z-index: auto`

设置了该值的盒子，并不会创建一个新的 `堆叠上下文` 。也就是不会给它一个国王身份。其在当前国家的身份大小（层叠等级）和国王在这个国家的身份大小一样。

**但是这里需要注意的是，父元素在其自身创建的层叠上下文中的层叠等级是 0.**

也就是说，国王在自己的国家，他比较低调，喜欢微服私访。当和自己的臣民呆在一起的时候，他穿着成最普通（z-index: 0）的样子。

但是当与其它国家比较的时候，才会拿出自己该有的身份（对其设置的 `z-index` 值）.

所以，设置一个元素为 `z-index: auto` ，其在视觉上的效果与 `z-index: 0` 的作用是一样的。

### `z-index: 0`

其与 `z-index: auto` 本质的区别就是，它会新建一个 `堆叠上下文`。

也就是说，虽然我这个国家比较穷，但是我也要成为国王。🙄
