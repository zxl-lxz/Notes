// call
// 用指定的this值去执行函数。第一个参数后的参数以逗号分隔。
let foo = function(x) {
    this.x = x;
}
let obj = {};
foo.call(obj, 1);
console.log(obj.x); // 1