# Array

总结下数组类型的方法和属性。

## Array.isArray()

关键词：`判断是否为数组`

用于检测值是否为数组。

```js
// 类数组返回false
Array.isArray(arguments); // false

// Array.prototype竟然是数组类型！！！
Array.isArray(Array.prototype); // true
```

## Array.from()

关键词: `类数组转数组`、`浅拷贝`

第一个参数：要转换的类数组

第二个参数：为新数组的每一个元素执行该函数。相当于 `map` 方法。

第三个参数：指定第二个函数执行时的 `this` 。

将具备 `Iterator` 接口的类数组转换为一个新的浅拷贝的 `Array` 的实例。

```js
const obj = { a: 1 };

const arr = Array.from(
    '12',
    function (x) {
        x += this.a;
        return x;
    },
    obj
);
arr; // [2, 3]

// 注意，当使用第三个参数指定第二个参数函数的this值时，函数不能使用箭头函数哦。
```

## Array.of()

> Array.of() 和 Array 构造函数之间的区别在于处理整数参数：Array.of(7) 创建一个具有单个元素 7 的数组，而 Array(7) 创建一个长度为 7 的空数组（注意：这是指一个有 7 个空位(empty)的数组，而不是由 7 个 undefined 组成的数组）。 -MDN

```js
Array.of(7); // [7]
Array.of(1, 2, 3);
[1, 2, 3];

new Array(7); // [empty*7]
```

## Array.prototype.concat()

关键词: `数组合并`、`浅拷贝`、`返回新数组（访问器方法）`

`concat` 会返回一个全新的数组。不会影响原数组。

```js
const origin = [1, 2];
const arr = origin.concat(3, [4]);
arr; // [1, 2, 3, 4]
origin; // [1, 2]
```

如果复制的是引用类型。只会复制指针引用，也就是浅拷贝。

```js
const origin = [{ a: 1 }];
const originTwo = [[1]];
const arr = origin.concat(originTwo);

arr; // [{a: 1}, [1]]

arr[0].a = 2;
arr[1].push(2);

arr; // [{a: 2}, [1, 2]]
origin; // [{a: 2}]
originTwo; // [[1, 2]]
```

## Array.prototype.copyWithin()

关键词: `修改原数组（修改器方法）` 、 `用一个位置替代另一个位置`

接受三个参数：

-   `target`: 从该位置开始替换。如果是负数，加上 `length`.
-   `start`: 从该位置开始读取。如负，加 `length`.
-   `end`: 在该位置之前结束读取。如负，加 `length`.

比较晦涩难懂，用例子说明:

```js
let arr = [1, 2, 3, 4, 5];

// target:0
// start: 3
// end: 默认为length
// 也就是，从index = 3 开始读取，直到最后一个元素。最后读取的结果是：[4, 5]
// 接下来就要进行替换了。从target = 0 也就是开始位置。用4代替1。用5代替2。
arr.copyWithin(0, 3); // 所以最终返回[4, 5, 3, 4, 5]

// 恢复arr
arr = [1, 2, 3, 4, 5];

// target:0
// start: 1
// end: 4
// 最终读取出来的是：[2, 3, 4]
// 从位置0开始替换。所以2代替1，3代替2， 4代替3.
arr.copyWithin(0, 1, 4); // 返回[2, 3, 4, 4, 5]

// 恢复arr
arr = [1, 2, 3, 4, 5];

// target: -1 + 5 = 4
// start: 3
// end: 2
// ⚠️经过实验🧪，当end比start小时。直接返回原数组。
arr.copyWithIn(-1, -2, -3); // [1, 2, 3, 4, 5]
```

## Array.prototype.entries()

与 `Array.prototype.values()`、`Array.prototype.keys()` 放在一起。

关键词: `返回Interator`

这三者都返回一个 `Interator` 对象。

```js
const arr = [1, 2];

const e = arr.entries();
const v = arr.values();
const k = arr.keys();

e.next(); // {value: [0, 1], done: false}
v.next(); // {value: 1, done: false}
k.next(); // {value: 0, done: false}
```

