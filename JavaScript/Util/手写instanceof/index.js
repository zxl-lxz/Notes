function instanceof (obj, target) {
    let proto = Object.getPrototypeOf(obj);
    let targetPrototype = Object.getPrototypeOf(target);

    while (true) {
        if (!proto) {
            return false;
        }
        if (proto === targetPrototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
}

// 判断obj的原型链上是否存在target函数的prototype