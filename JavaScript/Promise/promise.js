function Promise(executor) {
    let self = this;

    self.status = 'pending';
    self.data = undefined;
    self.onResolvedCallback = [];
    self.onRejectedCallback = [];

    function resolve(value) {
        if (self.status === 'pending') {
            self.status = 'resolved';
            self.data = value;
            for (let cb of self.onResolvedCallback) {
                cb(value);
            }
        }
    }

    function reject(err) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.data = err;
            for (let cb of self.onRejectedCallback) {
                cb(value);
            }
        }
    }

    executor(resolve, reject);
}

Promise.prototype.then = function (onResolved) {
    return new Promise((resolve, reject) => {
        try {
            const x = onResolved(this.data);
            if (x instanceof Promise) {
                x.then(resolve, reject);
            }
            resolve(x);
        } catch (err) {
            reject(err);
        }
    })
}

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new Error('Array is needed');
        }
        const promisesLength = promises.length;
        let current = 0;
        const result = [];

        for (let i = 0; i < promisesLength; i++) {
            Promise.resolve(promises[i]).then((value) => {
                current++;
                result[i] = value;
                if (current === promisesLength) {
                    return resolve(result);
                }
            }, error => {
                reject(error)
            })
        }
    })
}

function race(promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            promise.then(resolve, reject);
        }
    })
}