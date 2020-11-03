# 跨域

为什么会跨域？

## 同源策略

同源策略是一种安全机制。其限制一个源的文档或加载它的脚本如何能与另一个源的资源进行交互。

### 哪些算跨域？

以 `http://a.b.com/src/index.html` 为比较对象

| URL                              | 结果 | 原因               |
| -------------------------------- | ---- | ------------------ |
| http://a.b.com/dist/index.html   | 同源 | 只是路径不同       |
| https://a.b.com/src/index.html   | 跨域 | 协议不同           |
| http://c.b.com/src/index.html    | 跨域 | 主机（domain）不同 |
| http://a.b.com:81/src/index.html | 跨域 | 端口不同           |

### 没有同源策略会怎样？

**跨源接口请求，造成安全隐患**

`cookie` 用于用户登陆信息的存储。当用户登陆了一次后，服务端会在响应头加上 `set-cookie` 字段。下次再发起请求的时候，`cookie` 会自动附在 `http` 请求头中。

如果没有 `同源策略`,在网站 `A` 登陆了之后，你切换到网站 `B`。 `B` 网站向 `A` 网站的服务器发起了请求，由于没有 `同源策略` 的限制。`A` 的服务端拿到自动附加的 `cookie` 后，以为是你本人在 `A` 登陆的。所以依然返回数据。如果 `A` 网站涉及到金钱交易，后果将不堪设想...

**跨源 DOM 查询，造成信息泄漏**

网站 `http://abc.com/index.html` 是你常登的一个网站。但是有一个钓鱼网站叫做 `http://adc.com/index.html`。某天这个钓鱼网站投放的广告你不小心点进去了。在其输入框，输入了账号和密码。

```html
<iframe name="abc" src="http://abc.com/index.html></iframe>
```

```js
const iframe = window.iframes['abc'];
const node = iframe.document.getElementById('theInput-that-your-password');
```

所以，`同源策略` 非常重要。

如何决绝跨域问题？

## JSONP

浏览器并不是拒绝所有跨域请求，严格意义上讲，它只拒绝 `跨域读操作` 。

-   `跨域写操作` 一般是被允许的。例如重定向以及表单提交。
-   `跨域资源嵌入` 一般是被允许的。
-   `跨域读操作` 一般是不被允许的。但是可以通过内嵌资源来巧妙的进行读取访问。

以下是可能嵌入跨域资源的例子：

-   `<scrip src="..."></scrip>` 标签嵌入跨域脚本。
-   `<link ref="stylesheet" href="...">` 标签嵌入 `CSS` 。
-   ...

`Jsonp` 就是利用了 `script` 标签不受同源策略限制的特性。单纯的为了跨域请求，而与后端配合实现的一个技巧。

```js
<scrip>
function jsonpCallback(res) {
    console.log(res);
}
</scrip>
<script src="http://example.com/data.php?callback=jsonpCallback"></script>
```

前端将要执行的函数名，作为参数传递给后端。后端拿到这个函数名后，将要返回的数据作为参数传递给这个函数，并返回这个函数的调用。前端通过 `script` 标签请求的这个资源，就是执行这个函数。那么所需的数据就是参数 `res` 。因为 `script` 标签请求数据就是 `GET` 方式，所以 `JSONP` 跨域也只支持 `GET` 请求。

我们封装下前端的 `JSONP` 请求。

```js
const jsonpRequest = ({ url, data }) => {
    return new Promise((resolve, reject) => {
        const handleData = (data) => {
            const entries = Object.entries(data);
            let str = '';
            entries.forEach((item, index) => {
                str = `${str}${item[0]}=${item[1]}${index === entries.length - 1 ? '' : '&'}`;
            });
            return str;
        };
        const script = document.createElement('script');
        script.src = `${url}?${handleData(data)}&callback=jsonpCb`;
        document.body.appendChild(script);

        window.jsonpCb = (res) => {
            document.body.removeChild(script);
            delete window.jsonpCb;
            resolve(res);
        };
    });
};

jsonpRequest({
    url: 'http://example.com/data.php',
    data: {
        a: 1,
        b: 2,
    },
}).then((res) => {
    console.log(res);
});
```

## CORS

`cross-origin-resource-sharing` 跨域资源共享。顾名思义，官方推出的用于解决跨域问题的方案。

`cors` 跨域请求，分为 `简单` 和 `非简单` 两种。其区别在于是否需要发起一次预检测请求。

主要实现为服务端设置 `Access-Control-Allow-Origin`

## 其它

-   `Nginx` 代理
-   `postMessage`
-   `document.domian`
-   ...
