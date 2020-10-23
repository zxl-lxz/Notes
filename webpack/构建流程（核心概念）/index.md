# 构建流程

`webpack` 的构建流程离不开 4 个核心概念。

## 入口「entry」

入口指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图的开始。

## 出口「output」

出口告诉 `webpack` 在哪里输出它所创建的 `bundles` ,以及如何命名这些文件。

## loader

如果我们的工程只有 JS 模块，那么上面两步就可以了。

`loader` 让 `webpack` 能够处理那些非 `JavaScript` 文件。（webpack 本身只能理解 JS）。

例如 `css-loader` 。就告诉 `webpack` 在遇到引入了 `.css` 的文件时，别忘了使用 `css-loader` 处理下。

## plugin

`loader` 被用于转换某些类型的模块，而插件则可以执行范围更广的任务。插件的范围包括，从打包、优化、压缩，一直到重新定义环境中的变量。
