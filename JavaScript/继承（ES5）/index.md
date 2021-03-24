# 继承（ES5）

## 1. 原型链继承

```js
//第一个构造函数
//实例属性
function SuperType() {
    this.property = true;
}
//原型方法
SuperType.prototype.getSuperValue = function () {
    return this.property;
};
//第二个构造函数
//实例属性
function SubType() {
    this.subproperty = false;
}
//继承，将第一个构造函数的实例赋值给第二个构造函数的原型
SubType.prototype = new SuperType();
//原型方法
SubType.prototype.getSubValue = function () {
    return this.subproperty;
};
//创建第二个构造函数的实例
var instance = new SubType();
console.log(instance.getSuperValue); //true
```

通过让原型对象等于另一个类型的实例，实现原型链。实例指向原型对象，原型对象指向构造函数。所以原本存在于 `SuperType` 实例中的所有属性和方法现在都存在于 `SubType` 中。

**原型链继承须知：**

1. SubType 的原型对象中储存着 SuperType 的实例属性 property;

2. instance.constructor 现在指向 SuperType

3. 别忘记了默认的原型对象 Object.所有函数的默认原型都是它的实例。

4. 给子类型的原型添加方法或者修改超类型的方法的代码一定要在继承之后。如果是修改超类型的方法。那么子类型的实例调用该方法是调用的是修改后的方法。而超类型的实例调用该方法是还是调用原来的那个方法。

5. 给子类型添加方法不能用对象字面量的方式。否则子类型的原型对象指向的是一个新的 Object 实例。跟超类型无关了。

**⚠️ 原型链的问题：**

1.. 还是引用类型的问题。通过原型链，超类型的实例方法都储存在了子类型的原型对象中。在我的 JS 最全创建对象方式一文中总结到，原型模式的问题在于在实例中修改引用类型的值，会在另一个实例中反映。

2.. 在创建子类型的实例时，不能向超类型的构造函数传递方法。

鉴于以上的问题，单独的原型链继承很少使用。

## 2. 借用构造函数实现继承

### 解决引用类型值的问题

```js
//解决引用类型问题
function SuperType() {
    this.colors = ['red', 'blue', 'green'];
}
//借用构造函数实现继承
function SubType() {
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push('orange');
console.log(instance1.colors); //"red,blue,green,orange"
var instance2 = new SubType();
console.log(instance2.colors); //"red,blue,green"
```

### 解决无法传递参数的问题

```js
function SuperType(name) {
    this.name = name;
}
function SubType(name) {
    SuperType.call(this, name);
    this.age = 21;
}
var instance = new SubType('Blue Beginner');
console.log(instance.name); //"Blue Beginner"
console.log(instance.age); //21
```

**构造函数继承问题：**

以上例子中没有定义方法，如果将方法也定义在构造函数中，那么就会出现我在 `JS最全创建对象方式` 中总结到的问题，不同实例的同名函数不相等。函数复用无从谈起。而且，如果仅仅这样继承的话，在超类型原型中定义的方法，对子类型也是不可见的。考虑到这些问题，这种模式继承也很少单独使用。

## 3. 组合继承

将原型链继承和借用构造函数继承的技术组合到一起。

