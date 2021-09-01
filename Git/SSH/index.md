# SSH

阮一峰的网络日志: [SSH 原理与运用（一）：远程登录](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html)

Git: [服务器上的 Git - 生成 SSH 公钥](https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)

## SSH 是什么？

`SSH` 是一种网络协议，用于计算机之间的加密登录。

## 怎么做到的安全？

1. 远程主机发布公钥给用户。
2. 用户使用这个公钥加密自己的密码，发送给远程主机。
3. 远程主机用自己的私钥解密。

## 问题？

`SSH` 协议不像 `HTTP` 协议，`SSH` 的公钥没有证书中心认证。如果攻击者伪造远程主机，向用户发送公钥。就可以获取用户的密码。

## SSH 的应对方法

如果用户是第一次登录远程主机，系统会出现下面的提示：

```
$ ssh user@host

The authenticity of host 'host (12.18.429.21)' can't be established.

RSA key fingerprint is 98:2e:d7:e0:de:9f:ac:67:28:c2:42:2d:37:16:58:4d.

Are you sure you want to continue connecting (yes/no)?
```

意思就是，无法确认主机的真实性。只知道它的 `RSA key` ，是否继续链接？

所谓 `RSA key` 就是公钥指纹。用户怎么知道真实主机的公钥指纹是多少呢？

没什么好办法，真实主机会将公钥指纹公布在自己的网站上。需要用户自己去做对比。

如果确认了真实性，输入 `yes`，就会要求输入密码，进行登录。

这时，主机的公钥会被保存在本地的 `$HOME/.ssh/known_hosts` 中，下次再请求的时候，就会跳过警告，直接要求输入密码。

## 不想每次都使用密码登录

可以使用 公钥 登录

1. 用户将自己的公钥告诉主机
2. 请求的时候，主机会将一段字符串发送给用户，用户用私钥加密，发送给主机。
3. 主机用用户提供的公钥解密。

这种方法要求用户提供自己的公钥。

如果没有，可以使用 `ssh-keygen` 生成一个。

运行结束以后，会在 `~/.ssh` 文件夹下生成 `id_rsa` 和 `id_rsa.pub` 两个文件。前者是私钥，后者是公钥。将后者的内容告诉远程主机即可。

## 换电脑管理仓库

换电脑后，想要往远程仓库推送代码，需要使用 `SSH Key` 的方式。

首先要在新电脑内生成 `SSH key`

```shell
ssh-keygen -t rsa -C "email@xxx.com" # 邮箱
```

获取 `SSH key`

```shell
cd ~/.ssh
ls
cat id_rsa.pub
```

拷贝它，然后添加这个 `key` 到 `github` 的 `ssh keys` 配置里。

然后使用 `SSH` 的方式 `clone` 项目就行。

如果你是先使用的 `HTTPs` 的方式 `clone` 的项目，会发现不能推送更改到仓库。

这时候需要更改为 `SSH` 的方式

```shell
git remote set-url origin git@github.com:xxx/xxx.git
```
