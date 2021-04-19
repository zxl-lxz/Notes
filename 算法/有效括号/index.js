/**
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 * 
 * 有效字符串需满足：
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 * 注意空字符串可被认为是有效字符串。
 * 
 * 示例 1:
 * 输入: "()"
 * 输出: true
 * 
 * 
 * 示例 2:
 * 输入: "()[]{}"
 * 输出: true
 * 
 * 示例 3:
 * 输入: "(]"
 * 输出: false
 * 
 * 示例 4:
 * 输入: "([)]"
 * 输出: false
 * 
 * 示例 5:
 * 输入: "{[]}"
 * 输出: true
 * 
 * */

// 栈

const isP = (left, right) => {
    return (left === '(' && right === ')') ||
        (left === '[' && right === ']') ||
        (left === '{' && right === '}')
}
const isValid = function (s) {
    const stack = [];
    const sArr = s.split('');
    for (let i = 0; i < sArr.length; i++) {
        if (sArr[i] === '(' || sArr[i] === '[' || sArr[i] === '{') {
            stack.push(sArr[i]);
        } else {
            const popItem = stack.pop(sArr[i]);
            if (!popItem || !isP(popItem, sArr[i])) {
                return false;
            }
        }
    }
    return stack.length === 0 ? true : false;
};

// replace
// 这种情况只限于单个类型。(((())))

const _isValid = (s) => {
    return s.replace(/(\(\))/g, '').length ? false : true;
}



