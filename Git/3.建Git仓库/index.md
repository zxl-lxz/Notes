获取 Git 仓库

通常有两种获取 Git 项目仓库的方式：

将尚未进行版本控制的本地目录转换为 Git 仓库；

从其它服务器 克隆 一个已存在的 Git 仓库。

两种方式都会在你的本地机器上得到一个工作就绪的 Git 仓库.

如果你有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，那么首先需要进入该项目目录中

之后执行：

`$ git init`

该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪。

如果在一个已存在文件的文件夹（而非空文件夹）中进行版本控制，你应该开始追踪这些文件并进行初始提交。 可以通过 git add 命令来指定所需的文件来进行追踪，然后执行 git commit ：

```
$ git add *.c
$ git add LICENSE
$ git commit -m 'initial project version'
```
------

克隆现有的仓库

```
$ git clone https://github.com/libgit2/libgit2

// 如果你想在克隆远程仓库的时候，自定义本地仓库的名字，你可以通过额外的参数指定新的目录名：

$ git clone https://github.com/libgit2/libgit2 mylibgit
```


