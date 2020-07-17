# 原型链（JS最全创建对象方式汇总）

## 1.最简单的方式--创建一个Object实例

```js
var person = new Object();     //创建实例
person.name = "BlueBeginner";  //给实例添加属性
person.age = 21;               //添加属性
person.sayName = function(){   //添加方法
    alert(this.name);
}
```

## 2.对象字面量

```javascript
var person = {
    name:'BlueBeginner',
    age:21,
    5:true,
    sayName:function(){
        alert(this.name);
    }
}
```

**以上均为创建单个对象的方法，如果只需要少数具有不同属性和方法的对象，以上方法简单方便，但是当我们需要很多具有相似属性和方法的对象时，使用以上方法显然不切实际，因为会产生大量的重复代码。以下方法，便是为创建一类对象而生。**

## 3.工厂模式

```js
function createPerson(name, age, job){
    var o = new Object();//显式创建对象
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        alert(this.name);
    }
    return o;//返回对象
}
var personone = createPerson("BlueBeginner",21,"web Engineer");
var persontwo = createPerson("DJL",23,"web Engineer");
```

函数根据接受的参数来创建对应的对象，可以无数次的调用此函数，每次都会返回一个包含3个属性1个方法的对象。

**工厂模式注意：**

- 需要用var显式地创建对象
- 有return语句，返回对象
- 工厂模式没有解决对象的识别问题,我的理解是不能确定对象由哪个函数创建，看以下代码


```js
alert(personone instanceof createPerson);//false
alert(personone instanceof Object);//true
```

## 4.构造函数模式

```js
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    }
}
var personone = new Person("BlueBeginner",21,"web Engineer");
var persontwo = new Person("DJL",23,"web Engineer");
```

**构造函数模式注意：**

- 没有显式地创造对象
- 直接将属性和方法赋值给了this对象
- 没有return语句
- 构造函数名首字母大写
- 使用new操作符创建实例
    - 创建一个新对象
    - 将构造函数的作用域赋给这个对象(因此this指向这个对象)
    - 执行构造函数中的代码
    - 返回新对象
- 之所以说构造函数解决了工厂模式不能识别对象类型的问题，看下面的代码

```js
alert(personone instanceof Object);//true
alert(personone instanceof Person);//true
```

**然而无论是工厂模式还是构造函数模式，都存在一个相同的问题，即--不同实例上的同名函数是不相等的，看以下代码：**

```js
alert(personone.sayName == persontwo.sayName);//false
```

**这样的话，以上的两种模式都创建了两个完成同样任务的Function实例，这样做完全没必要。而且，对于构造函数模式，因为有this对象在，根本不用在执行代码前就把函数方法绑定到特定对象上面，大可像下面代码所示，将方法写到构造函数外面：**

```js
function Person(name,age,job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
function sayName(){
    alert(this.name);
}
```

**这样的话，所有实例共享了在全局作用域中定义的函数方法。但是很显然的是，如果需要很多很多方法呢？以这种方法，岂不是需要定义很多很多全局函数？在全局中定义的函数，只能被某些对象调用，这让全局作用域有点名不副实。好在，这些问题，可以通过原型模式来解决。**

## 5.原型模式

```js
function Person(){};
Person.prototype.name = "BlueBeginner";
Person.prototype.age = 21;
Person.prototype.job = "web Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};
var personone = new Person();
var persontwo = new Person();
personone.sayName();//'BlueBeginner'
persontwo.sayName();//'BlueBeginner'
alert(personone.sayName == persontwo.sayName);//true
```

**原型模式注意：**

- 所有实例共享相同的属性和方法
- 对于方法和基本属性值，这样很合适，但是对于引用类型的值，却出现了问题。在实例中重写引用类型的值会修改原型中的同名属性。如下：

```js
function Person(){};
Person.prototype = {
    constructor:Person,
    name:'BlueBeginner',
    age:21,
    friends:['DJL','ZH'],
    sayName:function(){
        alert(this.name);
    }
}
var personone = new Person();
var persontwo = new Person();
personone.friends.push('YR');
alert(personone.friends);//'DJL','ZH','YR'
alert(persontwo.friends);//'DJL','ZH','YR'
alert(personone.friends == persontwo.friends);//true
```

在第一的实例personone中重写引用类型值后，第二个实例所得到的原型上的引用类型值也被修改了，这显然不尽人意。所以很少有人单独使用原型模式。

## 6.组合使用构造函数模式和原型模式

```js
function Person(name,age,job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ['DJL','ZH']
}
Person.prototype = {
    constructor:Person,
    sayName:function(){
        alert(this.name);
    }
}
var personone = new Person("BlueBeginner",21,"web Engineer");
var persontwo = new Person("DJL",23,"web Engineer");
personone.friends.push('YR');
alert(personone.friends);//'DJL','ZH','YR'
alert(persontwo.friends);//'DJL','ZH'
alert(personone.sayName === persontwo.sayName);//true
alert(personone.friends == persontwo.friends);//false
```

这种模式将构造函数和原型分开，在构造函数里面写属性，在原型里面写方法，可以说，这是用来定义引用类型的一种默认模式，当然，有同学看到独立的构造函数和原型时，会感到困惑，下面这个模式，便解决了这个问题。

## 7.动态原型模式

```js
function Person(name,age,job){
    this.name = name;
    this.age = age;
    this.job = job;
    if(typeof this.sayName != 'function'){
        Person.prototype.sayName=function(){
            alert(this.name);
        };
    };
}
```

这种模式方法确实非常完美，if判断代码只会在初次调用构造函数时才会执行，此后，原型已经初始化，不需要再做什么修改了。

## 8.寄生构造函数模式

```js
function SpecialArray () {
    var values = new Array()
    values.push.apply(values,arguments)
    values.toPipedString = function () {
        return this.join('|')
    }
    return values
}
var colors = new SpecialArray('red','blue','green')
console.log(colors.toPipedString()) //"red|blue|green"
console.log(colors instanceof SpecialArray) //false
```

这种模式就是工厂模式去封装创建对象的代码。不过我们习惯叫这个函数为构造函数。而且使用`new`操作符创建新对象。需要注意的点是：**返回的对象与构造函数或者构造函数的原型属性之间没有关系**。也就是说，构造函数返回的对象与在构造函数外部创建的对象没有什么不同。**因此，不能依赖`instanceof`操作符来确定对象类型**。由于这个问题，可以使用上面介绍的模式，就不要使用这种模式。

## 9.稳妥构造函数模式

```js
function Person (name,age,job) {
    var o = new Object()
    o.sayName = function () {
        console.log(name)
    }
    return o
}
```

这种模式，创建`稳妥对象`：没有公共属性，而且其方法也不引用`this`的对象。除了使用`sayName`方法以外，没有任何其他办法访问`name`的值。常用于一些安全执行环境。