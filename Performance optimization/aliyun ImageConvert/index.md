# 阿里云图片存储服务之图片处理

想给工程的图片做一个优化。包括规范，格式，大小等优化，看看阿里云提供的方法能不能满足我的需求。

例如，我们现在又一个这样的图片：`http://udh.oss-cn-hangzhou.aliyuncs.com/109951163706019491.jpg`

以下是阅读阿里云图片处理文档，并经过自己实践，总结的我认为重要的点：

## 通过添加处理参数对图片进行处理

往 URL 后面添加参数，对图片进行处理。规范如下：

```js
// 原来的URL
const url = 'http://udh.oss-cn-hangzhou.aliyuncs.com/109951163706019491.jpg'

// 处理后的url
const _url = `${url}?x-oss-process=image/${key1},${value1},${value2}/${key2},${value1},${value2}`
```

如上，`?x-oss-process=image/` 这一段是固定的。`?`表示后面要接参数了。`x-oss-process=image` 表示是对图片进行处理的参数。`/`后面跟键值对。`key` 和 `value` 以 `,` 分割。

### 缩放

⚠️：缩放是可以压缩图片体积的！！！经实践，一个 `400 x 400` 的 `jpg` 图片，等比缩放`50%`后，变成了 `200 x 200`.其体积（磁盘上的大小）由 `20kb` 变成了 `4kb`.

[如何使用请仔细阅读缩放规范](https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.2.14.53956dd7ag1rIS#concept-hxj-c4n-vdb)

### 格式转换

转换成 webp 格式，对图片进行压缩。

### 其它

其它还有很多参数。例如裁剪，效果，旋转等等。具体请看阿里云官方文档。
