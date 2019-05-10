**什么是异步？**

函数在返回的时候，不能预期结果，而是要在将来通过一定手段得到。此时，不需要等待结果返回再执行下一个任务，而是直接执行下一个任务，当结果返回了，再去执行相应的回调函数。这就是异步。

**为什么要异步？**

因为JS是单线程的，当前一个任务耗时过久，如无限循环，那么会出现代码执行被阻塞。影响程序的正常执行。

**解决方案：**

> 回调函数

在回调函数返回之前，其它代码正常执行。

```js
const fn2 = (fn) => {
    setTimeout(() => {
        fn();
    }, 1000);
    console.log(2);
};
const fn1 = () => {
    console.log(1);
};
fn2(fn1);
// => 2, 1
```
解决了JS单线程的问题

缺点：如果有多个回调函数，一层层嵌套，会让代码看起来非常混乱，所谓回调地狱。不易维护。耦合性底。

> 事件发布订阅

当一个任务执行完成后，会发布一个事件，当这个事件有一个或多个‘订阅者’的时候，会接收到这个事件的发布，执行相应的任务，这种模式叫发布订阅模式。如node的events,dom的事件绑定。
```js
document.body.addEventListener('click',function(){
  alert('订阅了');
},false);
document.body.click(); 
```
优点：时间对象上的解耦。

缺点：消耗内存，过度使用会使代码难以维护和理解。

> promise

所谓`promise`，就是一个容器，里面保存着未来才会结束的事件的结果。

```js
let primise  = new Promise((resolve, reject) => {
    setTimeout((data) => {
        resolve(data);
    }, 1000);
});
promise
    .then((data) => {
        console.log(data);
    })
```
优点：解决了回调地狱，将异步操作以同步操作的流程表达出来。

缺点：无法取消`promise`,如果不设置回调函数，`promise`内部抛出的错误，不会反映到外部。一堆`then`看起来也没有那么友好。

> Generator

Generator是es6提出的另一种异步编程解决方案，需要在函数名之前加一个*号，函数内部使用yield语句。Generaotr函数会返回一个遍历器，可以进行遍历操作执行每个中断点yield。

```js
function * count() {
    yield 1
    yield 2
    return 3
}
let c = count();
console.log(c.next()) // { value: 1, done: false }
console.log(c.next()) // { value: 2, done: false }
console.log(c.next()) // { value: 3, done: true }
console.log(c.next()) // { value: undefined, done: true }
```
优点：没有了Promise的一堆then(),异步操作更像同步操作，代码更加清晰。

缺点：不能自动执行异步操作，需要写多个next()方法，需要配合使用Thunk函数和Co模块才能做到自动执行。

> async/await

async是es2017引入的异步操作解决方案，可以理解为Generator的语法糖，async等同于Generator和co模块的封装，async 函数返回一个 Promise。

```js
async function read() {
    let readA = await readFile('data/a.txt');
    let readB = await readFile('data/b.txt');
    let readC = await readFile('data/c.txt');

    console.log(readA);
    console.log(readB);
    console.log(readC);
};
read();
```
优点：内置执行器，比Generator操作更简单。async/await比*/yield语义更清晰。返回值是Promise对象，可以用then指定下一步操作。代码更整洁。可以捕获同步和异步的错误。
