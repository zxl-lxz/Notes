// 两个数之间的随机数，包含最小，不包含最大
const fun1 = (min, max) => {
    return Math.random() * (max - min) + min;
};

// ------------------------------------------------------------

// 两个数之间的随机整数，包含最小，不包含最大
const fun2 = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

// --------------------------------------------------------------------

// 两个数之间的随机整数，包含两个数
const fun3 = (min, max) => {
    min = Math.ceil(min);

    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1 )) + min;
};

// -----------------------------------------------------------------------------

// 用递归创造一个长度为5，值在2-32之间的整数，不重复。
let i = 0;

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomArr(arr, num) {
    if (arr.indexOf(num) < 0) {
        arr[i] = num;
        i++;
    } else {
        num = randomNum(2, 32);
    }
    if (i >= arr.length) {
        console.log(arr);
        return;
    } else {
        randomArr(arr, num);
    }
}
let arr = new Array(5);
let num = randomNum(2, 32);
randomArr(arr, num);






