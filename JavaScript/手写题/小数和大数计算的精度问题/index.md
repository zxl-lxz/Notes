## 处理 `JS小数的加减乘除` 可能产生精度丢失的问题

```js
// 加法
// 0.1 + 0.02
// 小数
const add = (a, b) => {
    const len1 = a.toString().split('.')[1].length;
    const len2 = b.toString().split('.')[1].length;

    const multiple = Math.pow(10, Math.max(len1, len2));

    return (a * multiple + b * multiple) / multiple;
};

const substruct = (a, b) => {
    const len1 = a.toString().split('.')[1].length;
    const len2 = b.toString().split('.')[1].length;

    const multiple = Math.pow(10, Math.max(len1, len2));

    const n = len1 > len2 ? len1 : len2;

    return Number(((a * multiple - b * multiple) / multiple).toFixed(n));
};

const _multiple = (a, b) => {
    const len1 = a.toString().split('.')[1].length;
    const len2 = b.toString().split('.')[1].length;

    const multiple = Math.pow(10, len1 + len2);

    return (a.toString().replace('.', '') * b.toString().replace('.', '')) / multiple;
};

const divide = (a, b) => {
    const len1 = a.toString().split('.')[1].length;
    const len2 = b.toString().split('.')[1].length;

    const multiple = Math.pow(10, Math.max(len1, len2));

    return (a * multiple) / (b * multiple);
};
```

## 处理 `JS大数的加减乘除` 可能产生精度丢失的问题

```js
// 加法
//     34382764893242364286
// 237457357392648643654386
const add = (num1, num2) => {
    num1 = num1.toString();
    num2 = num2.toString();

    const maxLen = Math.max(num1.length, num2.length);

    num1 = num1.padStart(maxLen, 0);
    num2 = num2.padStart(maxLen, 0);

    let temp = 0;
    let flag = 0;
    let result = '';
    for (let i = maxLen - 1; i >= 0; i--) {
        temp = flag + parseInt(num1[i]) + parseInt(num2[i]);
        result = (temp % 10) + result;
        flag = parseInt(temp / 10);
    }
    result = (flag === 1 ? '1' : '') + result;
    return result;
};
```
