# key

[参考原文-掘金-详解 vue 的 diff 算法](https://juejin.im/post/6844903607913938951)

`key` 的特殊属性，主要用于 `Vue` 的虚拟 `DOM` 算法。在新旧 `vnode` 的对比中，如果不使用 `key` ，`Vue` 会最大限度的减少动态元素并尽可能的就地复用。这会导致一些渲染错误。而且当我们想要触发一些 `transition` 过渡动画的时候，会出现不生效的情况。因为 `vue` 判断该元素并没有改变。

而使用 `key` 的时候，它会基于 `key` 的变化，重新计算排序元素序列。并且会移除 `key` 不存在的元素。

其原理在于 `Vue` 的 `diff` 算法。而我们的 `key` 起作用在其 `patch` 的过程。

```js
function patch(oldVnode, vnode) {
    // some code
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode);
    } else {
        const oEl = oldVnode.el; // 当前oldVnode对应的真实元素节点
        let parentEle = api.parentNode(oEl); // 父元素
        createEle(vnode); // 根据Vnode生成新元素
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)); // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el); // 移除以前的旧元素节点
            oldVnode = null;
        }
    }
    // some code
    return vnode;
}

// 作者：windlany
// 链接：https://juejin.im/post/6844903607913938951
```

![image](https://user-gold-cdn.xitu.io/2018/5/19/163777930be304eb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 同层比较

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/2edacc58-5b61-494c-a329-7f1a7547b5901605254855876Vuediff.png)

如果两个节点是一样的，就执行 `patchVnode()` 方法进一步比较。

如果两个节点不一样，直接用新的 `Vnode` 替换旧的。如果两个父节点不一样，但是其子节点都是一样的，也不会进行子节点比较。这就是同层比较。

## patchNode()

```js
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
    	}else if (ch){
            createEle(vnode) //create el's children dom
    	}else if (oldCh){
            api.removeChildren(el)
    	}
    }
}

// 作者：windlany
// 链接：https://juejin.im/post/6844903607913938951
```

以上就是根据不同情况进行不同处理了。

-   如果新旧节点指向同一个对象，直接 `return` 什么都不做。
-   如果都有文本节点，并且不一样，则用新的替换旧的。
-   如果 `oldVnode` 有子节点，而新的 `Vnode` 没有，则删除该子节点。
-   反过来，如果 `Vnode` 有子节点，而 `oldVnode` 没有，则将该子节点添加。
-   如果都有子节点，则进行 `updateChildren()` 比较。

`diff` 算法就在 `updateChildren()` 函数里。

## updateChildren()

```js
updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {   // 对于vnode.key的比较，会把oldVnode = null
            oldStartVnode = oldCh[++oldStartIdx]
        }else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
            // oldS 与 S 比较
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
            // oldE 与 E 比较
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
            // oldS 与 E 比较
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
            // oldE 与 S 比较
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
           // 使用key时的比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

这个函数主要做了以下事情：

-   将 `Vnode` 的子节点 `VnodeChildren(下文称Vch)` 和 `oldNode` 的子节点 `oldNodeChildren(下文称oldCh)` 提取出来。
-   `Vch` 和 `oldCh` 各有两个头尾的变量 `startIdx` 和 `endIdx` 。 他们的两个变量相互比较。一共有 4 种比较方式。如果 4 种都没有匹配，再看是否设置了 `key`。如果设置了，就会用 `key` 进行比较。在比较的过程中，变量会往中间靠，一旦 `startIdx > endIdx` 表明 `oldCh` 和 `Vch` 至少有一个已经遍历完了，就会结束比较。

接下来上图：

以下是 `Vnode` 和 `oldVnode`

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/56fcce6f-bcf6-44eb-91f5-aacb4c688e541605580645023vnode1.png)

将其取出来，并分别赋予头尾变量。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/8c610783-a4bd-433f-8cc2-e997247867d81605582710220vnode2.png)

`oldS` 将会与 `S` 和 `E` 做 `sameNode` 比较。`oldE` 将会与 `S` 和 `E` 做 `sameNode` 比较。

-   一旦有一对匹配上了，那么真实的 `DOM` 会移动到与之对应的节点。这两个指针会像中间移动。
-   如果 4 组都没有匹配上，分两种情况。
    -   如果新旧子节点都存在 `key` , 那么会根据 `oldCh` 的 `key` 生成一张 `hash表` 。用 `S` 的 `key` 与之做对比。匹配成功就去判断这 `S` 和 该节点是否 `sameNode` 。如果是，就在真实 `DOM` 中将成功的节点移到最前面。否则将 `S` 对应生成的节点插入到 `DOM` 中对应的 `oldS` 位置。 `S` 指针向中间移动，被匹配 `old` 中的节点置为 `null` 。
    -   如果没有 `key`, 则直接将 `S` 生成新的节点插入真实 `DOM`。

也就是，没有 `key` 只会做 4 中匹配，就算指针中间有可复用的节点，也不能被复用。

接下来，看一下上图做匹配的过程：

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/fc6b1e12-77fb-456d-bd50-101bec2451b81605592012409vnode3.png)

> `oldS` 与 `S` 匹配

将 `DOM` 中的节点 `a` 放到第一个。已经是第一个了就不管了。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/72a6c017-3296-40e0-ab2d-534f4ddf25081605592473568vnode4.png)

> `olds` 与 `E` 匹配

将 `DOM` 中的节点 `b` 放到最后一个。

![image](http://udh.oss-cn-hangzhou.aliyuncs.com/3930b424-7be8-4fa6-903e-a929560c12531605593277984vnode5.png)

> `oldE` 与 `S` 匹配

本来是要将 `c` 移动到 `S` 对应的位置。可是真实 `DOM` 中节点`c` 已经是在第二个位置了。所以什么都不做。

> `oldS > oldE` 结束匹配。

将剩余的节点 `d` 按照自己的 `index` 插入到 `DOM` 中去。

匹配结束有两种情况。

-   `oldS > oldE` 说明 `oldCh` 先遍历完，则需要将多余的 `Vch` 根据 `index` 添加到 `DOM` 中。
-   `S > E` 说明 `Vch` 先遍历完。则需要删除 `oldCh` 中多余的节点。
