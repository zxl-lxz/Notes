let deepClone = (obj, cache= []) => {
    // null
    // typeof 'a' === 'string'
    // typeof 1 === 'number'
    // typeof undefined === 'undefined'
    // typeof function === 'function'
    // typeof NaN === 'number'
    // typeof Symbol() === 'symbol'
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // new String()
    if (obj instanceof String) {
        return new String(obj.valueOf());
    }
    // new Boolean()
    if (obj instanceof Boolean) {
        return new Boolean(obj.valueOf());
    }
    // new Number();
    if (obj instanceof Number) {
        return new Number(obj.valueOf());
    }
    // new Date()
    if (obj instanceof Date) {
        return new Date(obj.valueOf());
    }
    // /\d+/g  new RegExp(/\d+/g)
    if (obj instanceof RegExp) {
        return new RegExp(obj.valueOf());
    }

    // 防止循环调用：每次将obj存储，并判断是否已经存在，若存在，不再进行递归。
    let hit = cache.filter((item) => item.origin === obj)[0];
    if (hit) {
        return hit.newObj;
    }
    const newObj = obj instanceof Array ? [] : {};
    cache.push({
        origin: obj,
        newObj,
    });
    // typeof [] === 'object'
    // typeof {} === 'object'
    for (let k in obj) {
        newObj[k] = deepClone(obj[k], cache);
    }
    return newObj;
}