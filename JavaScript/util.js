// 将一个字符串中的大小写转换
const convertCase = (str) => {
    return str.replace(/([a-z]*)([A-Z]*)/g, (m, s1, s2) => {
        return `${s1.toUpperCase()}${s2.toLowerCase()}`
    });
};

console.log(convertCase('abcABC')); // ABCabc

// 获取URL的参数
const parse = (url) => {
    let params = {};
    if (!url) {
        url = window.location.search;
    }
    url.replace(/([^&=?]+)=([^&=?]+)/g, (m, s1, s2) => {
        let key = decodeURIComponent(s1);
        let value = decodeURIComponent(s2);
        params[key] = value;
    });
};

// 数组去重（支持多维）
let result = [];

const deduplication = (arr) => {
    arr.forEach((item) => {
        if (Array.isArray(item)) {
            deduplication(item);
        } else {
            result.push(item);
        }
    });
    return [...new Set(result)];
};

// 手写new
// 创建一个新对象
// 新对象继承构造函数原型上的方法
// 将this指向新对象，以便继承属性。完成初始化。
// 如果返回结果为对象且有值，则返回这个对象，否则，返回新对象。
const _new = (Fn, ...arg) => {
    // 继承方法
    const obj = Object.create(Fn.prototype);
    // 继承属性
    const result = Fn.apply(obj, arg);
    return typeof result === 'object' ? result : obj;
}


let fun = (obj1, obj2) => {
    let restlt = {};
    for (let k in obj1) {
        if (typeof obj1[k] === 'string' || Object.prototype.toString.call(obj1[k]).slice(8, -1) === 'Object') {
            result[k] = obj2[k];
        }
        if (obj1[k] instanceof Array) {
            result[k] = [...new Set(obj1[k].concat(obj2[k]))];
        }
        if (typeof obj1[k] === 'boolean') {
            result[k] = obj1[k];
        }
    }
    return result;
}
