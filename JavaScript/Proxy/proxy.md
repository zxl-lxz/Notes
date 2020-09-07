# Proxy

`Proxy` 为构造函数。用于对目标对象设置拦截。

```js
const proxy = new Proxy(target, handler); 
```

`target` 为目标对象。`handler` 为拦截函数。

使用 `Proxy` 拦截对象，都是上面这种形式。 

注意，要让 `Proxy` 起到作用，必须对 `Proxy` 实例进行操作。而不是针对目标对象进行操作。

```js
const obj = {
    a: 1,
};

const proxy = new Proxy(obj, {
    get: function(target, key) {
        return 2;
    }
});

proxy.a // 2
obj.a // 1
```

还有一点需要注意，如果 `handler` 什么也没做，那么访问或者操作 `Proxy` 实例，相对于直接访问或者操作原对象。

```js
const obj = {
    a: 1,
};

const proxy = new Proxy(obj, {});

proxy.b = 2;
obj.b // 2
```

`Proxy` 一共提供了13种拦截操作。

## `get()`

拦截对象对读取操作。例如 `peoxy.foo` 或者 `proxy['foo']` 。

`get` 方法接受三个参数。依次为 `目标对象、属性名、proxy实例本身（可选）` 。

```js
const person = {
    name: 'Tom',
};

const proxy = new Proxy(person, {
    get: function(target, key) {
        if (key in target) {
            return target[key]
        } else {
            console.log('访问的属性不存在');
        }
    }
});
```

`proxy` 对象作为原型对象。

```js
let proxy = new Proxy({}, {
    get: function(target, key) {
        console.log(1);
        return target[key];
    }
});
let obj = Object.create(proxy);
obj.a // 打印1
```

第三个参数，总是指向原始的读操作所在的那个对象。

```js
const proxy = new Proxy({}, {
    get: function(target, key, recevier) {
        return recevier;
    }
});
proxy.a === proxy; // true

const d = Object.create(proxy);
d.a === d; // true
```

## `set()`

拦截赋值操作。例如 `proxy.a = 1` 或者 `proxy['a'] = 1` 。

`set` 方法接受四个参数。依次为 `目标对象、属性名、属性值、Proxy实例本身`

```js
const proxy = new Proxy({}, {
    set: function(target, key, val) {
        if (key === 'age') {
            if (!Number.isInteger(val)) {
                throw new TypeError('The age is not an integer');
            }
            if (val > 200 || val < 0) {
                throw new RangeError('The age is impossible');
            }
        }
        target[key] = val;
    }
});
```

## `apply()`

拦截函数的调用。例如 `proxy(...args)` 或者 `proxy.apply(ctx, [...args])` 或者 `proxy.call(ctx, ...args)`

`apply` 函数接受3个参数。依次为 `目标对象、目标对象的上下文、目标对象的参数数组`

```js
const foo = (x, y) => {
    return x + y;
}
const proxy = new Proxy(foo, {
    apply: function(target, ctx, args) {
        return Reflect.apply(...arguments) * 2
    }
});
proxy(1, 2) // 6
proxy.call(null, 3, 4) // 14
proxy.apply(null, [5, 6]) // 22
```

## `has()`

`has` 方法判断对象是否具有某个属性的操作。典型的就是 `in` 操作符。

`has()` 方法接受两个参数。依次为 `目标对象、属性名` 。

```js
const obj = {
    _pro: 'a',
    pro: 'a',
}
const proxy = new Proxy(obj, {
    has: function(target, key) {
        if (key[0] === '_') {
            return false
        }
        return key in target
    }
});
```

需要注意的是，`has` 的拦截对 `for...in` 操作，不起作用。

## `construct()`

`construct` 方法拦截 `Proxy` 实例作为构造函数的调用。例如 `new proxy(...args)` 。

`construct` 函数接受三个参数。依次为：

- `target` : 目标对象(下面例子的`foo`)
- `args` : 构造函数的参数数组
- `newTarget` : 创造实例对象时，`new` 命令作用的构造函数。(下面例子的`proxy`)

```js
const foo = () => {};

const proxy = new Proxy(foo, {
    construct: function(target, args, newTarget) {
        return {
            value: args[0] * 10,
            age: args[1] * 10,
        }
    }
});

const p = new proxy(1, 2);
p.value // 10
p.age // 20
```

需要注意的是，`construct` 方法必须返回一个对象。否则会报错。

## `deleteProperty()`

`deleteProperty` 拦截 `delete` 操作。

`deleteProperty` 接受两个参数。依次为 `目标对象、属性名` 。

如果这个方法最终抛出错误或者返回 `false` 。那么当前属性就无法被删除。

```js
const obj = {
    _pro: 'a',
}
const proxy = new Proxy(obj, {
    deleteProperty: function(target, key) {
        if (key[0] === '_') {
            return false;
        }
        delete target[key];
        return true;
    }
});

delete obj._pro
```

## `defineProperty()`

拦截 `Object.defineProperty(obj, key, desc)` 。返回布尔值。