```js
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
    console.log(this.age);
};
var instance1 = new SubType('Blue Beginner', 21);
instance1.colors.push('orange');
console.log(instance1.colors); //"red,blue,green,orange"
instance1.sayName(); //"Blue Beginner"
instance1.sayAge(); //21
var instance2 = new SubType('DJL', 23);
console.log(instance2.colors); //"red,blue,green"
instance2.sayName(); //"DJL"
instance2.sayAge(); //23
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点。是 JS 中最常用的继承模式。

## 4. 原型式继承

跟原型链继承完全不同，但名字很像，不要混淆。

基本原理：

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

先在函数内部创建一个临时性的构造函数。然后将传入的对象作为这个构造函数的原型。最后返回这个临时类型的实例。从本质上来讲，就是对传入的对象进行了一次浅克隆。例子：

```js
var person = {
    name: 'Blue Beginner',
    friends: ['DJL', 'XZQ', 'HB'],
};
var anotherPerson = object(person);
anotherPerson.name = 'Jhon'; //修改基本类型
anotherPerson.friends.push('JWQ'); //修改引用类型
console.log(person.friends); //"DJL,XQZ,HB,JWQ"
```

ES5 新增 `Object.create()` 方法规范化了原型式继承。这个方法接收两个参数。第一个参数是作为新对象原型的对象。第二个参数是为新对象定义额外属性的对象。当只有一个参数的情况下，`Object.create()` 与 `object()` 的作用一样。

```js
var person = {
    name: 'Blue Beginner',
    friends: ['DJL', 'XZQ', 'HB'],
};
var anotherPerson = Object.create(person);
anotherPerson.name = 'Jhon';
anotherPerson.friends.push('JWQ');
console.log(person.friends); //"DJL,XQZ,HB,JWQ"
```

`Object.create()` 的第二个参数：

```js
var anotherPerson = Object.create(person, {
    name: {
        value: 'Jhon',
    },
});
console.log(anotherPerson.name); //"Jhon"
```

在没有必要兴师动众的创建构造函数，而只想让一个对象与另一个对象类型保持相似的情况下，这种模式继承完全可以胜任。不过，就如上面所展示的一样，引用类型的值的属性始终共享。就像使用原型链继承一样。

## 5. 寄生式继承

寄生式继承是与原型式继承紧密相关的一种思路。它与创建对象方法里的寄生构造函数模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，然后再像真的是它做了所有工作一样返回对象。

```js
function createAnother(original) {
    var clone = object(original); //通过调用函数创建新对象
    clone.sayHi = function () {
        console.log('hi');
    };
    return clone;
}
```

看代码，就应该能懂。不多介绍。在主要考虑的是对象而不是自定义类型的情况下，这种模式是一种有用的模式。其实这个 `object()` 函数不是必需的，任何能够返回新对象的函数都适用于此模式。这个模式的问题依然是：引用类型的值会共享，函数的复用无从谈起。

## 6. 寄生组合式继承(ES6 的 extends 采用的方式)

前面说过，组合继承是 `JS` 最常用的继承方式。

回过头看下构造函数和原型模式组合的继承方式，会发现，这种模式有一种美中不足的地方：两次调用了超类型的函数。

一次是在子类型构造函数内部。这是为了继承超类型的构造函数里定义的属性。防止引用类型值的问题。

第二次是在为子类型原型对象赋值的时候。这个时候将超类型的实例赋值给了子类型的原型对象。这个时候，原型对象里面也拥有超类型构造函数里的属性。只不过，在子类型的对象读取这些属性的时候，由于其对象本身就有这些属性，会优先读取本身的属性，不会寻找到原型对象上来。

寄生组合模式就是优化了这一点，其实在为子类型原型赋值的时候，我们只需要超类型的原型上的属性。

```js
function inheritPrototype(subType, SuperType) {
    var prototype = Object(superType.prototype); //创建对象
    prototype.constructor = subType; //增强对象
    subType.prototype = prototype; //指定对象
}
```

第一步，创建超类型原型的一个副本

第二步，为创建的副本添加 `constructor` 属性，弥补因重写原型而失去的 `constructor` 属性。

第三步，将新创建的对象（即副本）赋值给子类型的原型

这样，我们就可以用这个方法去替换前面为子类型原型赋值的语句了。

```js
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
    console.log(this.age);
};
```

这种模式的高效率体现在它只调用了一次超类型的构造函数。与此同时，原型链还能保持不变。解决了引用类型值的问题，解决了函数复用的问题。因此，还能够正常使用 `instanceof` 和 `isPrototypeOf()` .这种方式是继承引用类型最理想的方式。
