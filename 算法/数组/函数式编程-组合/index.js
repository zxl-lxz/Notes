// 已知如下数组：var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];

// 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

// 利用函数组合更优雅的展示

// 扁平化
const flatArr = (arr) => arr.flat(Infinity);

// 去重
const remove = (arr) => [...new Set(arr)];

// 排序
const sortArr = (arr) => arr.sort((a, b) => a - b);

// 组合
const compose = (...fns) => (val) => fns.reduceRight((cur, next) => next(cur), val);

// 组合函数
const solveFun = compose(sortArr, remove, flatArr);

// 完毕

const _arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
solveFun(_arr);
