# Web 性能之数据、监控、指标

注：本文部分参考

1. 【字节前端】 [Web Performance Metrics 与 Core Web Vitals 简介 —— 现代前端性能各个指标的具体含义和设计理念](https://juejin.cn/post/6883444297614983175#heading-19)
2. 【MDN】[Performance](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)

本文结合自己的学习和理解，总结了小部分。很多东西都没有说全。权当学习文章。不可以此去做实践。

## 数据

`window.performance` 可以获取到与页面性能相关的信息。其属性和方法如下：

```js
// 属性
// 以下是真实数据
// 导航相关。PerformanceNavigation类型
navigation: {
    // 0: 当前页面是通过点击链接，书签和表单提交，或者脚本操作，或者在url中直接输入地址
    // 1: 点击刷新页面按钮或者通过Location.reload()方法显示的页面
    // 2: 页面通过历史记录和前进后退访问时
    // 255: 其他的任何方式
    type: 1,
    // 表示在到达这个页面之前重定向了多少次。
    redirectCount: 0,
},
// 内存相关。MemoryInfo类型。此属性是非标准属性。只在Chrome下有效。不应该在生产环境使用。
memory: {
    // 上下文内可用堆的最大体积，以字节计算。
    jsHeapSizeLimit: 4294705152
    // 已分配的堆体积，以字节计算。
    totalJSHeapSize: 651152055
    // 当前 JS 堆活跃段（segment）的体积，以字节计算。
    usedJSHeapSize: 613122587
},
// 性能测量开始时间点（高精度时间戳）
timeOrigin: 1618392583547.822,
// 延迟相关的性能信息。PerformanceTiming类型
timing: {
    // 从同一个浏览器上下文的上一个文档卸载(unload)结束时的UNIX时间戳。如果没有上一个文档，这个值会和PerformanceTiming.fetchStart相同。
    navigationStart: 1618392583547,
    // unload事件抛出时的UNIX时间戳。如果没有上一个文档，或者前一个文档或其中一个需要的重定向不属于同一来源 这个值会返回0.
    unloadEventStart: 1618392583584,
    // unload事件处理完成时的UNIX时间戳,如果没有上一个文档，或者前一个文档或其中一个需要的重定向不属于同一来源 这个值会返回0.
    unloadEventEnd: 1618392583584,
    // 第一个HTTP重定向开始时的UNIX时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
    redirectStart: 0,
    // 最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的UNIX时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
    redirectEnd: 0,
    // 浏览器准备好使用HTTP请求来获取(fetch)文档的UNIX时间戳。这个时间点会在检查任何应用缓存之前。
    fetchStart: 1618392583551,
    // 域名查询开始的UNIX时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 PerformanceTiming.fetchStart一致。
    domainLookupStart: 1618392583551,
    // 域名查询结束的UNIX时间戳。如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 PerformanceTiming.fetchStart一致。
    domainLookupEnd: 1618392583551,
    // HTTP请求开始向服务器发送时的Unix毫秒时间戳。如果使用持久连接（persistent connection），则返回值等同于fetchStart属性的值。
    connectStart: 1618392583551,
    // 浏览器与服务器之间的连接建立时的Unix毫秒时间戳。如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。
    connectEnd: 1618392583551,
    // 浏览器与服务器开始安全链接的握手时的Unix毫秒时间戳。如果当前网页不要求安全连接，则返回0。
    secureConnectionStart: 0,
    // 浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的Unix毫秒时间戳。
    requestStart: 1618392583574,
    // 浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳。如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间。
    responseStart: 1618392583578,
    // 浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳。
    responseEnd: 1618392583580,
    // 当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的 readystatechange (en-US)事件触发时）的Unix毫秒时间戳。
    domLoading: 1618392583618,
    // 当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange (en-US)事件触发时）的Unix毫秒时间戳。
    domInteractive: 1618392588369,
    // 当解析器发送DOMContentLoaded (en-US) 事件，即所有需要被执行的脚本已经被解析时的Unix毫秒时间戳。
    domContentLoadedEventStart: 1618392588369,
    // 当所有需要立即执行的脚本已经被执行（不论执行顺序）时的Unix毫秒时间戳。
    domContentLoadedEventEnd: 1618392588374,
    // 当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange (en-US) 被触发时的Unix毫秒时间戳。
    domComplete: 1618392606809,
    // 该文档下，load (en-US)事件被发送时的Unix毫秒时间戳。如果这个事件还未被发送，它的值将会是0。
    loadEventStart: 1618392606809,
    // 当load (en-US)事件结束，即加载事件完成时的Unix毫秒时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0.
    loadEventEnd: 1618392606809

},
```

可以看到，`timing` 属性包含了从 `上个文档卸载` 到 `当前文档加载完成` 的所有节点的时间。通过简单的运算，我们可以拿到我们想要的性能数据。比如：

```js
// 以下是本页面本身的加载（不包含外部资源）
let positiveDiff = (para1, para2) => {
    let diff = para1 - para2;
    return diff % 1 !== 0 ? diff.toFixed(3) : diff;
};
// dns查询时间：
positiveDiff(timing.domainLookupEnd, timing.domainLookupStart);

// tcp三次握手耗时
positiveDiff(timing.connectEnd, timing.connectStart);

// 请求文档耗时
positiveDiff(timing.responseStart, timing.requestStart);

// 接收文档耗时
// iOS平台responseEnd值可能会异常大
let responseEnd = timing.responseEnd > timing.domLoading ? timing.domLoading : timing.responseEnd;
positiveDiff(responseEnd, timing.responseStart);

// 开始解析dom至dom树解析完成
positiveDiff(timing.domInteractive, timing.domLoading);

// defer的js下载执行完成
positiveDiff(timing.domContentLoadedEventStart, timing.domInteractive);

// HTML和所有资源（比如图片）都加载完成
positiveDiff(timing.domComplete, timing.domContentLoadedEventEnd);

// Load事件耗时
positiveDiff(timing.loadEventEnd, timing.loadEventStart);
```

再来看下原型上的方法。

`performance.getEntries()`: 此方法返回所有资源的性能属性（包括页面本身和外部资源）。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/a4b55831-83ba-4aa8-bd66-65231e03ef8d1618465848766WX202104151347332x.png)

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/10e12a13-1701-49ca-95db-36bdf91a575e1618465848730WX202104151350182x.png)

