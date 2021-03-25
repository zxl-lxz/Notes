# 防抖函数和节流函数的实现

## 防抖函数

定义：一直不断的触发事件，当不触发的时候，在最后一次触发点的 N 秒后执行回调函数。

```js
function PreventShaking(fn) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, 500);
    };
}
```

利用了闭包的特性。返回的这个函数就是每次触发事件执行的函数。该函数是一个闭包。一直引用了 timer 这个变量。每次触发的时候，都会清除当前的 timer，并且重新创建一个 timer.

不想每次事件触发后等 n 秒才执行函数,做成一个开关，可以控制是否要这样。

```js
const content = document.querySelector('.content');

const myFun = function (e) {
    console.log(this, e);
};

const debounce = (fun, wait = 500, immediate) => {
    let timer = null;
    console.log('ddd');
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        if (immediate) {
            let callNomw = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNomw) {
                fun.apply(this, args);
            }
        } else {
            timer = setTimeout(() => {
                fun.apply(this, args);
            }, wait);
        }
    };
};
content.addEventListener('mousemove', debounce(myFun, 5000, true));
```

## 节流函数

定义：一直不断的触发事件，每间隔 N 秒触发一次回调函数。

### 1. 利用时间戳

```js
function throttle(fn) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime > 500) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}
```

### 2. 利用定时器

```js
function throttle(fn) {
    let timer = null;
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, 500);
        }
    };
}
```

### 如果我想一开始触发，结束后也会再触发一次呢？

```js
const throttle = (fun, delay = 1000) => {
    let pre = 0;
    let timer = null;
    return function (...args) {
        let now = Date.now();
        let remain = delay - (now - pre);
        if (remain <= 0 || remain > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            fun.apply(this, args);
            pre = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                fun.apply(this, args);
                pre = Date.now();
                timer = null;
            }, remain);
        }
    };
};
```
