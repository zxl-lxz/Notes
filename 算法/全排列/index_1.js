// 给定一个 没有重复 数字的序列，返回其所有可能的全排列。

// 示例:

// 输入: [1,2,3]
// 输出:
// [
//   [1,2,3],
//   [1,3,2],
//   [2,1,3],
//   [2,3,1],
//   [3,1,2],
//   [3,2,1]
// ]

const solveFun = (nums) => {
    const result = [];
    const used = {};

    const helper = (current) => {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        for (let num of nums) {
            if (used[num]) continue;
            current.push(num);
            used[num] = true;
            helper(current);
            current.pop();
            used[num] = false;
        }
    }

    helper([]);

    return result;
}