`performance.getEntriesByName(name)`: 名称过滤（name）。我们上面的`timing`对象，其实就是此函数参数传入当前页面`URI`获取到的对象的部分属性。

`performance.getEntriesByType(type)`: 类型过滤（entry type）

`performance.mark(name)`: 在该函数执行时，往上述对象中添加一个属性和值。属性名为传入的参数，值为该函数执行的时间。

`performance.clearMarks(name)`: 从浏览器的性能输入缓冲区中移除该属性。

`performance.measure(name, startMark, endMark)`

用一个例子来说明：

```js
// 以一个标志开始。
performance.mark('mySetTimeout-start');

// 等待一些时间。
setTimeout(function () {
    // 标志时间的结束。
    performance.mark('mySetTimeout-end');

    // 测量两个不同的标志。
    performance.measure('mySetTimeout', 'mySetTimeout-start', 'mySetTimeout-end');

    // 获取所有的测量输出。
    // 在这个例子中只有一个。
    var measures = performance.getEntriesByName('mySetTimeout');
    var measure = measures[0];
    console.log('setTimeout milliseconds:', measure.duration);

    // 清除存储的标志位
    performance.clearMarks();
    performance.clearMeasures();
}, 1000);
```

`performance.clearResourceTimings()`: 从浏览器的性能数据缓冲区中移除所有 `entryType` 是 `"resource"` 的 `performance entries`。

`performance.now()`: 返回一个表示从性能测量时刻开始经过的毫秒数。

`performance.toJSON()`: 返回 Performance 对象的 JSON 对象。

## 监控

通过上面的各种 `API` 我们可以拿到页面上所有资源的性能数据了。下面看下如何使用这些数据为我们的页面做性能监控。（首屏打点上报）。

首先我们需要在每个页面映入性能监控库。

```js
import performance from 'performance';
performance();
```

我们需要在页面 `load` 的时候，将从 `navigationStart` 到 `loadEventEnd` 的时间上报。但是我们不能直接用这两个值的差值。因为有可能任何一个值为 0 导致整个数据出现巨大偏差。我们需要将每一个小段的时间逐步相加。这样才能保证时间基本准确。

我们先需要做一些准备：

