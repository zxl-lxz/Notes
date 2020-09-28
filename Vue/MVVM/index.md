# MVVM 与 MVC 的区别

`MVVM` 其实应该叫 `M VM V`.

`Model ViewModel View`。

其核心是 `通过监听数据变化驱动视图。用户只用关心数据操作数据。`

而`MVC` 本质还是操作 `DOM`.数据变化了，还是再将变化后的数据赋值给视图。

像 `Vue,React,Angular`都是 `MVVM` 框架。

`JQ,Zepto` 等都是 `MVC` 框架。

```html
// MVVM

<div>{msg}</div>
<script>
    export default {
        data() {
            return {
                msg: '1'
            }
        }

        created() {
            // 用户只需对数据进行操作
            this.msg = '2'
        }
    }
</script>
```

```html
// MVC

<div id="div1"></div>

<script>
    document.getElementById('#div1').innerHtml = data.msg;
</script>
```

# MVVM 的优点

其优点，要归功于不用操作繁琐的 `DOM`.

1. `低耦合：` 一个数据可以对应多个视图。修改一个数据，可以同时修改多个视图。对于用户来说，大量节省了代码量。数据变化，视图可以不变。视图变化，数据可以没变。不再是一一对应的关系。给复用提供了机会。
2. 上面提到的复用。
3. 上面提到的开发效率，代码量，美观性等。
4. 方便测试。
