# Redux 初步流程梳理

首先安装两个包

`npm i redux`

`npm i react-redux`

## 跟着案例去学习

假设现在有这样一个简单的功能。

一个数字。一个按钮 ➕，一个按钮 ➖。

点击 ➕，数字加一。

点击 ➖，数字减一。

如果不用`redux`，代码如下：

```js
// 入口文件index.js
// ...
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
// ...
```

```js
// app.js
// ...
function App() {
  return (
    // ...
    <CountCal />
  )
}
// ...
```

```js
// countCal.js

import React, { Component } from 'react'

class CountCal extends Component {
    constrctor(props) {
        super(props)
        this.state = {
            count: 0,
        }
    }
    add() {
        this.setState((preState) => {
            return {
                count: preState.count + 1,
            }
        });
    }
    less() {
        this.setState((preState) => {
            return {
                count: preState.count - 1,
            }
        });
    }
    render() {
        return (
            <span>{this.state.count}</span>
            <button onClick={this.add.bind(this)}>
            +
            <button>
            <button onClick={this.less.bind(this)}>
            -
            <button>
        )
    }
}
export default CountCal
```

现在，我们这个 count 在整个项目中任何地方都要用，就不能只把它放在这里里。这时候`redux`就派上用场了。

首先，我们新建一个`store`文件夹 📁。

这里面存放所有跟`redux`相关的文件。

在`store`里创建`state/index.js`文件.用来存放所有的初始数据。

```js
// store/state/index.js

export default {
  count: 0,
}
```

`redux`使用`reducer`去返回数据。所以，我们想在页面拿到数据，必须先创建`reducer`.

创建`store/reducer.js`

```js
// store/reducer.js

import { combineReducers } from 'redux'
import defaultState from './state'

const calCount = (state = defaultState.count, action) => {
  if (action.type === 'ADD') {
    return state + action.value
  }
  if (action.type === 'LESS') {
    return state - action.value
  }
  return state
}

const reducer = combineReducers({
  calCount,
})

export default reducer
```

新建`store/index.js`

```js
// store/index.js

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

export default store
```

回到我们的页面

在入口文件，用`react-redux`提供的`Provider`包裹容器，这样可以在页面任何地方使用 store 里的数据。

```js
// 入口文件index.js

import { Provider } from 'react-redux'
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
```

```js
// CountCal.js

import React, { Component } from 'react'
import { connect } from 'react-redux'

class CountCal extends Component {
    constrctor(props) {
        super(props)
    }
    add() {
        // 通过dispatch向数据中心传递action
        this.props.dispatch({
                type: 'ADD',
                value: 1,
        });
    }
    add() {
        // 通过dispatch向数据中心传递action
        this.props.dispatch({
                type: 'LESS',
                value: 1,
        });
    }
    render() {
        return (
            <span>{this.props.count}</span>
            <button onClick={this.add.bind(this)}>
            +
            <button>
            <button onClick={this.less.bind(this)}>
            -
            <button>
        )
    }
}

// 通过state可以拿到reducer里面的函数返回值
const getCount = (state) => {
    return {
        count: state.calCount,
    }
}

// 通过connect将拿到的值以props为载体传递给页面
export default connect(getCount)(CountCal)
```
