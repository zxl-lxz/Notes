class APP {
  handlers = [];
  currentIndex = 0;

  next = () => {
      if (this.currentIndex < this.handlers.length) {
          this.handlers[this.currentIndex++](this.next);
      }
  };

  use(cb) {
      this.handlers.push(cb);
  }

  run() {
      this.next();
  }
}

const v1 = (obj) => {
  const {name} = obj;
  if (!name) {
    console.log('没有名字');
  }
  if (typeof name !== 'string') {
    console.log('名字不是字符串');
  }
}

const v2 = (obj) => {
  const {age} = obj;
  if (!age) {
    console.log('没有年龄');
  }
  if (typeof age !== 'number') {
    console.log('年龄不是数字');
  }
}

const app = new App();

const myObj = {
  name: '',
  age: 23,
};

app.use((next) => {
  v1(myObj);
  next();
});
app.use((next) => {
  v2(myObj);
  next();
});

app.run();