## 基础

```ts
let a: boolean = true;

let b: number = 1;

let c: string = 'c';

const sym: symbol = Symbol();

let u: undefined;
let n: null;

const list: number[] = [1, 2, 3];

type T = [number, string];
const tuple: T = [1, '1'];

enum Index {
    First,
    Second,
    Third,
}
const myIndex = Index.First;

// 异构枚举
enum Enum {
    A,
    B,
    C = 'C',
    D = 'D',
    E = 8,
    F,
}

let any: any = 6;
any = '6';

let un: unknown;
un = 9;

// void
function foo(): void {
    // ...
}

// object Object {}
let myObj: {};
// let myObj: object;
// let myObj: Object;
myObj = { name: 'John' };
// myObj = [1, 2, 3];
// myObj = function() {};
// myObj = { name: 'John' };
// console.log(myObj.name);

// never
type Filter<T, U> = T extends U ? never : T;

// 类型断言
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;

// 非空断言
function myFunc(maybeString: string | undefined | null) {
    const ignoreUndefinedAndNull: string = maybeString!;
}

// 确定赋值断言
// let x: number;
// initialize();
// // Variable 'x' is used before being assigned.(2454)
// console.log(2 * x); // Error
// function initialize() {
//   x = 10;
// }
let x!: number;
initialize();
console.log(2 * x); // Ok
function initialize() {
    x = 10;
}

// 类型守卫 - in 关键字
interface AAA {
    name: string;
    account: string;
}

interface BBB {
    password: string;
}

function bar(args: AAA | BBB) {
    if ('name' in args) {
        // ...
    }
}

// 类型守卫 - typeof 关键字
function car(args: string | number) {
    if (typeof args === 'number') {
        // ...
    }
}

// 类型守卫 - instanceof 同js

// 类型守卫 - 类型谓词
function isNumber(x: any): x is number {
    return typeof x === 'number';
}
function processValue(x: any) {
    if (isNumber(x)) {
        // 这里因为前面的类型谓词，TypeScript 知道 x 此时是 number 类型
        // 所以下面访问数值相关的属性和方法等都是合法的，不会报错
        console.log(x.toFixed(2));
    } else {
        console.log('不是数值类型');
    }
}

// 重载
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: string, b: number): string;
    add(a: number, b: string): string;
    add(a: Combinable, b: Combinable) {
        if (typeof a === 'string' || typeof b === 'string') {
            return a.toString() + b.toString();
        }
        return a + b;
    }
}
const calculator = new Calculator();
const result = calculator.add('Semlinker', ' Kakuqo');

// interface
interface Person {
    name: string;
    age?: number;
    sayName(): void;
    [propName: string]: any;
}
interface Point {
    x: number;
}
interface Point {
    y: number;
}
const point: Point = { x: 1, y: 2 }; // 自动合并

// Class
class Greeter {
    // 静态属性
    static cname: string;

    // 成员属性
    greeting: string;

    private _fullName: string;

    // 构造函数
    constructor(message: string) {
        this.greeting = message;
    }

    // 静态方法
    static getClassName() {
        return 'Class name is Greeter';
    }

    get FullName(): string {
        return this._fullName;
    }

    set FullName(newName: string) {
        this._fullName = newName;
    }

    // 成员方法
    greet() {
        return 'Hello,' + this.greeting;
    }
}

// Class 继承 - extends
class Animal {
    name: string;

    constructor(theName: string) {
        this.name = theName;
    }

    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) {
        super(name); // 调用父类的构造函数
    }

    move(distanceInMeters = 5) {
        console.log('Slithering...');
        super.move(distanceInMeters);
    }
}

let sam = new Snake('Sammy the Python');
sam.move();

// Class 实现 - implements
interface Point {
    x: number;
    y: number;
}

class SomePoint implements Point {
    x = 1;
    y = 2;
}

// 抽象类
abstract class Person {
    constructor(public name: string) {}

    // 抽象方法
    abstract say(words: string): void;
}
// 实现这个抽象类
class Developer extends Person {
    constructor(name: string) {
        super(name);
    }

    say(words: string): void {
        console.log(`${this.name} says ${words}`);
    }
}
const lolo = new Developer('lolo');
lolo.say('I love ts!'); // lolo says I love ts!

//
```
