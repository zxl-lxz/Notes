# 常用`Git` 指令汇总

本文只列出常用的指令。更多指令或参数请使用 `-h` 获取帮助。如：

```shell
git --help
git remote -h
```

也可参阅官方文档[系统学习 `Git`](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6)

## 配置

### 使用 `git config` 配置

以配置用户名为例，其它配置参考：[初次运行 Git 前的配置](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)

```shell
# /etc/gitconfig 文件: 包含系统上每一个用户及他们仓库的通用配置。
git config --system user.name "system name"

# ~/.gitconfig 或 ~/.config/git/config 文件：只针对当前用户。这会对你系统上 所有 的仓库生效。
git config --global user.name "global name"

# 当前使用仓库的 Git 目录中的 config 文件（即 .git/config）：针对该仓库。
cd my-project
git config user.name "my name"
```

每一个级别会覆盖上一级别的配置，所以 .git/config 的配置变量会覆盖 /etc/gitconfig 中的配置变量。

### 查看你的配置

```shell
# 查看所有的key=value
git config --list

# 查看特定的key的value
git config user.name
```

## 创建 `Git` 仓库

获取 Git 仓库，通常有两种获取 Git 项目仓库的方式：

1. 将尚未进行版本控制的本地目录转换为 Git 仓库；

2. 从其它服务器 克隆 一个已存在的 Git 仓库。

两种方式都会在你的本地机器上得到一个工作就绪的 Git 仓库.

### 使用 `git init` 初始化本地仓库

```shell
cd my-project

# 该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件
git init
```

### 使用 `git clone` 克隆仓库

```shell
git clone https://github.com/libgit2/libgit2

# 如果你想在克隆远程仓库的时候，自定义本地仓库的名字，你可以通过额外的参数指定新的目录名：
git clone https://github.com/libgit2/libgit2 mylibgit
```

## 跟踪每次更改和状态

请记住，你工作目录下的每一个文件都不外乎这两种状态：`已跟踪` 或 `未跟踪`。 

`已跟踪` 的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，`已跟踪` 的文件就是 Git 已经知道的文件。

刚新增的文件，未 add 的，就是还 `未被跟踪` 的。

![image](https://git-scm.com/book/en/v2/images/lifecycle.png)

### 使用 `git status` 查看当前状态

```shell
# 该指令会告诉你以下信息：
# 1. 位于什么分支
# 2. 与上游分支对比
# 3. 文件的状态（是否跟踪，是否提交等）
git status
```

### 使用 `git add` 暂存文件

这是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。

```shell
#  git add 命令使用文件或目录的路径作为参数；如果参数是目录的路径，该命令将递归地跟踪该目录下的所有文件。

# 暂存目录下的所有文件
git add .

# 暂存指定目录下的所有文件
git add my-project/pages

# 暂存单个或多个文件
git add README.md index.html
```

### 使用 `git commit` 提交文件

```shell
# -m 相当于 --message 用于描述提交信息
git commit -m "feat: v1.0.0"
```

## 远程仓库

本地和远程这两个概念一定要区分清楚。

### 查看远程仓库列表

```shell
# 该指令会列出每一个远程仓库的简写。
# 默认情况下，使用 git clone 的项目，会有一个默认的简写：origin
git remote
```

### 查看某一个具体的远程仓库信息

```shell
# 该指令会输出以下信息：
# 1. 当前远程仓库简称
# 2. 拉取的时候，获取的地址
# 3. 推送的时候，推送地址
# 4. HEAD分支
# 5. 远程分支列表和跟踪状态
#    branch1 已跟踪
#    branch2 已跟踪
#    branch3 已跟踪
#    ...
# 6. 为 'git pull' 配置的本地分支：
#    master 与远程 master 合并
#    branch1 与远程 branch1 合并
# 7. 为 'git push' 配置的本地引用：
#    master 推送至 master (最新)
#    branch1 推送至 branch1(本地已过时)
git remote show origin
```

### 添加远程仓库

如何将本地的项目推送到 `github` ?

```shell
cd my-project
git init
git add .
git commit -m "init"
```

在 `github` 上新建一个仓库。复制它的地址。

```shell
// 跟远程建立连接
git remote add origin git@github.com:1282772905/nuxtapp.git
// 在远程创建一个master分支，将本地项目推送到远程仓库的mastar分支上
git push --set-upstream origin master
```

其中， `origin` 是这个远程仓库的别名。

现在可以用这个 `origin` 代替整个 `URI`。例如：

```shell
git fetch origin
git pull origin master
git push origin master
...
```

`origin` 是默认别名。我们可以自己取名字。

## 分支

更深入了解[什么是分支](https://github.com/1282772905/Notes/blob/master/Git/6.%E4%BB%80%E4%B9%88%E6%98%AF%E5%88%86%E6%94%AF%EF%BC%9F/index.md)

### 创建分支

```shell
git branch feature_v1.0.0
```

### 切换分支

```shell
git checkout feature_v1.0.0
```

### 简写

```shell
git checkout -b feature_v1.0.0
```

### 分支的合并

深入理解[分支的合并](https://github.com/1282772905/Notes/blob/master/Git/6.%E4%BB%80%E4%B9%88%E6%98%AF%E5%88%86%E6%94%AF%EF%BC%9F/index.md#%E5%88%86%E6%94%AF%E7%9A%84%E5%90%88%E5%B9%B6)

```shell
# 当前在master分支上
# 以下指令会新建一个merge了远程master的新分支
git checkout -b branch1
```

### 更新所有远程分支

```shell
# 该指令会更新所有远程分支到最新到版本
# 用于别人往远程push了代码的情况。
# 注意，更新的是origin/master,本地的master并不会受这个指令影响
# 想要合并远程最新代码，请在此之后执行 git merge origin.master 而不是 git merge master
git fetch
```

### 推送你的更改到远程

```shell
# 默认情况下 使用 git push ,会默认推送到与本地分支对应到远程分支
# 可以使用 git remote show origin 查看对应的拉取和推送关系

git push origin master

# 以上指令，一般情况下可以简写为 git push
# 如果你当前在master分支，你也想push到远程的master分支的话
```

## 选择修订版本

有时候我们需要恢复到特定的快照中

### 使用 `git reflog` 查看快照

```shell
# 该指令会从近到远列出所有的快照：
# 3556aa9 (HEAD -> master, origin/master, origin/HEAD) HEAD@{0}: commit: commit message a
# f0dd3ae HEAD@{1}: commit: commit message b
# 9e2a6b1 HEAD@{2}: commit: commit message c
git reflog
```

### 使用 `git reset` 恢复到特定快照 

举个例子便于理解：

现在有一个文件 `A`。我对它做了一些修改 `b`, 该文件现在变成了 `Ab`。

现在我想恢复到文件 `A`。

首先执行 `git reflog` 拿到想要恢复的快照的号码。即下面的 `754de8c`

```shell
git reflog

# c88bd20 (HEAD -> master) HEAD@{0}: commit: Ab
# 754de8c (origin/master, origin/HEAD) HEAD@{1}: commit: A
```

```shell
# --mixed 默认参数：执行该指令后，修改 b 会存在（modified），但是没有被 add
git reset 754de8c

# 会看到 b 修改还在，只不过没有被add,可自行再做修改或者删除
```

```shell
# --soft 参数：执行该指令后，修改 b 会存在，并且被add(处于暂存区中，未被commit)
git reset --soft 754de8c
```

```shell
# --hard 参数：执行该指令后，修改 b 会消失
git reset --hard 754de8c
```








