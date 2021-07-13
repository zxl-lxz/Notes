// instanceof

function instanceof (left, right) {
    const prototype = Object.getPrototypeOf(right);
    const currentPrototype = Object.getPrototypeOf(left);

    while (true) {
        if (!currentPrototype) return false;
        if (prototype === currentPrototype) return true;

        currentPrototype = Object.getPrototypeOf(currentPrototype);
    }
}

// new

function new (fn, ...args) {
    const obj = Object.create(fn.prototype);
    const result = fn.apply(obj, args);

    return result instanceof Object ? result : obj;
}

// promise

function Promise(excutor) {
    this.status = 'pending';
    this.value = null;
    this.resolveCbs = [];
    this.rejectCbs = [];

    function resolve(value) {
        if (this.status === 'pending') {
            this.status = 'resolved';
            this.value = value;
            while (this.resolveCbs.length) {
                this.resolveCbs.pop()(value)
            }
        }
    }

    function reject(error) {
        if (this.status === 'pending') {
            this.status = 'rejected';
            this.value = error;
            while (this.rejectCbs.length) {
                this.rejectCbs.pop()(error)
            }
        }
    }

    excutor(resolve, reject);
}

Promise.prototype.then = function (onResolve) {
    return new Promise((resolve, reject) => {
        try {
            const x = onResolve(this.value);
            if (x instanceof Promise) {
                x.then(resolve, reject);
            }
            resolve(x);
        } catch (error) {
            reject(error);
        }
    })
}

// promise.all

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new Error('need Array');
        }

        const length = promises.length;
        const current = 0;
        const result = [];

        for (let i = 0; i < length; i++) {
            Promise.resolve(promises[i]).then((value) => {
                current++;
                result[i] = value;
                if (current === length) {
                    return resolve(result);
                }
            }, (error) => {
                reject(error);
            })
        }
    })
}

// promise.race

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            promise.then(resolve, reject);
        }
    })
}

// 防抖

function debounce(fn, await, callOnStart) {
    let timer = null;

    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        if (callOnStart) {
            timer = setTimeout(() => {
                timer = null;
            }, await)
            if (!timer) {
                fn.apply(this, args);
            }
        } else {
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, await);
        }
    }
}

// 节流

function throttle(fn, await) {
    let timer = null;

    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, await);
        }
    }
}

function throttle2(fn, await) {
    let pre = 0;

    return function (...args) {
        let now = Date.now();
        if (now - pre > await) {
            fn.apply(this, args);
            pre = now;
        }
    }
}

// bind

Function.prototype.bind = function (thisArg, ...args) {
    const fn = this;

    const resultFn = function (...nextArgs) {
        const isNew = this instanceof resultFn;
        const context = isNew ? this : thisArg;
        fn.apply(context, [args, nextArgs]);
    }

    resultFn.prototype = fn.prototype;
    return resultFn;
}

// call

Function.prototype.call = function (ctx, ...args) {
    if (typeof this !== 'function') {
        throw new Error('...');
    }
    ctx = ctx || window;
    ctx.fn = this;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;

}

// apply

Function.prototype.apply = function (ctx, args) {
    if (typeof this !== 'function') {
        // ...
    }
    ctx = ctx || window;
    ctx.fn = this;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

// 柯里化

const currying = (fn, ...args) => fn.length > args.length ? currying.bind(null, fn, ...args) : fn(...args);

// ajax

function ajax(url) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;

        if (this.status === 200) {
            handle(this.response);
        } else {
            // ...
        }
    }

}

// deepclone

function deepClone(obj, cache) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    const hit = cache.find((item) => item.origin === obj);
    if (hit) {
        return hit.newObj;
    }

    const newObj = Array.isArray(obj) ? [] : {};
    cache.push({
        origin: obj,
        newObj,
    });

    for (let key in obj) {
        newObj[key] = deepClone(obj[key], cache);
    }
    return newObj;
}

// 数组的乱序输出
const arr = [];
for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}


// 数组扁平化

