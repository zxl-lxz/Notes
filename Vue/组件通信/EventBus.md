# Event Bus

```js
/**
 * event长这样：
 * event: {
 *     eventa: [fna, fnb],
 *     eventb: [fnc, fnd],
 * }
 */
class EventBus {
    constructor() {
        this.event = Object.create(null);
    }

    /**
     * @event {string | Array<string>}
     * @fn {Function}
     */
    on(event, fn) {
        if (Array.isArray(event)) {
            event.forEach((item) => {
                this.on(item, fn);
            });
        } else {
            this.event[event] = this.event[event] || [];
            this.event[event].push(fn);
        }
    }

    /**
     * @event {string}
     */
    emit(event, ...args) {
        if (!this.event[event]) {
            console.error('The event was not monitored');
            return;
        }
        if (typeof this.event[event] === 'function') {
            this.event[event].apply(null, args);
            this.off(event);
        }
        if (Array.isArray(this.event[event])) {
            const cbs = [...this.event[event]];
            cbs.forEach((cb) => {
                cb.apply(null, args);
            });
        }
    }

    once(event, fn) {
        this.event[event] = fn;
    }

    /**
     * @event {string | Array<string>}
     * off() : 移除所有事件监听器
     * off(event) : 移除该事件的所有监听器
     * off(event, fn) : 移除这个回调的监听器
     * @fn {Function}
     */
    off(event, fn) {
        if (arguments.length === 0) {
            this.event = Object.create(null);
        } else if (arguments.length === 1) {
            if (Array.isArray(event)) {
                event.forEach((item) => {
                    this.event = { ...this.event, [item]: null };
                });
            } else {
                this.event = { ...this.event, [event]: null };
            }
        } else {
            const arr = [...this.event[event]];
            const index = arr.indexOf(fn);
            if (index !== -1) {
                arr.spice(index, 1);
                this.event = { ...this.event, [event]: arr };
            }
        }
    }
}

const bus = new EventBus();
const foo = (a, b) => a + b;

bus.on('touch', foo);

// 注意这里不能用touch,否则会覆盖on
bus.once('one', (a, b) => a * b);

bus.emit('touch', 1, 2);

bus.off('touch', foo);
```
