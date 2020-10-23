# webpack VS rollup

## 官方定义

`webpack`： `webpack` 是一个现代 `JavaScript` 应用程序的 `静态模块打包器` 。当 `webpack` 处理应用程序时，它会递归地构建一个 `依赖关系图` ，其中包含应用程序需要的每个模块，然后将所有的这些模块打包成一个或多个 `bundle`.

`rollup`: `rollup` 是一个 `JavaScript模块打包器` 。可以将小块代码编译成大块复杂的代码。

## 偏向

`webpack`：偏向应用于前端工程、UI 库。偏向场景中涉及到 `HTML、 CSS`，涉及到复杂的代码拆分合并或者动态加载。

`rollup`：偏向 `JavaScript` 库。

### `rollup` 举例：

```js
// src/main.js
import foo from './foo.js';
export default function () {
    console.log(foo);
}
```

```js
// src/foo.js
export default 'hello world!';
```

```js
// 执行命令 -o表示输出bundle.js文件 -f cjs表示使用commonjs标准输出
rollup src/main.js -o bundle.js -f cjs
```

```js
// 输出bundle.js内容
'use strict';

var foo = 'hello world!';

var main = function () {
    console.log(foo);
};

module.exports = main;
```
