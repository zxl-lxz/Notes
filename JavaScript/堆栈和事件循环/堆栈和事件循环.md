> [JavaScript开发者应懂的33个概念-《调用堆栈》](https://github.com/stephentian/33-js-concepts#1-%E8%B0%83%E7%94%A8%E5%A0%86%E6%A0%88)

![堆，栈，队列](https://mdn.mozillademos.org/files/4617/default.svg)
### 堆
对象被分配到一个堆中，即用以表示一大块非结构化的内存区域。可以简单粗暴的理解，JS中的所有数据都保存在堆内存中，尽管严格上并非如此。变量对象也是存储在堆内存中。
### 栈
开始解析JS，创建全局执行上下文，进入执行栈。也就是主线程的任务。当主线程任务执行完成，会去消息队列里面取可以执行的宏任务。为这个宏任务创建新的执行上下文，进入执行栈。遇到函数会为这个函数创建新的执行上下文，进入该执行栈。后进入栈的函数先被执行完成，弹出栈，继续上一次的位置继续执行上一个被推入栈的函数。知道该栈的所有函数执行完成。所以是先进后出,后进先出**LIFO**
### 队列
也就是消息队列。一个JS运行时包含一个待处理的消息队列。每一个消息都关联一个用以处理这个消息的函数。先入队列的消息将最先被处理。并为其创建一个新的执行上下文推入执行栈。当执行栈为空时，再处理下一个消息。
### 事件循环
事件循环就是上述的执行机制。
- [x] 同步任务在主线程上执行，形成一个执行栈。
- [x] 主线程之外，存在一个任务队列。宏任务和微任务都会往任务队列中放入一个消息
- [x] 一旦执行栈中的所有同步任务执行完毕，就会从任务队列中取消息。创建新的执行栈。创建新的执行上下文。
- [x] 这个过程是不断循环的。
### JS执行机制
详细说一下JS的执行机制。
- [x] 宏任务
- [x] 微任务

> 首先，全局执行上下文作文宏任务进入主线程。创建执行栈。  

> 上个宏任务执行结束，会查找微任务进行执行。如果有立即执行，如果没有，创建新的宏任务。

```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})

process.nextTick(function() {
    console.log('6');
})

new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

// 1，7，6，8，2，4，3，5，9，11，10，12
```
