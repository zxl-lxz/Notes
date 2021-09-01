// 缓存代理

const addAll = (...args) => {
  let result = 0;
  args.forEach(item => {
    result += item;
  })
}

const proxyAddAll = (function() {
  let cache = [];
  return function() {
    const args = Array.prototype.join.call(arguments, ',');
    if (args in cache) {
      return cache[args];
    }
    cache[args] = addAll(...arguments);
    return cache[args];
  }
})()

