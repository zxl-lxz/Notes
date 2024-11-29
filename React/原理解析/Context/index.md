# React进阶 - Context

为什么要有 `Context` 呢？

避免一层一层传递，避免牵一发而动全身。

## 基本用法

### createContext

```js
const ThemeContext = React.createContext(null) //
const ThemeProvider = ThemeContext.Provider  //提供者
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者
```

### 提供者

```js
export default function ProviderDemo(){
    const ThemeContext = React.createContext(null) //
    const ThemeProvider = ThemeContext.Provider  //提供者
    const [ contextValue , setContextValue ] = React.useState({  color:'#ccc', background:'pink' })
    return <div>
        <ThemeProvider value={ contextValue } > 
            <Son />
        </ThemeProvider>
    </div>
}
```

### 消费者

消费者一共有三种

#### 类组件 - contextType

```js
const ThemeContext = React.createContext(null)
// 类组件 - contextType 方式
class ConsumerDemo extends React.Component{
   render(){
       const { color,background } = this.context
       return <div style={{ color,background } } >消费者</div> 
   }
}
ConsumerDemo.contextType = ThemeContext

const Son = ()=> <ConsumerDemo />
```

#### 函数组件 useContext

```js
const ThemeContext = React.createContext(null)
// 函数组件 - useContext方式
function ConsumerDemo(){
    const  contextValue = React.useContext(ThemeContext) /*  */
    const { color,background } = contextValue
    return <div style={{ color,background } } >消费者</div> 
}
const Son = ()=> <ConsumerDemo />
```

#### Consumer

```js
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者

function ConsumerDemo(props){
    const { color,background } = props
    return <div style={{ color,background } } >消费者</div> 
}
const Son = () => (
    <ThemeConsumer>
       { /* 将 context 内容转化成 props  */ }
       { (contextValue)=> <ConsumerDemo  {...contextValue}  /> }
    </ThemeConsumer>
) 
```

### 动态context

```js
function ConsumerDemo(){
     const { color,background } = React.useContext(ThemeContext)
    return <div style={{ color,background } } >消费者</div> 
}
const Son = React.memo(()=> <ConsumerDemo />) // 子组件

const ThemeProvider = ThemeContext.Provider //提供者
export default function ProviderDemo(){
    const [ contextValue , setContextValue ] = React.useState({  color:'#ccc', background:'pink' })
    return <div>
        <ThemeProvider value={ contextValue } >
            <Son />
        </ThemeProvider>
        <button onClick={ ()=> setContextValue({ color:'#fff' , background:'blue' })  } >切换主题</button>
    </div>
}
```

Provider 模式下 context 有一个显著的特点，就是 Provder 的 value 改变，会使所有消费 value 的组件重新渲染，如上通过一个 useState 来改变 contextValue 的值，contextValue 改变，会使 ConsumerDemo 自动更新，注意这个更新并不是由父组件 son render 造成的，因为给 son 用 memo 处理过，这种情况下，Son 没有触发 render，而是 ConsumerDemo 自发的render。

一旦 `Provider` 的 `value` 值改变，在其下的所有组件数上的组件都会重新渲染。

那么如何阻止 Provider value 改变造成的 children （ demo 中的 Son ）不必要的渲染？

```js
const Son = React.memo(()=> <ConsumerDemo />)
// or
<ThemeProvider value={ contextValue } >
    { React.useMemo(()=>  <Son /> ,[]) }
</ThemeProvider>
```

## 高阶用法

### 嵌套

```js
const ThemeContext = React.createContext(null) // 主题颜色Context
const LanContext = React.createContext(null) // 主题语言Context

function ConsumerDemo(){
    return <ThemeContext.Consumer>
        { (themeContextValue)=> (
            <LanContext.Consumer>
                { (lanContextValue) => {
                    const { color , background } = themeContextValue
                    return <div style={{ color,background } } > { lanContextValue === 'CH'  ? '大家好，让我们一起学习React!' : 'Hello, let us learn React!'  }  </div> 
                } }
            </LanContext.Consumer>
        )  }
    </ThemeContext.Consumer>
}

const Son = memo(()=> <ConsumerDemo />)
export default function ProviderDemo(){
    const [ themeContextValue ] = React.useState({  color:'#FFF', background:'blue' })
    const [ lanContextValue ] = React.useState('CH') // CH -> 中文 ， EN -> 英文
    return <ThemeContext.Provider value={themeContextValue}  >
         <LanContext.Provider value={lanContextValue} >
             <Son  />
         </LanContext.Provider>
    </ThemeContext.Provider>
}
```