## Array.prototype.every()

关键词: `每一项都为true才返回true`、`false中断循环`、`调用前确认遍历的元素范围`、`不会改变原数组（引用传递有可能改变）`

我们来深入理解下 `every()`

最基础的用法：只有每一项返回 `true`，`every` 才返回`true`

```js
const arr = [1, 2];
const isNum = arr.every((item) => typeof item === 'number');
isNum; // true
```

📓：一旦某一项返回了 false,循环会立即中断弹出。

```js
const arr = [1, 2, 3];
let count = 0;
arr.every((item) => {
    count++;
    return item < 2;
});
count; // 2
```

📓: `every` 遍历的元素范围在遍历之前就已经确定了。

```js
const arr = [1, 2, 3];
let count = 0;

arr.every((item, index, arr) => {
    count++;
    arr.push(item);
    return item < 100;
});

count; // 3
arr; // [1, 2, 3, 1, 2, 3]
```

在遍历中途对数组长度进行改变是无效的。遍历次数不会因此改变。

一开始就没有赋值或者被删除的位置，是不会进行函数调用的。

```js
const arr = new Array(3).fill(1, 1); // [empty, 1, 1]
arr[0] === undefined; // true

let count = 0;

arr.every((item) => {
    count++;
    return item === undefined || item > 0;
});

count; // 2
```

`count` 只进行来两次自增，证明了数组的第一项并没有调用函数。

📓: `every` 不会改变原数组。

```js
const arr = [1, 2, 3];

const isRight = arr.every((item) => {
    item = item * 100;
    return item > 3;
});

isRight; // true
arr; // [1, 2, 3]
```

有人看到这里会疑惑。`item` 不就是数组的那一项吗，既然返回的是 `true`, 那么原数组怎么没变呢？

别急，我们再看一个例子:

```js
const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

const isRight = arr.every((item) => {
    item.a = 10000;
    return item.a > 100;
});

isRight; // true
arr; // [{a: 10000}, {a: 10000}, {a: 10000}]
```

可以看到，当我们改变元素组中引用类型的属性值的时候，原数组是会跟着一起被改变的。

别急，再看一个例子。

```js
const arr = [{ a: 1 }, { a: 2 }, { a: 3 }];

const isRight = arr.every((item) => {
    item.a = { a: 10000 };
    return item.a > 100;
});

isRight; // true
arr; // [1, 2, 3]
```

所以，并不是一定不会改变原数组。而是 `item` 其实是对数组当前项的一次浅克隆。如果数组的项是基本类型值，那就是值传递。如果数组的项是引用类型，那就是引用传递。

对于那些很复杂的数组（很多层嵌套，引用类型）。当我们需要做复杂的操作的时候，想要避免影响原数组，可以在遍历之前对整个原数组做一次深克隆。或者在遍历里面对 `item` 做深克隆。

还有一点需要注意：如果对空数组进行 `every` 操作，永远返回 `true`.

```js
const arr = [];
const isRight = arr.every((item) => item > 100000); // true
```

不可思议吧...

## Array.prototype.fill()

关键词: `填充数组`

```js
const arr = new Array(3).fill('a'); // ['a', 'a', 'a']

// 可接受三个参数.分别为值，开始位置，结束位置（不包括）

const arr1 = [1, 2, 3];
arr1.fill(4, 0, 1);
arr1; // [4, 2, 3]

// 引用类型的值用来填充，都是同一个指针

const bar = new Array(3).fill({ a: 1 });
bar[0].a = 2;
bar; // [{a: 2}, {a: 2}, {a: 2}]
```

## Array.prototype.filter()

关键词: `返回符合条件的新数组` 、`调用前确认遍历的元素范围`、`不会改变原数组（引用传递有可能改变）`

深入理解这里就不再重复举例子说明。请参考上方的`Array.prototype.every()`

```js
const arr = [1, 2, 3];
const newArr = arr.filter((item) => item > 2);

arr; // [1, 2, 3]
newArr; // [3]
```

## Array.prototype.find()

与 `Array.prototype.findIndex()` 一起。

