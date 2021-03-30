# 检测对象类型

## `typeof`

令人迷惑的操作符。应该避免使用它做以下检测。

```js
typeof NaN === 'number';

typeof [] === 'object';

typeof null === 'object';

typeof new Date() === 'object';

typeof /\d+/ === 'object';

typeof new String('') === 'object';
typeof new Number(1) === 'object';
typeof new Boolean(true) === 'object';
```

仅仅用它来检测对象是否定义或者赋值，或者检测以下例子：

```js
let b;

typeof a === 'undefined';
typeof b === 'undefined';

typeof function () {} === 'function';

typeof 'abc' === 'string';

typeof 123 === 'number';

typeof {} === 'object';
```

## `instanceof`

用于检测构造函数的 `prototype` 属性是否在对象的原型链上。

该操作符应该仅仅用来比较来自同一个 `JavaScript` 上下文的自定义对象。其它用法应该避免。

```js
function Super() {}
function Sub() {}

Sub.prototype = new Super();

new Sub() instanceof Super; // true
```

另外，有一个常用的 `[] instanceof Array` 。 不过更推荐使用 `Array.isArray()` 代替。

## `constructor`

返回对应的构造函数的引用。对于基本类型来说，该值只可读。

```js
const num = 3;
const str = 'a';
const boolean = true;

num.constructor === Number;
str.constructor === String;
bolean.constructor === Boolean;
```

该方法适用大部分情况。

避免适用该方法判断以下类型。

```js
NaN.constructor === Number;

null.constructor; // error

undefined.constructor; // error
```

## Object.prototype.toString.call()

该方法为推荐方法。适用所有类型。

```js
const toString = Object.prototype.toString;

toString.call([]); // [object Array]

const isACertainType = (typeStr) => (target) => typeStr === Object.prototype.toString.call(target).slice(8, -1);
const isArray = isACertainType('Array');
isArray([]); // true

// NaN 仍然返回Number
toString.call(NaN); // [object Number]
// NaN 还是用Object.is判断吧
Object.is(NaN, NaN); // true
```

始终推荐使用 `Object.prototype.toString()` 方法检测类型。

使用 `typeof` 检测对象是否定义赋值。

使用 `instanceof` 判断自定义对象的继承。

另外，推荐使用 `Array.isArray()` 来检测数组。
