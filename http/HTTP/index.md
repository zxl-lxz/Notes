# HTTP 发展史

`HTTP` 起初非常简单。现在依然简单，不过更加灵活、安全、规范。

## HTTP/0.9

起初，设计者只想在实验室之间传递超文本语言文件而已。其设计也非常简单。

请求：

```
GET /mypage.html
```

响应：

```html
<html>
    ...
</html>
```

## HTTP/1.0

由于 `http/0.9` 的应用非常有限，浏览器和服务器拓展了其内容：

-   协议版本信息现在会随着每个请求发送
-   状态码会在响应开始时发送，使得浏览器能了解请求成功或者失败，并调整自身行为（如更新或者使用缓存）
-   引入了 `HTTP头` 概念。
-   在 `HTTP头` 的帮助下，具备了传输其它类型文件的能力。（content-type）

```
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
```

## HTTP/1.1

`HTTP/1.0` 多种不同的实现方式在世纪运用中显得有些混乱。`HTTP/1.1` 消除了大量的歧义，引进了多项改进。

-   连接可以复用。
-   增加管线化技术，允许前一个响应被完全发送之前，下一个请求就可以发送。降低通信延迟。
-   支持响应分块。
-   引入额外的缓存控制技术。
-   引入内容协商机制。包括语言、编码、类型等。允许客户端和服务端之间约定以最合适的内容进行交换。
-   `Host` 头，能够使不同域名配置在同一个 `IP` 地址服务器上。

```
GET /en-US/docs/Glossary/Simple_header HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 20 Jul 2016 10:55:30 GMT
Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a"
Keep-Alive: timeout=5, max=1000
Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
Server: Apache
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding

(content)


GET /static/img/header-background.png HTTP/1.1
Host: developer.cdn.mozilla.net
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Age: 9578461
Cache-Control: public, max-age=315360000
Connection: keep-alive
Content-Length: 3077
Content-Type: image/png
Date: Thu, 31 Mar 2016 13:34:46 GMT
Last-Modified: Wed, 21 Oct 2015 18:27:50 GMT
Server: Apache

(image content of 3077 bytes)
```

## HTTP/2.0

`HTTP/1.0` 的使用长达了十几年的时间。但随着 `web` 应用的发展，其性能也快捉襟见肘。

`HTTP/2.0` 基于 `SPDY` 的灵感，做了以下优化：

-   二进制协议。不再可读。也不可以无障碍的手动创建。
-   复用。并行的请求能在同一个连接里处理。移除了 `http/1.x` 中顺序和阻塞的约束。
-   压缩 `headers` 。因为 `headers` 在一系列请求中是非常相似的，其移除了重复和传输重复数据的成本。
-   允许服务器在客户端中填充数据，通过一个叫服务器推送的机制来提前请求。
