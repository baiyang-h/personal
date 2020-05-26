### 初始

```
npm install react-router --save
npm install react-router-dom --save
```

`react-router`和`react-router-dom`他们两个只要引用一个就行了，不同之处就是后者比前者多出了`<Link>`、`<BrowserRouter>`浙江的DOM类组件。因此我们只需引用`react-router-dom`这个包就行了。

1. `<Route>`中的组件的`props`中，默认存在`history`、`location`、`match`三个属性。但其他不是在`<Route>`上的组件是不存在这三个属性，如果想要让其他组件也能得到这3个属性，那么需要使用`withRouter(组件)`。
2. 对于`<BrowserRouter>`、`<HashRouter>`等中的自定义组件，在点击`Link`改变url的时候也会重新渲染。



### BrowserRouter

`<BrowserRouter>`使用HTML5提供的history API(`pushState`、`replaceState`和`popstate`事件)来保持UI和URL的同步。

```jsx
import { BrowserRouter as Router } from 'react-router-dom';

<Router
  basename={string}
  forceRefresh={bl}
  getUserConfirmation={func}
  keyLength={number}
>
    <App />
</Router>
```

##### basename:string

作用：为所有位置添加一个基准URL

场景：假如你需要把页面部署到服务器的二级目录，你可以使用`basename`设置到此目录。

```jsx
<Router basename="/base">
    <div>
    	<Link to='/foo'>
    </div>
</Router>
```

渲染为：

```jsx
<a href="/base/foo">
```

##### forceRefresh:bool（会全部刷新）

作用：为`true`时，在导航的过程中整个页面将会刷新。一般情况下，只有在不支持HTML5 history API的浏览器中使用此功能。

```jsx
const supportsHistory = 'pushState' in window.history;
<Router forceRefresh={!supportsHistory}>
```

##### getUserConfirmation:func

作用：页面与页面导航之前执行的函数，默认使用`window.confirm`。

场景：例如：从`/a`导致至`/b`时，会使用默认的`window.confirm`函数弹出一个提示，用户点击确认后才能进行导航，否则不做任何处理。

注：配合`<Prompt>`一起使用

```jsx
const getConfirmation = (message, callback) => {
    const allowTransition = window.confirm(message);
    callback(allowTransition)
}
//getUserConfirmation绑定的函数默认有两个参数，1.<Prompt>标签上的message数据，callback为内置封装好了的回调函数，传入true跳转，传入false阻止
<BrowserRouter getUserConfirmation={getConfirmation}>
    <div>
    	<Prompt message="您确定要离开吗?" />
        ···
    </div>
</BrowserRouter>
```

##### keyLength：number

作用：设置它里面路由的`location.key`的长度，默认为6。(`key`的作用：点击同一个连接时，每次该路由下的`location.key`都会改变，可以通过`key`的变化来刷新页面。)

```jsx
<BrowserRouter keyLength={12} />
```

##### children:node

作用：渲染唯一子元素。



### ~~HashRouter~~

`<HashRouter>`使用URL的`hash`部分(即`window.location.hash`)来保持UI和URL的同步。

> 注意：使用hash记录导航历史不支持location.key和location.state。另外由于该技术只是用来支持旧版浏览器，因此更推荐大家使用BrowserRouter

```jsx
<a href='#/a/b' />
```

##### basename：string

##### getUserConfirmation：func

##### hashType：string

##### children：node



### Link

为你的应用提供声明式的、可访问的导航链接。

```jsx
import { Link } from 'react-router-dom';

<Link to="/foo">foo</Link>
```

##### to：string

一个字符串形式的链接地址，通过`pathname`、`search`和`hash`属性创建。

```jsx
<Link to="/a?sort=name">
```

##### to：object

一个对象形式的链接地址，可以具有以下任何属性

- `pathname`：要链接到的路径
- `search`：查询参数
- `hash`：URL中的`hash`
- `state`：存储到`location`中的额外状态数据

```jsx
<Link to={{
	pathname: '/courses',
    search: '?sort=name',
    hash: '#aa',
    state: {
		fromDashboard: true
    }
}}>
```

##### replace：bool

当设置为`true`时，点击链接后将替换历史堆栈中的当前条目，而不是添加新条目。默认为`false`。

```jsx
<Link to="/courses" replace />
```

##### innerRef:func

允许访问组件的底层引用。

