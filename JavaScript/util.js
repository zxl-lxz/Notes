// 将一个字符串中的大小写转换
const convertCase = (str) => {
    return str.replace(/([a-z]*)([A-Z]*)/g, (m, s1, s2) => {
        return `${s1.toUpperCase()}${s2.toLowerCase()}`
    });
};

console.log(convertCase('abcABC')); // ABCabc


