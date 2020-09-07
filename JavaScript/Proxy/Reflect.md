# Reflect

`reflect` 的英文意思为：反映，反射。

所以将 `Reflect` 放在 `Proxy` 里面一起写。因为他两常常一起使用。

> Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。-es6入门教程

```js
const proxy = new Proxy({}, {
    get: function(target, name, recevier) {
        console.log('get');
        Reflect.get(target, name, recevier);
    },
    set: function(target, name, value, recevier) {
        console.log('set');
        Reflect.set(target, name, value, recevier);
    }
});
```

于是， `Reflect` 对应 `Proxy` 的13种方法。

具体的我就不展示了，有兴趣自行查阅`es6入门教程`



