## TS 内置的高级类型

```ts
// Parameters 用于提取函数类型的参数类型
type A = Parameters<(name: string, age: number) => any>; // type A = [name: string, age: number]

// ReturnType 用于提取函数类型的返回值类型
type B = ReturnType<() => number>; // type B = number

// ConstructorParameters 用于提取构造器参数的类型
interface Person {
    name: string;
}

interface Person {
    sayName: () => void;
}
interface PersonConstructor {
    new (name: string): Person;
}
type C = ConstructorParameters<PersonConstructor>; // type C = [name: string]

// InstanceType 提取构造器返回值的类型
type D = InstanceType<PersonConstructor>; // Person

// ThisParameterType 提取this的类型
function hello(this: Person) {
    console.log(this.name);
}
type E = ThisParameterType<typeof hello>;

// OmitThisParameter 过去掉函数参数的 this, 返回新的函数类型
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T;

// Partial 把索引类型的属性变为可选
interface Dog {
    name: string;
    type: string;
}
type F = Partial<Dog>;
/**
 * type F = {
 *  name?: string | undefined;
 *  type?: string | undefined;
 * }
 */

// Required 同上，将索引类型的属性变为 required
type G = Required<Dog>;

// 同样的，还有 Readonly
type H = Readonly<Dog>;

// Pick 过滤出想要的属性，组成一个新的索引类型
type I = Pick<Dog, 'name' | 'type'>;

// Record 用于创建索引类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
// 这里很巧妙的用到了 keyof any，它的结果是 string | number | symbol：
type J = Record<'name' | 'age', string>;

// Exclude 从一个联合类型中去掉一部分类型
type Exclude<T, U> = T extends U ? never : T;
type K = Exclude<'a' | 'b' | 'c', 'a'>;

// Extract 与Exclude 相反
type Extract<T, U> = T extends U ? T : never;

// Omit Pick 可以取出索引类型的一部分索引构造成新的索引类型，那反过来就是去掉这部分索引构造成新的索引类型。
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Awaited
type Awaited<T> = T extends null | undefined
    ? T
    : T extends object & { then(onfulfilled: infer F): any }
    ? F extends (value: infer V, ...args: any) => any
        ? Awaited<V>
        : never
    : T;
type K = Awaited<Promise<Promise<Promise<number>>>>; // number

// NonNullable
type NonNullable<T> = T extends null | undefined ? never : T;

// Uppercase、Lowercase、Capitalize、Uncapitalize
// 这四个类型是分别实现大写、小写、首字母大写、去掉首字母大写的。
```
