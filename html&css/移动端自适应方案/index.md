# 移动端自适应

写一个东西之前，先问问

这个是什么？

为什么要去做？

怎样去做？

## 移动端自适应是什么？

是一种解决方案。用于解决同一个页面在不同移动设备上显示不一致的问题。

## 为什么要做移动端自适应？

为了优化体验。因为移动设备不断在更新换代。各种屏幕和型号的设备层出不穷。导致出现了很多移动端显示问题。

## 怎么去做？

首先需要根据统一的约定，做各设备的适配。然后需要根据某些设备的特性，做单独的适配。

**有哪些约定？哪些特性？**

### `英寸`

`英寸` 是设备对角线的长度。

`1英寸 = 2.54厘米`

### `像素`

`像素` 是最小组成单位。类似表格的每一项。

每一个像素都有自己的颜色、亮度、位置等特性。

### `屏幕分辨率`

`屏幕分辨率` 表明此屏幕由多少个像素点组成。

例如 `魅族16` 的屏幕参数如下:

| 参数名 | 参数值      |
| ------ | ----------- |
| 尺寸   | 6 英寸      |
| 分辨率 | 2160 x 1080 |
| 对比度 | 100000:1    |
| PPI    | 402         |
| 亮度   | 430cd/m²    |

可以得出，此设备由 `2160 x 1080` 个像素点组成.

分辨率高，不一定屏幕越清晰，还要结合屏幕尺寸做计算。

### PPI

每英寸包括的像素数。

上表中，`meizu16` 的 `PPI` 是 `402` .表示此设备每英寸的像素个数是 `402` 个。

显然，`PPI` 越高，屏幕越清晰。

### 设备独立像素

我们说设备的分辨率为 `2160 x 1080` 。这里的数字代表像素点数。

那如果一个块盒子的大小为 `300 x 300`。意思是其占用 `300 x 300` 个像素点去渲染这个块状盒子。

在低分辨率的设备上，其占的比例就大。在高分辨率的设备上，其占比就小。（比如在 900 x 900 分辨率的设备上，占比 1/3.在 600 x 600 分辨率的设备上，占比 1/2）。

那岂不是，分辨率越高，我们要展示的内容越小？

这显然不是我们希望看到的。我们希望内容越清晰而且大小不变。

乔布斯在 `iphone4` 的发布会上，首次提出了 `RetinaDisplay` （视网膜屏幕） 的概念。它正是解决了上面的问题。这也使得 `iphone4` 成为一款跨时代的手机。

在 `iphone4` 视网膜屏幕中,把 `2 x 2` 单位的像素当作 `1` 个像素点使用。

再看上面的例子。普通手机会使用 `300 x 300` 个像素点去渲染这个块状盒子。而 `iphone4` 会使用 `600 x 600` 个像素点去渲染它。

比如 `iphoneX` 的分辨率为 `1125 x 2436`。其会用 `3 x 3` 个像素当作一个像素去渲染。

其设备独立像素为 `375 x 812`。

打开 `Chrome` 开发者工具，可以看到确实是这样。

### dpr

设备像素比。

上面的例子，`iphoneX` 的 `dpr` 就是 `3` 。

用 `Chrome` 开发这工具，打开手机调试模式。选择机型为 `iphoneX`。

在控制台打印`window.devicePixelRatio` 会输出当前机型的 `dpr`。可以看到 `iphoneX` 的 `dpr` 为 3。

在 `CSS` 环境。可以使用 `min-device-pixel-ratio:` 来获取。

```css
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
}
```

当然，会发现有的设备其 `dpr * 设备独立像素` 并不等于其分辨率。这个我们不用去管。手机会把计算出来的像素塞进其物理像素中去。

理想情况下，无论各设备分辨率怎么变，只要保证宽高比一致，那么同一个元素在不用设备上显示的大小是一致的。但是现实是各设备各厂家都有自己的设计。所以现在基本不能做到在各设备上一样的大小。

