# 闭包是什么

参考：[[译]发现 JavaScript 中闭包的强大威力](https://juejin.im/post/5c4e6a90e51d4552266576d2)

> “闭包是指有权访问另一个函数作用域中的变量的函数”

> 摘录来自: 泽卡斯（Zakas. Nicholas C.）. “JavaScript高级程序设计(第3版) (图灵程序设计丛书)。” Apple Books. 

以上说法现在看来并不准确，`let`和`const`出现后，有了`块级作用域`

所以，应该这么给`闭包`下定义：

> 闭包是一个可以访问外部作用域的内部函数，即使这个外部作用域已经执行结束

要理解这句话，首先从`外部作用域`说起。

## 作用域

> 作用域决定这个变量的生命周期及其可见性。 当我们创建了一个函数或者 `{}` 块，就会生成一个新的作用域。需要注意的是，通过 `var` 创建的变量只有函数作用域，而通过 `let` 和 `const` 创建的变量既有函数作用域，也有块作用域。

## 外部作用域

JS中，函数里面可以嵌套函数。

```js
function foo() {
    let x = 1;
    function bar() {
        console.log(x);
    }
}
```

`bar` 函数是嵌套在`foo`函数里面的函数。它可以访问到变量 `x`,也就是可以访问外部作用域。此时`bar`函数就是闭包。

上面的例子以函数作用域为例，块级作用域同理

```js
{
    let x = 1;
    function bar() {
        console.log(x);
    }
}
```

内部函数不仅可以访问外部作用域定义的变量，甚至可以访问形参。

```js
(function foo(x) {
    let y = 1;
    function bar() {
        console.log(x); // 10
        console.log(y); // 1
    }
    bar();
})(10)
```

> ⚠️闭包的外部作用域是在定义时决定的，不是在运行时。

```js
(function foo() {
    let x = 1;
    function bar() {
        console.log(x);  // 1
    }
    function run(fn) {
        let x = 100;
        fn();
    }
    run(bar);
})()
```

以上解释了，闭包的形成，以及从外部作用域读取值的特点。

接下来，理解，如何让闭包发挥作用，其特性是什么？

## 外部作用域执行完毕后

让闭包发挥特性，有两种办法：

**1. 在异步任务中被作为回调**

**2. 被外部函数作为返回结果，或者被返回对象引用**

先看第一种，异步任务中作为回调

`timer` 定时器

```js
(function foo(){
    let x = 1;
    setTimeout(() => {
        console.log(x);
    }, 0);
})()
```
> 变量 `x` 将一直存活着直到定时器的回调执行或者 `clearTimeout()` 被调用。 如果这里使用的是 `setInterval()` ，那么变量 `x` 将一直存活到 `clearInterval()` 被调用。

`DOM` 事件

```js
(function foo() {
    let x = 1;
    $('btn').on('click', () => {
        console.log(x);
    })
})()
```

> 当变量 `x` 在事件处理函数中被使用时，它将一直存活直到该事件处理函数被移除。

`ajax` 请求

```js
(function foo() {
    let x = 1;
    fetch("http://").then(function log(){
      console.log(x);
    });
})()
```

> 变量 `x` 将一直存活到接收到后端返回结果，回调函数被执行。

再来看第二种，被外部函数作为返回结果，或者被返回对象引用

作为返回结果

```js
function foo() {
    let x = 1;
    function bar() {
        console.log(x);
    }
    return bar;
}
```

被返回对象引用

```js
function foo() {
    let x = 1;
    function bar() {
        console.log(x);
    }
    function run() {
        bar();
    }
    return run;
}
```

## 闭包与循环

先看`JS高级程序设计`的例子

```js
function foo() {
    let result = [];
    for (var i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        }
    }
    return result;
}
// 10个10
```
外部函数返回了一个对象，该对象的每一项都引用了闭包。

所以，触发闭包的特性：`闭包只存储外部变量的引用，而不会拷贝这些外部变量的值。`

当我们访问`result[0]()`的时候，返回的是10而不是0。因为每一个函数都引用着同一个变量`i`，当我们访问的时候，循环早就执行完毕了，最终都是`10`。

解决这个问题，最简单的办法 ，就是将`var`改成`let`。这样，在每一次循环的时候，为`for`语句创建一个新的局部变量`i`。

```js
function foo() {
    let result = [];
    for (let i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        }
    }
    return result;
}
// 0-10
```

⚠️如果变量声明在`for`语句之外，`let`将毫无意义。

```js
function foo() {
    let result = [];
    let i;
    for (i = 0; i < 10; i++) {
        result[i] = function() {
            return i;
        }
    }
    return result;
}
// 10个10
```

## 利用闭包：创建私有性

清楚了什么是闭包，那闭包用来做什么？

那就是私有性。

```js
let prototypeObj = {
    foo: () => {
        return this.a + this.b;
    }
}

function Add(prop) {
    let newObj = Object.create(prototypeObj);
    Object.assign(newObj, prop);
    return newObj;
}
```

上面对代码，我们又一个对象`prototypeObj`被用作了原型对象，赋值给了`newObj`.它在全局环境中。

现在我想，不对其它函数暴露这个原型对象。只给`Add`这个函数用。

这时闭包发挥作用了

```js
let Add = (function() {
    let prototypeObj = {
        foo: () => {
            return this.a + this.b;
        }
    }
    return function() {
        let newObj = Object.create(prototypeObj);
        Object.assign(newObj, prop);
        return newObj;
    }
}();
```

闭包容易造成内存泄露，所以记得手动回收：`Add = null`.

