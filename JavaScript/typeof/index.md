## 谨慎使用 `typeof` 判断类型

`JS` 中的数据类型可以这样分为两种：

1. 基本类型：`null undefined string number boolean symbol bigInt`
2. 对象： `object array function` 等都是对象

当对这些类型使用 `typeof` 操作符的时候，会返回一个字符串表示当前值的类型。

但是其结果却并不是那么令人放心。

```js
typeof null; // 'object' ⚠️

typeof undefined; // 'undefined'

typeof 'a'; // 'string'

typeof 123; // 'number'

typeof true; // 'boolean'

typeof symbol(); // 'symbol'

typeof 12258468545768757n; // 'bigint'

typeof {}; // 'object'

typeof []; // 'object' ⚠️ object的子类型

typeof (() => {}); // 'function' ⚠️ object的子类型，内部[[call]]属性，表面该对象可以被调用
```

再多的一些，这里不一一列举了～

所以，如果你想用 `typeof` 去检测一个值的类型，那还是小心点～

## typeof b === 'undefined' ?

但你以为这就完了？no no no。它还有更离谱的。

总所周知，如果我们定义了一个变量，但是没有给它赋值。它就是 `undefined`。

```js
let a;

typeof a; // 'undefined'

a; // 'undefined'
```

但是，如果一个变量连生命都没有呢？

```js
typeof b; // 'undefined'

b; // Uncaught ReferenceError: b is not defined
```

迷惑吗？这里的 `b` 根本就没有定义，他是一个不存在的东西。使用 `typeof` 操作符，竟然返回 `undefined`？？意思是，我还没出生呢，我就是 `undefined` 类型了。

但是当你读取 `b` 的时候，它又报错了。`b is not defined`。这句话读起来就是 `undefined` 的意思啊。难道 `not defined !== undefined` ???

这就是 `typeof` 更离谱的地方。“离谱他妈给离谱开门”。

言归正传。

准确的说，`b is not declared` 才对。根本就没有声明这个变量。

这里的 `typeof b` 返回 `undefined` 是 `typeof` 的一种安全措施。

## “安全” 的 `typeof`

如果一个变量没有声明，我们用 `if` 判断的时候（读取值）会报错。

```js
if (a) {
}
```

但是，`typeof` 不会啊！

```js
if (typeof a !== 'undefined') {
}
```

这种安全机制，还是给这种场景提供了帮助的。当然，我们也可以将变量绑定到 `window` 上，这样不会报错了，但是并不是所有的 JS 都是允许在浏览器上的。

```js
if (window.a) {
}
```

还有一种设计模式叫做 `依赖注入`,也避免了变量不存在的报错。

```js
function foo(a) {
    a = a || function () {};
}
```

以上～
