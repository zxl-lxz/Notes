# Getter

## 是什么？

> 有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

```js
computed: {
    doneTodosCount() {
        return this.$store.state.todos.filter((todo) => todo.done).length
    }
},
```

如果有很多组件都需要这么处理，我们需要在每个组件都写一遍，或者封装一个函数，在每个组件都引用这个函数。这两者都不是好办法。

`getters` 就是为了解决这个问题的。

## 使用

```js
const store = new Vuex.store({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 1, text: '...', done: false },
        ],
    },
    getters: {
        // 接受state作为第一个参数
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        },
        // 接受其他getter作为第二个参数
        doneTodosCount: (state, getters) => {
            return getters.doneTodos.length
        },

        // 也可以返回一个函数
        getTodoById: (state) => (id) => {
            return state.todos.find(todo => todo.id === id);
        }
    },
});
```

在我们的组件中，使用：

```js
computed: {
    myCom() {
        return this.$store.getters.getTodoById(2)
    }
},
```

## mapGetters

```js
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
        ])
    },
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：

```js
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```