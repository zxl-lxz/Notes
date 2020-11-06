# Module

在 `ES6` 之前，使用 `CommonJS` 加载模块，只能在程序运行时确认模块的依赖。

```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

以上代码，相当于加载了整个 `fs` 模块，然后找出了我们需要的三个。这种加载成为“运行时加载”，因为只有运行时才能得到 `_fs` 对象。

`ES6` 模块不是对象，而是通过 `export` 命令，显式指定输出的代码。再通过 `import` 命令输入。

```js
import { a, b, c } from 'fs';
```

上面的代码实质是从 `fs` 模块加载 3 个方法，其它的不加载。这种被称为 `编译时加载`或者 `静态加载`。

## `export`

使用 `export` 需要注意的是：`export` 输出的是对外的接口，而不是输出值。

```js
export const a = 1;

const b = 2;
export { b };

const c = 3;
export { c as d };

const name = 'zl';
const age = 25;
export { name, age };

export function foo() {}

function bar() {}
export { bar };

export class Person {}
```

以上都是可以的。

但是下面这些会报错。

```js
export 1;

const b = 2;
export b;

function foo() {}
export foo;
```

另外，`export` 语句输出的接口，与其对应的值是动态绑定关系。即通过该接口 ，可以取到内部变量实时的值。

```js
export let foo = 2;
setTimeout(() => (foo = 3), 500);
```

这一点与 `CommonJS` 完全不同。`CommonJS` 模块输出的是值的缓存，不存在动态更新。

最后需要注意的是，`export` 不能出现在块级作用域内。

```js
function foo() {
    export fefault 'bar';
}
foo()
```

以上代码会报错。

### `export default`

`export default` 相当于使用了两次 `as`.

```js
const a = 1;
export { a as default };

import { default as myName } from './index.js';

// 相当于
const a = 1;
export default a;

import myName from './index.js';
```

## `imoport`

```js
import { name, age } from './index.js';

import { name as myName, age as myAge } from './index.js';
```

`import` 输入的变量都是只读的。对于基本类型，不允许修改其值。对于引用类型，不允许修改其指针指向。

```js
import { a } from './index.js';

a = {};

// 报错
```

```js
import { a } from './index.js';

a.foo = 2;

// 允许。
```

虽然允许修改对象的属性值，但是这样其它引用了 `a` 的模块，也会受到影响。这将会导致错误很难定位。建议凡是输入的变量，一律当作完全只读。

需要注意的是，`import` 也是静态分析的。一切只能在运行时才能得出结果的，都不能使用。

```js
// 报错
import { 'f' + 'oo'} from './index.js';

// 报错
const module = 'module';
import {a} from module;

// 报错
if (X) {
    import {a} from './index.js'
}
```

以上，均会报错。

可以使用 `*` 号输入整个模块。

```js
import * as all from './index.js';

console.log(all.a);
```

### `import()`

运行时加载。`import()` 返回 `promise`。

> 按需加载

```js
button.addEventListener('click', (e) => {
    import('./index.js').then((module) => {
        module.init();
    });
});
```

> 条件加载

```js
if (x) {
    import('./index.js').then();
} else {
    import('./util.js').then();
}
```

> 动态加载模块

```js
import(f()).then();
```

> 同时加载多个

```js
Promise.all([
    import('./a.js'),
    import('./b.js'),
    import('./c.js')
])
.then(([modulea, moduleb, modulec]) => {
    ...
})
```

## 加载实现

默认情况下，`script` 标签是同步执行的。渲染引擎遇到 `script` 标签就会停下来，等到执行完脚本再继续向下渲染。

```js
<script type="application/javascript">
    // ...code
</script>

<script src="./index.js" type="application/javascript"></script>
```

如果引用了外部脚本，还需要下载的时间。一旦加载时间过长，就会导致浏览器阻塞。

有两种异步执行脚本的方法。

```js
<script src="./index.js" defer></script>
<script src="./index.js" async></script>
```

`defer` 与 `async` 的区别是：`defer` 需要等到整个页面正常渲染结束，才会执行。`async` 则是一旦下载完成，就会中断当前的渲染，执行这个脚本。

也就是 `defer` 是 `渲染完再执行`, `async` 是 `下载完就执行`。如果页面有多个 `defer` ，按照顺序加载。而多个 `async` 无法保证加载顺序。