关键词: `找出第一个符合条件的`, `返回则中断循环`、`不会改变原数组（引用传递有可能改变）`

```js
const arr = [1, 2, 3];

const num = arr.find((item) => item > 2);

const index = arr.findIndex((item) => item > 2);

num; // 3
index; // 2
```

相较于 `indexOf` ,其优点是可以借助函数识别出来 `NaN`

```js
[NaN].indexOf(NaN); // -1

[NaN].findIndex((item) => Object.is(NaN, item)); // 0
```

深入理解参考`every`。但是有一点与 `every` 不一样。那就是 `一开始的遍历范围` 。

> 注意 callback 函数会为数组中的每个索引调用即从 0 到 length - 1，而不仅仅是那些被赋值的索引，这意味着对于稀疏数组来说，该方法的效率要低于那些只遍历有值的索引的方法。

> 在第一次调用 callback 函数时会确定元素的索引范围，因此在 find 方法开始执行之后添加到数组的新元素将不会被 callback 函数访问到。如果数组中一个尚未被 callback 函数访问到的元素的值被 callback 函数所改变，那么当 callback 函数访问到它时，它的值是将是根据它在数组中的索引所访问到的当前值。被删除的元素仍旧会被访问到，但是其值已经是 undefined 了。-MDN

意思就是，与 `every` 一样，一开始就决定了要遍历的次数。中途改变数组的长度不会改变遍历的次数。

但是，一开始的遍历次数取值不一样。 `every` 会忽略空值和被删除的值。但是 `find` 不会忽略。

```js
const arr = new Array(3).fill(1, 1); // [empty, 1, 1]
arr[0] === undefined; // true

let count = 0;

arr.find((item) => {
    count++;
    return item > 100;
});

count; // 3
```

`count` 为 3 说明，`empty` 同样调用了函数。

## Array.prototype.flat()

关键词: `去扁平化`、`返回新数组`

```js
const arr = [1, [2, 3]];
const newArr = arr.flat();

arr; // [1, [2, 3]]
newArr; // [1, 2, 3]
```

参数传正整数，可扁平化任意维数组。

```js
[1, [2, [3, [4, [5]]]]].flat(Infinity); // [1, 2, 3, 4, 5]
```

手动实现:

**二维数组一维化**

```js
const flat = (arr) => [].concat(...arr);

// or

arr.reduce((acc, val) => acc.concat(val), []);
```

**递归实现任意维度一维化**

```js
const flat = (arr, deep = 1) => {
    return deep > 0
        ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flat(val, deep - 1) : val), [])
        : arr.slice();
};
```

## Array.prototype.forEach()

关键词: `无法中断循环`、`调用前确认遍历的元素范围`、`不会改变原数组（引用传递有可能改变）`、`返回undefined`、`无法进行链式调用`

深入理解，参考`every`

需要注意的是 `无法中断循环` 这一点。与之相反的，以下遍历操作都可以跳出循环

`for`、`for...in`、`for...of`、`every()`、`some()`、`find()`、`findIndex()`

## Array.prototype.includes()

关键词: `检测数组是否包含某个值`

```js
// 基本用法
const arr = [1, 2, 3];
arr.includes(1); // true

// 第二个参数大于数组长度
arr.includes(1, 1000); // false

// 第二个参数为负数
arr.includes(2, -2); // 相当于(2, (-2 + 3)) true
arr.includes(2, -100); // 相当于(2, 0)

// 针对NaN
const arr1 = [NaN];
arr1.includes(NaN); // true
```

## Array.prototype.indexOf()

关键词: `检测数组是否包含某个值`

关于第二个参数为负值，参考`includes()`

需要注意的是，内部采用 `===` 做判断。

## Array.prototype.join()

关键词: `数组转字符串`

```js
// 基础用法
const arr = [1, 2, 3];

arr.join(); // 不传参数，默认使用英文逗号 '1,2,3'

arr.join(''); // '123'

arr.join('-'); // '1-2-3'

// undefined和null会被转换为空字符串
const arr1 = [1, undefined, null, 1];
arr1.join(); // '1,,,1'
```

