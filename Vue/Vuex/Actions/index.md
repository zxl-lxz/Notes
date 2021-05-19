# Actions

## 是什么？

> Action 类似于 mutation，不同在于：

1. `Action` 提交的是 `mutation`,而不是直接变更状态。
2. `Action` 可以包含任何异步操作。

可以理解为：`mutation` 直接更改 `state`。 `Action` 决定什么时候执行 `mutation` 去更改这个 `state`。

## 使用

```js
const store = new Vuex.store({
    state: {
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    },
    actions: {
        increment(context) {
            context.commit('increment');
        }
    },
});
```

> Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

但是 context 对象不是 store 实例本身。

在我们的组件中：

```js
this.$store.dispatch('increment', {
    amount: 10,
});

// 或者

this.$store.dispatch({
    type: 'increment',
    amount: 10,
});
```

借助 `mapActions` 辅助函数：

```js
import { mapActions } form 'vuex';

export default {
    methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

## 异步

> 首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

```js
this.$store.dispatch('actionA').then(() => {
  // ...
})
```

```js
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

```js
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```