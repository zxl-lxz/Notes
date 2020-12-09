# setTimeout

在指定延迟后调用函数.

返回一个 ID 值。配合`clearTimeout(ID)`清除定时器。

```js
// => 2
// 1s后输出 => 1
let timer = setTimeout(() => {
    console.log(1);
}, 1000);

console.log(2);
```

# setInterval

以指定周期调用函数。

返回一个 ID 值。配合`clearInterval(ID)`清除定时器。

```js
// => 2
// 每间隔1s打印出1
let timer = setInterval(() => {
    console.log(1);
}, 1000);

console.log(2);
```

# 可能不是你所期望的

回调函数的执行是需要时间的。

```js
setTimeout(() => {
    // 我需要执行0.5s
}, 1000);
```

如果我们希望看到的是，1 秒之后，函数开始执行。这段代码满足了需求。

而如果我们期望的是，1 秒之后，拿到函数的结果，那这段代码做不到。

特别的，当我们使用 `setInterval` 时

```js
setInterval(() => {
    // 需要执行0.5s
}, 1000);
```

我们期望的是，每间隔 1s 执行一次函数。那上面代码符合期望。

而如果我们期望，上一段代码执行完之后，间隔 1s 再执行函数，那么显然，上述代码只会间隔 0.5s

而如果，代码执行的时间超过了间隔时间：

# 两者区别

`setInterval`的问题：

```js
let timer = setInterval(() => {
    // 这段代码需要执行3.5s
}, 1000);
```

以上，本应该在 1s,2s,3s,4s 这些节点，都会有函数推入消息队列。

但是里面的代码需要执行 3.5s 。所以，在 1s 的时候，函数被推入消息队列，并被取出来去执行了。

在 2s 的时候，此时消息队列里没有函数。所以在 2s 的时候，函数被推入消息队列。但是并不会被取出来执行。因为此时，上一个函数还没有执行完。

时间来到了 3s,本来应该有一个函数被推入消息队列。但是此时已经有一个一模一样的函数在消息队列里了。`setinterval`的处理是，忽略 3s 这个函数。

3.5s 的时候，第一个函数执行完了。

如果我们希望的是，执行完之后再过一秒再去执行第二次。

显然在 4s 的时候，函数立即被执行。只间隔了 0.5s.

`setTimeout`解决这个问题：

```js
// es6的箭头函数不支持arguments对象
let timer = setTimeout(function () {
    setTimeout(arguments.callee, 1000);
}, 1000);
```

看下面代码：

`setInterval`:如果在弹窗出现后，你迟迟不点击确定，那么会发现，点击确定后，下一个弹窗会立马出现，而不是等待了 1 秒。

```js
let i = 0;
let timer = setInterval(() => {
    alert(i++);
}, 1000);
```

`setTimeout`:这次，弹窗会在你点击了确定后 1 秒后再弹出下一个。

```js
let i = 0;
let timer = setTimeout(function () {
    alert(i++);
    timer = setTimeout(arguments.callee, 1000);
}, 1000);
```
