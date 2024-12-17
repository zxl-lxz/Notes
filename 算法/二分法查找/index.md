二分法，初始定义 left mid right，根据 mid 与 target 的对比，来动态的将 left 和 right 更新为上一次 mid 的位置，这样就砍掉了一半的区间，再更新 mid 的值，如此循环往复

这里需要注意的是 `[left, right]` 都是闭区间，以及 `[left, right)` 这种左闭右开的区别

[704. 二分查找](https://leetcode.cn/problems/binary-search/description/)

```js
// 都是闭区间
var search = function (nums, target) {
    let mid,
        left = 0,
        right = nums.length - 1;

    while (left <= right) {
        mid = left + ((right - left) >> 1);
        if (nums[mid] > target) {
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
};

// 左闭右开
var search = function (nums, target) {
    let mid,
        left = 0,
        right = nums.length;

    while (left < right) {
        mid = left + ((right - left) >> 1);
        if (nums[mid] > target) {
            right = mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            return mid;
        }
    }
    return -1;
};
```
