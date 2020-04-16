// bind
// 返回一个新函数。新函数的this将被指定为第一个参数。其余参数将用作参数供调用。

let foo = function(y, z) {
    return this.x + y + z;
}
let obj = {
    x: 1,
};
let bar = foo.bind(obj, 2);
bar(3); // 6

// 手写bind

Function.prototype._bind = function(thisArg, ...args) {
    // this就是调用bind的函数。
    let fun = this;
    let reFun = function(...value) {
        // 判断是否是new 操作符。如果是，那么this是返回的函数的实例
        let isNew = this instanceof reFun;
        let context = isNew ? this : thisArg;
        return fun.apply(context, args.concat(value));
    }
    reFun.prototype = fun.prototype;
    return reFun;
}
