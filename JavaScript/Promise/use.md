# Promise

`Promise` 是 `ES6`提供的原生对象。它是一个容器，里面保存着未来才会结束的事件的结果。

**三种状态**

`pending(进行中)`、`fullfilled(已成功)`、`rejected(已失败)`。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是 `Promise` 这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

状态只能由`pending` 变为 `fullfilled`，或者由 `pending` 变为 `rejected` 。一旦状态改变，就不会再改变。

```js
const promise = new Promise(function (resolve, reject) {
    resolve('ok');
    throw new Error('test');
});
promise
    .then(function (value) {
        console.log(value);
    })
    .catch(function (error) {
        console.log(error);
    });
// ok
```

**为什么要用`Promise`**

1. 有了 `Promise`对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。

2. `Promise` 对象提供统一的接口，使得控制异步操作更加容易。

**其缺点是什么**

1. 无法取消 `Promise` ，一旦新建它就会立即执行，无法中途取消。

2. 如果不设置回调函数(`then` 的第二个参数，或者 `catch` )，`Promise` 内部抛出的错误，不会反应到外部。

3. 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## 基本用法

```js
const promise = new Promise((resolve, reject) => {
    if (/* success */) {
        resolve();
    } else {
        reject();
    }
});
```

⚠️ `new Promise`会立即执行，而其`then`是微任务。

如下：

```js
setTimeout(() => console.log(1), 0);
const promise = new Promise((resolve, reject) => {
    if (/* success */) {
        console.log(2);
        resolve();
    } else {
        reject();
    }
});
promise.then(() => console.log(3));
```

以上代码，打印顺序为`2, 3, 1`。

⚠️ `resolve()` 或者 `reject()` 并不会终止 `Promise` 的参数函数执行。

如下：

```js
new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
}).then((r) => {
    console.log(r);
});
```

以上代码，打印顺序为 `2, 1`。`console.log(2)`这个语句，再`resolve(1)`后，会正常被执行。严格意义上，`resolve()`后，`Promise`的使命已经完成，不应该继续执行代码。可以加上`return`语句，保证不会出现意外。

```js
new Promise((resolve, reject) => {
    return resolve(1);
    // 后面的语句不会执行
    console.log(2);
});
```

## `Promise.prototype.then()`

`then`方法接受两个参数，第二个参数可选。

```js
new Promise().then(
    () => {
        console.log('fullfilled');
    },
    () => {
        console.log('rejected');
    }
);
```

第一个参数作为 `fullfilled` 的回调。第二个参数作为 `rejected` 的回调。

不建议使用`then`的第二个参数作为`rejected`的回调，更推荐使用`catch`。

## `Promise.prototype.catch()`

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```js
new Promise().then(() => console.log('fullfilled')).catch((err) => concole.log(err, 'rejected'));
```

`Promise` 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。

```js
getJSON('/post/1.json')
    .then(function (post) {
        return getJSON(post.commentURL);
    })
    .then(function (comments) {
        // some code
    })
    .catch(function (error) {
        // 处理前面三个Promise产生的错误
    });
```

上面代码中，一共有三个 `Promise` 对象：一个由`getJSON()`产生，两个由`then()`产生。它们之中任何一个抛出的错误，都会被最后一个`catch()`捕获。

`Promise`内部的报错不会影响外部 JS 的继续执行。所以，如果没有指定 `catch` 方法，`Promise`内部的错误将无法反映到外部，也就是`被吃掉`。我们理应对这些错误做点什么。

如下：

```js
const someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};

someAsyncThing().then(function () {
    console.log('everything is great');
});

setTimeout(() => {
    console.log(123);
}, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

原本，如果`x + 2` 不是在`Promise`里免，在执行到`someAsyncThing()`的时候，JS 会报错，从而不在继续执行。但是由`Promise`内部对错误不会影响外部 JS 对执行，最终还是会打印出`123`.这会让我们对代码调试很困难。

所以建议始终添加`catch`回调，对错误进行监控。

## `Promise.prototype.finally()`

`finally`其实就是`then`两个参数情况下的语法糖。

无论最终状态如何，都会执行`finally`中的回调函数。

`finally`方法总是会返回原来的值。

```js
// resolve 的值是 undefined
Promise.resolve(2).then(
    () => {},
    () => {}
);

// resolve 的值是 2
Promise.resolve(2).finally(() => {});

// reject 的值是 undefined
Promise.reject(3).then(
    () => {},
    () => {}
);

// reject 的值是 3
Promise.reject(3).finally(() => {});
```

**手写`finally`**

```js
Promise.prototype.finally = function(callback) {
    // this即调用的实例，其constructor指向Promise构造函数
    const P = this.constructor;
    return this.then(
        // 返回Promise
        value => P.resolve(callback()).then(() => value),
        err => P.resolved(callback()).then(() => thorw err),
    );
}
```

## `Promise.all()`

不是原型上的方法哦。

接受一个数组作为参数，返回一个由结果组成的数组。

```js
const getDta1 = () => {
    /* Call interface */
    return new Promise((resolve, rejected) => {
        if (res.success) {
            resolve(res.data1);
        } else {
            reject(new Error(res.err));
        }
    });
};
const getDta2 = () => {
    /* Call interface */
    return new Promise((resolve, rejected) => {
        if (res.success) {
            resolve(res.data2);
        } else {
            reject(new Error(res.err));
        }
    });
};

Promise.all([getData1, getData2])
    .then((result) => {
        console.log(result);
        // [data1, data2]
    })
    .catch((err) => {});
```

**⚠️ 注意**

```
const p = Promise.all([p1, p2, p3]);
```

只有`p1`、`p2`、`p3`都变成`fullfilled`，最终状态才为`fullfilled`,走到`then`.

只要有一个为`rejected`，最终状态就为`rejected`,走到`catch`.

如果作为参数的`promsie`自己定义了`catch`.那么，不会因为这一个报错走到`Promise.all`的`catch`.

如下：

```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
    .then((result) => result)
    .catch((e) => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then((result) => result)
    .catch((e) => e);

Promise.all([p1, p2])
    .then((result) => console.log(result))
    .catch((e) => console.log(e));
// ["hello", Error: 报错了]
```

如果作为参数的`promise`没有自己定义`catch`，那么就会走到`Promise.all`的`catch`.

```js
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
}).then((result) => result);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
}).then((result) => result);

Promise.all([p1, p2])
    .then((result) => console.log(result))
    .catch((e) => console.log(e));
// Error: 报错了
```