```jsx
const refCallback = node => {
    //node 指向最终挂载的DOM元素，在卸载时为null
    console.log(node)	//<a href="/">foo</a>
}
<Link to="/" innerRef={refCallback}>foo</Link>
```

##### innerRef：RefObject

```jsx
const anchorRef = React.createRef();
<Link to="/" innerRef={anchorRef}>foo</Link>
```

##### others(自定义属性)

你还可以传递一些其他属性，例如`title`、`id`或`className`等。

```jsx
<Link to="/" className="nav" title="a title">About</Link>
```



### NavLink

一个特殊版本的`<Link>`，它会与当前URL匹配时为其呈现元素添加样式属性。默认是匹配时加了`class=active`和`aria-current="page"`

```jsx
import { NavLink } from 'react-router-dom';
<NavLink to="/about">About</NavLink>
```

Elements

```jsx
<a href="/about" class="active" aria-current="page">bar</a>
```

##### activeClassName：string

当元素出于激活状态时应用的类，默认为`active`。它将与`className`属性一起使用，不会覆盖。

```jsx
<NavLink to="/foo" activeClassName="selected">FAQs</NavLink>
```

##### activeStyle：object

当元素处于激活状态时应用的样式。

```jsx
<NavLink 
    to="/faq" 
    activeStyle={{fontWeight: 'bold', color: 'red'}}
>FAQs</NavLink>
```

##### exact: bool

##### strict: bool

若为 `true`，只有当访问地址后缀斜杠严格匹配（有或无）时激活样式才会应用。

```jsx
<NavLink strict to="/events/">Events</NavLink>

<Route strict to="/events/" />
```

| path    (Route) | location.pathname    (Link) | matches? |
| --------------- | --------------------------- | -------- |
| `/one/`         | `/one`                      | no       |
| `/one/`         | `/one/`                     | yes      |
| `/one/`         | `/one/two`                  | yes      |

##### isActive：func

是否让`activeClassName`、`activeStyle`有效，该属性的函数渲染的时候就默认会自动执行。

`<NavLink>`默认增加的`class="active"` ，也可以增加`activeClassName`、`activeStyle`属性。我们可以使用`isActive`函数返回的`true`或`false`来允许增加的这些属性是否有效显示。

```jsx
const oddEvent = (match, location) {
    if(!match) return false;
    //do something
    return true;
}
<NavLink to="/a" isActive={oddEvent} activeClassName="aaa" activeStyle={{width: '100px'}}}>
    
//返回true   显示
<a href="/a" class="aaa" style="width: 100px">
//false		不显示
<a href="/a">
```

##### location：object

`isActive` 默认比较当前历史位置（通常是当前的浏览器 URL）。可以设置别的`location`，那么在`isActive`的函数的`location`参数中可以得到你设置的数据。

```jsx
const oddEvent = (match, location) {
    //如果不设置location的值，那么值为当前url匹配的location，设置了则是你设置匹配的location
    console.log(location);  	//打印 {pathname: '/b'} 
    return true;
}

<NavLink to="/a" isActive={oddEvent} location={{pathname: '/b'}}>
```



### Prompt

作用：当用户离开当前页面前做出一些提示。

场景：比如我在填写表单时，填到一半不小心点击了别的按钮，如果不设置会直接跳转，该标签就能他不出一个提示。

```jsx
import Prompt from 'react-router-dom';
<Prompt when={布尔值} message="xxx">
```

##### message：string

```jsx
<Prompt message="你确定要离开当前页面吗？" />
```

##### message：func

该函数需要返回一个字符串以向用户显示提示，或者返回`true`以允许直接跳转。

```jsx
<Prompt message={location => {
  //location：为跳转到的地方的location
  //可以返回字符串或者直接返回true	true直接跳转， false 阻止
  return true
}} />
```

> 译注：上例中的 `location` 对象指的是下一个位置（即用户想要跳转到的位置）。你可以基于它包含的一些信息，判断是否阻止导航，或者允许直接跳转。

##### when：bool

通过设置 `when={true}` 或 `when={false}` 以阻止或允许相应的导航。



### MemoryRouter

将URL的历史记录保存在内存中的`<Router>`(不读取或写入地址栏)。在测试和非浏览器环境中很有用。(即在网页的网址上不管你怎么点击`<Link>`，地址栏上你看不到变动，主要在内存中变动)

##### initialEntries: array

历史堆栈中的一系列位置信息。这些可能是带有 `{pathname, search, hash, state}` 的完整位置对象或简单的字符串 URL。即在内存中存在一个list，里面为`pathname`集。

