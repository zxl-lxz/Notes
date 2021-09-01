# React进阶 - ref

## Ref

[使用ref](https://github.com/1282772905/Notes/blob/master/React/Ref/index.md)

### 创建Ref

#### React.createRef()

原理很简单：

```js
export function createRef() {
  const refObject = {
    current: null,
  }
  return refObject;
}
```

一般在类组件中使用，保存在 `this` 属性上，方便后续操作。注意的是，不能在函数组件中使用，因为函数组件重新渲染会重新执行整个函数，之前的 `ref` 内容会丢失。

#### 函数组件 useRef

函数组件由于没有类组件的 `this` 去保存信息，每次都会重新创建 `ref` 。

为了解决这个问题，hooks 和函数组件对应的 fiber 对象建立起关联，将 useRef 产生的 ref 对象挂到函数组件对应的 fiber 上，函数组件每次执行，只要组件不被销毁，函数组件对应的 fiber 对象一直存在，所以 ref 等信息就会被保存下来。

### React如何处理ref 标签

首先明确一个问题是 DOM 元素和组件实例 必须用 ref 对象获取吗？答案是否定的，React 类组件提供了多种方法获取 DOM 元素和组件实例，说白了就是 React 对标签里面 ref 属性的处理逻辑多样化。

#### 字符串ref

```js
/* 类组件 */
class Children extends Component{  
    render=()=><div>hello,world</div>
}
/* TODO:  Ref属性是一个字符串 */
export default class Index extends React.Component{
    componentDidMount(){
       console.log(this.refs)
    }
    render=()=> <div>
        <div ref="currentDom"  >字符串模式获取元素或组件</div>
        <Children ref="currentComInstance"  />
    </div>
}
```

#### 回调函数ref

```js
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
/* TODO: Ref属性是一个函数 */
export default class Index extends React.Component{
    currentDom = null
    currentComponentInstance = null
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
        <div ref={(node)=> this.currentDom = node }  >Ref模式获取元素或组件</div>
        <Children ref={(node) => this.currentComponentInstance = node  }  />
    </div>
}
```

#### ref属性是一个 ref 对象

```js
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
export default class Index extends React.Component{
    currentDom = React.createRef(null)
    currentComponentInstance = React.createRef(null)
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
         <div ref={ this.currentDom }  >Ref对象模式获取元素或组件</div>
        <Children ref={ this.currentComponentInstance }  />
   </div>
}
```

### ref的高阶用法

#### forwardRef

```js
// 孙组件
function Son (props){
    const { grandRef } = props
    return <div>
        <div> i am alien </div>
        <span ref={grandRef} >这个是想要获取元素</span>
    </div>
}
// 父组件
class Father extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <div>
            <Son grandRef={this.props.grandRef}  />
        </div>
    }
}
const NewFather = React.forwardRef((props,ref)=> <Father grandRef={ref}  {...props} />)
// 爷组件
class GrandFather extends React.Component{
    constructor(props){
        super(props)
    }
    node = null 
    componentDidMount(){
        console.log(this.node) // span #text 这个是想要获取元素
    }
    render(){
        return <div>
            <NewFather ref={(node)=> this.node = node } />
        </div>
    }
}
```

#### 合并转发ref

```js
// 表单组件
class Form extends React.Component{
    render(){
       return <div>{...}</div>
    }
}
// index 组件
class Index extends React.Component{ 
    componentDidMount(){
        const { forwardRef } = this.props
        forwardRef.current={
            form:this.form,      // 给form组件实例 ，绑定给 ref form属性 
            index:this,          // 给index组件实例 ，绑定给 ref index属性 
            button:this.button,  // 给button dom 元素，绑定给 ref button属性 
        }
    }
    form = null
    button = null
    render(){
        return <div   > 
          <button ref={(button)=> this.button = button }  >点击</button>
          <Form  ref={(form) => this.form = form }  />  
      </div>
    }
}
const ForwardRefIndex = React.forwardRef(( props,ref )=><Index  {...props} forwardRef={ref}  />)
// home 组件
export default function Home(){
    const ref = useRef(null)
     useEffect(()=>{
         console.log(ref.current)
     },[])
    return <ForwardRefIndex ref={ref} />
}
```

#### 消除HOC对ref指向的影响

```js
function HOC(Component){
  class Wrap extends React.Component{
     render(){
        const { forwardedRef ,...otherprops  } = this.props
        return <Component ref={forwardedRef}  {...otherprops}  />
     }
  }
  return  React.forwardRef((props,ref)=> <Wrap forwardedRef={ref} {...props} /> ) 
}
class Index extends React.Component{
  render(){
    return <div>hello,world</div>
  }
}
const HocIndex =  HOC(Index)
export default ()=>{
  const node = useRef(null)
  useEffect(()=>{
    console.log(node.current)  /* Index 组件实例  */ 
  },[])
  return <div><HocIndex ref={node}  /></div>
}
```
经过 forwardRef 处理后的 HOC ，node.current 指向 Index 组件实例。

#### 函数组件 forwardRef + useImperativeHandle

对于函数组件，本身是没有实例的，但是 React Hooks 提供了，useImperativeHandle 一方面第一个参数接受父组件传递的 ref 对象，另一方面第二个参数是一个函数，函数返回值，作为 ref 对象获取的内容。一起看一下 useImperativeHandle 的基本使用。

useImperativeHandle 接受三个参数：

第一个参数 ref : 接受 forWardRef 传递过来的 ref 。
第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
第三个参数 deps :依赖项 deps，依赖项更改形成新的 ref 对象。

```js
// 子组件
function Son (props,ref) {
    const inputRef = useRef(null)
    const [ inputValue , setInputValue ] = useState('')
    useImperativeHandle(ref,()=>{
       const handleRefs = {
           onFocus(){              /* 声明方法用于聚焦input框 */
              inputRef.current.focus()
           },
           onChangeValue(value){   /* 声明方法用于改变input的值 */
               setInputValue(value)
           }
       }
       return handleRefs
    },[])
    return <div>
        <input placeholder="请输入内容"  ref={inputRef}  value={inputValue} />
    </div>
}

const ForwarSon = forwardRef(Son)
// 父组件
class Index extends React.Component{
    cur = null
    handerClick(){
       const { onFocus , onChangeValue } =this.cur
       onFocus() // 让子组件的输入框获取焦点
       onChangeValue('let us learn React!') // 让子组件input  
    }
    render(){
        return <div style={{ marginTop:'50px' }} >
            <ForwarSon ref={cur => (this.cur = cur)} />
            <button onClick={this.handerClick.bind(this)} >操控子组件</button>
        </div>
    }
}
```

####  函数组件缓存数据

函数组件每一次 render ，函数上下文会重新执行，那么有一种情况就是，在执行一些事件方法改变数据或者保存新数据的时候，有没有必要更新视图，有没有必要把数据放到 state 中。如果视图层更新不依赖想要改变的数据，那么 state 改变带来的更新效果就是多余的。这时候更新无疑是一种性能上的浪费。

这种情况下，useRef 就派上用场了，上面讲到过，useRef 可以创建出一个 ref 原始对象，只要组件没有销毁，ref 对象就一直存在，那么完全可以把一些不依赖于视图更新的数据储存到 ref 对象中。这样做的好处有两个：

第一个能够直接修改数据，不会造成函数组件冗余的更新作用。
第二个 useRef 保存数据，如果有 useEffect ，useMemo 引用 ref 对象中的数据，无须将 ref 对象添加成 dep 依赖项，因为 useRef 始终指向一个内存空间，所以这样一点好处是可以随时访问到变化后的值。

```js
const toLearn = [ { type: 1 , mes:'let us learn React' } , { type:2,mes:'let us learn Vue3.0' }  ]
export default function Index({ id }){
    const typeInfo = React.useRef(toLearn[0])
    const changeType = (info)=>{
        typeInfo.current = info /* typeInfo 的改变，不需要视图变化 */
    }
    /* useEffect 里面可以直接访问到改变后的 typeInfo 的内容，不需要添加依赖项 */
    /* 可以添加typeInfo.current */
    useEffect(()=>{
       if(typeInfo.current.type===1){
           /* ... */
       }
    },[ id ]);
    return <div>
        {
            toLearn.map(item=> <button key={item.type}  onClick={ changeType.bind(null,item) } >{ item.mes }</button> )
        }
    </div>
}
```

### ref的原理

先看一个demo

```js
export default class Index extends React.Component{
    state={ num:0 }
    node = null
    render(){
        return <div >
            <div ref={(node)=>{
               this.node = node
               console.log('此时的参数是什么：', this.node )
            }}  >ref元素节点</div>
            <button onClick={()=> this.setState({ num: this.state.num + 1  }) } >点击</button>
        </div>
    }
}
```

点击按钮，会打印几次？答案是2次。第一次是 null 第二次是 div

#### ref 执行时机和处理逻辑

对于整个 Ref 的处理，都是在 commit 阶段发生的。

对于 Ref 处理函数，React 底层用两个方法处理：commitDetachRef 和 commitAttachRef ，上述两次 console.log 一次为 null，一次为div 就是分别调用了上述的方法。

这两次正正好好，一次在 DOM 更新之前，一次在 DOM 更新之后。

第一阶段：一次更新中，在 commit 的 mutation 阶段, 它会清空之前ref值，使其重置为 null。

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref;
  if (currentRef !== null) {
    if (typeof currentRef === 'function') { /* function 和 字符串获取方式。 */
      currentRef(null); 
    } else {   /* Ref对象获取方式 */
      currentRef.current = null;
    }
  }
}
```

第二阶段：DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 。

第三阶段：layout 阶段，在更新真实元素节点之后，此时需要更新 ref 。

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostComponent: //元素节点 获取元素
        instanceToUse = getPublicInstance(instance);
        break;
      default:  // 类组件直接使用实例
        instanceToUse = instance;
    }
    if (typeof ref === 'function') {
      ref(instanceToUse);  //* function 和 字符串获取方式。 */
    } else {
      ref.current = instanceToUse; /* function 和 字符串获取方式。 */
    }
  }
}
```

