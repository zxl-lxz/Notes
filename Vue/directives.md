自定义组件，用于DOM上。比较合适的，比如打点。`v-log`  
**简单写下用法，不全。详情看vue官网**
- [x] 选项/资源：`derectives`
- [x] 钩子函数-`bind`:只调用一次，指令第一次绑定到元素时调用。
- [x] 钩子函数-`update`:组件所在的VNode更新时调用。
- [x] 钩子函数的参数
    - `el`:指令所绑定的元素，可以用来直接操作DOM
    - `binding`:一个对象，包含以下属性
        - `name`:指令名。如`log` 
        - `value`:绑定的值。也就是传入的值。如`v-log:click="1+1"`.值为2
        - `arg`:传给指令的的参数。如`click`

```html
<!--绑定为数据-->
<div v-log:click="blockName"></div>

<script>
// 可以在后面改变传入指令的值，触发update函数钩子。
export default {
    data() {
        return {
            blockName: '',
        }
    }
}
</script>
```
```js
// mixins/logMix.js
// 封装一下打点。只有block_name的时候，可以只传字符串。
const sendLog = (et, josn) => {
    if (typeof json !== 'object') {
        json = {
            block_name: json,
        };
    }
    statistics.sendLog({
        et,
        json,
    });
};
// 下面自定义指令v-log
export default {
    directives: {
        log: {
            bind(el, binding) {
                // arg为事件类型，value为值
                const {arg, value} = binding;
                if (arg === 'click') {
                    // 通过`dataset`在函数钩子之间共享。这样才能在值变化时，及时更新打点的值。
                    el.dataset.clickLog = value || '';
                    el.addEventListener('click', () => {
                        let log = el.dataset.clickLog;
                        if (log) {
                            sendLog('click', log);
                        }
                    })
                }
            },
            update(el, binding) {
                let {arg, value} = binding;
                value = value || '';
                // 判断值是否改变，如果改变了，将新值告诉`dataset`,从而改变log
                if (arg === 'click' && el.dataset.clickLog !== value) {
                    el.dataset.clickLog = value;
                }
            },
        },
    },
    // minxin,顺便支持几给方法。
    methods: {
        // 打点
        log(val, et = 'click') {
            sendLog(et, val);
        },
        // 首屏
        logFs() {
            statistics.firstScreen();
        },
    },
}
```