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
            for (let i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value);
            }
        }
    }

    function reject(err) {
        if (self.status === 'pending') {
            self.status = 'rejected';
            self.data = err;
            for (let i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](err);
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