首先，需要给每一个`property`做监听。

Vue里定义这个监听器为`Observer`.

# `Observer`

监听器：监听每一个属性，当读取和赋值的时候，触发`Object.defineProperty`的`setter`和`getter`.

```js
// 遍历每一个property，添加监听函数
function observable(obj) {
    if (!obj || typeof obj !== object) {
        return;
    }
    let keys = Object.keys(obj);
    keys.forEach((key) => {
        defineReactive(obj, key, obj[key]);
    });
    return obj;
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log('do someThing');
            return val;
        },
        set(newVal) {
            val = newVal;
            console.log('do someThing');
        },
    });
}
```

现在有了监听器。当监听到数据变化的时候，需要去触发试图更新。

在Vue里，有`data,computed,watch`这三种可更改数据并触发试图改变的方式。所以我们需要一个收集器，当数据变化的时候，我们需要通知所有与这个数据有关的对象。

这里涉及到了发布-订阅模式。

类似于售楼概念。售楼处就是一个发布者，这里收集了所有想买这个楼盘的人的联系方式。一旦有房源，会通知所有人。

所以引出了收集器`Dep`.

# Dep

收集器：负责收集所有依赖。一旦数据更新，通知有所依赖该数据的订阅者。

```js
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    // 将订阅者收集起来
    addSub: function(sub) {
        this.subs.push(sub);
    },
    // 给每一个订阅者发送消息
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    },
}
// 这个是全局的Dep
Dep.target = null;
```

现在，更改下上面的`defineReactive`函数。

```js
function defineReactive(obj, key, val) {
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function getter() {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function setter(newVal) {
            if (val === newVal) {
                return;
            }
            val = newVal;
            dep.notify();
        },
    });
}
```

现在，有了收集器了，如何将订阅者加入收集器呢？

Vue里订阅者，定义为了`Watcher`.

# `Watcher`

订阅者：在初始化的时候，将自己添加进收集器Dep.

```js
function Watcher(vm, exp, cb) {
    // vm是Vue实例
    // exp是属性名
    // cb就是数据改变时，需要执行的回调函数

    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    // 初始化的时候，调用自己的get方法。并将数据的oldValue缓存起来。
    this.value = this.get();
}

Watcher.prototype = {
    // 每一个订阅者的update函数。在监听器的setter函数里会被调用。
    update: function() {
        this.run();
    },
    run: function() {
        // 因为已经触发了setter，所以此时的值是改变后的newvalue
        let newValue = this.vm.data[this.exp];
        let oldValue = this.value;
        if (newValue !== oldValue) {
            this.value = newValue;
            this.cb.call(this.vm, newValue, oldValue);
        }
    },
    get: function() {
        // 将自身赋值给全局的Dep对象的target属性。
        Dep.target = this;
        // 执行监听器里的getter函数。这时候，就将自身添加到了收集器里。
        let value = this.vm.data[this.exp];
        // 完了之后，要将全局了Dep的target属性还原。以便别的订阅者使用。
        Dep.target = null;
        return value;
    },
}
```