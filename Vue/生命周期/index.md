# 生命周期

## 钩子函数

![生命周期](https://cn.vuejs.org/images/lifecycle.png)

**解读：**

`new Vue` 的时候

首先 `init Events & init Lifecycle`.

然后执行 `beforeCreate`.

然后 `init injections & init reacttivity`.

然后执行 `created`.

看下源码的执行顺序：

```js
initLifecycle(vm);
initEvents(vm);
initRender(vm);

callHook(vm, 'beforeCreate');

initInjections(vm); // resolve injections before data/props
initState(vm);
initProvide(vm); // resolve provide after data/props

callHook(vm, 'created');
```

其中

`initLifecycle(vm)`: 对 `vm`实例的一些属性做一些初始化赋值。

`initEvents(vm)`: 对`vm`实例的事件机制做一些初始化处理。

`initRender(vm)`: 对插槽进行初始化，为渲染 `Vnode` 做一些准备。

上面执行完之后，执行 `befoeCreate` 钩子函数。所以在 `beforeCreate` 钩子函数里，是不能访问 `data,props,methods等这些变量的，当然也无法访问真实的dom`.

`initInjections(vm) 和 initProvide(vm)`: 对应 `provide/inject`,用于组件通信。

`initState(vm)`: 初始化 props、data、methods、watch、computed 等属性。

上面执行完后，执行 `created`钩子函数。

那么显然 `beforeCreate` 的钩子函数中就不能获取到 `props、data` 中定义的值，也不能调用 `methods` 中定义的函数。

在这俩个钩子函数执行的时候，并没有渲染 `DOM`，所以我们也不能够访问 `DOM`，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 `props、data` 等数据的话，就需要使用 `created` 钩子函数。

然后，会判断是否有 `el` 属性。如果有判断是否有 `template`.如果没有，先中断生命周期。直到 `vm.$mount` 被调用。再判断是否有 `template` 。

如果有 `template`,将 `template` 里的内容编译为 `VNode`,如果没有，将 `el` 挂载的元素里的内容编译为 `VNode`.

之后执行 `beforeMount` 钩子。

之后，将`VNode`转换为真实的`DOM`.再执行 `mounted`钩子函数。

之后，`VUE` 会监听每一个 `property` 的变化，当数据变化时，先执行 `beforeUpdate`.之后，触发 `DOM` 更新。再执行 `updated` 钩子函数。

当 `vm.destory()` 函数被调用的时候，执行 `beforeDestory` 钩子函数，当清楚里所有订阅者，自组件，事件监听后，再执行 `destoryed` 钩子函数。

## 父子组件生命周期执行顺序

**加载渲染过程：**

`父 beforeCreate`

`父 created`

`父 beforeMount`

`子 beforeCreate`

`子 created`

`子 beforeMount`

`子 mounted`

`父 mounted`

**更新过程：**

`父 beforeUpdate`

`子 beforeUpdate`

`子 updated`

`父 updated`

**销毁过程：**

`父 beforeDestory`

`子 beforeDestory`

`子 destoryed`

`父 destoryed`
