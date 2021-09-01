// Pub Sub 模式

class Publisher {
  constructor() {
    this.subs = [];
  }

  add(sub) {
    this.subs.push(sub);
  }

  remove(sub) {
    this.subs = this.subs.filter(item => item !== sub);
  }

  notify() {
    this.subs.forEach(item => {
      item.update();
    })
  }
}

class Sub {
  update() {
    // ...
  }
}