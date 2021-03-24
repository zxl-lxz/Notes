发布订阅

```js
class Publisher {
    constructor() {
        this.subMap = {};
    }

    // 订阅
    $on(type, cb) {
        if (this.subMap[type]) {
            if (!this.subMap[type].includes(cb)) {
                this.subMap[type].push(cb);
            }
        } else {
            this.submap[type] = [cb];
        }
    }

    // 发布
    $emit(type, ...args) {
        if (this.subMap[type]) {
            this.subMap[type].forEach((cb) => cb(...args));
        }
    }

    // 取消订阅
    $off(type, cb) {
        if (this.subMap[type]) {
            if (cb) {
                if (this.subMap[type].includes(cb)) {
                    const _index = this.subMap[type].findIndex((item) => item === cb);
                    this.subMap[type].splice(_index, 1);
                }
            } else {
                this.subMap[type] = null;
            }
        }
    }
}
```
