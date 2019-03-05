# 子项目（item）属性记忆
### 1⃣️order
相当于`z-index`的作用。不过与`z-index`相反。`order`的数值越小，项目越排在前面。这里设置第六的项目的`order`为-1.（默认都是0）.
![image](http://h0.hucdn.com/open201910/964f89e1e7dec841_514x416.png)

### 2⃣️flex-grow
有剩余空间时，项目放不放大的一个属性。默认值为0，即不放大。当有一个项目设置>0时，它将一个人“独吞”剩余空间大小。当有"竞争者"时，根据各自`flex-grow`的大小，分配剩余空间的大小。
![image](http://h0.hucdn.com/open201910/caae3aefc3dd704e_436x416.png)
![image](http://h0.hucdn.com/open201910/1265ea66c8ef46b6_480x408.png)
![image](http://h0.hucdn.com/open201910/9e9b0e2522d9396c_616x414.png)

### 3⃣️️flex-shrink
默认所有项目的该值都为1.即当空间不足时，所有的项目都将缩小。
![image](http://h0.hucdn.com/open201910/bad8cd4b8ad51793_434x396.png)

当某个项目设置`flex-shrink`值为0时，该项目将不会缩小。
![image](http://h0.hucdn.com/open201910/f2dc144f111e6c73_430x406.png)

### 4⃣️flex-basis
默认值auto.定义项目在分配剩余空间之前，占据的主轴空间。其实就是width.默认就是项目本来的大小。可以和设置width一样，设置一个固定值。

### 5⃣️flex
就是`flex-grow,flex-shrink,flex-basis`三个属性的合并。
默认值是`0 1 auto`.就是有剩余空间也不占据剩余空间，空间不足时要缩小，不放大不缩小时显示自身大小。

### 6⃣️align-self
默认auto.继承父容器的align-items属性对齐。该属性设置，可以允许该项目有不一样的对齐方式。
