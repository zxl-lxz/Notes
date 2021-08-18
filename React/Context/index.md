# Context 实现组件通信

## React.createContext

创建一个 `Context` 对象。

```js
const MyContext = React.createContext();
```

## Context.Provider

```js
<MyContext.Provider value={}>

</MyContext.Provider>
```

## Context.Consumer

消费组件,让函数组件可以取到 `context` 的值

```js
<MyContext.Consumer>{(value) => {}}</MyContext.Consumer>
```

## useContext

```js
const value = useContext(MyContext);
```

一个大佬的封装例子：

```js
import React, { createContext, useReducer, useContext, useCallback, useEffect, useRef } from 'react';

// 定义一个state Context
export const ButtonAuthStateCtx = createContext({});
// 定义一个dispatch Context
export const ButtonAuthDispatchCtx = createContext();

// context 的初始值
const initialState = {
    // ...
};

// 改变context的reducer
const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'update':
            return Object.assign({}, state, payload);
        default:
            return state;
    }
};

// 使用方法
export const useButtonAuthDispatch = (params, { manual = false } = {}) => {
    const context = useContext(ButtonAuthDispatchCtx) || {};
    return context;
};

// 使用值
export const useButtonAuthState = () => {
    const context = useContext(ButtonAuthStateCtx);
    return context || {};
};

// 自定义hook,返回值和改变值的方法
export const useButtonAuth = (params, option = {}) => {
    const stateCtx = useButtonAuthState();
    const dispatchCtx = useButtonAuthDispatch(params, option);
    return [stateCtx, dispatchCtx];
};

const ButtonAuthProvider = ({ children }) => {
    const [config, dispatch] = useReducer(reducer, initialState);

    return (
        <ButtonAuthDispatchCtx.Provider
            value={{
                setButtonAuthState: dispatch,
            }}
        >
            <ButtonAuthStateCtx.Provider value={config}>{children}</ButtonAuthStateCtx.Provider>
        </ButtonAuthDispatchCtx.Provider>
    );
};

export default ButtonAuthProvider;
```
