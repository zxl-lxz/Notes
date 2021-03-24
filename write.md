谈谈对原型链的理解

说到原型链，就不得不提到 JS 中创建对象的方式了。

最简单的，通过对象字面量，或者 new Object 的方式。但是当我们想创建一组拥有差不多的属性的对象时，这时候就需要批量生产。

最开始，工厂函数诞生了。

```js
function foo(name, name2) {
    const obj = {};
    obj.name = name;
    obj.name2 = name2;
    obj.sayname = () => {
        console.log(obj.name1);
    };
    return obj;
}

foo('z', 'a');
```

工厂函数确实解决了批量创建函数的问题，但是其没有为所创建的对象赋予一个是谁创建的标识。也就是没有往创建的 对象的原型链上添加是谁创建的。其创建的 所有对象，仍然直接是 Object 的实例。也就是没有解决对象的识别问题。

接着，构造函数解决了工厂模式的问题。

```js
function Person(name) {
    this.name = name;
    this.sayName = () => {
        console.log(this.name);
    };
}

const person1 = new Person('zl');
```

构造函数与工厂模式不同的是，其在函数内部使用了 this 对象，并且在创建对象的时候，使用的是 new 操作符。

new 操作符所做的操作就是，创建一个对象，将构造函数的作用域指向这个对象，this 也指向这个对象。执行构造函数里的语句。返回这个对象。

构造函数会在对象的原型链上新增该构造函数。也就解决了对象的识别问题。

然而，无论是工厂模式还是构造函数模式，都有一个问题，那就是不同的实例上，其拥有的同名的方法是不相等的。

每次执行工厂模式的函数或者构造函数里的语句时，都是创建了一个新函数。所以任意两各实例上的同名函数都不是同一个函数。这导致了内存的浪费。而且对于构造函数来说，由于有 this 的存在，便可以将函数在全局中定义好。这样也可以让所有实例的这个函数指向同一个函数。但是如果有很多函数的话，这样会导致全局作用域拥挤，全局作用域也名不副实了。

所以为了决绝这个问题，便有了原型模式

纯粹的原型模式

```js
function Person() {}

Person.prototype.name = ['zl'];
Person.prototype.sayName = () => {
    console.log(this.name);
};
```

纯粹的原型模式，直接往构造函数的原型上添加属性和方法。这样其创建的对象也会继承这些属性和方法。但是其问题便是，引用类型的值，都指向同一个堆。而且不能传递参数。

所以最常用的模式是 组合使用构造函数模式和原型模式。

构造函数里创建为对象添加属性，原型中为对象添加方法。

```js
function Person(name) {
    this.name = name;
}
Person.prototype.sayName = () => {
    console.log(name);
};
```

将其组合在一起

```js
function Person(name) {
    this.name = name;
    if (typeof this.sayName !== 'function') {
        Person.prototype.sayName = () => {
            console.log(this.name);
        };
    }
}
```

说完了以上，便也理解了 JS 中原型和原型链的大概意思。寻找一个对象的属性时，如果其本身没有，那么便会往上层原型寻找，直到寻找到所有对象的原型 Object。直到 null,也就是原型链的最顶端。

那么，具体怎么寻找，需要谈到两个属性 prototype 和 _proto_。

只有函数才有 protoytpe 属性。一般的 对象只有 _proto_ 属性。并且对象的 _proto_ 属性指向创建这个对象的构造函数的 prototype 属性。

比如我们访问一个创建自 B 构造函数的对象 A 的 toString 方法的时候，这个对象本身并没有这个方法，于是通过其 _proto_ 属性访问构造函数 B 的 prototype 属性，结构发现构造函数的原型上也灭有这个方法，于是有通过构造函数 B 的的 _proto_ 属性访问 Object.prototype 。

说完了创建对象和原型和原型链。就需要说一下 JS 的继承了。

首先是原型链继承。

```js
function Super(name) {
    this.name = name;
}
Super.prototype.sayName = () => {};

function Me() {}
Me.prototype = new Super();
Me.prototype.constructor = Me;

Me.prototype.sayname = () => {};
```

将超类型的实例赋值给子类型的原型对象。

这样的问题依旧是继承而来的所有属性和方法都在原型对象上。一旦属性是引用类型值

构造函数继承，解决了引用类型值的问题。

```js
function Super(name) {
    this.name = name;
}

function Me(age) {
    Super.call(this, 'zl');
    this.age = age;
}
```

构造函数继承的问题就是继承的函数的问题。如果超类型将方法也放在构造函数里，那么创建的 子类型的对象，其方法都不想等。

组合使用构造函数模式和原型模式实现继承。

```js
function Super(name) {}
Super.prototype.sayName = () => {};

function Me(age) {
    Super.call(this, 'zl');
    this.age = age;
}

Me.prototype = new Super();
Me.prototype.constructor = Me;

Me.prototype.sayAge = () => {};
```

以上是按照基础的原型链和构造函数的思路，三种继承方式。

原型式继承：

Object 本身提供了一种方法，叫做 Object.create();该方法也是一种继承方式。它接受一个对象，作为创建的对象的原型。其原理就是手动创建一个构造函数，将传入的 对象当作这个构造函数的 原型。并返回构造函数的 实例对象。也被称做原型式继承。

```js
function foo(obj) {
    functioon Foo() {};
    Foo.prototype = obj;
    return new Foo();
}
```

不过这种继承方式，引用类型的值将会一致共享。（都在同一个原型对象上。）

最后说一种 ES6 采用的继承方式：寄生组合式继承

```js
function Super(name) {
    this.name = name;
}
Super.prototype.sayName = () => {};

function Me(age) {
    Super.call(this, 'zl');
    this.age = age;
}

let _prototype = Object(Super.prototype);
Me.prototype = _prototype;
Me.prototype.constructor = Me;

Me.prototype.sayAge = () => {};
```
