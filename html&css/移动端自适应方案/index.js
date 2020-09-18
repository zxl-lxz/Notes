function autoFix() {
    let timer,
        // 这里设置1或者 1/dpr 都是可以的。无论是苹果还是安卓。这里做处理可以跟设备的最佳渲染机制有关。
        dpr = window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1,
        scale = 1 / dpr,
        htmlElement = document.documentElement,
        metaElement = document.createElement("meta");
    function resetRem() {
        window.rem = htmlElement.getBoundingClientRect().width / 16;
        htmlElement.style.fontSize = window.rem + "px";
    }
    window.dpr = dpr;
    window.addEventListener("resize", function () {
        clearTimeout(timer);
        timer = setTimeout(resetRem, 300)
    }, false);
    window.addEventListener("pageshow", function () {
        clearTimeout(timer);
        timer = setTimeout(resetRem, 300)
    }, false);
    // 设置html元素的data-dpr属性。做字体大小的自适应。
    htmlElement.setAttribute("data-dpr", dpr);
    metaElement.setAttribute("name", "viewport");
    metaElement.setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no, viewport-fit=cover");
    htmlElement.firstElementChild.append(metaElement);
    resetRem();
}

// 你的设计稿的尺寸比如是750. 那么 配合 我们设置的 window.rem = htmlElement.getBoundingClientRect().width / 16;

// 此时，你设计稿上的 1rem是 46.875px

// 如果我们写 window.rem = htmlElement.getBoundingClientRect().width / 10;
// 那么1rem就是75px了。这个是自己根据设计稿定的。

// 做自适应时， 时用JS获取 此时设备的宽度。从而获得其rem. 我们成为为nowRem.

// (nowRem / rem) * (你要设置的尺寸)

// 至于css预编译器，各种数学运算方式都不一样，对于单位的处理也不一样。但是原理不变。

// 例如less的计算方式。（比较容易让人困惑）

// @base: 46.875rem

// .div {width: 200/@b}

// 其实是这样计算的 (200 / 46.875) * 1rem. 此时的rem就是我们计算出来的nowRem.

// 上面的计算等价于 200 * (nowRem / 46.875)