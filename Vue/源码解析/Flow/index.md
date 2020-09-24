# 静态类型检查工具

## 类型推断

```js
// @flow

function split(str) {
    return str.split('');
}
split(11);
```

`flow` 检测上面代码，会报错。因为参数 `str` 期待为字符串，但是传了数字。

## 类型注释

```js
// @flow

function add(x, y) {
    return x + y;
}
add('hi', 1);
```

上面代码，不会报错。

但是如果我们期望是数字的相加。

```js
// @flow

function add(x: number, y: number): number {
    return x + y;
}
add('hi', 1);
```

上面代码会报错。

## 检测数组

```js
// @flow
let arr: Array<number> = [1, 2, 3];
```

## 检测 class

```js
class Bar {
    x: number;
    y: number | string;
    z: boolean;

    constructor(x: number, y: number | string) {
        this.x = x;
        this.y = y;
        this.z = false;
    }
}

let bar: Bar = new Bar(1, 'hi');
```

## 检测 Object

```js
// @flow

const obj: {
    a: string,
    b: number,
    c: Array<string>,
    d: Bar,
} = {
    a: 'a',
    b: 1,
    c: ['a', 'b'],
    d: new Bar(1, 'hi'),
};
```

## null 和 undefined

```js
let foo: ?string = null;
```
