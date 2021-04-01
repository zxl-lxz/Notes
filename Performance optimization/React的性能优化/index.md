# React 性能优化

本文参考 `React官网` 和 [如何对 React 函数式组件进行优化 - 掘金 - 桃翁](https://juejin.cn/post/6844904000043614222#heading-0)

以下是整理的正文

---

`React` 内部已经使用了很多技巧优化了 `UI` 的更新和 `DOM` 操作。大部分情况下，我们不需要特意去做针对 `React` 的性能优化。尽管如此，以下依然是一些可以提升速度的方法。

## 使用生产版本

`React` 默认包含了很多警告信息，以便在开发过程中提示一些有用的反馈。然而这些信息包的体积并不算小。我们部署到服务器的包，一定要使用生产环境的 `React`。

通过安装 `React DevTools` 可以帮助我们判断，当前使用的是生产环境还是开发环境。

## 虚拟化长列表

参考 [react-window](https://react-window.now.sh/#/examples/list/fixed-size)

使用这个组件库，可以很方便的减少长列表中 UI 的更新。

## React.lazy()

懒加载组件

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <section>
                    <OtherComponent />
                    <AnotherComponent />
                </section>
            </Suspense>
        </div>
    );
}
```

## 跳过渲染

`React` 通过 `diff` 算法，已经尽可能的减少了需要更新的 `DOM节点` 的数量。不过如果我们知道何时可以不用更新 `DOM` ，我们可以通过以下这些方法来跳过渲染。

### shouldComponentUpdate

`shouldComponentUpdate` 生命周期钩子函数会在每次 `props` 或者 `state` 更新时执行。其默认返回 `true`，即需要渲染。

通过比较 `this.props 和 next.props`、`this.state 和 next.state`。如果当前 `state或者props` 的更改确实不需要更新 `DOM` ，那么便可以返回 `fasle` 去避免不必要的 `render` 和 后续的 `ComponentDidUpdate` 的执行。（说实话，确定不是需要将这个 `state` 的属性不要定义在 state 里吗???）

`React` 默认提供了 `PureComponent` 来内置了这个功能。但是其只会对更改前的值和更改后的值做浅比较。使用拓展运算符能够比较好的解决这一问题。（当然任何返回新对象的方法都可以）.

不建议在 `shouldComponentUpdate` 里做深度比较或者执行深克隆。这样将会损害性能。

### React.memo()

`React.memo` 其实就是一个高阶组件。其接收一个组件作为参数，返回一个新组件。

这个新组件只有在其 `props` 更改时，才会重新渲染这个组件，否则将直接返回“记忆”中的上一次的结果。

```js
// Child
function Child(props) {
    return <div>{props.name}</div>;
}
```

```js
// App
class App extends React.Component() {
    state = {
        title: '',
    };
    changeTitle = () => {
        this.setState({
            title: 'i am changed!',
        });
    };
    render() {
        return (
            <div>
                <span>{this.state.title}</span>
                <button onClick={this.changeTitle}>Click Me</button>
                <Child name="zxl" />
            </div>
        );
    }
}
```

上述代码中，我只是更改了父组件的 `title`，并没有更新 `Child` 组件所接收的 `name`。但是在 `title` 更新后，不仅 `App` 组件会重新渲染，`Child` 组件也会重新渲染。

我们如果想避免这种情况，可以使用 `React.memo()`

```js
function Child(props) {
    return <div>{props.name}</div>;
}

export default React.memo(Child);
```

`React.memo` 默认只会对 `props` 做浅比较。如果想做深度比较，更加精准的控制，可以传入第二个参数

```js
React.memo(Child, (preProps, nextProps) => {});
```

### UseCallback

这个 `Hook` 用于给 `Clild` 传递了函数的情况下的跳过渲染。什么意思呢？

```js
// Child
function Child(props) {
    return (
        <div>
            <span>{props.name}</span>
            <button onClick={props.changeTitle}>Click Me</button>
        </div>
    );
}

export default React.memo(Child);
```

```js
// App
class App extends React.Component() {
    state = {
        title: '',
        subTitle: '',
    };
    changeTitle = () => {
        this.setState({
            title: 'i am changed!',
        });
    };
    changeSubTitle = () => {
        this.setState({
            subTitle: 'subTitle Changed!',
        });
    };
    render() {
        return (
            <div>
                <span>{this.state.title}</span>
                <button onClick={this.changeSubTitle}>Click Me</button>
                <Child name="zxl" changeTitle={this.changeTitle} />
            </div>
        );
    }
}
```

无论当我们点击 `App` 中的按钮改变 `subTitle` ，还是点击 `Child` 中的按钮改变 `title`。都会触发 `Child` 的更新。为什么呢？

注意到 `App` 中的 `ChageTitle` 是我们传入 `Child` 的 `props` 的属性。而当 `App` 更新的时候，会重新创建一个 `changeTitle` 函数。这就是弊病所在。

`useCallback` 就是为了解决这个问题。

```js
// App
import React, { useCallback } from 'react';
class App extends React.Component() {
    state = {
        title: '',
        subTitle: '',
    };
    changeTitle = () => {
        this.setState({
            title: 'i am changed!',
        });
    };
    changeSubTitle = () => {
        this.setState({
            subTitle: 'subTitle Changed!',
        });
    };
    render() {
        const memoizedCallback = useCallback(this.changeTitle, []);
        return (
            <div>
                <span>{this.state.title}</span>
                <button onClick={this.changeSubTitle}>Click Me</button>
                <Child name="zxl" changeTitle={memoizedCallback} />
            </div>
        );
    }
}
```

参考：[useCallback](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)

### useEffect 的第二个参数

参考 [通过跳过 Effect 进行性能优化](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)

## 跳过计算

### useMemo

当有一个函数需要很长的执行时间，而其值影响到了 `DOM` 的渲染，但并不是唯一因素的时候，就需要用到这个 `hook`了。什么意思呢？

```js
function Cal() {
    const [count, setCount] = useState(0);
    const longTimeCal = () => {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += i;
        }
        return result;
    };
    const value = longTimeCal();
    return (
        <div>
            <span>{count + value}</span>
            <button onClick={(count) => setCount(count + 1)} />
        </div>
    );
}
```

每次重新渲染的时候，都需要计算一遍这个函数的值。这就是弊病所在。

我们使用 `useMemo` 做优化。

```js
function Cal() {
    const [count, setCount] = useState(0);
    const longTimeCal = () => {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += i;
        }
        return result;
    };
    const value = useMemo(longTimeCal, []);
    return (
        <div>
            <span>{count + value}</span>
            <button onClick={(count) => setCount(count + 1)} />
        </div>
    );
}
```

## key 的使用

养成好习惯～

## Profiler

`React DevTools` 提供的分析性能的工具。详细用法请看[React Profiler 介绍](https://zh-hans.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html#reading-performance-data)
