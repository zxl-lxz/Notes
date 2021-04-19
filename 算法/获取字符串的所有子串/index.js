/**
 * input: 'ABC'
 * output: [['A'], ['B'], ['C'], ['AB'], ['BC'], ['ABC']]
 * 
 * 需要注意的是 子串是连续的。这意味着 AC 不是子串
 * 
 * 思路：利用splice方法。两个变量。一个是start表示开始位置。一个是clen表示截取的长度。
*/

const getAllChildString = (str) => {
    const result = [];
    for (let clen = 1; clen <= str.length; clen++) {
        let start = 0;
        while (start + clen <= str.length) {
            result.push(str.split('').splice(start, clen));
            start++;
        }
    }
    return result;
}