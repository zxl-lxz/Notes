此属性为`ES2018`新增属性。

---

## 用作解构赋值

> 对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。

```js
const obj = {
  a: 1,
  b: 2,
  c: 3,
}

let { a, ...z } = obj
z // {b: 2, c: 3}
```

**注意 ⚠️**

1. 等号右边必须是对象。如果不是对象，会自动转换成对象。`null`和`undefined`不能被转换为对象。

```js
let { ...obj } = 'abc'
obj // {0:a, 1:b, 2:c}

let { ...obj } = [1, 2, 3]
obj // {0:1, 1:2, 2:3}

let { ...obj } = 123
obj // {}

let { ...obj } = null
obj // Uncaught TypeError: Cannot destructure 'null' as it is null.

let { ...obj } = undefined
obj // Uncaught TypeError: Cannot destructure 'undefined' as it is undefined.
```

2. 解构赋值必须是最后一个参数，否则会报错。

```js
let {...z, x, y} = {x: 1, y: 2, a: 3, b: 4};
// Uncaught SyntaxError: Rest element must be last element
```

3. 浅拷贝。如果 property 的值是引用类型。复制的是引用。

4. 不能复制继承自原型的属性。

```js
let obj = Object.create({ a: 1, b: 2 })
obj.x = 3

let { ...newObj } = obj

newObj // {x: 3}
```

## 用作拓展

> 对象的扩展运算符`（...）`用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

```js
let obj = { a: 1, b: 2 }
let newObj = { ...obj }

newObj // {a: 1, b: 2}
```

**注意 ⚠️**

1. `...`后面不是对象，会自动转换成对象。

```js
let obj = {...['a', 'b']}; // {0: 'a', 1: 'b'}

let obj = {...'abc'}; // {0: 'a', 1: 'b', 3: 'c'}

let obj = {...{}};
          {...null};
          {...undefined};
          {...true};
          // {}
```

2. `...`等于`Object.assign()`

```js
let obj = { ...a }
// 等同于
let obj = Object.assign({}, a)
```

所以，它可以使一些操作变得很简便

```js
// 合并两个对象
let obj = { ...a, ...b }
// 等同于
let obj = Object.assign({}, a, b)
```

如果自定义属性，放在其后，会覆盖同名属性

```js
let obj = { ...a, x: 1, y: 1 }
// a里的x和y属性会被覆盖
// 相当于
let obj = Object.assign({}, a, { x: 1, y: 2 })

// 这样，修改对象的部分属性就很方便了(react中，setState((pre) => {...})，现在可以很方便修改某个属性)
let obj = {
  ...preObj,
  name: 'a',
  age: 23,
}
```

放在其前面，相当于设置默认属性值

```js
let obj = { x: 1, y: 2, ...a }
```
