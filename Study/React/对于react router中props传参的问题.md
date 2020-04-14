对于 在react的router中的Route中将props传给相应的组件
```html
<Route render={ (props) => (
    <Nav {...props} menuList={ this.state.menuList }/>
)}/>
```

我们想在Route的对应组件中获得props中的location， history， match参数时，会存在延时滞后， 好像并没有同步，不是说你Link点了相应的url，Route里的props中的参数就是当前url的路由信息。 确实上一个的。

**方法1** 

在react的router中好像也是建议这种

```js
componentWillReceiveProps(nextProps) {
    console.log(nextProps.location, this.props.location) //前者是当前最新的props， 后者为上次的props
    if(nextProps.location.pathname !== this.props.location.pathname) {
        console.log(444)
    }
}
```

**方法2**

```
干脆就加了个setTimeout 问题就解决了。。
```

具体为什么出现这样的问题，还不清楚， 如果我是直接父组件改变props的状态，传进子组件的话，是正常的，立即变动。但在react router点link存在这个问题。

我猜想是不是props的属性获取也是存在一个事件的，要在某个生命周期的时候或者dom渲染完成的时候才能获取到？ 所以在render等中已经是能获取到了？

```html
<div>
    <button onClick={ this.handleClick}>click</button>
    <br/>
    <!-- 传入属性， 在父组件中改变，子组件也变了 -->
    <Child name={ this.state.name }/> 
</div>
```

**1、直接使用**
这种方式，父组件改变props后，子组件重新渲染，由于直接使用的props，所以我们不需要做什么就可以正常显示最新的props。

```js
class Child extends Component {
    render() {
        return <div>{this.props.someThings}</div>
    }
}
```

**2、转换成自己的state**
这种方式，由于我们使用的是state，所以每当父组件每次重新传递props时，我们需要重新处理下，将props转换成自己的state，这里就用到了 componentWillReceiveProps。

```js
class Child extends Component {
    constructor(props) {
        super(props);
        this.state = {
            someThings: props.someThings
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({someThings: nextProps.someThings});
    }
    render() {
        return <div>{this.state.someThings}</div>
    }
}
```