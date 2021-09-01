# React理念

> 我们认为，React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

如何快速响应？

需要突破两大瓶颈：`CUP` & `IO`。

`CPU`瓶颈指的是计算机的计算能力。当`JS`运行时间过长，阻塞了`DOM`的更新。

`IO`瓶颈指的是网络请求瓶颈。当数据迟迟不返回，页面无法展示完整，操作无法得到响应。

## CUP瓶颈

在一个`tab`进程中,`JS`线程和`GPU`渲染线程是互斥的。如果`JS`执行时间太长，那么用户界面就无法得到及时渲染。

浏览器的主刷新频率为`60HZ`。即每一秒刷新`60`次。也就是说 （`1000ms/60`）,每一帧需要在`16.6ms`内完成。

在`16.6ms`内，需要完成`JS`解析，`layout`，`paint`。当应用复杂的时候，很难做到这一点。

`React`如何解决呢？

> 在浏览器每一帧的时间中，预留一些时间给JS线程，`React`利用这部分时间更新组件（可以看到，在[源码 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)中，预留的初始时间是5ms）。

其它时间，`React`将控制权交还给浏览器。在下一帧继续被中断的`JS`执行工作。

## IO瓶颈

> `网络延迟`是前端开发者无法解决的。如何在`网络延迟`客观存在的情况下，减少用户对`网络延迟`的感知？
>
> `React`给出的答案是[将人机交互研究的结果整合到真实的 UI 中 (opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production)。

## React15

这个版本，并没有实现`可中断的异步执行`。[老的React架构](https://react.iamkasong.com/preparation/oldConstructure.html#react15%E6%9E%B6%E6%9E%84%E7%9A%84%E7%BC%BA%E7%82%B9)

该版本中，reconcilier 和 renderer 交替工作。reconcilier每发现一个节点需要更新，就通知renderer更新DOM。这个过程不断重复交替执行，直到整个重新渲染结束。一旦中间被中断，那么用户将会看到不正确的DOM。

## 新的React16架构

新的架构新增了 `Scheduler`。它是一个调度器。它会判断浏览器是否有剩余时间去执行我们的JS。并且还提供了优先级供任务设置。

新架构的reconcilier结合scheduler,实现了一种新的机制。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

workInProgress就是我们的任务。shouldYield表示是否应该将控制权让出给浏览器，即表明是否有空闲时间。上面代码表示：当我有任务需要执行，并且浏览器有空闲时间时，我才会执行这个任务。

那当我一个任务执行到一半，发现浏览器没空闲时间了，就会中断这个任务的执行。那么新架构如何解决DOM更新不完全的问题呢？

答案是，在新架构中，reconcilier和renderer不再是交替工作了。在reconcilier执行的过程中，它会给变化的虚拟DOM打上标签。表明是增/删/改。

> 整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

Renderer根据打的标签，更新DOM。

![图片来源：react技术揭秘](https://react.iamkasong.com/img/process.png)

> 其中红框中的步骤随时可能由于以下原因被中断：
>
> - 有其他更高优任务需要先更新
> - 当前帧没有剩余时间
>
> 由于红框中的工作都在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM（即上一节演示的情况）。

## Fiber

fiber就是个reconciler提供这个中断能力的。

### fiber的心智模型：代数效应

保持函数调用方式不变。从某个过程中跳出，再回到刚刚的位置继续执行。

