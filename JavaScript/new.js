function _new(fn, ...args) {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, args);
    return ret instanceof Object ? ret : obj;
}

function Person(name) {
    this.name = name;
}

Person.prototype.sayName = function() {
    console.log(this.name);
}

const person = _new(Person, 'zl');

person.sayName();
