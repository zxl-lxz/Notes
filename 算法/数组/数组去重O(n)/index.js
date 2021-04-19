/**
 * 需要注意的是，k都是字符串。此处省略了对类型对还原判断。
 * 
 * */

const removeDup = (arr) => {
    const map = new Map();
    arr.forEach(item => {
        map[item] = item;
    });
    for (let k in map) {
        result.push(k);
    }
    return Object.keys(map);
}
removeDup([1, 2, 3, 4, 5, 1, 2]);