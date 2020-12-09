在使用 `Vue` 的列表渲染和条件渲染时，我们可能会写出这样的代码。

```js
<div class="content">
    <div v-for="(item, index) in list" v-if="item.age > 25">
        <span>{{item.name}}</span>
        :
        <span>{{item.age}}</span>
    </div>
</div>
```

官方提示：`不推荐在同一组件上同时使用 v-for 和 v-if`

这其中涉及到 性能优化的问题

`Vue` 中，`v-for` 的优先级高于 `v-if` 。

也就是上述例子中，假设列表的长度是10.其中 `age > 25` 的长度是5. `Vue` 仍然会优先创建长度为 `10` 的`Vnode` 。 `v-if` 将会作用到每一个项上面。

在 `DOM` 更新，去做 `diff` 算法的时候，由于 `content` 通过了 `sameNode` 的判断，将会对其子元素做 `diff` 算法。

使用哪怕我们的目的只是需要渲染5个，但是会对10个子元素去做 `diff` 算法。这将造成性能浪费。

优化方法有两种：

1、使用计算属性
2. 使用 `template`: 如下

```js
<div class="content">
    <div v-for="(item, index) in list" v-bind:key="index">
        <template v-if="item.age > 25">
            <span>{{item.name}}</span>
            :
            <span>{{item.age}}</span>
        <template>
    </div>
</div>
```