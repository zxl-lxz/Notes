# `defineProperty`

在了解 `ES6` 的 `Proxy` 属性之前，我们先来回顾下 `ES5` 的 `defineProperty` 属性。

对象的属性分为两种：`数据属性` 和 `访问器属性`。

这两种属性都有其特质。

## 数据属性

数据属性具有4个特性。

`configurable` : 表示能否通过 `delete` 删除属性从而重新定义属性。能否修改属性的这4个特性。能否把属性修改为访问器属性。

`enumerable` : 表示能否通过 `for in` 循环返回属性。

`writable` : 表示能否修改属性的值。

`value` : 存储和读取值的位置。

在调用 `defineProperty()` 时，若没有指定前3个特质的值，默认都是false. `value` 默认是 `undefined`.

### configurable

这个特性，一旦被设置为false.即表示，不能再修改这4个特性了。所以如下代码在严格模式下会报错。

```js
// use strict
const obj = {};
Object.defineProperty(obj, 'a', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: 1,
});
Object.defineProperty(obj, 'a', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: 1,
});
// 报错
```

### enumerable

```js
const obj = {
    a: 1,
    b: 2,
    c: 3,
}
Object.defineProperty(obj, 'a', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: 1,
});

for (let k in obj) {
    console.log(k);
}

// b, c
```

## 访问器属性

访问器属性也有4个特性。

`configurable` : 表示能否通过 `delete` 删除属性从而重新定义属性。能否修改属性的这4个特性。能否把属性修改为访问器属性。

`enumerable` : 表示能否通过 `for in` 循环返回属性。

`get` : 在读取属性时调用的函数。默认值为 `undefined`。

`set` : 在写入属性时调用的函数。

```js
let obj = {};

Object.defineProperty(obj, 'a', {
    get: function() {
        return this._a
    },
    set: function(newVal) {
        this._a = newVal;
    }
});
// 注意，可以是_a或者任何其它的名字，但是就是不能是a.否则会溢出栈。因为在set里又会调用set.
```