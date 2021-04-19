/**
 * const iphone = ['iphone12', 'iphone12Pro'];
 * const size = ['128G', '256G'];
 * const color = ['蓝色', '绿色'];
 * ......无限维度
 * 输出所有sku
 * 
 * 全排列 回溯算法
*/

const allSku = (...arr) => {
    let result = [];
    let helper = (currentIndex, pre) => {
        const current = arr[currentIndex];
        const isLast = currentIndex === arr.length - 1;
        for (let val of current) {
            let cur = pre.concat(val);
            if (isLast) {
                result.push(cur);
            } else {
                helper(currentIndex + 1, cur);
            }
        }
    }
    helper(0, []);
    return result;
}

allSku(iphone, size, color); // [['iphone12', '128G', '蓝色'], ['iphone12', '256G', '绿色'], ......]