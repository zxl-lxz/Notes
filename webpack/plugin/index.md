# plugin

插件让我们可以往 `webpack` 的编译过程中加入自定义构建行为。

`webpack` 的编译过程就像是一条生产线。在每一个节点会做相应的事情。`webpack` 会在这些节点广播这些事件。插件就是要去订阅自己关心的节点，插入自己的构建行为。

让以上这些落地的就是 `Tapable` 库。

`webpack` 里几个非常重要的对象 `Compiler` 、 `Compilation` 、 `JavascriptParser` 都继承了 `Tapable` 类。他们身上挂着非常丰富的钩子。

每一个钩子都对应订阅了 `webpack` 编译过程中的某个时刻。

[具体的钩子含义](https://champyin.com/2020/01/12/%E6%8F%AD%E7%A7%98webpack-plugin/)

## 开发一个简单的插件

1. 插件都是一个类
2. 原型上有一个 `apply` 方法。
3. 注册一个事件钩子
4. 操作 `webpack` 内部实例数据
5. 功能完成后，调用 `webpack` 提供的回调

```js
class MyPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('My Plugin', (status) => {
            console.log('a smiple plugin');
        });
    }
}
```

以上的 `done` 就是订阅了 `webpack` 编译结束时的钩子。在一次编译完成后，会打印.

[原文链接-揭秘 webpack plugin](https://champyin.com/2020/01/12/%E6%8F%AD%E7%A7%98webpack-plugin/)

## 热更新（HMR: Hot Module Replacement）

[HMR](https://juejin.im/post/6844904008432222215)
