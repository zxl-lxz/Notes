# 什么是分支

## 分支的本质

> 分支其实是一个指针。指向最后一次提交时的快照。

![image](https://git-scm.com/book/en/v2/images/branch-and-history.png)

上图，`HEAD` 是一个指针，表面当前所在分支。

`master` 和 `v1.0` 都是分支。指向最后一次提交后的快照`f30ab`。

> 创建分支

```
git checkout testing
```

![image](https://git-scm.com/book/en/v2/images/head-to-master.png)

> 切换分支

```
git checkout testing
```

![image](https://git-scm.com/book/en/v2/images/head-to-testing.png)

> 提交，更新最后一次提交快照

![](https://git-scm.com/book/en/v2/images/advance-testing.png)

> 切回master再提交

![](https://git-scm.com/book/en/v2/images/advance-master.png)

## 分支的合并

`master`:

```
git branch -b iss53
```

![](https://git-scm.com/book/en/v2/images/basic-branching-2.png)

`iss53`:

```
git commit -m "issue53"
```

![](https://git-scm.com/book/en/v2/images/basic-branching-3.png)

切回 `master`,并创建新分支 `hotfix`:

```
git checkout master

git branch -b hotfix

git commit -m "hotfix"
```

![](https://git-scm.com/book/en/v2/images/basic-branching-4.png)

切回`mastre`合并：

```
$ git checkout master

$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

> 在合并的时候，你应该注意到了“快进（fast-forward）”这个词。 由于你想要合并的分支 hotfix 所指向的提交 C4 是你所在的提交 C2 的直接后继， 因此 Git 会直接将指针向前移动。换句话说，当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做 “快进（fast-forward）”。

![](https://git-scm.com/book/en/v2/images/basic-branching-5.png)

```
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
```

![](https://git-scm.com/book/en/v2/images/basic-branching-6.png)

```
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

> 这和你之前合并 hotfix 分支的时候看起来有一点不一样。 在这种情况下，你的开发历史从一个更早的地方开始分叉开来（diverged）。 因为，master 分支所在提交并不是 iss53 分支所在提交的直接祖先，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照（C4 和 C5）以及这两个分支的公共祖先（C2），做一个简单的三方合并。

![](https://git-scm.com/book/en/v2/images/basic-merging-1.png)

> 和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。 这个被称作一次合并提交，它的特别之处在于他有不止一个父提交。

![](https://git-scm.com/book/en/v2/images/basic-merging-2.png)






