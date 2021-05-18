# State

## 单一状态树

> Vuex 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 (SSOT (opens new window))”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

## 获取

```js
import App from './App.vue';
import router from './router';
import store from './store';

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
```

在组件中：

```js
computed: {
    count() {
        return this.$store.state.count;
    }
},
```

或者，借助 `mapState` 函数。该函数返回一个对象。借助拓展运算符展开它。

```js

computed: {
    myCom() {},
    ...mapState({
        count: state => state.count,
        // 传字符串参数 'count' 等同于 `state => state.count`
        countAlias: 'count',
        countPlusLocalState(state) {
            return state.count + this.localCount;
        },
    }),
},
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。

```js
computed: {
    ...mapState(['count']),
},
```

