// 运行端口
const PORT = 8080;

// 引入http模块
const http = require('http');

// 引入fs模块
const fs = require('fs');

// 引入url模块
const url = require('url');

// 引入path模块
const path = require('path');

// 搭建本地服务器
// req:浏览器的信息
// res:服务器返回的结果
const server = http.createServer((req, res) => {
    // 我的index.js里开启了webworker
    // pathname：返回了两个值 /index.html /worker.js
    const pathname = url.parse(req.url).pathname;

    // 相对应的，realPath也返回两个值
    // /Users/zhouliang/learn/Notes/JavaScript/webWorker/index.html
    // /Users/zhouliang/learn/Notes/JavaScript/webWorker/worker.js
    const realPath = path.join('/Users/zhouliang/learn/Notes/JavaScript/webWorker', pathname);

    fs.readFile(realPath, (err, data) => {
        if (err) {
            res.writeHead(404, {
                'content-type': 'text/plain;charset="utf-8"'
            });
            res.write('404,页面不在');
            res.end();
        } else {
            res.writeHead(200, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write(data);
            res.end();
        }
    });
});

server.listen(PORT);
console.log('服务开启成功');