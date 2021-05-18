# 从一个最简单的例子开始

## `Vuex` vs `全局变量`

1. `Vuex` 的状态是响应式的。
2. 我们不能直接改变 `store` 中的状态。唯一方法：`commit mutation`。

## 一个最简单的 `Vuex`

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        increment(state) {
            state.count++;
        }
    },
});
```

在我们的组件中：

```js
methods: {
    increment() {
        this.$store.commit('increment');
        console.log(this.$store.state.count);
    },
},
```