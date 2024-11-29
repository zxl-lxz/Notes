function instanceof (obj, target) {
    let proto = Object.getPrototypeOf(obj);
    const targetPrototype = Object.getPrototypeOf(target);

    while (proto) {
        if (proto === targetPrototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}

// 判断obj的原型链上是否存在target函数的prototype