```js
// 计算两个时间点的时间差
let positiveDiff = (para1, para2) => {
    let diff = para1 - para2;
    return diff % 1 !== 0 ? diff.toFixed(3) : diff;
};

// 为times赋值
let reduceData = (value, obj, key) => {
    if (value) {
        obj[key] = value;
    }
};
/**
 * @gap_ns_dns  navigationStart与dns间隔
 * @dns         dns查询耗时
 * @gap_dns_tcp dns与tcp间隔
 * @tcp         tcp三次握手耗时
 * @gap_tcp_req tcp与req间隔
 * @req         请求文档耗时
 * @res         接收文档耗时
 * @gap_res_p   res与process间隔
 * @p1          开始解析dom至dom树解析完成(尚未加载内嵌资源)
 * @p2          defer的js下载执行完成
 * @p3          DOMContentLoaded事件耗时
 * @p4          HTML和所有资源（比如图片）都加载完成
 * @gap_p_load  domComplete后立刻触发load事件
 * @load        Load事件耗时
 */
let getPerformanceData = () => {
    if (!performance.timing) {
        return null;
    }

    let timing = performance.timing;

    // iOS平台responseEnd值可能会异常大
    let responseEnd = timing.responseEnd > timing.domLoading ? timing.domLoading : timing.responseEnd;

    let times = {};

    reduceData(positiveDiff(timing.domainLookupStart, timing.navigationStart), times, 'gap_ns_dns');
    reduceData(positiveDiff(timing.domainLookupEnd, timing.domainLookupStart), times, 'dns');
    reduceData(positiveDiff(timing.connectStart, timing.domainLookupEnd), times, 'gap_dns_tcp');
    reduceData(positiveDiff(timing.connectEnd, timing.connectStart), times, 'tcp');
    reduceData(positiveDiff(timing.requestStart, timing.connectEnd), times, 'gap_tcp_req');
    reduceData(positiveDiff(timing.responseStart, timing.requestStart), times, 'req');
    reduceData(positiveDiff(responseEnd, timing.responseStart), times, 'res');
    reduceData(positiveDiff(timing.domLoading, responseEnd), times, 'gap_res_p');
    reduceData(positiveDiff(timing.domInteractive, timing.domLoading), times, 'p1');
    reduceData(positiveDiff(timing.domContentLoadedEventStart, timing.domInteractive), times, 'p2');
    reduceData(positiveDiff(timing.domContentLoadedEventEnd, timing.domContentLoadedEventStart), times, 'p3');
    reduceData(positiveDiff(timing.domComplete, timing.domContentLoadedEventEnd), times, 'p4');
    reduceData(positiveDiff(timing.loadEventStart, timing.domComplete), times, 'gap_p_load');
    reduceData(positiveDiff(timing.loadEventEnd, timing.loadEventStart), times, 'load');

    return times;
};

// 逐步相加
let getThresholdData = (performanceData) => {
    if (!performanceData) {
        return Infinity;
    }

    // 最小过程性能数据key
    let perfKeys = [
        'gap_ns_dns',
        'dns',
        'gap_dns_tcp',
        'tcp',
        'gap_tcp_req',
        'req',
        'res',
        'gap_res_p',
        'p1',
        'p2',
        'p3',
        'p4',
        'gap_p_load',
        'load',
    ];
    // 页面加载完成时间
    let load2 = 0;

    for (let key in perfKeys) {
        let _value = performanceData[perfKeys[key]];
        if (typeof _value !== 'undefined') {
            load2 += _value;
        }
    }

    return load2;
};
```

有了上面的准备后，我们已经可以计算出整个时间了。

页面本身之外的引用资源也需要进行性能监控。

