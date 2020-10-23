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

## 总结

> `Webpack` 启动后会从 `Entry` 里配置的 `Module` 开始递归解析 `Entry` 依赖的所有 `Module` 。 每找到一个 `Module` ， 就会根据配置的 `Loader` 去找出对应的转换规则，对 `Module` 进行转换后，再解析出当前 `Module` 依赖的 `Module` 。 这些模块会以 `Entry` 为单位进行分组，一个 `Entry` 和其所有依赖的 `Module` 被分到一个组也就是一个 `Chunk` 。最后 `Webpack` 会把所有 `Chunk` 转换成文件输出。 在整个流程中 `Webpack` 会在恰当的时机执行 `Plugin` 里定义的逻辑。

> 作者：lihuanji
> 链接：https://juejin.im/post/6844903588607557639
> 来源：掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
