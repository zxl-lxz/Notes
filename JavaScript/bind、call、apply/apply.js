// apply
// 指定this的值去执行函数。第二个参数是一个数组。

let foo = function (x, y) {
    this.x = x;
    this.y = y;
}

let obj = {};

foo.apply(obj, [1, 2]);

console.log(obj); // {x: 1, y: 2}

// 手写apply

Function.prototype._apply = function (context) {
    if (typeof this !== 'function') {
        throw new TypeError('not function');
    }
    context = context || window;
    context.fn = this;
    let args = [...arguments][1];
    let result = context.fn(...args);
    delete context.fn;
    return result;
}