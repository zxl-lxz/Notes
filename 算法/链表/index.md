## 链表

链表的每一个节点都是一个对象或者说是一个引用，并不是说两个节点的 value 相等，就能够说这两个节点一样。除了 value 还有 next 、pre

交叉链表的交叉部分，就是节点一模一样，引用一模一样

链表的第一个节点就是 head ，最后一个节点就是 tail

```js
// 链表算法常用技巧 1
let p = head;

while (p) {
    if (xxx) {
        p = p.next;
    }
}

// 链表算法常用技巧 2
let pre = head;
let cur = head;
let index = 0;
```

### 单链表

```js
function List() {
    const Node = function(element) {
        this.element = element;
        this.next = null;
    }

    let head = null;

    let length = 0;

    // 向链表尾部插入节点
    const append = function(ele) {
        const node = new Node(ele);

        const p = head;

        if (!head) {
            head = node;
        } else {
            while(p.next) {
                p = p.next;
            }
            p.next = node;
        }

        length++;
    };


    const insert = function(ele, position) {
        const node = new Node(ele);

        if (posotion >= 0 && position <= length) {
            let pre = head;
            let cur = head;
            let index = 0;
            if (position === 0) {
                // node 作为第一个，node.next 指向之前的 head
                node.next = head;

                // 更新head；现在，新的 head 就是 node 了
                head = node;
            } else {
                while(index < position) {
                    pre = cur;
                    cur = cur.next;
                    index++;
                }
                pre.next = node;
                node.next = cur;
            }
            length++;
        } else {
            return null;
        }
    };
    const delete = function(ele) {
        if (!head) return;
        let p = head;
        let pre = head;

        while(p) {
            if (p.element === ele) {
                p = p.next;
                pre.next = p;
            } else {
                pre = p;
                p = p.next;
            }
        }
    };

    // 判断链表中是否存在该节点
    const has = function(ele) {
        const p = head;

        if (!p) return false;

        while(p) {
            if (p.element === ele) return true
            p = p.next
        }

        return false;
    };
}
```

### 双链表

单链表只有一个方向，从头到尾。双链表有两个方向，从头到尾 + 从尾到头。

```js
function DoubleLinkList() {
    const Node = function (element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    };

    let head = null;
    let tail = null;
    let length = 0;

    const insert = function (ele, position) {
        const node = new Node(ele);

        if (position >= 0 && position <= length) {
            let pre = head;
            let cur = head;
            let index = 0;

            if (position === 0) {
                if (!head) {
                    head = node;
                    tail = node;
                } else {
                    node.next = pre;
                    pre.prev = node;
                    head = node;
                }
            } else if (position === length) {
                cur = tail;
                cur.next = node;
                node.prev = cur;
                tail = node;
            } else {
                while (index < position) {
                    pre = cur;
                    cur = cur.next;
                    index++;
                }
                pre.next = node;
                node.next = cur;
                node.prev = pre;
                cur.prev = node;
            }
            length++;
            return true;
        } else {
            return false;
        }
    };

    // 删除 position 位置的节点
    function removeAt(position) {
        if (position >= 0 && position < length && length > 0) {
            let prev = head,
                curr = head,
                index = 0;
            if (position === 0) {
                // 移除头节点
                if (length === 1) {
                    // 仅有一个节点
                    head = null;
                    tail = null;
                } else {
                    head = head.next;
                    head.prev = null;
                }
            } else if (position === length - 1) {
                // 移除尾节点
                curr = tial;
                tail = curr.prev;
                tail.next = null;
            } else {
                while (index < position) {
                    prev = curr;
                    curr = curr.next;
                    index++;
                }
                // 移除curr
                prev.next = curr.next;
                curr.next.prev = prev;
            }
            length -= 1;
            return curr.element;
        } else {
            return null;
        }
    }
}
```

### 循环单链表

循环单链表的最后一个 node.next 指向 head