```jsx
//此时的结果会渲染pathname为/two的组件
//下面的结果会初始化默认渲染path为/two的组件
<MemoryRouter
  initialEntries={[ '/one', '/two', { pathname: '/three' } ]}
  initialIndex={1}		//索引从0开始，  
>
  <App/>
</MemoryRouter>
```

##### initialIndex: number

`initialEntries` 数组中的初始位置索引。初始化渲染历史堆栈中的相应`pathname`的`path`。

##### getUserConfirmation: func

##### keyLength: number

##### children: node



### Redirect

使用`<Redirect>`会导航到一个新的位置。新的位置将覆盖历史堆栈中的当前条目。

```jsx
import { Route, Redirect } from 'react-router-dom';
//第一种
<Route exact path="/" render={ () => <Redirect to="/a" /> } />
//第二种 必须在Swtich		form就是pathname对应的值
<Switch>
    <Route path="/a" component={A} />
		<Route path="/b" component={B} />
    <Redirect from="/c" to="/a" />
</Switch>
```

##### form：string

要从中进行重定向的路径名，可以是 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的 URL 路径。所有匹配的 URL 参数都会提供给 `to`，必须包含在 `to` 中用到的所有参数，`to` 未使用的其它参数将被忽略。

**只能在 `<Switch>` 组件内使用 `<Redirect from to>`，以匹配一个位置，`from` 只是 `path` 的别名 **。

```jsx
<Switch>
  <Redirect from='/old-path' to='/new-path' />
  <Route path='/new-path' component={Place} />
</Switch>
```

##### to：string

