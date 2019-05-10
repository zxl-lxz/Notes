const itArray = Array.prototype.toString;

itArray.call(new Object()); // "[object, Object]"

itArray.call(new String('aaa')); // "[object String]"
itArra.call('aaa'); // "[onject, String]"

itArray.call(Math); // "[object, Math]"

itArray.call(null); // "[onject, Null]"

itArray.call(undefined); // "[object, Undefined]"

itArray.call(new Number(1)); // "[object, Number]"
itArray.call(1); // "[object, Number]"

itArray.call([1]); // "[object, Array]"
itArray.call(new Array(1, 2)); // "[object, Array]"


// instanceof:往上查找原型，找到了就返回true
function Person() {
    this.age = 21;
}
const person = new Person();

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true

const arr = [1];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true

// isArray
Array.isArray(arr); // true
