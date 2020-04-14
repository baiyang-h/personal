### Basic

```js
<Route
  exact
  path={match.url}
  render={() => <h3>Please select a topic.</h3>}	//render直接返回
/>
```



### URL Parameters

```js
<Route
  path="/order/:direction(asc|desc)"	//表示只能匹配/order/asc或/order/desc
  component={ComponentWithRegex}
/>
```



### Redirects(Auth)

1. 在`<BrowserRouter>`中，只有`<Route component={组件}>`中的组件的`props`参数中才存在`hidtory`、`location`、`match`，其他自定义组件的`props`中不存在这3个属性，如果别的自定义组件也想得到这3个属性的话，我们要使用`withRouter(组件)`。
2. `<Router>`中的自定义组件，每次`Link`使url改变都会触发内部的自定义组件重新执行。
3. `to: Object` 一个可以具有以下任何属性的对象：
   - `pathname`: 表示要链接到的路径的字符串。

   - `search`: 表示查询参数的字符串形式。
   - `hash`: 放入网址的 hash，例如 `#a-hash`。
   - `state`: 状态持续到 `location`。 就是我在to的时候能够在state上带上想要传的参数，然后可以在`location`中得到`state`传过来的参数。
4. `<Redirect>`  可以把它当成是一个组件的形式返回
5. 或者`<Redirect from="/a" to="/b">`，看成像`Route`。`pathname`为`/a`的重定向到`/b`

```js
//1
<Route 
  path="/a" 
  render={ 
    (props) => (
      <Redirect to={{
      	pathname: '/b',
      	state: {from: props.location}
      }}
    )> } 
 />

//2
render() {
    return <Redirect to="/b" />
}
    
//Switch   只能在Switch中使用， 因为只能显示一个
<Redirect from="/a" to="/b">
```



### Custom Link

对于`<Route>`中渲染内容有三种方式，`component`、`render`、`children`。

其中`component`和`render`都是只有当位置匹配时才会渲染的 React 组件。而`children`却是不论 `path` 是否匹配位置，都会渲染。其中`children`中的`match`属性存在如果当前的`pathname`和`path`一样的话，那么`match`有值，否则为`null`。

```js
<OldSchoolMenuLink activeOnlyWhenExact={true} to="/" label="Home" />
<OldSchoolMenuLink to="/about" label="About" />
    
const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (		//不管匹配不匹配都会渲染组件，不过不匹配的话match为null。而component和render只会渲染匹配的组件
      <div className={match ? "active" : ""}>
        {match ? "> " : ""}
        <Link to={to}>{label}</Link>
      </div>
    )}
  />
);
```



### Preventing Transitions (离开判断)

用于在位置跳转之前给予用户一些确认信息。  `when`为`true`则跳转，`false`则阻止。

```js
<Prompt
  when={true}
  message="你确定要离开当前页面吗？"
/>
```

```js
<Prompt message={location => {
  return `你确定要跳转到${location.pathname}吗？`;
}} />
```

上例中的 `location` 对象指的是下一个位置（即用户想要跳转到的位置）。你可以基于它包含的一些信息，判断是否阻止导航，或者允许直接跳转。

```js
event.preventDefault();			//阻止默认事件
event.target.reset();			//form表单内部所有表单回到初始状态
```

一般可以和`getUserConfirmation`函数配合使用



### No Match   (404)

```js
<Switch>
    <Route path="/" exact component={Home} />
	<Redirect from="/old-match" to="/will-match" />
    <Route path="/will-match" component={WillMatch} />
	<Route component={NoMatch} />
</Switch>
```

用于渲染与路径匹配的第一个子 `<Route>` 或 `<Redirect>`。 只会渲染第一个先匹配的元素。

`<Switch>` 只会渲染一个路由。

##### location: object

当将该值定义在`<Switch>`上的时候， 同源指向该匹配的`pathname`。除非再次改变`location`，不然`Link`什么的不起作用

```js
//默认一开始匹配/will-match， 渲染WillMatch组件
<Switch location={{pathname: '/will-match'}}>			
    <Route path="/" exact component={Home} />
	<Redirect from="/old-match" to="/will-match" />
    <Route path="/will-match" component={WillMatch} />
	<Route component={NoMatch} />
</Switch>
```



### Recursive Paths   (递归)

核心

```js
const Person = ({ match }) => {
    return (
    	<ul>
        	{ 
                list.map(item => (
             		<li key={item.id}>
                        <Link to={`${match.url}/${item.id}`}>{item.path}</Link>
                    </li>
            	)) 
            }
        </ul>
		<Route path={`${match.url}/:id`} component={Person}>
    )
}
```

调用自己， 小心死循环



### Sidebar

我们将路由配置提取出来，都写在一个数组里

```js
const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: "/bubblegum",
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: "/shoelaces",
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
];
```



### Animated Transitions

`TransitionGroup`和`CSSTransition`

```js
import { TransitionGroup, CSSTransition } from "react-transition-group";
```

```js
<Switch>
    <Route path="/hsl/:h/:s/:l" component={HSL} />
	<Route path="/rgb/:r/:g/:b" component={RGB} />
</Switch>
```

因为是两个Route，虽然Switch只渲染一个，但对于不同的Route进行动画没用，使用`react-transition-group`



- 一开始`Router`下直接只用`Route`渲染，那么里面渲染的内容都可以得到`match`、`location`、`history`这三个属性了
- 封装一个用于`Link`的组件，在这个组件内部直接使用`{...props}`来定义组件上的属性。  
- 对/重定向
- 直接使用`style={{styles.xx}}`    样式都写在一个对象上， 很好管理
- `flex: 1`;    空间里平局分配
- 扩展运算符的活用



### Ambiguous Matches

Switch只匹配一个，对于都匹配的path默认只显示先匹配的。



### Route Config

```js
const routes = [
  {
    path: "/sandwiches",
    component: Sandwiches
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus
      },
      {
        path: "/tacos/cart",
        component: Cart
      }
    ]
  }
];
```



### Modal Gallery

1. 使用`componentWillUpdate`能知道当前路由的信息和将要更新的路由的信息。可以将没更新前的信息保留到更新后的`render`获取。

```js
componentWillUpdate(nextProps) {
    //this.props;	当前没更新时
    //nextProps;	更新后
  }
```

2. `Switch`上的`location`的权重大于内部`Route`的`path`权重，将会被覆盖，执行`Swich`上的`location`。
3. `e.stopPropagation()`阻止事件冒泡



### StaticRouter ConteContext

```js
this.staticContext = {a: 1}
<StaticRouter location="/foo" context={this.staticContext}>
    <div>
    	<Route render={
                ({staticContext}) => {
					console.log(staticContext)	//{a: 1}
            	}
			}
        />
	</div>
</StaticRouter>
```

在`<StaticRouter>`上定义的`context`的值，可以在内部匹配的`<Route>`的`props`中通过`props.staticContext`得到。