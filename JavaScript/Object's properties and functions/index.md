# Object

来总结下 `Object` 对象的方法。

## `Object.assign()`

用于对象的合并。将源对象的所有可枚举属性，复制到目标对象。并返回目标对象。此方法会修改目标对象。

下面是基本用法。

如果有重名的属性，后面的会覆盖前面的。

```js
const obj1 = {
    a: 1,
};
const obj2 = {
    a: 2,
    b: 3,
};
const target = {
    a: null,
};
const assignObj = Object.assign(target, obj1, obj2);

assignObj; // {a: 2, b: 3}
target; // {a: 2, b: 3}
```

📓：浅克隆

既然是复制源对象的属性值，那么就要考虑到值的类型。对于基本类型的值，拷贝的就是值。对于引用类型的值，该方法拷贝的是值的引用。

```js
const obj1 = {
    a: 1,
    b: {
        a: 1,
    },
};

const assignObj = Object.assign({}, obj1);

assignObj.a = 2;
assignObj; // {a: 2, b: {a: 1}}
obj1; // {a: 1, b: {a: 1}}

assignObj.b.a = 2;
assignObj; // {a: 2, b: {a: 2}}
obj1; // {a: 1, b: {a: 2}}
```

📓：只传一个参数的情况

如果只有一个参数，会直接返回该参数。

```js
Object.assign(obj) === obj; // true
```

如果第一个参数不是对象，则会调用对应的构造函数。

```js
Object.assign(2);
// 相当于
new Number(2);

// 有意思的是
typeof Object.assign(2); // 'object'

Array.isArray(Object.assign([])); // true

// 由于undefined和null无法被转换为对象。所以会报错
Object.assign(null); // 报错
Object.assign(undefined); // 报错
```

📓：源对象位置的参数，不是{}的情况。

如果是 `null` 或者 `undefined` 不会报错。直接跳过。其它类型，除了字符串类型和数组，也会被跳过。

```js
Object.assign({}, null, undefined, true, /\d+/g, 111, 'abc', () => {}, [1, 2]);
// {0: 1, 1: 2, 2: 'c'}
```

以上，只有字符串和数组生效了。会被当作对象处理。

## `Object.create()`

创建一个新对象，使用传入的对象来提供新创建对象的 `_proto_` 属性。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/2c39b918-1a1e-41bf-a8ee-3d6a2639f328WX20200915-160738@2x.png)

📓：用 `Object.create()` 实现继承。

```js
function Super(name) {
    this.name = name;
}
Super.prototype.sayName = function () {
    console.log(this.name);
};

function Sub(name) {
    Super.call(this, name);
}
Sub.prototype = Object.create(Super.prototype);
Sub.prototype.constructor = Sub;

const sub = new Sub('ZL');
```

我们在控制台，看看发生了什么。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/97ac12f3-b3c7-42b2-a61b-9d2ee9106560WX20200915-163032@2x.png)

`sub` 是我们创建的自类型的实例。它有自身的属性 `name` 。其 `_proto_` 属性指向其构造函数的 `prototype` 属性。也就是 `Sub` 的 `prototype` 属性。

而，我们将 `Sub.prototype = Object.create(Super.prototype);` 。仔细理解这句代码。

`Sub` 的 `protoytype` 属性现在是一个对象。这个对象的 `_proto_` 属性指向 `Super` 的 `prototype` 属性。

所以 `Sub` 的 `prototype` 不就是 `Super` 构造函数的一个实例嘛。

别忘了将 `constructor` 指回本身的构造函数哦。

📒： 创建一个原型为 null 的对象

```js
Object.create(null);
```

## `Object.defineProperty()`

参考[我对于 Proxy 和 Object.defineProperty 的总结](https://github.com/1282772905/Notes/tree/master/JavaScript/Proxy)

## `Object.entries()`

与 `Object.keys(),Object.values()`一起总结。

```js
const obj = {
    a: 1,
    b: 2,
};

Object.entries(obj); // [['a', 1], ['b', 2]]
Object.keys(obj); // ['a', 'b']
Object.values(obj); // [1, 2]
```

`Object.entries` 与 `Object.fromEntries` 互为逆操作。

## `Object.freeze()`

冻结一个对象。无法增删改。

> `Object.freeze()` 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。`freeze()` 返回和传入的参数相同的对象。--引用自 MDN

如果对象的属性值是引用类型，该引用类型不受影响。

## `Object.getOwnPropertyDescriptor()`

获得一个对象的自身的一个属性的属性描述对象。

```js
var o, d;

o = {
    get foo() {
        return 17;
    },
};
d = Object.getOwnPropertyDescriptor(o, 'foo');
// d {
//   configurable: true,
//   enumerable: true,
//   get: /*the getter function*/,
//   set: undefined
// }
```

## `Object.getOwnPropertyNames()`

与 `Object.getOwnPropertySymbols()` 一起。

参考[我对`ownKeys()的总结`](https://github.com/1282772905/Notes/blob/master/JavaScript/Proxy/proxy.md#ownkeys)

## `Object.getPrototypeOf()`

```js
const obj = {};

const obj1 = Object.create(obj);

Object.getPrototypeOf(obj1) === obj; // true

Object.getPrototypeOf(Object) === Function.prototype; // true

Object.getPrototypeOf({}) === Object.prototype; // true
```

## `Object.is()`

判断两个值是否为同一个值。具体参考 MDN。

需要注意的是

```js
Object.is(NaN, NaN); // true

Object.is(0, -0); // false
```

## `Object.prototype.hasOwnProperty()`

判断对象的属性是否是自身属性。

```js
const obj = {
    a: 1,
    b: null,
    c: undefined,
};

obj.hasOwnProperty('a');
obj.hasOwnProperty('b');
obj.hasOwnProperty('c');
// 以上均返回 true
```

## `Object.prototype.toString()`

如果未被覆盖，常用于检测对象类型

```js
Object.prototype.toString.call([]); // [object array]
```

其它类型这里不多做举例。

以上，大部分方法都总结到了。

🎉🎉🎉
