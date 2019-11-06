# Set

类似于数组。成员的值是唯一的。没有重复的值。

`Set`本身是一个构造函数。

```js
const set = new Set([1, 2, 3, 4, 4]);
[...set] // => [1, 2, 3, 4]
// 以上，可用于数组去重[...new Set(Array)]或者字符串去重[...new Set(String)].join('')
```

## Set的属性

`size`: 返回成员个数。类似数组的`length`

```js
const set = new Set([1, 2, 2]);
set.size // => 2
```

## Set的方法

`add(value)`: 添加某个值,返回Set

`delete(value)`: 删除某个值，返回布尔值，表示删除是否成功。

`has(value)`:返回一个布尔值，表示该值是否为`Set`成员。

`clear()`:清除所有成员，没有返回值。

```js
const set = new Set();
set.add(1).add(2).add(2);
console.log([...set]); // => [1, 2]

set.delete(2);
console.log([...set]); // => [1]

set.has(2); // => false
set.has(1); // => true

set.clear();
console.log([...set]); // => []
```

# WeakSet

`WeakSet`与`Set`相似，也是不重复的值的集合。但是有两点区别：

1. `WeakSet`的成员只能是对象

```js
const wkst = new WeakSet();
wkst.add(1);
// Uncaught TypeError: Invalid value used in weak set
wkst.add(Symbol());
// Uncaught TypeError: Invalid value used in weak set
```

2. > 其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

`WeakSet`也是一个构造函数。

```js
const ws = new WeakSet([[1, 2], [3, 4]]);
// WeakSet {[1, 2], [3, 4]}

const wkst = new WeakSet([1, 2, 3, 4]);
// Uncaught TypeError: Invalid value used in weak set(…)
```

传入的数组的成员将会成为`WeakSet`的成员，所以数组的成员必须是对象，而不是只要传入的是对象就行。

`WeakSet`的方法：`add()`,`delete()`,`has()`.

`WeakSet`没有`size`属性。没有办法遍历它的成员。这是因为其成员都是弱引用，随时可能消失。遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。

# Map

`Map`提供了一种键值对的组合，并且键的类型不受局限，可以是任何类型的值。

```js
const m = new Map();
const o = {name: 'zl'};
m.set(o, 'zl');
m.get(o); // => 'zl'
```

`Map`也是构造函数，可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。

```js
const m =  new Map([['name', 'zl'], ['age', '23']]);
m.get('name'); // 'zl'
m.get('age'); // '23'
```

实际上，任何具有`Iterator`接口的，且每个成员都是一个双元素的数组的数据接口都可以当作`Map`的参数。这就是说，`Set`和`Map`都可以用来生成新的`Map`.

```js
const s = new Set([['foo', 2], ['bar', 4]]);
const m1 = new Map(s);
m1.get('foo'); // 2

const m2 = new Map([['baz', 3]);
const m3 = new Map(m2);
m3.get('baz'); // 3
```

## Map实例的属性和操作方法

`size`:成员总数

`set(key, value)`: `set`方法设置键名`key`对应的键值为`value`，然后返回整个 `Map` 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。

`get(key)`:读取值

`has(key)`:返回一个布尔值。

`delete(key)`:删除某个键。返回`true`.如果删除失败，返回`false`.

`clear()`:清除所有成员，没有返回值。

```js
const m = new Map([['foo', 1], ['bar', 2]]);
m.size // 2

m.set(1, 'a').set(2, 'b');
m.size // 4

m.get(1); // 'a'

m.has(1); // true
m.has(3); // false

m.delete(1); // true
m.has(1); // false
m.delete(3); // false

m.clear();
m.size // 0
```

# WeakMap

> 只接受对象作为键名

> 其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。