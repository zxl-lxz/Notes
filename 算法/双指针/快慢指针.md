一个快指针，取新数组所需要的元素

一个慢指针，指向新数组的下标，等待快指针取到值之后，填入这个新数组的下标中

[27. 移除元素](https://leetcode.cn/problems/remove-element/description/)

```js
var removeElement = function (nums, val) {
    let fastIndex = 0;
    let slowIndex = 0;

    while (fastIndex < nums.length) {
        if (nums[fastIndex] !== val) {
            nums[slowIndex++] = nums[fastIndex];
        }
        fastIndex++;
    }
    return slowIndex;
};
```
