import React, { Component } from 'react';
import Circle from './Circle';

class Dots extends Component {
    state={
        dataList:[],                  // 数据源列表
        renderList:[],                // 渲染列表
        position:{ width:0,height:0 } // 位置信息
    }
    box = React.createRef();
    componentDidMount(){
        const { offsetHeight , offsetWidth } = this.box.current
        const originList = new Array(20000).fill(1)
        this.setState({
            position: { height:offsetHeight,width:offsetWidth },
            dataList:originList,
            renderList:originList,
        })
    }
    render() {
        const { renderList, position } = this.state;
        return (
            <div ref={this.box}>
                {
                    renderList.map((item,index)=><Circle  position={ position } key={index}  /> )
                }
            </div>
        );
    }
}

export default Dots;