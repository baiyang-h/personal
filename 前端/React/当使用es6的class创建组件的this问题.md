```jsx
class EventMp extends React.Component {
    constructor(props) {
        super(props)
        console.log(this) //EventMp 直接调用了 不是react中的合成事件中调用
    }
    fn1() {
        console.log(this)
    }
    fn2() {
        console.log(this)
    }
    render() {
        this.fn1() //EventMp 直接调用了 不是react中的合成事件中调用
        //下面undefined 下面在react的jsx中的方法，react本身取消了这种帮我们自动绑定this的魔术功能，要使得this正确指向生成的实例组件，我们使用bind或者箭头函数：
        return (
            <div className="box">
                <button onClick = { this.fn2 }>click</button>
            </div>
        )
    }
}
ReactDOM.render(
    <EventMp/>,
    document.getElementById('root')
)
```

**React.createClass有一个内置的魔术功能，可以自动绑定所有方法this。这对于在其他类中不用于此功能的JavaScript开发人员来说可能会有点混乱，或者当从React转到其他类时可能会令人困惑。因此，我们决定不将此内置到React的类模型中。如果需要，您仍然可以在构造函数中明确地预处理方法**。

上面是react官方更新文档的说明。也就是说：在React.creatClass中，是react本身帮我们绑定了this，才让我们不用手动去绑定this就能正确得使用。如果react没有帮我们绑定this，这时候this是指向哪里的呢？

当使用ES6的class语法来创建组件，react本身取消了这种帮我们自动绑定this的魔术功能，要使得this正确指向生成的实例组件，我们使用bind或者箭头函数：

<br>

#### 如使用bind()函数改变this的上下文

可以在class声明中的constructor()函数中，使用

```js
this.handleClick = this.handleClick.bind(this);
```

除此我们也可以在具体使用该函数的地方绑定this的上下文到LikeButton实例对象，代码如下

```jsx
<div onClick={this.handleClick.bind(this)}>
    You {text} this. Click to toggle.
</div>
```

#### es6的箭头函数

es6中新加入了箭头函数=>，箭头函数除了方便之外还有而一个特征就是将函数的this绑定到其定义时所在的上下文。这个特征也可以帮助我们解决这个问题。使用如下代码：

```jsx
<div onClick={() => this.handleClick()}>
    You {text} this. Click to toggle.
</div>
```

#### 或者在class类中的函数直接用箭头函数的方式

```js
class Fn {
    fn = () => {
        console.log(this) // 这个this也是合成事件的上下文,但是可不会是原生class中的上下文哦 记住只用于合成事件
    }
}
```

！！！！而且这种写法 在原生的es6的js中,是不能再类中这么写声明式的函数的，只有在react的class组件可以



参考地址： [https://www.zhihu.com/question/42935015/answer/153671878](https://www.zhihu.com/question/42935015/answer/153671878)
