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
