```js
// 以前序遍历为例（前序： 中 左 右）

// 递归
const dfs = (root) => {
    if (!root) return;

    console.log(root.val);

    dfs(root.left);
    dfs(root.right);
};

// 迭代
// 栈
const dfs = (root) => {
    const stack = [root];

    while (stack.length) {
        const cur = stack.pop();
        console.log(cur.val);

        cur.right && stack.push(cur.right);
        cur.left && stack.push(cur.left);
    }
};
```
