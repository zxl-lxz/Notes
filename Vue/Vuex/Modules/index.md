# Modules

## 是什么？

> 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

> 为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割。

## 使用

```js
// moduleA
export default {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... },
    getters: { ... }
}
```

```js
// moduleB
export default {
    state: () => ({}),
    mutations: { ... },
}
```

```js
// store
const store = new Vuex.store({
    state: {},
    mutations: {},
    modules: {
        a: moduleA,
        b: moduleB,
    },
});
```

在组件中：

```js
import store from '@/store';

console.log(store.state.a); // => moduleA 的状态
console.log(store.state.b); // => moduleB 的状态
```

### 局部状态

```js
const moduleA = {
    state: () => ({
        count: 0,
    }),
    mutations: {
        increment(state) {
            // 这里的 `state` 对象是模块的局部状态
            state.count++;
        },
    },

    getters: {
        // 这里的 `state` 对象是模块的局部状态
        // getters是局部的
        // rootState是全局的
        doubleCount(state, getters, rootState) {
            return state.count * 2;
        },
    },
    actions: {
        // state和commit是局部的。
        // rootState是全局的。
        incrementIfOddOnRootSum({ state, commit, rootState }) {
            if ((state.count + rootState.count) % 2 === 1) {
                commit('increment');
            }
        },
    },
};
```

## 命名空间

[Vuex - Modules - 命名空间](https://vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4)

看官网吧，挺复杂的...
