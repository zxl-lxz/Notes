# nextTick

`Vue` 中的核心方法。

官方也对此修改了几个版本。不过核心思路不变。

先来看下之前版本的代码：

```js
import { noop } from 'shared/util';
import { handleError } from './error';
import { isIOS, isNative } from './env';

const callbacks = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
let microTimerFunc;
let macroTimerFunc;
let useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks);
    };
} else if (
    typeof MessageChannel !== 'undefined' &&
    (isNative(MessageChannel) ||
        // PhantomJS
        MessageChannel.toString() === '[object MessageChannelConstructor]')
) {
    const channel = new MessageChannel();
    const port = channel.port2;
    channel.port1.onmessage = flushCallbacks;
    macroTimerFunc = () => {
        port.postMessage(1);
    };
} else {
    /* istanbul ignore next */
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    microTimerFunc = () => {
        p.then(flushCallbacks);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) setTimeout(noop);
    };
} else {
    // fallback to macro
    microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
export function withMacroTask(fn: Function): Function {
    return (
        fn._withTask ||
        (fn._withTask = function () {
            useMacroTask = true;
            const res = fn.apply(null, arguments);
            useMacroTask = false;
            return res;
        })
    );
}

export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        if (useMacroTask) {
            macroTimerFunc();
        } else {
            microTimerFunc();
        }
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise((resolve) => {
            _resolve = resolve;
        });
    }
}
```

老版的实现分为宏任务和微任务。

`microTimerFunc` 为微任务函数。

`macroTimerFunc` 为宏任务函数。

上方的注释意思为：在 `2.4` 版本之前 `只使用微任务` 。这样做会导致怎样的问题。后面更新为`使用宏任务和微任务` 。但是这样做也会有一些问题。

先来看实现思路。

`flushCallbacks` 就是最执行的函数。该函数将下一次消息队列里的函数一一执行。

也就是说当我们同时写了很多个 `nextTick` 的时候，这些函数都将在下一个队列里执行。

```js
this.$nextTick(fun1);
this.$nextTick(fun2);
this.$nextTick(fun3);
```

`fun1,fun2,fun3` 都将在下一个消息队列中被取出来推入栈中执行。

接下来是最为关键的优先级判断。越靠前的优先级越大。也就是说作者更想使用它来实现`nextTick`，或者最好使用它来实现。顺序不同，对浏览器支持的程度就不同。

首先是 `setImmediate` 。是`window` 暴露的一个方法。具体查看 MDN。如果浏览器原生支持它的话，则

```js
macroTimerFunc = () => {
    setImmediate(flushCallbacks);
};
```

如果不支持，则判断是否支持 `MessageChannel`.如果支持，同样 `macroTimerFunc` 用其实现。

如果以上两个都不支持，则采用宏任务 `setTimeout`。

以上三种都是对宏任务函数的定义。

接下里还有对微任务的定义。

判断浏览器是否支持 `Promise`.如果支持，则用 `Promise.then()` 实现。否则 `微任务用宏任务实现。`也就是都是宏任务。

接下来是暴露出去的 `nextTick` 函数的实现。

每调用一次 `nextTIck` 函数，就将其回调函数推入我们定义的 `callbacks` 数组中。

并且这里使用了 `try...catch` 包装。保证不会因为某一个错误导致整个 `JS` 停止运行。

接下来，由于 `useMacroTask` 默认是 `false` 。所以这里默认会走到使用 `microTimerFunc`。也就是如果浏览器支持 `Promise` 的话。就优先使用 `Promise.then()` 实现。但是如果浏览器不支持的话，微任务函数是用宏任务函数实现的。所以也会走到宏任务的实现方式。

最后一段，是当我们使用 `nextTick` 但是没有传入回调函数。则会返回一个 `Promise`。那么我们也可以这样使用 `nextTick`。

```js
this.$nextTick().then(() => {});
```

以上就是 19 年 10 月之前的版本了。后面因为某些原因，作者又将其改为了全部使用微任务的版本。

```js
/* @flow */
/* globals MutationObserver */

import { noop } from 'shared/util';
import { handleError } from './error';
import { isIE, isIOS, isNative } from './env';

export let isUsingMicroTask = false;

const callbacks = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
let timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        // In problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) setTimeout(noop);
    };
    isUsingMicroTask = true;
} else if (
    !isIE &&
    typeof MutationObserver !== 'undefined' &&
    (isNative(MutationObserver) ||
        // PhantomJS and iOS 7.x
        MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true,
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
    isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = () => {
        setImmediate(flushCallbacks);
    };
} else {
    // Fallback to setTimeout.
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise((resolve) => {
            _resolve = resolve;
        });
    }
}
```

以上是目前的最新版。

整个过程就不再分析。

其主要区别就在于 `API` 的改变和优先级。

新版优先使用 `Promise.then()`.去掉了宏任务函数。并且引入了 `MutationObserver`.
