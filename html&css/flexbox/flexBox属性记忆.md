# 父容器属性记忆
### flex-derection 
- [x] row(默认):其实就是从左到右排列
- [x] row-reverse：从右到左
- [x] colum：从上到下
- [x] colum-reverse：从下到上

![image](https://cloud.githubusercontent.com/assets/10307282/23820897/3a74719c-065e-11e7-9437-a646d84add48.gif)
![image](https://cloud.githubusercontent.com/assets/10307282/23820898/3a779f66-065e-11e7-8493-8490e494cc39.gif)

### flex-wrap
- [x] no-wrap(默认)：自元素宽度累计超出了父元素最大宽度也不换行！
- [x] wrap:换行了！并且会自适应的换行。保证排列整齐！
- [x] wrap-reverse:不仅换行，第一行在最后了～

### flex-flow
上面两个属性合并成一个属性啦！当你又想控制排列方向又想换行的时候，用这个就行。`flex-flow: colum wrap;`

### justify-content
沿着主轴的对齐方式。假设主轴从左到右。
一共其实就6种表现方式。
![image](http://h0.hucdn.com/open201910/6a8cb9f1cbb94d2a_1618x552.png)
![image](http://h0.hucdn.com/open201910/654807743b640b62_996x530.png)
![image](http://h0.hucdn.com/open201910/9f34fda341544958_992x526.png)
![image](http://h0.hucdn.com/open201910/74a5a84977d256e1_998x526.png)
![image](http://h0.hucdn.com/open201910/02606551ae22f21c_996x520.png)
![image](http://h0.hucdn.com/open201910/df1226eb9f9ad904_998x524.png)

### align-items
在交叉轴上的对齐方式。
默认情况下是strech,项目会拉伸至最大高度。
换行了的话，其实相当于将父容器平分，每一部分有自己的主轴和交叉轴。
下面图1，2，5是没有写高度的。其它都写死了高度。
![image](http://h0.hucdn.com/open201910/d8fbfa9abe071452_1004x760.png)
![image](http://h0.hucdn.com/open201910/8a5fae8fff831a7d_996x758.png)
![image](http://h0.hucdn.com/open201910/299c1fa1ab2c17b9_992x750.png)
![image](http://h0.hucdn.com/open201910/70a53e24f380df97_996x750.png)

### align-content
上面例子都是有换行的。其实就是有多个主轴了。这个属性就相当于将每一个有主轴的模块当作整个父容器的子项目，起到了justify-content类似的作用。
![image](http://h0.hucdn.com/open201910/9e7b1cdcc88a7ca6_1000x758.png)
![image](http://h0.hucdn.com/open201910/65d12cd7487d0481_992x754.png)
![image](http://h0.hucdn.com/open201910/4225901658e60022_1000x750.png)
![image](http://h0.hucdn.com/open201910/21bd96445f6f552b_1008x750.png)
![image](http://h0.hucdn.com/open201910/9e12dc5e4bffcd35_1004x754.png)
![image](http://h0.hucdn.com/open201910/ce3bec593acc79ac_1014x754.png)
![image](http://h0.hucdn.com/open201910/f67d5379dae55ffa_1000x762.png)
