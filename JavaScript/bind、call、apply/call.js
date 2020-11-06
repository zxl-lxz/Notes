// call

// 用指定的this值去执行函数。第一个参数后的参数以逗号分隔。
let foo = function (x) {
    this.x = x;
}
let obj = {};
foo.call(obj, 1);
console.log(obj.x); // 1

// 手写call

Function.prototype._call = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('not function');
    }
    context = context || window;
    context.fn = this;
    const args = [...arguments].slice(1);
    const result = context.fn(...args);
    delete context.fn;
    return result;
}