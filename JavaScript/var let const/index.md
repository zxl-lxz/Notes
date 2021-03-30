# `var` `let` `const`

## `var`

ES5 没有块级作用域,只有函数作用域。

```js
// 由于没有块级作用域，相当于在全局环境使用var声明变量
{
    var a = 1;
}
console.log(a);
// 1
```

```js
//由于存在函数作用域，此时的变量b存在于函数内部，即使返回了b,在函数外部也访问不到
function foo() {
    var b = 1;
    return b;
}
console.log(b);
// b is not defined
```

```js
//不使用var声明的变量为全局变量
function foo() {
    c = 100;
}
foo();
console.log(c);
// 100
```

```js
//函数需要执行，否则变量没有定义
function bar() {
    d = 1000;
}
console.log(d); //=> d is not defined
```

```js
//var专属的变量声明提升和函数声明提升
console.log(e);
var e = 10000;
//undefined
```

## `let` & `const`

```js
//块级作用域
{
    let a = 1;
}
console.log(a); //=> a is not defined
```

**经典的 for 循环问题**

```js
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[6](); //=> 10
//全局变量i,从始至终都是同一个变量，数组a的每一个元素都是一个执行console.log(i)的函数。当这个函数执行的时候，循环已经走完了。又由于是同一个i,所以最后都是10

let b = [];
for (let i = 0; i < 10; i++) {
    b[i] = function () {
        console.log(i);
    };
}
b[6](); //=> 6
//当前的i只在本轮循环有效，每一次都是不同的变量
```

```js
// 不存在变量提升
console.log(a);
let a = 1;
// ReferenceError
```

```js
// 暂时性死区
// 只要在声明之前使用，都会报错
var a = 1;
{
    console.log(a);
    let a = 2;
}
// Uncaught ReferenceError: Cannot access 'a' before initialization
//只要块级作用域内存在let命令，它所声明的变量就绑定这个区域，不再受外部的影响

////一个变量根本没有声明，typeof反而不会报错
typeof aaa; //=> undefined

{
    typeof aaa; //=> ReferenceError
    let aaa;
}
// 一旦使用了let声明，typeof将不再安全
```

```js
//报错，因为在同一个作用域

{
    let a = 10;
    var a = 1000;
}

//不报错，不在同一个作用域
{
    let a = 10;
    {
        let a = 100;
    }
}
```

```js
// const一些特性
const a = 100;
a = 1000;
//报错
//如果声明的是基本类型，值不能改变

const obj = {};
obj.name = 'zhou';
obj.age = 22;
//以上是可行的
obj = {};
// 改变了指针是不行的，会报错
```