### viewport

`<meta name="viewport" content="width=device-width, initial-scale=1">`

此标签用于设置视口初始值。

`width`: 定义视口的宽度。

`initial-scale`: 定义设备宽度和视口大小之间的比例。

`maximum-scale`: 最大缩放比例。

`minimum-scale`: 最小缩放比例。

`user-scalable`: 是否允许用户缩放。

`viewport-fit`:

-   `auto`: 不影响初始布局视口，并且整个网页都是可见的。
-   `contain`: 表示视口已缩放以适合显示在显示屏上的最大矩形。
-   `cover`: 表示视口已缩放以填充设备显示。强烈建议使用安全区域插入变量，以确保重要内容不会出现在显示屏之外。

内容比较多。还是懵的建议多看几遍。多去思考，把逻辑理清楚。自己动手去试试。

### 方案

理清楚了上面的各属性以后。我们来看下，在不做任何处理的时候，我们写一个 `100px` 的元素，在各设备上显示的情况。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,  minimum-scale=1.0, user-scalable=no,viewport-fit=cover"
        />
        <title>Document</title>
        <style>
            html,
            body {
                margin: 0;
                padding: 0;
            }
            .div1 {
                width: 100px;
                height: 100px;
            }
        </style>
    </head>
    <body>
        <div class="div1"></div>
    </body>
