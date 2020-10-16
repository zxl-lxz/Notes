# computed

`computed` 之所以是响应式，其实也是和其它 `property` 一样。利用了 `发布订阅` 那一套。其核心是 `computed watcher`。

```js
<template>
    <div>
        <span>{computedName}</span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                firstName: 'liang',
                lastName: 'zhou',
            }
        }

        computed {
            computedName() {
                return this.firstname + this.lastName
            }
        }
    }
</script>
```

`Vue` 在生命周期的 `created` 之前会执行 `initState` 函数。

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

该函数会判断，是否定义了 `computed` 。如果有的话，会执行 `initComputed` 函数。

```js
const computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
    const watchers = (vm._computedWatchers = Object.create(null));

    for (const key in computed) {
        // 我们写的函数，例如computedName
        const userDef = computed[key];
        // computedName也可以是对象，对象有get函数
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        // watchers为每一个computed里的属性，创建对应的watcher实例
        watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
        defineComputed(vm, key, userDef);
    }
}
```

以上是简化版的函数。我删掉了一些 SSR 的判断和一些报错判断等。

该函数最主要的，对 `computed` 里定义的每一个计算属性，都创建一个 `watcher`实例。

`computed watcher` 与众不同的地方在于.一开始并没有求值。

```js
// Watcher constructor
this.value = this.lazy ? undefined : this.get();
```

然后执行 `defineComputed` 。

```js
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
};
export function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key);
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

以上是简化版的 `defineComputed` 。删除了很多判断。以上是最常见的一种情况。

`defineComputed` 就是设置了 `sharedPropertyDefinition` 这个属性描述符的`getter` 为 `createComputedGetter(key)`.

```js
function createComputedGetter(key) {
    return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            // 此处为computed里引用computed的处理
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value;
        }
    };
}
```

上面的`watcher` 就是我们前面 `watchers` 对象里，与这个 `key` 对应的 `watcher` 实例。

`dirty`的值和 `lazy` 的值一样。上面我们有这样一个变量作为 `options` 传入了 `watcher` 的构造函数。`const computedWatcherOptions = { lazy: true }`

所以接下来，调用了实例的 `evaluate(), depend()`.最后返回实例的 `value` 属性。

```js
evaluate () {
    this.value = this.get()
    this.dirty = false
}
```

执行求值函数`get`。

```js
// ...code
// expOrFn 就是我们自己定义的computed函数
if (typeof expOrFn === 'function') {
    this.getter = expOrFn
}
// ...code

get () {
    pushTarget(this)
    let value
    const vm = this.vm
    value = this.getter.call(vm, vm)
    if (this.deep) {
        traverse(value)
    }
    popTarget()
    this.cleanupDeps()
    return value
}
```

以上是简化后的 `get`.就是执行我们自己定义的 `computed` 函数，进行求值。

求值完之后，这里有个逻辑是 `if (Dep.target) watcher.depend()`

这里的 `Dep.target` 其实是另一个 `computed`。怎么说呢？看看上面的 `get` 求值函数。

在求值之前，还执行了 `pushTarget(this)` 函数和 `popTarget()`。

```js
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
const targetStack = [];

export function pushTarget(target: ?Watcher) {
    targetStack.push(target);
    Dep.target = target;
}
export function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
}
```

到这里，举个例子。

```js
// app.vue
computed {
    a() {
        return this.name + this.age
    }
    b() {
        return this.a + this.age
    }
}
```

上面，`b` 引用了 `a` 。

当我们调用`b` 的时候，会调用其 `get` 求值函数。这时，其 `watcher` 被推入数组。然后执行到了 `this.a` ，又会调用 `a` 的求值函数 `get`。这时候其 watcher 也被推入数组。但是后面又执行了`pop`。所以当 `a` 求完值后，`Dep.target` 其实是 `b`.这时候会执行 `a` 对于的 `watcher` 的 `depend()` 方法。

来看看 `depend()`.

```js
/**
* Depend on all deps collected by this watcher.
*/
depend () {
    let i = this.deps.length
    while (i--) {
        this.deps[i].depend()
    }
}
```

就是将 `a` 依赖的属性全部让 `b` 也依赖。这样 `name` 和 `age` 变化时，又能够通知 `b` 重新计算值了。

一旦我们修改了依赖，就会触发 `setter`.通知所有依赖他的 `watcher` 执行 `update()` 方法。

```js
update () {
/* istanbul ignore else */
	if (this.lazy) {
		this.dirty = true
	} else if (this.sync) {
		this.run()
	} else {
		queueWatcher(this)
	}
}
```

如果，值没有变化，上面都没做。

如果是异步函数，则一个个执行对应 `watcher` 的 `run` 函数。

如果不是异步的函数，例如同时多次改变依赖的值。

```js
export function queueWatcher(watcher: Watcher) {
    const id = watcher.id;
    if (has[id] == null) {
        has[id] = true;
        if (!flushing) {
            queue.push(watcher);
        } else {
            // if already flushing, splice the watcher based on its id
            // if already past its id, it will be run next immediately.
            let i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }
        // queue the flush
        if (!waiting) {
            waiting = true;

            if (process.env.NODE_ENV !== 'production' && !config.async) {
                flushSchedulerQueue();
                return;
            }
            nextTick(flushSchedulerQueue);
        }
    }
}
```

该函数就是为什么，多次改变值，只会执行一次更新了。因为将所有的 `watcher` 都放到了一个数组中。使用 `nextTick` 保证在下一个队列中执行。
