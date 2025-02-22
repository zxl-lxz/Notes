
// promise

function Promise(excutor) {
    this.status = 'pending';
    this.value = null;
    this.resolveCbs = [];
    this.rejectCbs = [];

    function resolve(value) {
        if (this.status === 'pending') {
            this.status = 'resolved';
            this.value = value;
            while (this.resolveCbs.length) {
                this.resolveCbs.pop()(value)
            }
        }
    }

    function reject(error) {
        if (this.status === 'pending') {
            this.status = 'rejected';
            this.value = error;
            while (this.rejectCbs.length) {
                this.rejectCbs.pop()(error)
            }
        }
    }

    excutor(resolve, reject);
}

Promise.prototype.then = function (onResolve) {
    return new Promise((resolve, reject) => {
        try {
            const x = onResolve(this.value);
            if (x instanceof Promise) {
                x.then(resolve, reject);
            }
            resolve(x);
        } catch (error) {
            reject(error);
        }
    })
}

// promise.all

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new Error('need Array');
        }

        const length = promises.length;
        const current = 0;
        const result = [];

        for (let i = 0; i < length; i++) {
            Promise.resolve(promises[i]).then((value) => {
                current++;
                result[i] = value;
                if (current === length) {
                    return resolve(result);
                }
            }, (error) => {
                reject(error);
            })
        }
    })
}

// promise.race

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            promise.then(resolve, reject);
        }
    })
}