为什么字符串ref也是按照函数处理呢？

当 ref 属性是一个字符串的时候，React 会自动绑定一个函数，用来处理 ref 逻辑。

```js
const ref = function(value) {
    let refs = inst.refs;
    if (refs === emptyRefsObject) {
        refs = inst.refs = {};
    }
    if (value === null) {
        delete refs[stringRef];
    } else {
        refs[stringRef] = value;
    }
};
```

#### ref的处理特性

接下来看一下 ref 的一些特性，首先来看一下，上述没有提及的一个问题，React 被 ref 标记的 fiber，那么每一次 fiber 更新都会调用 commitDetachRef 和 commitAttachRef 更新 Ref 吗 ？

答案是否定的，只有在 ref 更新的时候，才会调用如上方法更新 ref ，究其原因还要从如上两个方法的执行时期说起

在 commit 阶段 commitDetachRef 和 commitAttachRef 是在什么条件下被执行的呢 ？ 来一起看一下：

```js
// commitDetachRef 调用时机
function commitMutationEffects(){
     if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
}

// commitAttachRef 调用时机
function commitLayoutEffects(){
     if (effectTag & Ref) {
      commitAttachRef(nextEffect);
    }
}
```
从上可以清晰的看到只有含有 Ref tag 的时候，才会执行更新 ref，那么是每一次更新都会打 Ref tag 吗？ 跟着我的思路往下看，什么时候标记的 Ref 。