function flat(arr) {
    const result = [];

    for (let value of arr) {
        if (Array.isArray(value)) {
            result = result.concat(flat(value));
        } else {
            result.push(value);
        }
    }

    return result;
}

function flat2(arr) {
    return arr.reduce((pre, acc) => {
        return pre.concat(Array.isArray(acc) ? flat(acc) : acc);
    }, [])
}

// 数组去重

function quchong(arr) {
    const result = [];

    for (let value of arr) {
        if (result.includes(value)) return;
        result.push(value);
    }
}

function quchong(arr) {
    const result = [];
    const map = {};

    for (let value of arr) {
        if (!map[value]) {
            result.push(value);
            map[value] = 1;
        }
    }
    return result;
}

// 大数 和 小数  加减乘除

function add(a, b) {
    const len1 = a.toString().split('.')[1].length;
    const len2 = b.toString().split('.')[1].length;

    const maxLen = Math.max(len1, len2);

    const mutiple = Math.pow(10, maxLen);

    const result = (a * mutiple) + (b * mutiple);

    return result / mutiple;
}

function bigIntAdd(num1, num2) {
    num1 = num1.toString();
    num2 = num2.toString();

    const maxLen = Math.max(num1.length, num2.length);

    num1 = num1.padStart(maxLen, 0);
    num2 = num2.padStart(maxLen, 0);

    let jinwei = 0;
    let weiResult = 0;
    let result = '';

    for (let i = maxLen - 1; i >= 0; i--) {
        weiResult = flag + parseInt(num1[i]) + parseInt(num2[i]);
        result = (weiResult % 10) + result;
        jinwei = parseInt(weiResult / 10);
    }

    result = (jinwei === 1 ? '1' : '') + result;

    return result;
}

// js对象转换为树型结构

function jsonToTree(data) {
    const result = [];

    if (!Array.isArray(data)) {
        return data;
    }

    const map = {};
    data.forEach((item) => {
        map[item.id] = item;
    })

    data.forEach((item) => {
        const parent = map[item.pid];

        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    })

    return result;
}

// url params

function getUrlParams(url) {
    const params = {};
    url = url || window.location.search;

    url.replace(/([^?=&]+)=([^?=&]+)/g, (m, s1, s2) => {
        const key = decodeURIComponent(s1);
        const value = decodeURIComponent(s2);

        params[key] = value;
    })
    return params;
}

// 发布订阅

class EventBus {
    constructor() {
        this.subs = {};
    }

    on(type, cb) {
        if (this.subs[type]) {
            if (!this.subs[type].includes(cb)) {
                this.subs[type].push(cb);
            }
        } else {
            this.subs[type] = [cb];
        }
    }

    emit(type, ...args) {
        if (this.subs[type]) {
            this.subs[type].forEach((cb) => cb(...args));
        }
    }

    off(type, cb) {
        if (this.subs[type]) {
            if (cb && this.subs[type].includes(cb)) {
                const index = this.subs.findIndex((_cb) => _cb === cb);
                this.subs[type].splice(index, 1);
            } else {
                this.subs[type] = null;
            }
        }
    }
}

// promise封装jsonp跨域

function jsonPAjax(params) {
    function handle(data) {

    }
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${params.url}?${handle(params.data)}&callback=jsonpCb`;
        document.body.appendChild(script);

        window.jsonpCb = (res) => {
            document.body.removeChild(script);
            delete window.jsonpCb;
            resolve(res);
        }
    })
}

jsonPAjax({
    url: '',
    data: {},
}).then((res) => {

})

// 中间件模式

class App {
    handlers = [];
    currentIndex = 0;

    next = () => {
        if (this.currentIndex < this.handlers.length) {
            this.handlers[this.currentIndex++](this.next);
        }
    }

    use(cb) {
        this.handlers.push(cb);
    }

    run() {
        this.next();
    }
}

// setTimeout 实现 setInterval

function setInterval(fn, delay) {
    let timer = setTimeout(function () {
        fn();
        timer = setTimeout(arguments.callee, delay);
    }, delay);

    return timer;
}