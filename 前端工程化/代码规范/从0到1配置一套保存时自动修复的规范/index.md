# VSCode + ESlint + Stylelint 配置指南

## 前言

从入坑开始接触了大大小小几十个项目了。在项目的切换中，总会碰到以下一些令人头疼的问题：

1. 编辑的时候标红，提示代码格式错误
    - 保存的时候没有自动修复。
    - 保存的时候修复了，但是还是报错。
2. 编辑的时候没有标红
    - 保存的时候也不报错。
    - 保存的时候报错了。
3. 写 `Vue` 项目时，只对 `script` 里的代码检测了语法，`template` 和 `style` 里的语法没有提示。保存时也不会自动按照规范修复。
4. ....

怀着实在忍不了了心情，我仔细阅读了

1. `VSCode defaultsetting.json` 配置
2. ESlint 配置规则
3. eslint-plugin-vue 文档
4. 诸多网上的配置教程
5. ...

如果你曾遇到这样的困惑，不妨耐心往下看，相信你会有收获。如果你是前端工程化大佬，请忽略 😄

以 `VSCode` + `Vue项目` 为例。

## 我们想要的效果

1. 编辑的时候，按照我配置的规则 `A` 提示我语法有错误（标红）

2. 保存的时候，按照规则 `A`，自动修复所有错误。

## 配置 VSCode

`保存时自动修复` 和 `文件使用哪套规则` 等都在 `VSCode` 配置。

首先，我们需要找到 `VSCode` 配置规则的地方。它有 `默认规则` 和 `用户自定义规则`。

按 `shift + cmd + P` 搜索 `deafult` 打开 `defaultSetting.json` 就是 `VSCode` 的默认配置。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff488a0dc5ad4536906aa7117b893341~tplv-k3u1fbpfcp-watermark.image)

还是按 `shift + cmd + P` 搜索 `setting` 打开 `setting.json` 就是 `VSCode` 的用户自定义配置。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b1a933b5f014b83abd667890c9ac01b~tplv-k3u1fbpfcp-watermark.image)

`setting.json` 里的配置会覆盖默认设置。

我们需要在 `setting.json` 里写入以下配置。

```json
{
    // 保存时使用eslint格式进行修复
    "editor.codeActionsOnSave": {
        "source.fixAll": true,
        "source.fixAll.eslint": true
    },

    // 保存的时候自动格式化
    "editor.formatOnSave": true,

    // 如果你的VSCode安装了Vetur插件，以下配置是需要的
    // 这能阻止Vetur对Vue代码进行检测，提高性能
    "vetur.format.enable": false,
    "vetur.validation.template": false,
    "vetur.validation.script": false,
    "vetur.validation.style": false,

    // 以下配置需要VSCode安装ESlint插件
    // 使用eslint规范 .Vue，.js
    "[vue]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[javascript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },

    // 使用prettier规范JSON
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

    // eslint设置
    "eslint.alwaysShowStatus": true,
    "eslint.validate": ["javascript", "vue", "html"],
    "eslint.options": {
        "extensions": [".js", ".vue"]
    }
}
```

这样，我们有了如下效果：

1. 保存的时候自动格式化代码并使用规则修复
2. `.vue`,`.js`文件使用 `eslint` 规范
3. `.json` 文件使用 `prettier` 规范

我们上面配置的每一条规则，都可以在 `defaultSetting.json` 中找到。其中有对规则的作用详细的解释。有的还会有官方链接。想深入了解的同学可以自行查找。

别忘了安装 `ESlint` 插件哦～

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b02d4fdc465e4543ad6ae608172a3ddd~tplv-k3u1fbpfcp-watermark.image)

## 配置 `ESLint` 规则

配置方式有多种，可以在 `package.json`里配置，也可以单独配置 `.eslintrc.js`文件。这里我更推荐使用单独的文件配置。一目了然。

首先，我们在根目录下新建 `.eslintrc.js` 文件。

```js
module.exports = {};
```

如果我们自己一条条的配置规则，估计整个人都会不好了，还好我们可以直接使用业内推荐的规范。

当然了，如果你是使用脚手架创建的项目，在创建的时候，可以选择使用脚手架默认安装 `eslint`相关的包。可以打开 `package.json` 查看是否已经安装了。如果是，则没必要重复安装。

如果还没有安装，打开命令行工具

```shell
npm i --save-dev eslint eslint-plugin-vue babel-eslint
```

我们配置 `.eslintrc.js`

```js
module.exports = {
    root: true,
    // 如果是SSR项目，则需要配置node:true
    env: {
        browser: true,
        node: true,
    },
    // 为什么是这样的parser配置？
    // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: [
        // 如果是nuxt.js的脚手架项目，则需要安装对应的以来并做以下配置
        '@nuxtjs',
        'plugin:nuxt/recommended',

        // 让eslint可以规范vue文件
        'plugin:vue/base',
        // vue3的项目需要使用，如果是vue2项目，使用 plugin:vue/recommended
        'plugin:vue/vue3-recommended',
    ],
    plugins: [
        // 注意这里不能配置 html 选项，原因：
        // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
        'vue',
    ],
    // 配置自己的规则，覆盖上面继承的规则
    rules: {
        // 配置js的缩进为 4，switch case 语句的 case 也使用4个空格缩进
        indent: ['error', 4, { SwitchCase: 1 }],
        // 使用 eslint 检测 template里的代码，这里我配置 4 个空格缩进
        'vue/html-indent': ['error', 4],
    },
};
```

以上配置，大家根据自己的项目特点，自行删减即可。比如，如果你的项目不是 `nuxt.js` 的，可以去掉 `extends` 里的 `'@nuxtjs` 和 `plugin:nuxt/recommended`。

现在我们基本已经实现了想要的效果。

1. 编辑的时候，对 `.js`,`.vue` 文件的 `template` 和 `script` 使用配置的 `eslint` 规范检查。
2. 保存的时候，对以上文件使用相同的 `eslint` 规范进行自动修复。

## 配置 `stylelint`

不过我们现在还不能对 `.css,.scss` 和 `vue` 文件里的 `style` 部分做规范检查和自动修复。这需要安装`stylelint`。

```shell
npm i --save-dev stylelint stylelint-config-standard stylelint-scss
```

以上安装了 `stylelint` 和 业内使用比较多的规范 ` stylelint-config-standard` 和对 `scss` 语法的支持 `stylelint-scss`。

接下来我们需要配置它们。

在根目录下新增 `.stylelintrc.json` 文件。

```json
{
    // 使用规范
    "extends": "stylelint-config-standard",
    // 自定义4个空格缩进
    "rules": {
        "indentation": 4
    }
}
```

`VSCode` 安装 `stylelint` 插件。

大功告成！赶快试试吧～
