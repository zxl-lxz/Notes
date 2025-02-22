/**
 * 实现思路：
创建一个空的构造函数 F。

将构造函数 F 的原型设置为传入的 proto。

使用 new F() 创建一个新对象，这个对象的原型就是 proto。

如果传入了 propertiesObject，则使用 Object.defineProperties() 为新对象添加属性。
*/
const myObjectCreate = function (proto, propertiesObject) {
    if (typeof proto !== 'object' && proto !== null) return;
    function F() { };
    F.prototype = proto;
    const result = new F();

    if (propertiesObject) {
        Object.defineProperties(result, propertiesObject);
    }
    return result;
}