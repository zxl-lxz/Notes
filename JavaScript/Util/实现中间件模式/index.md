请实现这个 `App` 类

```js
const app = new App();

app.use((next) => setTimeout(() => next(), 500));

app.use((next) => {
    console.log(123);
    next();
});
app.run();
// => 500ms之后打印出123
```

解：

```js
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
```
