# `loader`

## `loader` 是什么

`webpack` 本身是只能打包 `JavaScript` 类型的文件的。对于像 `CSS、HTML` 这样类型，就需要 `loader` 做转换。`loader` 可以将文件从不同的语言转换为 `JavaScript` 。

## 如何使用

一个简单的案例

```js
moudle.export = {
    rules: [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
    ],
};
```

[more](https://www.webpackjs.com/configuration/module/#module-rules)

## `style-loader`

### 用法

一般与 `css-loader` 或者 `file-loader` 一起使用。

```js
module.exports = {
    rules: [
        {
            test: /\.css$/,
            use: {
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                },
            }
        }
    ],
}
```

导入 `css` 文件

```js
import './index.css';
```

编译为

```html
<style>
    html,
    body {
        background-color: '#ffffff';
    }
</style>
```

### `injectType`

该配置项，设置如何将样式注入到 `DOM` 中。

有以下几种取值。

**`styleTag`**

默认值。使用多个 `style` 将样式注入。

```js
import './a.css';
import './b.css';
```

编译为

```html
<style>
    .a {
        color: '#ffffff';
    }
</style>

<style>
    .b {
        color: '#333333';
    }
</style>
```

**`singletonStyleTag`**

使用一个 `style` 将样式注入。

```js
module.exports = {
    rules: [
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'style.loader',
                    options: {
                        injectType: 'singletonStyleTag',
                    },
                },
                {
                    loader: 'css-loader',
                },
            ],
        },
    ],
};
```

```js
import './a.css';
import './b.css';
```

编译为

```html
<style>
    .a {
        color: '#ffffff';
    }
    .b {
        color: '#333333';
    }
</style>
```

**`linkTag`**

以 `<link rel="stylesheet" href="">` 的形式引入样式。这时候，`style-loader` 接收到的应该是样式文件的地址。所以需要搭配 `file-loader` 。

```js
module.exports = {
    test: /\.css$/,
    use: [
        {
            loader: 'style-loader',
            options: {
                injectType: 'linkTag',
            },
        },
        {
            loader: 'file-loader',
        },
    ],
};
```

编译为

```js
<head>
  <link rel="stylesheet" href="f2742027f8729dc63bfd46029a8d0d6a.css">
  <link rel="stylesheet" href="34cd6c668a7a596c4bedad32a39832cf.css">
</head>
```

**`lazyStyleTag, lazySingletonStyleTag`**

延迟加载

```js
// config
{
  test: /\.(css)$/,
  use: [
    {
      loader: 'style-loader',
      options: {
        injectType: 'lazyStyleTag',
      },
    },
    { loader: 'css-loader' },
  ],
}

// js
const globalStyle = require('./assets/style/global.css');
const indexStyle = require('./assets/style/index.css');

// globalStyle.use();
```

需要手动调用 `globalStyle.use()`

### `style-loader`实现思路

`style-loader` 的功能就一个。在 `DOM` 里插入一个 `style` 标签，并且将 `CSS` 写入这个标签内。

```js
const style = document.createElement('style');

style.type = 'text/css';

style.appendChild(document.createTextNode(content));

document.head.appendChild(style);
```

以上是最简单思路。

[源码分析](https://segmentfault.com/a/1190000020686081?utm_source=tag-newest)

[源码](https://github.com/webpack-contrib/style-loader)

## `css-loader`

> `css-loader` 解释(interpret) `@import` 和 `url()` ，会 `import/require()` 后再解析(resolve)它们。

## `file-loader`

> The `file-loader` resolves `import/require()` on a file into a `url` and emits the file into the output directory.

## `vue-loader`

> `webpack` 在加载 `vue` 文件时，会调用 `vue-loader` 来处理 `vue` 文件，之后 `return` 一段可执行的 `js` 代码，其中会根据不同 `type` 分别 `import` 一次当前 `vue` 文件，并且将参数传递进去，这里的多次 `import` 也会被 `vue-loader` 拦截，然后在 `vue-loader` 内部根据不同参数进行处理（比如调用 `style-loader`）。