```js
const SLOW_SOURCE_MAX = 10 * 1000; // 性能值大于10秒作为慢资源处理
const NO_VALUE = -1; // 数据取不到的时候的默认值

const ERROR_MINUS = -21; // 异常--负数的默认值

/**
 * 处理异常size值(浏览器差异)
 * @param a Number
 * @return Number
 */
let abnormalSize = (arg) => {
    if (isNaN(arg)) {
        return NO_VALUE;
    }
    if (arg < 0) {
        return ERROR_MINUS;
    }
    return arg;
};

/**
 * 计算外部资源加载时间
 * @return value
 * @rstime           开始时间
 * @rredir           重定向耗时
 * @rredircache      缓存检查与重定向间隔
 * @rcache           缓存检查耗时
 * @rdns             DNS解析耗时
 * @rdnstcp          dns与tcp间隔
 * @rtcp             tcp开始建连至https开始连接耗时
 * @rssl             https连接开始至tcp完成建连耗时
 * @rtcpreq          tcp与req间隔
 * @rreq             请求文档耗时
 * @rres             接收文档耗时
 */
let getEntryTiming = (entry) => {
    let t = entry;
    let name = t.name;

    let redirectStart = t.redirectStart || t.startTime;
    let redirectEnd = t.redirectEnd || t.startTime;
    let responseStart = t.responseStart || t.fetchStart;
    let secureConnectionStart = t.secureConnectionStart || t.connectStart;
    // dnslookup阶段没有的情况下 domainLookupStart为0
    let domainLookupStart = t.domainLookupStart || t.fetchStart;

    try {
        // gap_cache_dns 无法计算 直接算进cache中
        let times = {};
        // 加载时间
        times.rduration = t.duration % 1 !== 0 ? t.duration.toFixed(3) : t.duration;

        reduceData(positiveDiff(t.startTime, 0), times, 'rstime');
        reduceData(positiveDiff(redirectEnd, redirectStart), times, 'rredir');
        reduceData(positiveDiff(t.fetchStart, redirectEnd), times, 'rredircache');
        reduceData(positiveDiff(domainLookupStart, t.fetchStart), times, 'rcache');
        reduceData(positiveDiff(t.domainLookupEnd, t.domainLookupStart), times, 'rdns');
        reduceData(positiveDiff(t.connectStart, t.domainLookupEnd), times, 'rdnstcp');
        reduceData(positiveDiff(secureConnectionStart, t.connectStart), times, 'rtcp');
        reduceData(positiveDiff(t.connectEnd, secureConnectionStart), times, 'rssl');
        reduceData(positiveDiff(t.requestStart, t.connectEnd), times, 'rtcpreq');
        reduceData(positiveDiff(t.responseStart, t.requestStart), times, 'rreq');
        reduceData(positiveDiff(t.responseEnd, responseStart), times, 'rres');

        if (times.rduration < SLOW_SOURCE_MAX) {
            let search = name.split('?');
            name = search[0];
        }

        // 资源名称(绝对路径)
        times.rname = name;
        // 自定义类型
        times.rtype = t.type;

        let size = abnormalSize(t.transferSize);
        if (size) {
            times.rtransize = size;
        }
        return times;
    } catch (e) {
        console.warn(`msg:${e.msg}`);
        console.warn(`stack:${e.stack}`);
        return {};
    }
};
```

```js
let entries = [];
let infoList = [];
let getResourceData = () => {
    try {
        let resourceData = [];
        entries.forEach((entry) => {
            let name = entry.name && entry.name.match(/([/][^?#;]*)?(?:[?]([^?#]*))?(#[^#]*)?$/);
            let pathName = name[1];
            let fullName = name[0];

            if (entry.entryType === 'navigation') {
                // 过滤页面本身
                return;
            }

            if (/\.js$/.test(pathName)) {
                entry.type = 'script';
            } else if (/\.css$/.test(pathName)) {
                entry.type = 'stylesheet';
            } else if (/\.(eot|woff|ttf|svg)$/.test(pathName)) {
                entry.type = 'font';
            } else if (/\.(bmp|gif|jpg|png|jpeg|webp)(!share)*?$/.test(pathName)) {
                entry.type = 'image';
                return;
            } else if (/\.(mp3|wma|wav|ape|flac|ogg|aac)$/.test(pathName)) {
                // 音频
                entry.type = 'media';
            } else if (/\.(mp4|avi|rmvb|mkv)$/.test(pathName)) {
                // 视频
                entry.type = 'media';
            } else if (entry.initiatorType === 'iframe') {
                entry.type = 'iframe';
            } else {
                entry.type = 'others';
                return;
            }

            resourceData.push(getEntryTiming(entry));
        });

        return resourceData;
    } catch (e) {
        console.warn(`msg:${e.msg}`);
        console.warn(`stack:${e.stack}`);
        return [];
    }
};
```