```js
const proxy = new Proxy({}, {
    defineProperty: function(target, key, desc) {
        return false;
    }
});
proxy.a = 1; // 无效
```

## `getOwnPropertyDescriptor()`

拦截 `Object.getOwnPropertyDescriptor(obj, key)`

返回属性描述对象或者`undefined`

```js
const obj = {
    a: '1',
    _a: '2',
}
const proxy = new Proxy(obj, {
    getOwnPropertyDescriptor: function(traget, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key)
    }
});

getOwnPropertyDescriptor(obj, '_a'); // undefined
getOwnPropertyDescriptor(obj, a); // {...}描述对象 
```

## `getPrototypeOf()`

拦截获取对象原型的操作。有以下几种:

- `Object.prototype._proto_`
- `Object.prototype.isPrototypeOf`
- `Object.getPrototypeOf`
- `Refelect.getPrototypeOf`
- `instanceof`

```js
const proxy = new Proxy({}, {
    getPrototypeOf: function(target) {
        return {};
    }
});
```

注意返回值必须是对象或者 `null` (原型链的最顶层就是`null`).

## `isExtensible()`

拦截 `Object.isExtenble()` 。

返回布尔值

```js
const proxy = new Proxy({}, {
    isExtensible: function(target) {
        console.log('a');
        return Object.isExtensible(target)
    }
});

Object.isExtensible(proxy);
```

注意，这个方法有一个强限制，它的返回值必须与目标对象的 `isExtensible` 属性保持一致，否则就会抛出错误。

## `ownKeys()`

拦截对象自身属性的读取操作。有以下4种:

- `Object.getOwnPropertyNames()` : 返回`不包含继承的`、`可枚举的`、`不包含symbol的`属性名组成的数组。
- `Object.getOwnPropertySymbols()`: 返回所有 `Symbol` 属性的数组。
- `Object.keys()`: 返回 **`不包含继承的`** 、`可枚举的`、`不包含symbol` 的属性名组成的数组。
- `for...in`: 遍历 **`包含继承的`** 、`可枚举的`、`不包含symbol` 的属性。 

> 注：作为属性名的symbol

```js
const obj = {
    [Symbol('a')]: 'a'
}
```

以下是拦截 `Object.keys()` 操作的例子 

```js
const target = {
    a: 'a',
    b: 'b',
}
const proxy = new Proxy(target, {
    ownKeys: function(target) {
        return ['a']
    }
});

Object.keys(target);
```

需要注意以下几点

首先，`ownKeys()` 自动过滤掉 `不可枚举的`、`本身不存在的` 属性。

```js
const obj = {};
// key属性不可枚举
Object.defineProperty(obj, 'key', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 'static'
});
const proxy = new Proxy(obj, {
    ownKeys: function(target) {
        return ['a', 'key']
    }
});
// a属性不存在，key属性不可枚举
Object.getOwnPropertyNames(obj); // []
```

其次，其返回的数组的成员，只能是 `字符串` 或者 `Symbol`类型。否则报错。

再者，如果目标对象包含不可配置属性，则该属性必须被返回。否则报错。

```js
const obj = {};
Object.defineProperty(obj, 'key', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: 'static'
});
const proxy = new Proxy(obj, {
    ownKeys: function(target) {
        return ['a']
    }
});
Object.getOwnPropertyNames(obj); // 报错，key必须被返回
```

最后，如果目标对象被设置成了不可拓展，则其返回的数组，必须恰好包含所有属性。不多也不能少。否则报错。

```js
const obj = {
    a: 1
};

Object.preventExtensions(obj);

const p = new Proxy(obj, {
    ownKeys: function(target) {
        return ['a', 'b'];
    }
});

Object.getOwnPropertyNames(p); // 报错
```

## `preventExtensions()`

拦截 `Object.preventExtensions()` 。

该方法必须返回一个布尔值，否则自动转换为布尔值。

该方法又一个限制: 只有对象不可拓展时，才能返回 `true` ,否则报错。所以一般在函数里面，调用 `Object.preventExtensions(target)`

```js
const proxy = new Proxy({}, {
    preventExtensions: function(target) {
        console.log('a');
        Object.preventExtensions(target);
        return true;
    }
});
```

## `setPrototypeOf()`

拦截 `Object.setPrototypeOf()` 方法。

> 警告: 由于现代 JavaScript 引擎优化属性访问所带来的特性的关系，更改对象的 [[Prototype]]在各个浏览器和 JavaScript 引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于 obj.__proto__ = ... 语句上的时间花费，而且可能会延伸到任何代码，那些可以访问任何[[Prototype]]已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的 [[Prototype]]。相反，你应该使用 Object.create()来创建带有你想要的[[Prototype]]的新对象。 - -来源自MDN

```js
const handler = {
    setPrototypeOf (target, proto) {
        throw new Error('Changing the prototype is forbidden');
    }
};
const proto = {};
const target = function () {};
const proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden
```

以上，就是 `Proxy` 提供的13种拦截方法。








