/**
 * 使用 Object.create 创建一个新对象，并将传入的构造函数的prototype 作为参数传入让其成为新对象的原型
 * 让this指向这个对象，再执行构造函数里面的代码
 * 最后返回这个对象（如果构造函数的返回值是一个对象，那么就返回这个返回值，否则就返回之前的对象）
*/

function _new(fn, ...args) {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, args);
    return ret instanceof Object ? ret : obj;
}

function Person(name) {
    this.name = name;
}

Person.prototype.sayName = function () {
    console.log(this.name);
}

const person = _new(Person, 'zl');

person.sayName();
