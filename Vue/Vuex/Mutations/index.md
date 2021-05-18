# Mutations

## 唯一方法

更 `Vuex` 的 `store` 的状态的唯一方法就是提交 `mutation`。

## 使用

```js
const store = new Vuex.store({
    state: {
        count: 1,
    },
    mutation: {
        increment(state) {
            state.count++
        }
    },
});
```

在我们的组件中：

```js
methods: {
    changeCount() {
        this.$store.commit('increment');
    }
},
```

## 提交载荷（payload）

```js
mutations: {
    // 传值
    increment(state, n) {
        state.count += n;
    }
}
```

大多数情况，建议传入对象。

> 这样可以包含多个字段并且记录的 mutation 会更易读：

```js
mutations: {
    increment(state, payload) {
        state.count += payload.amount
    }
},
```

```js
this.$store.commit('increment', {
    amount: 10,
});
```

或者，直接使用对象风格的提交方式：

```js
this.$store.commit({
    type: 'increment',
    amount: 10,
});
```

## `Mutation` 需要遵守 `Vue` 的响应规则

> 既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1. 最好提前在你的 store 中初始化好所有所需属性。
2. 当需要在对象上添加新属性时，你应该

    - 使用 `Vue.set(obj, 'newProp', 123)`
    - 使用新对象（借助对象展开符）

## 使用常量替代 `Mutation` 事件类型

建议的代码风格

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

## `Mutation` 必须是同步函数

必须

## 提交

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```