module.exports = {
    // 限制代码行长度
    printWidth: 120,
    // 首行缩进宽度1个单位为1个空格
    tabWidth: 4,
    // 默认用tab而不是用spaces缩进,用了这个后上面的tabWidth就不管用了
    useTabs: false,
    // 使用分号
    semi: true,
    // 是否使用单引号
    singleQuote: true,
    // 对象的属性key是否使用引号
    // as-needed 在有特殊字符的时候用
    // consistent 有一个用上了就全部用
    // preserve 尊重用户选择
    quoteProps: 'as-needed',
    // jsx中用单引号
    // 也就是jsx中html属性的值用单引号还是双引号
    jsxSingleQuote: false,
    // 对象或数组等的最后一个属性后边是否尾随逗号
    // none 不尾随
    // es5 只在对象数组的最后一个属性后边配逗号
    // all 所有可以配逗号的后面配逗号，比如函数传参
    trailingComma: 'es5',
    // 大括号加空格
    // 比如{a: 1}会改成{ a: 1 }
    bracketSpacing: true,
    // jsx “>” 的html标签是否在同一行
    // true的话
    // <button
    //  onClick={this.handleClick}>
    // </button>
    // =============================
    // false的话
    // <button
    //  onClick={this.handleClick}
    // >
    // </button>
    jsxBracketSameLine: false,
    // 箭头函数单个参数的情况下是否加括号
    // avoid 不加
    // always 加
    arrowParens: 'always',
    // 只格式化顶部内容做了相应标记的文件。比如下面这个注释就是标记
    /**
     * @prettier
     */
    requirePragma: false,
    // 对html标签内的空白是否进行格式化
    // 类似 1<b> 2 </b>3这种如果设置为 'ignore' 就会变成
    // 1<b>2</b>3
    // css选项为默认的，适配地不错，就算东也不会改什么，但是如果真的不想perttier动它，
    // 那就设置为 "strict"
    htmlWhitespaceSensitivity: 'css',
    // vue文件下script style等标签下最外层代码缩进策略
    // false 表示默认缩进
    vueIndentScriptAndStyle: false,
    // auto表示自动设置
    // "lf"–仅\n换行（），在Linux和macOS以及git repos内部通用
    // "crlf"-回车符+换行符（\r\n），在Windows上很常见
    // "cr"-仅回车符（\r），很少使用
    // 这个选项是为了防止不同操作系统下最后一行空行的错乱，但公司都用mac所以没事可以设置成"lf"
    endOfLine: 'auto'
}