```js
// 队列
const bfs = (root) => {
    const queue = [root];

    while (queue.length) {
        const cur = queue.shift();
        console.log(cur.val);

        cur.left && queue.push(cur.left);
        cur.right && queue.push(cur.right);
    }
};
```
