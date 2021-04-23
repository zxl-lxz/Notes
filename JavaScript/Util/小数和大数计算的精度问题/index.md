## 处理 `JS小数的加减乘除` 可能产生精度丢失的问题

```js
// 加法
// 0.1 + 0.02
const add = (num1, num2) => {
    // 1
    const len1 = num1.toString().split('.')[1].length;
    // 2
    const len2 = num1.toString().split('.')[1].length;

    // 100
    const multiple = Math.pow(10, Math.max(len1, len2));

    return (num1 * multiple + num2 * multiple) / multiple;
};

// 减法
const subtract = (num1, num2) => {
    const len1 = num1.toString().split('.')[1].length;
    const len2 = num1.toString().split('.')[1].length;

    const multiple = Math.pow(10, Math.max(len1, len2));

    const n = len1 > len2 ? len1 : len2;

    return Number(((num1 * multiple - num2 * multiple) / multiple).toFixed(n));
};

// 乘法

const multiple = (num1, num2) => {
    const len1 = num1.toString().split('.')[1].length;
    const len2 = num1.toString().split('.')[1].length;

    const multiple = Math.pow(10, len1 + len2);

    return (Number(num1.replace('.', '')) * Number(num2.replace('.', ''))) / Math.pow(10, multiple);
};

// 除法
const divide = (num1, num2) => {
    const len1 = num1.toString().split('.')[1].length;
    const len2 = num1.toString().split('.')[1].length;

    const multiple = Math.pow(10, len1 + len2);

    return (num1 / num2) * Math.pow(10, len2 - len1);
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

    num1 = num1.padString(maxLen, 0);
    num2 = num2.padString(maxLen, 0);

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