```js
// performance.js

const FEATURE_MAX = 60 * 1000; // 性能值大于60s的均作为异常处理
const hasLoaded = false; //页面是否已经load

const init = () => {
    //
    let loadedFunc = () => {
        // 页面本身的加载性能上报
        setTimeout(() => {
            hasLoaded = true;
            let performanceData = getPerformanceData();
            let data = getThresholdData(performanceData);

            // 如果打点数据计算出页面加载完成时间大于60s，该次打点不上报
            if (data < FEATURE_MAX) {
                sendLog(data);
            }
        });
        // 页面上外部资源的性能上报
        // 允许丢失 延迟执行
        setTimeout(() => {
            let resourceData = getResourceData();
            let length = resourceData.length;
            let arr = [];
            let num = 10;

            while (length > 0) {
                if (length > num) {
                    arr = resourceData.splice(0, num);
                    length = resourceData.length;
                } else {
                    arr = resourceData;
                    length = 0;
                }

                sendLog(arr);
            }
        }, 500);
    };

    window.addEventListener('load', loadedFunc);
};

export default init;
```

以上便上报了页面 DOM 加载完毕的时间。

那如何上报首屏时间呢？又如何上报首次 `paint` 的时间呢？

先来看 `first paint` 的时间

```js
/* 获取首次渲染耗时 */
let getFirstPaint = function (decimalNum) {
    if (!window.performance || !window.performance.getEntriesByType) {
        return undefined;
    }

    decimalNum || (decimalNum = 0);

    let paintEntries = window.performance.getEntriesByType('paint');

    if (paintEntries && paintEntries.length) {
        for (let i = 0, length = paintEntries.length; i < length; i++) {
            let entry = paintEntries[i];

            if (entry && entry.name === 'first-paint') {
                return +(entry.startTime + entry.duration).toFixed(decimalNum);
            }
        }
    }

    return undefined;
};
```

其中，`window.performance.getEntriesByType('paint')`是入下图所示的对象：

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/b6e1a6a5-2113-47fe-8e0d-d3591f33f2f71618474244895WX202104151610192x.png)

所以，也可以对 `first-contentful-paint` 做监控。

再来看下，如何根据我们页面的情况，自己选择在何时上报首屏数据呢？

我们对外暴露一个 `firstScreen` 方法。

```js
/**
* 首屏打点
*/

let pageStartTime = 0; // 首屏起点时间，默认为0，在单页应用中切换页面时需要重置此值

let firstScreen = () => {
    if (window.performance && performance.now && !firstScreenFlag) {
        firstScreenFlag = true;

        let firstScreenLog = window.firstScreenTime || positiveDiff(parseInt(performance.now()), pageStartTime);
        // 首屏打点可能会晚于页面加载，所以这里需要做下判断
        if (hasLoaded) {
            sendLog(firstScreenLog);
        } else {
            window.addEventListener('load', () => {
                // onload事件里同步执行的js会被计入到pageLoad内 包一层异步来解决
                setTimeout(() => {
                    sendLog(firstScreenLog);
                });
            });
        }
    }
};
let init = () => {
    // 上面的代码不重复了
    ...
    return {
        firstScreen,
    };
}

```

其中 `firstScreenTime` 我们可以在 `html` 文件中自己定义。

```html
......
<!-- 上面是html部分 -->
<script>
    (function () {
        var positiveDiff = function (para1, para2) {
            var diff = para1 - para2;
            if (isNaN(diff)) {
                return -1;
            }
            if (diff > 60000) {
                return -22;
            }
            if (diff < 0) {
                return -21;
            }
            return diff % 1 !== 0 ? diff.toFixed(3) : diff;
        };
        window.firstScreenTime = positiveDiff(parseInt(performance.now()), 0);
    })();
</script>
```

如果我们没在`HTML`中定义这个属性，就会在我们调用 `firstScreen` 的时候，取当前的时间了。例如可以在我们的业务接口请求完成后调用。

## 指标

现在我们获取了很多性能数据。那我们如何判断一个资源，或者我们的页面性能好坏呢？

这里直接参考字节大佬的文章吧。

【字节前端】 [Web Performance Metrics 与 Core Web Vitals 简介 —— 现代前端性能各个指标的具体含义和设计理念](https://juejin.cn/post/6883444297614983175#heading-19)