要重定向到的URL，可以是[path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的URI路径。

```jsx
<Redirect to="/a" />
```

##### to：object

要重定向到的位置，其中`pathname`可以是[path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的URI路径。

```jsx
<Redirect to={{
  pathname: '/login',
  search: '?utm=your+face',
  state: {				//可以在这个属性中进行location中的传数据， 在渲染组件的location中可以获取
    referrer: currentLocation
  }
}} />
```

 `state` 对象可以在重定向到的组件中通过 `this.props.location.state` 进行访问。

##### push：bool

如果为`true`，重定向会将新的位置推入历史记录，而不是替换当前条目

```jsx
<Redirect push to="/a />
```

##### exact: bool

##### strict: bool



### Route

它最基本的职责是在其`path`属性与某个`location`匹配时呈现相应的组件。

`<Route>`自带三个render methods和三个props。

render methods分别是：

- `<Route component>`：每次都会卸载、重新渲染，`component`上是一个函数名或类名。
- `<Route render>`：不会每次卸载、重新渲染，`render`上是一个函数，返回一个组件。
- `<Route children>`：不管`pathname`和`location`是否匹配，都渲染组件。如果不匹配，那么它的`match`为`null`。

在`<Route />`中只能使用其中一种。

props分别是：

- `match`
- `location`
- `history`

##### component

```jsx
function User({match}) {
    return <h1>{match.params.username}</h1>
}
//component上是一个组件
<Route path="/user/:username" component={User} />
```

当你使用`component`(而不是`render`或`children`)时，Router将根据指定的组件，使用`React.createElement`创建一个新的React元素。这意味着每次渲染都会重新创建一个新组件。这将导致现有组件的卸载和新组件的安装，而不是仅仅更新现有组件。当使用`render`和`children`内联函数进行渲染时，不会重新卸载和安装。

##### render：func

使用`render`可以方便地进行内联渲染和包装，而且不会产生上文说的重复装载问题。

```jsx
<Route path="/a" render={props => <A {...props} {...otherProps} /> />
```

> 警告：<Route component>优先于<Route render>，因此不要在同一个<Route>中同时使用两者。

##### children：func

有时候无论path是否匹配位置，你都想渲染一些内容。此时，可以使用`children`属性。除了无论是否匹配它都会被调用以外，它的工作原理与`render`完全一样。

`children`渲染方式接收所有与`component`和`render`方式相同的route props，除非路由与URL不匹配，不匹配时`match`为`null`。

```jsx
//Link为/a   这里的结果渲染了A和C组件， children不管匹不匹配都会渲染，但不匹配时match为null
<Route path="/a" component={A} />
<Route path="/b" render={(props) => <B/>} />
<Route path="/c" children={(props) => <C/>} />
```

> 警告：<Route component>和<Route render>优先于<Route children>，因此不要在同一个<route>中同时使用多个。

##### path：string

可以是path-to-regexp能够理解的任何有效的URL路径。

```jsx
<Route path="/a" component={User} />
```

没有定义path的`<Route>`总是会被匹配。

##### exact：bool

如果为`true`，则只有在`path`完全匹配`location.pathname`时才匹配。

```jsx
<Route exact path="/one" component={MyComponent} />
```

| path | location.pathname | exact | matches |
| ---- | ----------------- | ----- | ------- |
| /one | /one/two          | true  | no      |
| /one | /one/two          | false | yes     |

##### strict：bool

```jsx
<Route strict path="/one/" component={MyComponent} />
```

| path  | location.pathname | matches |
| ----- | ----------------- | ------- |
| /one/ | /one              | no      |
| /one/ | /one/             | yes     |
| /one/ | /one/two          | yes     |

##### location：object

一般情况下，`<Route>`尝试将其`path`与当前历史位置进行匹配。但是，也可以传递具有不同路径名的位置进行匹配。

```jsx
//这里不能写path，如果写了会什么都不显示。      这里总是指向location为'/a'
<Route location={{pathname: '/a'}} component={A} />
```

如果一个`<Route>`被包含在一个`<Switch>`中，并且将需要匹配的位置传递给了`<Switch>`，那么传递给`<Route>`的`location`将被`<Switch>`所使用的`location`覆盖。

```jsx
//不管url是什么，总是指向pathname为/a的Route
<Switch location={{pathname: '/a'}}>
	···
</Switch>
```

##### sensitive：bool

如果为`true`，进行匹配时将区分大小写。

```jsx
//path的大小写
<Route sensitive path="/one" component={OneComponent} />
```



### StaticRouter

一个永远不会改变位置的`<Router>`，这在服务器端渲染场景中非常有用。

以下是一个示例，node server为`<Redirect>`发送302状态码，并为其它请求发送常规HTML：

```js
import { createServer } from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

createServer((req, res) => {
  // 这个 context 对象包含了渲染的结果
  const context = {};

  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  // 如果使用 <Redirect>，context.url 将包含要重定向到的 URL
  if (context.url) {
    res.writeHead(302, {
      Location: context.url
    });
    res.end();
  } else {
    res.write(html);
    res.end();
  }
}).listen(3000);
```

##### basename: string

##### location: string

##### location: string

##### location: object

##### context: object

一个普通的 JavaScript 对象。在渲染过程中，组件可以向对象添加属性以存储有关渲染的信息。

```jsx
const context = {};			//给渲染的组件传递信息

<StaticRouter context={context}>
  	<App />
    <Route render={({staticContext}) => (//)} />
</StaticRouter>
//在StaticRouter上的context属性，在StaticRouter中的Route被匹配时，可以从props中的staticContext里得到context上定义的值
```

渲染之后，可以使用这些属性来配置服务器的响应。

```js
if (context.status === '404') {
  // ...
}
```

##### children：node



### Switch

作用：用于渲染与路径匹配的第一个子`<Route>`或`<Redirect>`。只会渲染一个，最先匹配的被渲染。

```jsx
import { Switch, Route } from 'react-router';

<Switch>
  <Route path="/about" component={About} />
  <Route path="/:user" component={User} />
  <Route component={NoMatch} />
</Switch>	

//当location为/about时，则只会渲染优先匹配的 About组件
```

##### location：object

在`<Switch>`上定义`location`属性，会覆盖当前历史位置，不管你`<Link>`的`pathname`对应`path`是哪一个，都不会匹配。会被`<Switch>`上的`location`所覆盖。下面的例子永远指向渲染组件C。

```jsx
<Switch location={{ pathname: '/c' }}>
    <Route path="/a" component={A} />
    <Route path="/:name" component={B} />
    <Route path="/c" component={C} />
</Switch>

this.props.location		//  /c的location  {pathname: '/c'}
```

##### children：node

所有`<Switch>`的子元素都应该是`<Route>`或`<Redirect>`。只有第一个匹配当前路径的子元素将被呈现。

`<Route>`组件使用`path`属性进行匹配，而`<Redirect>`组件使用它们的`from`属性进行匹配。没有`path`属性的`<Route>`或者没有`form`属性的`<Redirect>`将始终渲染绑定的组件。

如果给 `<Switch>` 提供一个 `location` 属性，它将覆盖匹配的子元素上的 `location` 属性。

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/users" component={Users} />
  <Redirect from="/accounts" to="/users" />
  <Route component={NoMatch} />
</Switch>
```



### history

`history`对象通常具有以下属性和方法：

- `length`：历史堆栈中的条目数
- `action`：当前的导航操作(`push`、`replace`或`pop`)
- `location`：当前访问的位置信息，具有以下属性：
  - `pathname`：URL路径
  - `search`：URL中的查询字符串
  - `hash`：URL中的`hash`片段
  - `state`：存储至`location`中的额外状态数据，仅在browser history和memory history中有效。
- `push(path, [state])`：将一个新条目推入到历史堆栈中
- `replace(path, [state])`：替换历史堆栈中的当前条目
- `go(n)`：将历史堆栈中的指针移动n个条目
- `goBack()`：返回到上一个页面，相当于 `go(-1)`
- `goForward()` ：进入到下一个页面，相当于 `go(1)`
- `block(prompt)` ：阻止导航

```jsx
history.block("Are you sure you want to leave this page?")

history.block((location, action) => {
  if (input.value !== "") return "Are you sure you want to leave this page?"
})
```



### location

当前访问地址信息

```js
{
  key: 'ac3df4', // 使用 hash history 时，没有这个属性
  pathname: '/somewhere'
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

1. Router将在以下几个地方为你提供一个`location`对象：

- `Route component`
- `Route render`
- `Route children`
- `withRouter`

`location`对象永远不会发生改变，因此可以在生命周期钩子函数中使用`location`对象来查看当前访问地址信息。

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.location !== this.props.location) {
    // 已经跳转了！
  }
}
```

2. 还可以在以下情况中使用`location`：

- Web`<Link to={location}>`
- React Native`<Link to={location}>`
- `<Redirect to={location}>` 
- `history.push(location, 可选参数state)`
- `history.replace(location, 可选参数state)`

```jsx
// 通常情况下我们这么做
<Link to="/somewhere" />

// 但是我们可以改为使用 location 对象
const location = {
  pathname: '/somewhere',
  state: { fromDashboard: true }
};

<Link to={location} />
<Redirect to={location} />
history.push(location);
history.replace(location);
```

3. 还能在以下标签上使用

- `<Route location={}>`
- `<Switch location={}>`

这将阻止它们在Router状态下的实际位置。这对动画和等待导航非常有用，或者任何时候你想诱导一个组件在不同于真实位置的地方渲染。



### match

一个`match`对象包含有关`<Route path>`如何匹配URL的信息。它具有以下属性：

- `params`：根据`path`中指定的动态片段，从URL中解析出的键值对。

  ```jsx
  <NavLink to="/foo">foo</NavLink>
  <Route path="/:key" component={Foo} />
  this.props.match.params		//{key: foo}
  ```

- `isExact`：如果整个URL匹配(不包含尾随字符)，则为`true`

- `path`：用于匹配的路径模式

- `url`：URL的匹配部分。

可以在以下几个地方访问`match`对象：

- `<Route component>`
- `<Route render>`
- `<Route children>`
- `<Route component>`
- `withRouter`
- `matchPath`的返回值

##### null matches

在`<Route path="/where" children={({match}) => ()} />`中，即使`path`与当前位置不匹配，`children`指定的内联函数也依然会被调用。这种情况下，`match`为`null`。

没有`path`的`<Route>`从它的父节点继承`match`对象。如果它的父匹配为`null`，那么它的匹配也将为`null`。

```jsx
// location.pathname = '/matches'
<Route path='/does-not-match' children={({ match }) => (
  // match === null
  <Route render={({ match: pathlessMatch }) => (
    // pathlessMatch === null
  )} />
)} />
```



### withRouter

对于`<Route>`标签，我们可以直接在上面获取`location`、`match`、`history`属性，但是对于其他在`<Router>`中的自定义组件却没有这3个路由属性。此时我们可以使用`withRouter`方法得到这几个属性。

```jsx
import { BrowserRouter as Router, Route, Link  } from "react-router-dom";
import Title from './Title.js'
<Router>
    <div>
        <Title name={this.state.name} />
        <Link to="/bar" onClick={this.doneBar} >bar</Link>
        <Link to="/baz" onClick={this.doneBaz} >baz</Link>
        <Route path="/bar" component={Bar} />
        <Route path="/baz" component={Baz} />
    </div>
</Router>
```

```jsx
//Title.js
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
class Title extends Component {
    ···
}
export default withRouter(Title)
```