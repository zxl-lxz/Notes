const currying = (fn, ...args) => args.length >= fn.length ? fn(...args) : currying.bind(null, fn, ...args);