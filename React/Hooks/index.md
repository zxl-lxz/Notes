# Hook

## Hook 是什么

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

> Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook 不能在 class 组件中使用 —— 这使得你不使用 class 也能使用 React。

## 为什么要使用 Hook

### 复用状态逻辑（代码复用）

使用 `自定义hook` 代替 `HOC、renderProps`。无需修改组件结构的情况下复用状态逻辑。

### 让复杂组件变得简单（代码管理）

`Hook` 将组件中相互关联的部分拆分成更小的函数。

### 拥抱函数

不再使用 `class`

## 如何使用 Hook

### `Hook` 使用规则

`Hook` 就是 `JavaScript` 函数，但是使用它有两个额外的规则：

1. 只能在函数最外层调用 `Hook`。不要在循环、条件判断或者子函数中调用。

2. 只能在 `React函数组件` 中使用 `Hook`。

[why?](https://zh-hans.reactjs.org/docs/hooks-rules.html#explanation)

### `useState`

```js
import React, { useState } from 'react';

function foo() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>click me</button>
        </div>
    );
}
```

`useState` 只接受一个参数，那就是初始 `state`。这个初始 `state` 只会在第一次渲染时被用到。

如果初始 `state` 需要通过复杂计算得到。可以传入参数。

```js
const [count, setCount] = useState(() => {
    const count = someComplexCalculation(props);
    return count;
});
```

`setCount` 不会将新的 `state` 和 旧的 `state` 进行合并。

可以使用 `函数式更新` 。

```js
setCount((c) => c + 1);
```

这样不会引用 `count` 。

> 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。

```js
// class组件
// 一次性更新多个state
setState(preState => {
    return {
        ...preState,
        ...updateState
    }
})；
```

> useReducer 是另一种可选方案，它更适合用于管理包含多个子值的 state 对象。

### `useEffect`

`数据获取`、`订阅`、`操作DOM` 等统称为 `副作用`。

该 `hook` 正是提供操作 `副作用` 的能力。

> 它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API。

分别对应 `第一次挂载` 、 `更新` 、 `即将销毁` 。

```js
import React, { useState, useEffect } from 'react';

function foo() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `you clicked ${count} times!`;
    });

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>click me</button>
        </div>
    );
}
```

通过返回一个函数，执行在组件销毁时的副作用

```js
import React, { useState, useEffect } from 'react';

function foo() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `you clicked ${count} times!`;
        return () => {
            document.title = 'i am done!';
        };
    });

    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>click me</button>
        </div>
    );
}
```

> 与 `componentDidMount` 或 `componentDidUpdate` 不同，使用 `useEffect` 调度的 `effect` 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，`effect` 不需要同步地执行。在个别情况下（例如测量布局），有单独的 `useLayoutEffect Hook` 供你使用，其 `API` 与 `useEffect` 相同。

**在调用新的`effect` 之前对前一个进行清理**

[解释: 为什么每次更新的时候都要运行 Effect](https://zh-hans.reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)

**跳过 `Effect` 进行性能优化**

> 如果某些特定值在两次重渲染之间没有发生变化，你可以通知 `React` 跳过对 `effect` 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

```js
useEffect(() => {
    document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

[提示: 通过跳过 Effect 进行性能优化](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

### `自定义Hook`

抽离状态逻辑

```js
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);

    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }

    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        };
    });

    return isOnline;
}
```

在别的组件中使用 `useFriendStatus`

```js
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);

    if (isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
```

```js
function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);

    return <li style={{ color: isOnline ? 'green' : 'black' }}>{props.friend.name}</li>;
}
```

> `useSomething` 的命名约定可以让我们的 `linter` 插件在使用 `Hook` 的代码中找到 `bug` 。
