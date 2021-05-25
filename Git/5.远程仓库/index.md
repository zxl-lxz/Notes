# 远程仓库

如何将本地的项目推送到 `github` ?

## 新建远程仓库

```
cd my-project
git init
git add .
git commit -m "init"
```

在 `github` 上新建一个仓库。复制它的地址。

```
// 跟远程建立连接
git remote add origin git@github.com:1282772905/nuxtapp.git
// 在远程创建一个master分支，将本地项目推送到远程仓库的mastar分支上
git push --set-upstream origin master
```

其中， `origin` 是这个远程仓库的别名。

现在可以用这个 `origin` 代替整个 `URI`。例如：

```
git fetch origin
git pull origin master
git push origin master
...
```

`origin` 是默认别名。我们可以自己取名字。

## 查看远程仓库

```
$ git remote
origin

$ git remote -v
origin  git@github.com:1282772905/Notes.git (fetch)
origin  git@github.com:1282772905/Notes.git (push)

$ git remote show origin
* 远程 origin
  获取地址：git@github.com:1282772905/Notes.git
  推送地址：git@github.com:1282772905/Notes.git
  HEAD 分支：master
  远程分支：
    master 已跟踪
  为 'git pull' 配置的本地分支：
    master 与远程 master 合并
  为 'git push' 配置的本地引用：
    master 推送至 master (最新)
```

## 删除或者重命名

```
// 重命名
$ git remote rename origin myname

// 删除
$ git remote remove myname
```

> 值得注意的是这同样也会修改你所有远程跟踪的分支名字。 那些过去引用 pb/master 的现在会引用 paul/master。

> 一旦你使用这种方式删除了一个远程仓库，那么所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除。