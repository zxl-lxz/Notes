const arr = [1, 2, [3, 4, [5, 6]], 7, 8, 9];

if (!Array.prototype.flat) {
    Array.prototype.flat = function (num = 1) {
        if (!Number(num) || Number(num) < 0) {
            return this;
        }
        let arr = [];
        this.forEach((item) => {
            if (Array.isArray(item)) {
                arr = arr.concat(item.flat(--num));
            } else {
                arr.push(item);
            }
        });
        return arr;
    };
}

arr.flat(Infinity);

// 1, 2, 3, 4, 5, 6, 7, 8 ,9


// 数组扁平化去重排序
const arr1 = [1 , 2, 2, [4, 5, 6, 7, 8,], 1, 9, [9, 5, 3, 4, 8, [1, 9, 3, 7]]];

[...new Set(arr1.flat(Infinity))].sort((a, b) => a - b);

// 1, 2, 3, 4, 5, 6, 7, 8 ,9
