# 父容器属性记忆

### flex-derection

-   [x] row(默认):其实就是从左到右排列
-   [x] row-reverse：从右到左
-   [x] colum：从上到下
-   [x] colum-reverse：从下到上

![image](https://cloud.githubusercontent.com/assets/10307282/23820897/3a74719c-065e-11e7-9437-a646d84add48.gif)
![image](https://cloud.githubusercontent.com/assets/10307282/23820898/3a779f66-065e-11e7-8493-8490e494cc39.gif)

### flex-wrap

-   [x] no-wrap(默认)：子元素宽度累计超出了父元素最大宽度也不换行！
-   [x] wrap:换行了！并且会自适应的换行。保证排列整齐！
-   [x] wrap-reverse:不仅换行，第一行在最后了～

### flex-flow

上面两个属性合并成一个属性啦！当你又想控制排列方向又想换行的时候，用这个就行。`flex-flow: colum wrap;`

### justify-content

沿着主轴的对齐方式。假设主轴从左到右。
一共其实就[6 种表现方式](https://github.com/1282772905/Notes/blob/master/html%26css/flexbox/flex.html)

### align-items

在交叉轴上的对齐方式。
默认情况下是 strech,项目会拉伸至最大高度。
换行了的话，其实相当于将父容器平分，每一部分有自己的主轴和交叉轴。

### align-content

上面例子都是有换行的。其实就是有多个主轴了。这个属性就相当于将每一个有主轴的模块当作整个父容器的子项目，起到了 justify-content 类似的作用。
