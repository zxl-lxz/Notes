# React进阶 - 组件、状态、生命周期

go!

## 深入JSX

[小册](https://juejin.cn/book/6945998773818490884/section/6948337148202319908)

我们写的 `jsx` 最终都是调用 `React.createElement` 创建 `react element`。

[React.createElement](https://zh-hans.reactjs.org/docs/react-api.html#createelement)

它是一个对象，其 `props` 属性中的 `children` 属性，保存着子节点。我们写的 `jsx` 代码中，有`函数、文本、组件、map、fragment` 等等。不同的类型，在 `children` 中保存方式也不一样。

之后，每一个子节点都会被转换成对应的 `fiber` ，`fiber` 也会有自己的方式 `tag` 去标识不同的节点类型。

```jsx
const { children } = reactElement.props;
```

我们可以拿到这个属性，也就是我们可以让 render 可控。这在一些场景下是非常有用的。

利用 `React.createElement、React.cloneElement、React.Children.toArray、React.Children.map` 等等方法，我们可以基于现有的 `react element` 做一些更改，生产一个新的 `react element`

[React 顶层API](https://zh-hans.reactjs.org/docs/react-api.html)

## 组件

函数组件和类组件

[小册](https://juejin.cn/book/6945998773818490884/section/6948969962421616654)

### 函数组件

`UI = fn(props) `.在源码里，函数组件是这样处理的：

```js
function renderWithHooks(
  current,          // 当前函数组件对应的 `fiber`， 初始化
  workInProgress,   // 当前正在工作的 fiber 对象
  Component,        // 我们函数组件
  props,            // 函数组件第一个参数 props
  secondArg,        // 函数组件其他参数
  nextRenderExpirationTime, //下次渲染过期时间
){
     /* 执行我们的函数组件，得到 return 返回的 React.element对象 */
     let children = Component(props, secondArg);
}
```

`Component`就是函数组件。可以看到是直接调用的。所以不要给函数组件添加原型属性。因为是直接调用，函数组件没有自己的实例，不能保存当前的状态。所以每一次组件更新都是重新调用方法，里面的变量和函数都会重新初始化。

为了能让函数组件可以保存一些状态，执行一些副作用钩子，React Hooks 应运而生，它可以帮助记录 React 中组件的状态，处理一些额外的副作用。

### 类组件

源码里，类组件是这样处理的：

```js
function constructClassInstance(
    workInProgress, // 当前正在工作的 fiber 对象
    ctor,           // 我们的类组件
    props           // props 
){
     /* 实例化组件，得到组件实例 instance */
     const instance = new ctor(props, context)
}
```

类组件都会继承自 `React.Component`，看看 `Component`是怎么定义的：

```js
function Component(props, context, updater) {
  this.props = props;      //绑定props
  this.context = context;  //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
}
```

这也就是为什么，如果在 `constructor` 里，调用了 `super` 方法，一定要传 `props` 。因为 `props` 就是在 `Component` 函数里，被赋值给了 `this`。`super` 就是调用 `Component` 函数。当然，如果不调用 `super`，类组件默认会调用 `super(...args)`。

类组件因为有实例存在，实例会保存当前的状态，每次更新，只需要调用 `render` 方法就可以。

## State

[小册](https://juejin.cn/book/6945998773818490884/section/6951186955321376775)

`React` 是有多种模式的。

1. `legacy` 模式（现在的默认模式）
2. `blocking` 模式（过渡模式）
3. `concurrent` 模式（未来v18的默认模式）

当前默认模式下，`state` 的更新机制是 `batchUpdate` 批量更新。

我们调用 `setState` 的时候，`React` 做了什么事情呢？

1. `setState` 产生一个当前更新的优先级（老版本用 expirationTime ，新版本用 lane ）。
2. 接下来 React 会从 fiber Root 根部 fiber 向下调和子节点，调和阶段将对比发生更新的地方，更新对比 expirationTime ，找到发生更新的组件，合并 state，然后触发 render 函数，得到新的 UI 视图层，完成 render 阶段。
3. 接下来到 commit 阶段，commit 阶段，替换真实 DOM ，完成此次更新流程。
4. 接下来会执行 setState 中 callback 函数,如上的`()=>{ console.log(this.state.number) }`，到此为止完成了一次 setState 全过程。

批量更新是怎么实现的呢？因为 `React` 采用合成事件，所有的时间都会在下面这个函数处理：

```js
/* 在`legacy`模式下，所有的事件都将经过此函数同一处理 */
function dispatchEventForLegacyPluginEventSystem(){
    // handleTopLevel 事件处理函数
    batchedEventUpdates(handleTopLevel, bookKeeping);
}

function batchedEventUpdates(fn,a){
    /* 开启批量更新  */
   isBatchingEventUpdates = true;
  try {
    /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
    return batchedEventUpdatesImpl(fn, a, b);
  } finally {
    /* try 里面 return 不会影响 finally 执行  */
    /* 完成一次事件，批量更新  */
    isBatchingEventUpdates = false;
  }
}
```

`isBatchingEventUpdates` 开启批量更新。

一旦我们在另一个异步函数中操作 `setState` ，那么当执行到 `setState` 的时候， `isBatchingEventUpdates` 已经变成 `false`  了。

**一个例子，两张图，看懂批量更新：**

```js
export default class index extends React.Component{
    state = { number:0 }
    handleClick= () => {
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback1', this.state.number)  })
          console.log(this.state.number)
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback2', this.state.number)  })
          console.log(this.state.number)
          this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback3', this.state.number)  })
          console.log(this.state.number)
    }
    render(){
        return <div>
            { this.state.number }
            <button onClick={ this.handleClick }  >number++</button>
        </div>
    }
} 
```

![03.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/478aef991b4146c898095b83fe3dc0e7~tplv-k3u1fbpfcp-watermark.awebp)

```js
setTimeout(()=>{
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback1', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{    console.log( 'callback2', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback3', this.state.number)  })
    console.log(this.state.number)
})
```

![04.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e730fc687c4ce087e5c0eab2832273~tplv-k3u1fbpfcp-watermark.awebp)

**另外注意的点：**

1. **在函数组件中，无论何时只能取得到当前的 `state` 值。更改后的值，需要再下一次函数执行的时候。**
2. **函数组件中，如果前后的 `state` 值一样，不会出发重新渲染。而类组件中，如果不是 `pureComponent` ,无论前后值是否一样，都会触发更新。**
3. **类组件的 `setState` 是合并 `state`。函数组件的 `dispatch` 是重新赋值。**

## Props

[小册](https://juejin.cn/book/6945998773818490884/section/6950659615675645990)

`React` 中的 `props` 是非常灵活的。也是组建同学最重要的一种方式。

1. 父组件通过传给子组件一些数据 `props` ,供子组件渲染消费。
2. 通过传 `callback props` 给子组件，子组件可以通知父组件数据的变更。
3. `props` 可以是 `React 组件` ,可以是 `渲染函数`,可以是通过 `children` 传入。
4. 在通过 `children` 传入的时候，可以通过一些 `React` 的全局 `API` 进行操作。

## 生命周期

[小册](https://juejin.cn/book/6945998773818490884/section/6952042099374030863)

### 类组件生命周期

先来看看，在调和过程中，对于 `fiber tag = 1` 的类组件是怎么处理的

```js
/* workloop React 处理类组件的主要功能方法 */
function updateClassComponent(){
  	// shouldUpdate 标识用来证明 组件是否需要更新。
    let shouldUpdate;
  
  	// stateNode 是 fiber 指向 类组件实例的指针。
    const instance = workInProgress.stateNode;
  
  	// instance 为组件实例,如果组件实例不存在，证明该类组件没有被挂载过，那么会走初始化流程
     if (instance === null) {
       	// 组件实例将在这个方法中被new。
        constructClassInstance(workInProgress, Component, nextProps);
       
       	//初始化挂载组件流程
        mountClassInstance(  workInProgress,Component, nextProps,renderExpirationTime );
        shouldUpdate = true;
     } else {
       	// 更新组件流程
        shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderExpirationTime) 
     }
     if(shouldUpdate){
       	/* 执行render函数 ，得到子节点 */
        nextChildren = instance.render();
       
       	/* 继续调和子节点 */
        reconcileChildren(current,workInProgress,nextChildren,renderExpirationTime);
     }
}
```

几个重要概念：

- ① `instance` 类组件对应实例。
- ② `workInProgress` 树，当前正在调和的 fiber 树 ，一次更新中，React 会自上而下深度遍历子代 fiber ，如果遍历到一个 fiber ，会把当前 fiber 指向 workInProgress。
- ③ `current` 树，在初始化更新中，current = null ，在第一次 fiber 调和之后，会将 workInProgress 树赋值给 current 树。React 来用workInProgress 和 current 来确保一次更新中，快速构建，并且状态不丢失。
- ④ `Component` 就是项目中的 class 组件。
- ⑤ `nextProps` 作为组件在一次更新中新的 props 。
- ⑥ `renderExpirationTime` 作为下一次渲染的过期时间。

在组件实例上可以通过 `_reactInternals` 属性来访问组件对应的 fiber 对象。在 fiber 对象上，可以通过 `stateNode` 来访问当前 fiber 对应的组件实例。两者的关系如下图所示。

![lifecycle3.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/018a9cbd20df478a955b84beba770674~tplv-k3u1fbpfcp-watermark.awebp)

#### 组件初始化

初始化的时候，首先执行的是 `constructor`，对应源码里的 `constructClassInstance` 函数。

```js
function constructClassInstance(
    workInProgress, // 当前正在工作的 fiber 对象
    ctor,           // 我们的类组件
    props           // props 
){
     /* 实例化组件，得到组件实例 instance */
     const instance = new ctor(props, context)
}
```

实例化之后，会执行 `mountClassInstance`

```js
function mountClassInstance(workInProgress,ctor,newProps,renderExpirationTime){
    const instance = workInProgress.stateNode;
    const getDerivedStateFromProps = ctor.getDerivedStateFromProps
    
  	/* ctor 就是我们写的类组件，获取类组件的静态方法 */
  	if (typeof getDerivedStateFromProps === 'function') {
     /* 这个时候执行 getDerivedStateFromProps 生命周期 ，得到将合并的state */
     const partialState = getDerivedStateFromProps(nextProps, prevState);
      
     // 合并state
     const memoizedState = partialState === null || partialState === undefined ? prevState : Object.assign({}, prevState, partialState);
      
     workInProgress.memoizedState = memoizedState;
     
     /* 将state 赋值给我们实例上，instance.state  就是我们在组件中 this.state获取的state*/
     instance.state = workInProgress.memoizedState;
  	}
  	if(typeof ctor.getDerivedStateFromProps !== 'function' &&
       typeof instance.getSnapshotBeforeUpdate !== 'function' &&
       typeof instance.componentWillMount === 'function' 
    ) {
      	/* 当 getDerivedStateFromProps 和 getSnapshotBeforeUpdate 不存在的时候 ，执行 componentWillMount*/
      	instance.componentWillMount(); 
  	}
}
```

之后在 `commit` 阶段，会调用 `componentDidMount`

```js
function commitLifeCycles(finishedRoot,current,finishedWork){
     switch (finishedWork.tag){                             /* fiber tag 在第一节讲了不同fiber类型 */
        case ClassComponent: {                              /* 如果是 类组件 类型 */
             const instance = finishedWork.stateNode        /* 类实例 */
             if(current === null){                          /* 类组件第一次调和渲染 */
                instance.componentDidMount() 
             }else{                                         /* 类组件更新 */
                instance.componentDidUpdate(prevProps,prevState，instance.__reactInternalSnapshotBeforeUpdate); 
             }
        }
     }
}
```

#### 更新阶段

上面说到，如何实例存在，则执行 `updateClassInstance` 函数。

```js
function updateClassInstance(current,workInProgress,ctor,newProps,renderExpirationTime){
    const instance = workInProgress.stateNode;
  	// 判断是否具有 getDerivedStateFromProps 生命周期
    const hasNewLifecycles =  typeof ctor.getDerivedStateFromProps === 'function';
  	// 如何没有定义 getDerivedStateFromProps
    if(!hasNewLifecycles && typeof instance.componentWillReceiveProps === 'function' ){
      		// 浅比较 props 不相等
         if (oldProps !== newProps || oldContext !== nextContext) {
           	// 执行生命周期 componentWillReceiveProps
            instance.componentWillReceiveProps(newProps, nextContext); 
         }
    }
    let newState = (instance.state = oldState);
    if (typeof getDerivedStateFromProps === 'function') {
      	/* 执行生命周期getDerivedStateFromProps  ，逻辑和mounted类似 ，合并state  */
        ctor.getDerivedStateFromProps(nextProps,prevState);
        newState = workInProgress.memoizedState;
    }   
    let shouldUpdate = true
    /* 执行生命周期 shouldComponentUpdate 返回值决定是否执行render ，调和子节点 */
    if(typeof instance.shouldComponentUpdate === 'function' ){
        shouldUpdate = instance.shouldComponentUpdate(newProps,newState,nextContext,);
    }
    if(shouldUpdate){
        if (typeof instance.componentWillUpdate === 'function') {
            instance.componentWillUpdate(); /* 执行生命周期 componentWillUpdate  */
        }
    }
    return shouldUpdate
}
```

1. 如果没有定义 `getDerivedStateFromProps`,并且定义了 `componentWillReceiveProps`,而且 `props` 不相等，则执行 `componentWillReceiveProps`

2. 如果定义了 `getDerivedStateFromProps`,则执行它。它会合并 `state`,返回最新的 `state`

3. 如果定义了 `shouldComponentUpdate`,则执行它，根据返回值，判断是否执行 `render`，默认返回true

4. 如果定义了 `componentWillUpdate`,执行它。

5. 执行 `render`.

6. 在 `commit` 阶段，执行 `getSnapshotBeforeUpdate`

   1. ```js
      function commitBeforeMutationLifeCycles(current,finishedWork){
           switch (finishedWork.tag) {
                case ClassComponent:{
                  		/* 执行生命周期 getSnapshotBeforeUpdate   */
                     const snapshot = instance.getSnapshotBeforeUpdate(prevProps,prevState);
                  		/* 返回值将作为 __reactInternalSnapshotBeforeUpdate 传递给 componentDidUpdate 生命周期  */
                      instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                }
           }
      }
      ```

7. 执行 `componentDidUpdate`

   1. ```js
      function commitLifeCycles(finishedRoot,current,finishedWork){
           switch (finishedWork.tag){                             /* fiber tag 在第一节讲了不同fiber类型 */
              case ClassComponent: {                              /* 如果是 类组件 类型 */
                   const instance = finishedWork.stateNode        /* 类实例 */
                   if(current === null){                          /* 类组件第一次调和渲染 */
                      instance.componentDidMount() 
                   }else{                                         /* 类组件更新 */
                      instance.componentDidUpdate(prevProps,prevState，instance.__reactInternalSnapshotBeforeUpdate); 
                   }
              }
           }
      }
      ```

#### 销毁

在调和阶段，如果发现元素被移除，就会在 `commit` 阶段执行 `componentWillUnmount`

#### 总图

![lifesycyle8.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7066da719fda4a91aa2c432f60c58a48~tplv-k3u1fbpfcp-watermark.awebp)

#### 各生命周期应该何时使用，如何使用

##### constructor

1. 初始化state
2. 绑定this，节流，防抖等
3. 生命周期劫持

```js
constructor(props){
    super(props)        // 执行 super ，别忘了传递props,才能在接下来的上下文中，获取到props。
    this.state={       //① 可以用来初始化state，比如可以用来获取路由中的
        name:'alien'
    }
    this.handleClick = this.handleClick.bind(this) /* ② 绑定 this */
    this.handleInputChange = debounce(this.handleInputChange , 500) /* ③ 绑定防抖函数，防抖 500 毫秒 */
    const _render = this.render
    this.render = function(){
        return _render.bind(this)  /* ④ 劫持修改类组件上的一些生命周期 */
    }
}
/* 点击事件 */
handleClick(){ /* ... */ }
/* 表单输入 */
handleInputChange(){ /* ... */ }
```

##### **getDerivedStateFromProps**

`getDerivedStateFromProps(nextProps,prevState)`

1. 替代 `componentWillMount 和 componentWillReceiveProps`
2. 组件初始化或者 `props` 更新时，将 `props` 映射到 `state`
3. 返回值与 `state` 合并完，可以作为 `shouldComponentUpdate` 第二个参数 `newState` ，可以判断是否渲染组件。(请不要把 `getDerivedStateFromProps` 和 `shouldComponentUpdate` 强行关联到一起，两者没有必然联系)

```js
static getDerivedStateFromProps(newProps){
    const { type } = newProps
    switch(type){
        case 'fruit' : 
        return { list:['苹果','香蕉','葡萄' ] } /* ① 接受 props 变化 ， 返回值将作为新的 state ，用于 渲染 或 传递给s houldComponentUpdate */
        case 'vegetables':
        return { list:['菠菜','西红柿','土豆']}
    }
}
render(){
    return <div>{ this.state.list.map((item)=><li key={item} >{ item  }</li>) }</div>
}
```

##### **UNSAFE_componentWillMount**

未来版本可能会废弃。可以做一些初始化的操作。

##### **UNSAFE_componentWillReceiveProps**

`UNSAFE_componentWillReceiveProps(newProps){}`

组件更新阶段。其本意是`props` 更改时做一些操作。但是实际上，只要父组件 `render`、调用 `React.createElement` 方法，那么 `props` 就会被重新创建。导致即使 `props` 没更新，也会执行这个生命周期钩子。

1. 用来监听父组件是否 `render`
2. 根据 `props` 改变，来决定是否更新 `state`。因为可以访问到 · ， 所以可以在异步成功回调(接口请求数据)改变 · 。这个是 · 不能实现的。

但是不建议这么使用。`props` 改变，再触发 `componentWillReceiveProps` 异步请求数据渲染，这样首先在没做优化前提下会带来两次子组件的更新，第一次 `props` 改变，第二次 `props` 改变，异步改变`state` 。其次该生命周期的不安全性。再者需要在该生命周期内部，设置大量的条件判断语句，通过 `this.props` ， `nextProps` 判断 `props` 到底改变与否。所以完全可以换一种思路，那就是**状态提升**，把数据层完全托管父组件，子组件没有副作用，只负责渲染父组件传递的 `props` 即可。

`componentWillReceiveProps` 生命周期的执行，和纯组件没有关系，纯组件是在 `componentWillReceiveProps` 执行之后浅比较 `props` 是否发生变化。`PureComponent` 下不会阻止该生命周期的执行。

##### **UNSAFE_componentWillUpdate**

`UNSAFE_componentWillUpdate` 可以意味着在更新之前，此时的 DOM 还没有更新。在这里可以做一些获取 DOM 的操作。就比如说在一次更新中，保存 DOM 之前的信息(记录上一次位置)。但是 React 已经出了新的生命周期 `getSnapshotBeforeUpdate` 来代替 `UNSAFE_componentWillUpdate`。

```js
UNSAFE_componentWillUpdate(){
    const position = this.getPostion(this.node) /* 获取元素节点 node 位置 */
}
```

##### **render**

所谓 render 函数，就是 jsx 的各个元素被 `React.createElement` 创建成 React element 对象的形式。一次 render 的过程，就是创建 React.element 元素的过程。

- 那么可以在render里面做一些,**createElement创建元素** , **cloneElement 克隆元素** ，**React.children 遍历 children** 的操作。

**getSnapshotBeforeUpdate**

`getSnapshotBeforeUpdate(prevProps,prevState)`

把 getSnapshotBeforeUpdate 用英文解释一下 ， **get | snap shot | before | update** ， 中文翻译为 **获取更新前的快照**，可以进一步理解为 获取更新前 DOM 的状态。

见名知意，上面说过该生命周期是在 commit 阶段的before Mutation ( DOM 修改前)，此时 DOM 还没有更新，但是在接下来的 Mutation 阶段会被替换成真实 DOM 。此时是获取 DOM 信息的最佳时期，getSnapshotBeforeUpdate 将返回一个值作为一个`snapShot`(快照)，传递给 componentDidUpdate作为第三个参数。

注意：如果没有返回值会给予警告⚠️，如果没有 `componentDidUpdate`也会给予警告。

```js
getSnapshotBeforeUpdate(prevProps,preState){
    const style = getComputedStyle(this.node) 
    return { /* 传递更新前的元素位置 */
        cx:style.cx,
        cy:style.cy
    }
}
componentDidUpdate(prevProps, prevState, snapshot){
    /* 获取元素绘制之前的位置 */
    console.log(snapshot)
}
```

##### **componentDidUpdate**

更新过程中执行（**DOM更新完毕,但还没有进行浏览器的layout绘制**）

```js
componentDidUpdate(prevProps, prevState, snapshot){
    const style = getComputedStyle(this.node)
    const newPosition = { /* 获取元素最新位置信息 */
        cx:style.cx,
        cy:style.cy
    }
}
```

1. componentDidUpdate 生命周期执行，此时 DOM 已经更新，可以直接获取 DOM 最新状态。这个函数里面如果想要使用 setState ，一定要加以限制，否则会引起无限循环。
2. 接受 `getSnapshotBeforeUpdate` 保存的快照信息。

##### **componentDidMount**

componentDidMount 生命周期执行时机和 componentDidUpdate 一样，一个是在**初始化**，一个是**组件更新**。此时 DOM 已经创建完，既然 DOM 已经创建挂载（**但还没有进行浏览器的layout绘制**），就可以做一些基于 DOM 操作，DOM 事件监听器。

```js
async componentDidMount(){
    this.node.addEventListener('click',()=>{
        /* 事件监听 */
    }) 
    const data = await this.getData() /* 数据请求 */
}
```

1. 可以做一些关于 DOM 操作，比如基于 DOM 的事件监听器。
2. 对于初始化向服务器请求数据，渲染视图。（初始化的时候执行一次，后续更新执行的是 `componentDidUpdate`,使用不会担心无限循环）

##### **shouldComponentUpdate**

`shouldComponentUpdate(newprops, newState, nextContext){}`

1. 一般用于性能优化

```js
shouldComponentUpdate(newProps,newState){
    if(newProps.a !== this.props.a ){ /* props中a属性发生变化 渲染组件 */
        return true
    }else if(newState.b !== this.props.b ){ /* state 中b属性发生变化 渲染组件 */
        return true
    }else{ /* 否则组件不渲染 */
        return false
    }
}
```

##### **componentWillUnmount**

1. 清除一些定时器，事件监听等

```js
componentWillUnmount(){
    clearTimeout(this.timer)  /* 清除延时器 */
    this.node.removeEventListener('click',this.handerClick) /* 卸载事件监听器 */
}
```

### 函数组件（生命周期）

React hooks也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其原理主要是运用了 hooks 里面的 `useEffect` 和 `useLayoutEffect`。

#### useEffect

```js
useEffect(()=>{
    return destory
},dep)
```

> useEffect 第一个参数 callback, 返回的 destory ， destory 作为下一次callback执行之前调用，用于清除上一次 callback 产生的副作用。

> 第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 destory ，和执行新的 effect 第一个参数 callback 。

> 对于 useEffect 执行， React 处理逻辑是采用异步调用 ，对于每一个 effect 的 callback， React 会向 `setTimeout`回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新，js 执行完成，视图绘制完毕，才执行。所以 effect 回调函数不会阻塞浏览器绘制视图。

#### useLayoutEffect

> useLayoutEffect 和 useEffect 不同的地方是采用了同步执行，那么和useEffect有什么区别呢？
>
> - 首先 useLayoutEffect 是在DOM 绘制之前，这样可以方便修改 DOM ，这样浏览器只会绘制一次，如果修改 DOM 布局放在 useEffect ，那 useEffect 执行是在浏览器绘制视图之后，接下来又改 DOM ，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。
> - useLayoutEffect callback 中代码执行会阻塞浏览器绘制。

#### 二者区别

**一句话概括如何选择 useEffect 和 useLayoutEffect ：修改 DOM ，改变布局就用 useLayoutEffect ，其他情况就用 useEffect 。**

问：React.useEffect 回调函数 和 componentDidMount / componentDidUpdate 执行时机有什么区别 ？

答：useEffect 对 React 执行栈来看是异步执行的，而 componentDidMount / componentDidUpdate 是同步执行的，useEffect代码不会阻塞浏览器绘制。在时机上 ，componentDidMount / componentDidUpdate 和 useLayoutEffect 更类似。

