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

// 点击平滑滚动
const scrollSmoothTo = (targetPosition) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback) => setTimeout(callback, 20);
    }
    // 当前文档滚动高度
    let scrollTop = window.documentElement.scrollTop || window.body.scrollTop;

    const step = () => {
        // 距离目标还差多少距离
        let distance = targetPosition - scrollTop;

        // 下一步要滚动到的高度
        scrollTop = scrollTop + (distance / 6);

        // 边界处理
        if (Math.abs(distance) < 1) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo(0, scrollTop);
            window.requestAnimationFrame(step);
        }
    };
    step();
}

// 函数柯里化

let judge;
const curry = function (fn) {
    return judge = (...args) => fn.length === args.length ? fn.call(this, ...args) : (...nextArg) => judge(...args, ...nextArg)
};

// 去除对象数组中，对象某个属性重复的项
const mergeList = (addList, list, attr) => {
    const newsetList = addList.filter((item) => {
        return list.every((citem) => citem[attr] !== item[attr]);
    });
    return [...list, ...newsetList]
}


