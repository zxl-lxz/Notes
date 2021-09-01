# Reconciliation

`React` 中，`props` 或者 `state` 改变，导致组件重新调用 `render` 函数，返回不同的 `虚拟DOM树`。然后进行新旧 `虚拟DOM` 的对比`(diff)`,最后渲染为真实的 `DOM` 。这个过程就是 `Reconciliation` 。称为 `协调`。

其核心，就是 `diff`过程。

## shouldComponentUpdate

为了更好的性能，我们要尽可能的减少这个过程。因为 `diff` 过程需要进行复杂的对比。在类组件中，我们可以使用 `shouldComponentUpdate` 这个生命周期钩子函数去控制组件是否需要进行再次渲染以更新。

这个钩子函数，默认返回 `true` 。只要我们的 `props` 或者 `state` 改变（浅比较），就会重新渲染。

如果我们可以确定不需要组件重新渲染，我们可以控制它返回 `false`，这样 `React` 将不会针对这个组件进行`Reconciliation` 过程。

另外，在 `React` 的 `diff` 算法中，如果当前节点 `shouldComponentUpdate` 返回 `true`,则表明需要进行对比，如果新旧节点类型一样，则会进行子节点的对比。如果新旧节点的类型不一样，`React` 会直接将该节点和其所有子节点全部删除，并且替换为新的。

`React.PureComponent` 内置了这个功能。

## React.memo

以上的`shouldComponentUpdate` 适用于类组件，那么函数组件能否减少 `diff` 过程呢。答案就是利用 `React.memo`。不过它只能浅比较`props` 的改变。如果新旧`props`没有改变，则不会重新渲染。

## 浅比较

```js
function shallowEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== 'object' ||
      a === null ||
      typeof b !== 'object' ||
      b === null
  ) {
    return false;
  }
  
  const keysa = Object.keys(a);
  const keysb = Object.keys(b);
  if (keysa.length !== keysb.length) {
    return false;
  }
  
  for (let i = 0; i < keysa.length; i++) {
    if (!b.hasOwnProperty(keysa[i]) ||
        a[keysa[i]] !== b[keysa[i]]
    ) {
      return false;
      }
  }
  return true;
}
```

## 深比较

```js
function deepEqual(a, b) {
  // null
  if (a === null && b === null) {
    return true;
  }
  // 基本类型
  if (typeof a !== 'object' &&
      typeof b !== 'object'
  ) {
    return a === b;
  }
  // 只要有一个不是object,或者其中一个是null,另一个是object。都返回false
  if (typeof a !== 'object' ||
      a === null ||
      typeof b !== 'object' ||
      b === null
  ) {
    return false;
  }
  const keysa = Object.keys(a);
  const keysb = Object.keys(b);
  
  if (keysa.length !== keysb.length) {
    return false;
  }
  
  for(let i = 0; i < keysa.length; i++) {
    // 属性不相同或者值不相等
    if (!b.hasOwnProperty(keysa[i]) ||
        b[keysa[i]] !== a[keysa[i]]
    ) {
      return false;
    } else {
      return deepEqual(a[keysa[i]], b[keysa[i]]);
    }
  }
}
```

深比较，对性能的消耗非常严重。

