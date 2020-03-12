class Point {
    _foo = 'fooooooo';
    _age = 23;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add() {
        return this.x + this.y;
    }
    get prop() {
        return 'getter'
    }
    set prop(value) {
        console.log(value);
    }
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('fpp');
    }
    baz() {
        console.log(this._age);
    }
}

let point1 = new Point(1, 2);
console.log(point1.add());
console.log(point1.hasOwnProperty('x'), point1.hasOwnProperty('add'));
console.log(point1.prop, point1.prop = 123);
console.log(Point.bar(), point1.bar());
console.log(new Point().baz());
