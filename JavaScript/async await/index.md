# async await

`async` 函数就是 `Generator` 函数的语法糖。

## 基本用法

`async` 函数返回一个 `Promise` 对象，可以使用 `then` 方法添加回调函数。也可以作为 `await` 的参数。

```js
// 可用于控制多个异步函数执行顺序
async function foo() {
    await new Promise((resolve, reject) => {
        ...
    })
}

async function init() {
    await foo();
    console.log('after foo');
}
```

## 语法

### 返回 `Promise`

`async` 函数内部的 `return` 语句，显示的返回的值，会被 `then` 函数捕捉为参数。

`async` 函数内部抛出的错误，会让其返回的 `Promise` 变为 `reject` 状态。抛出的错误对象会被 `catch` 函数捕捉。

```js
async function foo() {
    return 'a';
}
foo().then((value) => console.log(value)); // a

async function bar() {
    throw Error('error');
}
bar().catch((err) => consle.log(err)); // error
```

### `await`

正常情况， `await` 后面是一个 `Promise` 对象。如果不是，则直接返回其值。

```js
async function foo() {
    // 等同于 return 123;
    return await 123;
}
foo().then((value) => console.log(value)); // 123
```

`await` 命令后面的 `Promise` 如果变成 `reject` 状态，则返回值会被 `catch` 函数捕捉为参数。而且，一旦有一个 `await` 后面的 `Promise` 变为 `reject` 状态，则整个 `async` 函数都会中断执行。

```js
async function foo() {
    await Promise.reject('error');
    console.log(111); // 不会执行
}
foo().catch((v) => log(v)); // error
```

想要不中断，有两种可行的方法:

一种是将可能出错的 `Promise` 放在 `try catch` 语句中。

```js
async function foo() {
    try {
        await Promise.reject('error');
    } catch (val) {
        log(val); // error
    }
    return await Promise.resolve('a'); // 执行
}
```

另一种是为可能出错的 `Promise` 设置 `catch` 语句。

```js
async function foo() {
    await Promise.reject('error').catch(() => {});
    return await Promise.resolve('a'); // 执行
}
```

### 使用注意点

如果不想多个 `await` 的情况下，需要等待上一个执行完毕的情况。可以使用以下方法：

```js
// 方法一
const [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 方法二
const _foo = getFoo();
const _bar = getBar();
const foo = await _foo;
const bar = await _bar;
```

`await` 命令只能用在 `async` 函数中。

```js
async function dbFuc(db) {
    let docs = [{}, {}, {}];

    // 报错
    docs.forEach(function (doc) {
        await db.post(doc);
    });
}
```

就算将 `forEach` 的参数函数改为 `async` 函数，这时候，也会有问题。

```js
function dbFuc(db) {
    //这里不需要 async
    let docs = [{}, {}, {}];

    // 可能得到错误结果
    docs.forEach(async function (doc) {
        await db.post(doc);
    });
}
```

> 上面代码可能不会正常工作，原因是这时三个 `db.post` 操作将是并发执行，也就是同时执行，而不是继发执行。正确的写法是采用 `for` 循环。

```js
async function dbFuc(db) {
    let docs = [{}, {}, {}];

    for (let doc of docs) {
        await db.post(doc);
    }
}
```

最后，`async` 函数可以保留运行堆栈。

```js
const a = () => {
    b().then(() => c());
};
```

> 上面代码中，函数 a 内部运行了一个异步任务 `b()`。当 `b()` 运行的时候，函数 `a()` 不会中断，而是继续执行。等到 `b()` 运行结束，可能 `a()` 早就运行结束了，`b()` 所在的上下文环境已经消失了。如果 `b()` 或 `c()` 报错，错误堆栈将不包括 `a()`。

> 现在将这个例子改成 `async` 函数。

```js
const a = async () => {
    await b();
    c();
};
```

> 上面代码中，`b()` 运行的时候，`a()` 是暂停执行，上下文环境都保存着。一旦 `b()` 或 `c()` 报错，错误堆栈将包括 `a()`。
