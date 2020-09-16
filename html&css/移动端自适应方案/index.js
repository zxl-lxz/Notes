function autoFix() {
    let timer,
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
    htmlElement.setAttribute("data-dpr", dpr);
    metaElement.setAttribute("name", "viewport");
    metaElement.setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no, viewport-fit=cover");
    resetRem();
}

// 你的设计稿的尺寸比如是750. 那么 配合 我们设置的 window.rem = htmlElement.getBoundingClientRect().width / 16;

// 此时，你设计稿上的 1rem是 46.875px

// 做自适应时， 时用JS获取 此时设备的宽度。从而获得其rem. 我们成为为nowRem.

// (nowRem / rem) * (你要设置的尺寸)

// 至于css预编译器，各种数学运算方式都不一样，对于单位的处理也不一样。但是原理不变。