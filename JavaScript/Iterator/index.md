# Iterator

遍历器。

它为不同的数据结构提供统一的访问机制。任何数据结构，只要部署了 `Iterator` 接口，就可以完成遍历操作。（依次处理该数据结构的所有成员）

`Iterator` 拥有一个名为 `next` 的方法。每一次调用 `next` 方法，都会返回当前指针所在的数据结构的信息。该信息由两个属性组成。 `value`和 `done`。 `value` 属性是当前值， `done` 属性表示整个遍历是否完成。

> Iterator 的遍历过程是这样的。

> （1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

> （2）第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。

> （3）第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。

> （4）不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

下面是模拟实现 `next` 方法。

```js
function makeIterator(arr) {
    let nextIndex = 0;
    return {
        next() {
            return {
                value: arr[nextIndex++],
                done: nextIndex > arr.length - 1,
            };
        },
    };
}
```

ES6 规定，默认的 `Iterator` 接口部署在数据结构的 `Symbol.iterator` 属性。也就是说，只要一个对象具有 `Symbol.iterator` 属性，就可以认为是可遍历的。

`Symbol.iterator` 是一个函数，执行它会返回遍历器 `iterator` 。

原声具备 `Iterator` 接口的数据结构有：

-   Array
-   Map
-   Set
-   String
-   TypedArray
-   函数的 arguments 对象
-   NodeList 对象

注意，`{}` 是不具备原声 `Iterator` 接口的。

```js
const a = [1, 2, 3];
const i = a[Symbol.iterator]();
i.next(); // {value: 1, done: false}
i.next(); // {value: 2, done: false}
i.next(); // {value: 3, done: false}
i.next(); // {value: undefined, done: true}
```

`{}` 想要拥有 `Iterator` 接口，得自己动手实现。

```js
class RangeIterator {
    constructor(start, stop) {
        this.value = start;
        this.stop = stop;
    }

    [Symbol.iterator] = () => this;

    next() {
        let value = this.value;
        if (value < stop) {
            this.value++;
            return {
                value,
                done: false,
            };
        }
        return {
            value: undefined,
            done: true,
        };
    }
}

for (let v of new RangeIterator(0, 3)) {
    console.log(v); // 0, 1, 2
}
```

甚至可以直接这样：

```js
const obj = {
    0: "a",
    1: "b",
    2: "c",
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator],
};
```

不过要注意，必须按照类数组的结构。

## 调用 `Iterator` 接口的例子

-   [x] 解构赋值
-   [x] 拓展运算符
-   [x] yield\*
-   [x] 其它任何接受数组作为参数的场景
    -   for...of
    -   Array.isArray()
    -   Promise.all()
    -   ......