```js
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) ||      // 初始化的时候
    (current !== null && current.ref !== ref)  // ref 指向发生改变
  ) {
    workInProgress.effectTag |= Ref;
  }
}
```

可以看到，只有初始化的时候或者ref变更的时候，才会打 ref tag。

再看看一开始的例子：

```js
<div ref={(node)=>{
               this.node = node
               console.log('此时的参数是什么：', this.node )
}}  >ref元素节点</div>
```

每一次更新的时候，都给 ref 赋值了新的函数，那么 markRef 中就会判断成 current.ref !== ref，所以就会重新打 Ref 标签，那么在 commit 阶段，就会更新 ref 执行 ref 回调函数了。

如果改成下面这样：

```js
export default class Index extends React.Component{
    state={ num:0 }
    node = null
    getDom= (node)=>{
        this.node = node
        console.log('此时的参数是什么：', this.node )
     }
    render(){
        return <div >
            <div ref={this.getDom}>ref元素节点</div>
            <button onClick={()=> this.setState({ num: this.state.num + 1  })} >点击</button>
        </div>
    }
}
```

这个时候，在点击按钮更新的时候，由于此时 ref 指向相同的函数 getDom ，所以就不会打 Ref 标签，不会更新 ref 逻辑，直观上的体现就是 getDom 函数不会再执行。

#### 卸载ref

```js
this.state.isShow && <div ref={()=>this.node = node} >元素节点</div>
```

在一次更新的时候，改变 isShow 属性，使之由 true 变成了 false， 那么 div 元素会被卸载，那么 ref 会怎么处理呢？

被卸载的 fiber 会被打成 Deletion effect tag ，然后在 commit 阶段会进行 commitDeletion 流程。对于有 ref 标记的 ClassComponent （类组件） 和 HostComponent （元素），会统一走 safelyDetachRef 流程，这个方法就是用来卸载 ref。

```js
function safelyDetachRef(current) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {  // 函数式 ｜ 字符串
        ref(null)
    } else {
      ref.current = null;  // ref 对象
    }
  }
}
```