</html>
```

实际情况是:

1. 各设备的`document.documentElement.clientWidth` 等于其 `设备独立像素`。
    1. `iphone6`: `375 x 667`
    2. `iphoneX`: `375 x 812`
    3. `iphone XS MAX`: `414 x 896`
2. 我们设置的 `100px` 的元素，在各设备上都显示为 `100px`。设备独立像素大的，其占屏幕宽度比例就低。这就是是没有做自适应的情况。显然不是我们想看到的。

根据上面的情况，我们需要做的是：根据设备的 `clientWidth` 去做自适应。

现在，让我们结合实际开发情况，梳理下设计思路：

1. 我们拿到设计稿。这个设计稿可能是根据任何设备来设计的。假设为`750`。

2. 我们获取到来设计稿上一个元素的大小。假设为 `100px`。

3. 现在，如果我们直接在代码里写 `100px` 。在目前市面上的设备里，好像没有一款设备的独立像素为 750 的。所以，这个元素将会严重比设计稿上占的比例大。而且是大很多。

4. 所以我们迫切需要一个单位，暂且命名为@b。当我们写 `100@b` 的时候，其能在任何设备上做自适应的大小。

5. 这时候就轮到 `document.documentElement.clientWidth` 或者 `document.documentElement.getBoundingClientRect().width` 出场了。当我们的 `initial-scale=1` 的时候，其值就是设备的 `设备独立像素`.

6. 那么 `@b = clientWidth / 750`.我们可以在 JS 里将根元素的 `font-size` 设置为这个值。那么就可以直接用 rem 做单位了。

以上其实已经解决了自适应问题了。

不过有人好奇了，如果我的 `initial-scale=1/dpr` 呢。

举个例子就能明白。假设一个设备，其 `设备独立像素` 为 `375` 。 `dpr` 为 `2` .

这时，其`initial-scale=0.5`。

这时，会发现，我们获取的 `clientWidth` 会变成 `750` 。

也就是说，设置 `initial-scale=1/dpr` 与 设置`initial-scale=1` 是一样的效果。

## 总结

绕了这么一大圈，我们发现，问题其实很简单:

`@b = clientWidth / 设计稿给的宽度`

设计稿上的元素大小为 `100 x 200`

`CSS` 里就写 `width: 100@b; height: 200@b`

🎉🎉🎉

### `下面给出JS设置方案（rem方案）`

```js
// 750的设计稿
// 假设设计稿上1rem  = 46.875px  46.875 * 16 = 750
// 在CSS里，我们设置元素属性为 （100 / 46.875） * 1rem
// 用less预编译器，可以写为 @b:46.875rem
// width: 100/@b
function Adaptive() {
    let timer,
        // 这里设置1或者 1/dpr 都是可以的。无论是苹果还是安卓。这里做处理可以跟设备的最佳渲染机制有关。
        dpr = window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1,
        scale = 1 / dpr,
        htmlElement = document.documentElement,
        metaElement = document.createElement('meta');

    // 设置根元素的字体大小
    function resetRem() {
        const rem = htmlElement.getBoundingClientRect().width / 16;
        htmlElement.style.fontSize = rem + 'px';
    }

    // 当调整窗口大小,页面显示的时候，重新设置根元素字体大小
    window.addEventListener(
        'resize',
        function () {
            clearTimeout(timer);
            timer = setTimeout(resetRem, 300);
        },
        false
    );
    window.addEventListener(
        'pageshow',
        function () {
            clearTimeout(timer);
            timer = setTimeout(resetRem, 300);
        },
        false
    );

    // 设置html元素的data-dpr属性。做字体大小的自适应。
    // 字体不适合用rem，因为通过计算得来的px。很有可能为13，15这种大小。不在其点阵里面。显示出来的字体会很难看。
    htmlElement.setAttribute('data-dpr', dpr);

    // 设置viewport属性
    metaElement.setAttribute('name', 'viewport');
    metaElement.setAttribute(
        'content',
        'initial-scale=' +
            scale +
            ', maximum-scale=' +
            scale +
            ', minimum-scale=' +
            scale +
            ', user-scalable=no, viewport-fit=cover'
    );
    // 往 head 里插入 meta
    htmlElement.firstElementChild.append(metaElement);

    // 初始化的时候，执行一遍函数
    resetRem();
}
Adaptive();
```

### 字体方案

为什么字体不使用以上的 `rem` 作为单位自适应呢？

1. 在大屏，我们希望看到更多的文字。
2. 中文点阵最好是在 `12px, 14px, 16px`。如果使用计算而来的大小，避免不了会有 `13px, 15px` 这种尺寸。这样的文字显示奇怪。

我们已经设置了 `html` 元素的 `data-dpr`属性为现在设备的 `dpr` . 当 `dpr` 大于 `1` 的时候，我们同时设置 `initial-scale= 1/dpr`。让这两者同步。

```less
// less
.px2px(@name, @px) {
    @{name}: floor(@px / 2) * 1px;
    [data-dpr='2'] & {
        @{name}: @px * 1px;
    } // for mx3
    [data-dpr='2.5'] & {
        @{name}: floor(@px * 2.5 / 2) * 1px;
    } // for 小米note
    [data-dpr='2.75'] & {
        @{name}: floor(@px * 2.75 / 2) * 1px;
    }
    [data-dpr='3'] & {
        @{name}: floor(@px / 2 * 3) * 1px;
    } // for 三星note4
    [data-dpr='4'] & {
        @{name}: @px * 2px;
    }
}

.fontSize(@px) {
    .px2px(font-size, @px);
}
```

这样可以有效避免奇怪的尺寸。

在同样的 `dpr` 下，设备独立像素越大的，显示的文字内容也就越多。

### 1 像素边框方案

1. 根据设备的 `dpr` 去设置 `innitail-scale=1/dpr` 的时候，我们直接在 `CSS`里写 `1px` 就是 真正的`1px`。

2. 用伪元素

```less
// less
.border-common() {
    position: relative;
    &:after {
        display: block;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scale(1);
        transform: scale(1);
        pointer-events: none;
        z-index: 1;
    }
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        &:after {
            right: -100%;
            bottom: -100%;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            z-index: 1;
        }
    }
}

.border(@px, @type, @color) {
    .border-common();
    &:after {
        border: @px @type @color;
    }
}
```
