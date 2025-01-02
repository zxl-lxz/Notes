## 二叉树

递归三部曲：

1. 确定递归函数的参数和返回值
2. 确定递归的终止条件
3. 确定单层逻辑

push + shift 模拟队列（先入先出）

push + pop 模拟栈（先入后出）

```js
// 链式存储
function Node() {
    this.val = val;
    this.left = null;
    this.right = null;
}
```

### 二叉树的深度优先遍历和广度优先遍历

#### 深度优先遍历

```js
const dfs = (node) => {
    if (!node) return;
    console.log(node.val);

    node.left && dfs(node.left);
    node.right && dfs(node.right);
};

dfs(root);
```

#### 广度优先遍历

利用队列的思维

```js
const bfs = (node) => {
    if (!node) return;

    const queue = [node];

    while (queue.length > 0) {
        const currNode = queue.shift();
        console.log(node.val);

        currNode.left && queue.push(currNode.left);
        currNode.right && queue.push(currNode.right);
    }
};
bfs(root);
```

### 二叉树的（前、中、后）遍历

所谓前中后，其实意思是跟节点在什么时候被遍历到。

前序：从根节点开始进行遍历

中序：从左叶子节点开始遍历，遍历完左树，然后遍历到跟节点，再遍历右树

后序：从左叶子节点开始遍历，遍历完左叶子节点的一部分后，转而遍历对成的右叶子节点，直到最终遍历到根节点。

#### 前序遍历

中 左 右

```js
// 递归的方式
const preorderTraversal = (root) => {
    const result = [];

    const dfs = (node) => {
        if (!node) return;
        result.push(node.val);
        dfs(node.left);
        dfs(node.right);
    };

    dfs(root);

    return result;
};

// 迭代的方式，利用栈的思想（先入后出）
const preorderTraversal = (root) => {
    const result = [];
    const stack = [];

    if (root) stack.push(root);

    while (stack.length > 0) {
        const node = stack.pop();

        result.push(node.val);

        if (node.right) {
            stack.push(node.right);
        }

        if (node.left) {
            stack.push(node.left);
        }
    }

    return result;
};
```

#### 中序遍历

左 中 右

```js
// 递归的方式
const inorderTraversal = (node) => {
    if (!node) return;
    inorderTraversal(node.left);
    console.log(node.val);
    inorderTraversal(node.right);
};

// 迭代的方式，也是利用栈的思想
const inorderTraversal = (node) => {
    // const result = [];

    const stack = [];
    const p = root;

    while (p || stack.length) {
        while (p) {
            stack.push(p);
            p = p.left;
        }

        p = stack.pop();
        // result.push(p.val);
        p = p.right;
    }

    // return result;
};
```

#### 后序遍历

左 右 中

```js
// 递归的方式
const postorderTraversal = (node) => {
    if (!node) return;
    postorderTraversal(node.left);
    postorderTraversal(node.right);
    console.log(node.val);
};

// 迭代的方式
const postorderTraversal = (node) => {
    const stack = [node];
    const outputStack = [];

    while (stack.length) {
        const currNode = stack.pop();
        outputStack.push(currNode);

        currNode.left && stack.push(currNode.left);
        currNode.right && stack.push(currNode.right);
    }

    while (outputStack.length) {
        const currNode = outputStack.pop();
        console.log(currNode.val);
    }
};

// 也可以利用前序遍历，更改一下顺序，再翻转结果就行
// 前序：中 左 右  （改变顺序）=> 中右左 （翻转结果数组）=> 左右中
const preorderTraversal = (root) => {
    const result = [];
    const stack = [];

    if (root) stack.push(root);

    while (stack.length > 0) {
        const node = stack.pop();

        result.push(node.val);

        if (node.left) {
            stack.push(node.left);
        }

        if (node.right) {
            stack.push(node.right);
        }
    }

    return result.reverse();
};
```
