1. 受控表单

```jsx
class From extends React.components {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }
    submit() {
        console.log(this.state.value);
        e.preventDefault();
    }
    change(e) {
        this.setState({
            value: e.target.value,
        });
    }
    // 在react中，textarea，select都用value属性 
    render() {
        return (
            <div className="wrap">
                <form onSubmit={(e) => this.submit(e)}>
                    <label>
                        文章：
                        <textarea value={this.state.value} onChange={(e) => this.change(e)}></textarea>
                    </label>
                    <input type="submit" value="提交">
                </form>
            </div>
        )
    }
}
```