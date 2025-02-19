### cookie

1. 单个 4kb；最多 20 个
2. 服务端通过 set-cookie 可以让浏览器设置 cookie
3. 构成部分
   name

    value

    domain：设置 baidu.com 意味着 a.baidu.com 和 b.baidu.com 可以共享 cookie

    path：设置 /home 意味着只有这个路径下的页面才可以共享 cookie

    secure：https 下才可以使用

    httpOnly: 不允许脚本访问，只允许 http 头部自动携带

### WebStorage

localStorage 和 sessionStorage

两者区别就是一个永久一个只存在当前 tab 的生命周期内。

两者都遵循浏览器的同源策略。
