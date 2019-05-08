let s = new Set();

console.log(s);

const arr = [1, 2, 3, 4, 2, 2, 4];

arr.forEach((item) => {
    s.add(item);
});

console.log(s);

// 数组去重
console.log([...new Set(arr)]);

// 字符串去重
console.log([...new Set('asdfasdf')].join(''));

// add方法
console.log(s.add(1)); // => 1,2,3,4
console.log(s.add(5)); // => 1,2,3,4,5

// delete方法,返回布尔值，表示是否删除成功
s.delete(5); // => true
s.delete(6); // => false
console.log(s); // => 1,2,3,4

// has方法
console.log(s.has(5)); // => false

// keys,values,entries
console.log(s.keys(), s.values(), s.entries());

s.forEach((v, k) => {
    console.log(v, k);
});

let ws = new WeakSet([[1, 2], [3, 4]]); // => {[1, 2], [3, 4]}