## Array.prototype.map()

深度解析参考`every`。

原数组的每一项调用函数，结果组成新数组返回。

## Array.prototype.pop()

与 `Array.prototype.shift()`一起。

`pop` 是删除末尾。`shift` 是删除首个。

关键词: `返回值为删除的这一项`

```js
const arr = [1, 2, 3];
const deleteNum = arr.pop();

arr // [1, 2]
deleteNum // 3

// 作用于类数组
[].pop.call(arguments);

// 空数组调用此方法返回undefined
[].pop(); // undefined
```

## Array.prototype.push()

与 `Array.prototype.unshift()`（首添加） 一起。

关键词: `添加项`、`返回数组新长度`

```js
const arr = [1, 2, 3];
const newLength = arr.push(4, 5, 6);
arr // [1, 2, 3, 4, 5, 6]
newLength // 6

// 可作用域类数组，但是原声的类数组String却不行
[].push.call(arguments, 1); // ok
[].push.call('123', 4, 5); // 报错
```

## Array.prototype.reduce()

关键词: `汇总`

```js
const arr = [1, 2, 3];
const addNum = arr.reduce((acc, cur) => acc + cur); // 6

// 以上代码：acc首先取值为1，cur取值为2.两者相加的值赋值给下一轮的acc。第二轮的时候，acc的值为3，cur的值为3.两者相加为6.由于没有更多项去执行，于是将acc返回。
```

需要注意的是，可以为 `acc` 提供首轮的初始值。并且提倡这么做。

```js
const arr = [1, 2, 3];
const addNum = arr.reduce((acc, cur) => acc + cur, 10); // 16
```

其深度分析的特性，像是一开始的`迭代范围`，`引用类型`等等与`every`保持一致。

## Array.prototype.reverse()

关键词: `颠倒数组`、`改变原数组`、`返回原数组的引用`

```js
const arr = [1, 2, 3];
const arr1 = arr.reverse();

arr; // [3, 2, 1]
arr1; // [3, 2, 1]
```

## Array.prototype.slice()

关键词: `截取`、`返回新数组`、`浅克隆`

关键词里的新数组和浅克隆所代表的含义就不多解释里。参考`every`。

```js
const arr = [1, 2, 3];
const sliceArr = arr.slice(1); // [2, 3]

// 第一个参数为负数
arr.slice(-1); // 相当于(2) 返回[3]

// 第一个参数大于length

arr.slice(100); // []

// 第二个参数为负数
arr.slice(0, -1); // 相当于(0, 2) 返回[1, 2]

// 第二个参数太小
arr.slice(0, -100); // []
```

## Array.prototype.some()

深度特性参考`every`.一模一样。

基本特性为：数组中只要有一项符合条件，立即中断，返回`true`.

## Array.prototype.sort()

关键词: `对数组进行排序`

可接受一个比较函数。如果没有，则先将数组的每一项转换为字符串，再按照字符编码位数进行排序。

```js
const arr = [1000, 9];
arr.sort();
arr; // [1000, 9]

// 接受一个比较函数。
// 如果fun(a, b) < 0,则a排在b前面
// 如果fun(a, b) = 0,则a，b的相对位置不变。（并非所有浏览器都能做到这一点）
// 如果fun(a, b) > 0,则a排在b后面

const arr1 = [9, 7, 8, 1];
arr1.sort((a, b) => a - b); // [1, 7, 8, 9]
```

## Array.prototype.splice()

关键词: `增删改`、`返回被删除的项组成的数组`

```js
const arr = [1, 2, 3, 4, 5, 6];
// 从index=2开始，删除两项。并从index=2开始，将7，8添加到数组
const deleteArr = arr.splice(2, 2, 7, 8);

arr; // [1, 2, 7, 8, 5, 6]
deleteArr; // [3, 4]
```

## Array.prototype.toString()

覆盖了 `Object` 的 `toString()` 方法.

```js
[1, 2, 3] + 'a'; // '1,2,3a'
```

至此，目前版本数组的方法全部完毕。

🎉🎉🎉
