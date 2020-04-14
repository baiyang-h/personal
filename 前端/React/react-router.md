## React-Router

1. `<Route>`中的组件的`props`中，默认存在`history`、`location`、`match`三个属性。但其他不是绑定在`<Route>`上的组件是没有这3个属性的，如果其他组件也想在`<BrowserRouter>`中得到这3个属性，那么需要使用`withRouter(组件)`。
2. 对于`<Router>`中的自定义组件，如`<my-component>`，在点击`Link`改变url的时候会重新执行。

```
npm install --save react-router
npm install --save react-router-dom
```

## `<BrowserRouter>`

`<BrowserRouter>`使用HTML5提供的history API(`pushState`, `replaceState` 和 `popstate` 事件)来保持 UI 和 URL 的同步。 像Vue中的history模式

```jsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter
  basename={string}
  forceRefresh={bool}
  getUserConfirmation={func}
  keyLength={number}
>
  <App />
</BrowserRouter>
```

#### basename: string

所有位置的基准 URL。如果你的应用程序部署在服务器的子目录，则需要将其设置为子目录。`basename` 的正确格式是前面有一个前导斜杠，但不能有尾部斜杠。

```jsx
<BrowserRouter basename="/aa">
    <div>
    	<Link to="/bar">bar</Link>

    	<Route path="/bar" component={Bar} />			//这里path不用写/aa/bar
	</div>
</BrowserRouter>
```

上例中的 `<Link>` 最终将被呈现为：

```jsx
<a href="/aa/bar" />
```

#### forceRefresh: bool     （会全部刷新）

如果为 `true` ，在导航的过程中整个页面将会刷新。一般情况下，只有在不支持 HTML5 history API 的浏览器中使用此功能。 

```jsx
const supportsHistory = 'pushState' in window.history;
<BrowserRouter forceRefresh={!supportsHistory} />
```

#### getUserConfirmation: func

用于确认导航的函数，默认使用 [window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)。例如，当从 `/a` 导航至 `/b` 时，会使用默认的 `confirm` 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理。

**注：需要配合 `<Prompt>` 一起使用**，我们可以在`<Prompt message="xxx">`写上离开时要显示的`message`，通过`getUserConfirmation`函数来确定显示什么和是否跳转。

```jsx
// 这是默认的确认函数
const getConfirmation = (message, callback) => { 	 
  const allowTransition = window.confirm(message);	//yes  or no		
  callback(allowTransition);		//传入true跳转
}
//getUserConfirmation绑定的函数默认有两个参数，一个是<Prompt>标签中message的数据，callback为内置封装了的回调函数，传入true跳转，传入false阻止。
<BrowserRouter getUserConfirmation={getConfirmation}>	
    <div>
    	<Prompt  message="你确定要离开吗？" />
        ······
    </div>
</BrowserRouter>
```

猜想使用场景：对于每个组件我们都可以通过设置`<Prompt>`标签来做组件内部离开时的守卫，当然我们也可以使用函数的方式写message，但如果很多个组件内部`<Prompt>`的message中的方法都一样，那么每个都写是否会重复。这个时候使用`getUserConfirmation`做一个全局守卫，对于组件内部只写message的字符串信息。方法都写在`getUserConfirmation`上。

#### keyLength: number

作用：设置它里面路由的`location.key`的长度，默认为6。(`key`的作用：点击同一个连接时，每次该路由下的`location.key`都会改变，可以通过`key`的变化来刷新页面。)

```jsx
<BrowserRouter keyLength={12} />
```

#### children: node

要呈现的[单个子元素（组件）](https://reactjs.org/docs/react-api.html#react.children.only)。



## `<HashRouter>`

`<HashRouter>` 使用 URL 的 `hash` 部分（即 `window.location.hash`）来保持 UI 和 URL 的同步。 像Vue中的hash模式。

> 注意： 使用 `hash` 记录导航历史不支持 `location.key` 和 `location.state`。在以前的版本中，我们视图 shim 这种行为，但是仍有一些问题我们无法解决。任何依赖此行为的代码或插件都将无法正常使用。由于该技术仅用于支持旧式（低版本）浏览器，因此对于一些新式浏览器，我们鼓励你使用 `<BrowserHistory>` 代替。

`<a href="#/calendar/today" />`

#### basename: string

#### getUserConfirmation: func

#### hashType: string

`window.location.hash` 使用的 `hash` 类型，有如下几种：

- `slash` - 后面跟一个斜杠，例如 #/ 和 #/sunshine/lollipops
- `noslash` - 后面没有斜杠，例如 # 和 #sunshine/lollipops
- `hashbang` - Google 风格的 [ajax crawlable](https://developers.google.com/webmasters/ajax-crawling/docs/learn-more)，例如 #!/ 和 #!/sunshine/lollipops

默认为 `slash`。

#### children: node



## `<Link>`

为你的应用提供声明式的、可访问的导航链接。

```jsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
```

#### to: string

一个字符串形式的链接地址，通过 `pathname`、`search` 和 `hash` 属性创建。 

```jsx
<Link to='/courses?sort=name' />
```

#### to: object

一个对象形式的链接地址，可以具有以下任何属性

- `pathname` - 要链接到的路径
- `search` - 查询参数
- `hash` - URL 中的 hash，例如 #the-hash
- `state` - 存储到 location 中的额外状态数据

```jsx
<Link to={{
  pathname: '/courses',
  search: '?sort=name',
  hash: '#the-hash',
  state: {
    fromDashboard: true
  }
}} />
```

#### replace: bool

当设置为 `true` 时，点击链接后将替换历史堆栈中的当前条目，而不是添加新条目。默认为 `false`。

```jsx
<Link to="/courses" replace />
```

#### innerRef: func

允许访问组件的底层引用。 

```jsx
const refCallback = node => {
  // node 指向最终挂载的 DOM 元素，在卸载时为 null
    console.log(node);			//<a href="/">foo</a>
}

<Link to="/" innerRef={refCallback}>foo</Link>
```

#### innerRef: RefObject

```jsx
const anchorRef = React.createRef()

<Link to="/" innerRef={anchorRef} />
```

#### others   (一些自定义属性)

你还可以传递一些其它属性，例如 `title`、`id` 或 `className` 等。 

```jsx
<Link to="/" className="nav" title="a title">About</Link>
```



## `<NavLink>`

一个特殊版本的 `<Link>`，它会在与当前 URL 匹配时为其呈现元素添加样式属性。 默认是匹配时加了`class="active"`和`aria-current="page"`

```jsx
import { NavLink } from 'react-router-dom';

<NavLink to="/about">About</NavLink>
```

Elements

```html
<a href="/about" class="active" aria-current="page">bar</a>
```

#### activeClassName: string

当元素处于激活状态时应用的类，默认为 `active`。它将与 `className` 属性一起使用，不会覆盖。

```jsx
<NavLink to="/faq" activeClassName="selected">FAQs</NavLink>
```

#### activeStyle: object

当元素处于激活状态时应用的样式。

```jsx
const activeStyle = {
  fontWeight: 'bold',
  color: 'red'
};

<NavLink to="/faq" activeStyle={activeStyle}>FAQs</NavLink>
```

#### exact: bool

如果为 `true`，则只有在位置完全匹配时才应用激活类/样式。

```jsx
<NavLink exact to="/profile">Profile</NavLink>
```

#### strict: bool

如果为 `true`，则在确定位置是否与当前 URL 匹配时，将考虑位置的路径名后面的斜杠。有关更多信息，请参阅 [<Route strict>](https://reacttraining.com/react-router/web/api/Route/strict-bool) 文档。

```jsx
<NavLink strict to="/events/">Events</NavLink>

<Route strict to="/events/" />
```

| path    (Route) | location.pathname    (Link) | matches? |
| --------------- | --------------------------- | -------- |
| `/one/`         | `/one`                      | no       |
| `/one/`         | `/one/`                     | yes      |
| `/one/`         | `/one/two`                  | yes      |

#### isActive: func

是否让`activeClassName`、`activeStyle`有效。

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

#### location: object

`isActive` 默认比较当前历史位置（通常是当前的浏览器 URL）。可以设置别的location，那么在`isActive`的函数的`location`参数中可以得到你设置的数据。

```jsx
const oddEvent = (match, location) {
    //如果不设置location的值，那么值为当前url匹配的location，设置了则为你设置匹配的location
    console.log(location);  	//打印 {pathname: '/b'} 
    return true;
}

<NavLink to="/a" isActive={oddEvent} location={{pathname: '/b'}}>
```



## `<Prompt>`

用于在进行跳转之前，离开的时候给予用户一些确认信息，确认了才跳转，否则阻止。

比如：我在填写表单，填到一半不小心点击了别的按钮，如果不设置会直接跳转，那么就白填了这么久。该标签就能弹出一个提示。

```jsx
import { Prompt } from 'react-router-dom';

<Prompt when={一个布尔值} message="可以使字符串或函数" />
```

#### message: string

当用户试图离开某个位置时弹出的提示信息。

```jsx
<Prompt message="你确定要离开当前页面吗？" />
```

#### message: func

将在用户试图导航到下一个位置时调用。需要返回一个字符串以向用户显示提示，或者返回 `true` 以允许直接跳转。

```jsx
<Prompt message={location => {
  //location：为跳转到的地方的location
  //可以返回字符串或者直接返回true	true直接跳转， false 阻止
  return true
}} />
```

> 译注：上例中的 `location` 对象指的是下一个位置（即用户想要跳转到的位置）。你可以基于它包含的一些信息，判断是否阻止导航，或者允许直接跳转。

#### when: bool

通过设置 `when={true}` 或 `when={false}` 以阻止或允许相应的导航。

> 译注：`when` 只有两种情况，当它的值为 `true` 时，会弹出提示信息。如果为 `false` 则不会弹出。见[阻止导航](https://reacttraining.com/react-router/web/example/preventing-transitions)示例。



## ` <MemoryRouter>`

将 URL 的历史记录保存在内存中的 `<Router>`（不读取或写入地址栏）。在测试和非浏览器环境中很有用，例如 [React Native](https://facebook.github.io/react-native/)。( 即在网页的网址上不管你怎么点击`<Link>`，地址栏已经不会变动了，主要在内存上)。

#### initialEntries: array

历史堆栈中的一系列位置信息。这些可能是带有 `{pathname, search, hash, state}` 的完整位置对象或简单的字符串 URL。

即我此时在内存中的历史中存在一个list，里面为`pathname`集。

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

#### initialIndex: number

`initialEntries` 数组中的初始位置索引。初始化渲染历史堆栈中的相应`pathname`的`path`。

#### getUserConfirmation: func

用于确认导航的函数。当 `<MemoryRouter>` 直接与 `<Prompt>` 一起使用时，你必须使用此选项。

#### keyLength: number

`location.key` 的长度，默认为 `6`。

#### children: node

要呈现的[单个子元素（组件）](https://reactjs.org/docs/react-api.html#react.children.only)。



## `<Redirect>`

使用 `<Redirect>` 会导航到一个新的位置。**新的位置将覆盖历史堆栈中的当前条目**，例如服务器端重定向（HTTP 3xx）。

```jsx
import { Route, Redirect } from 'react-router-dom';
//第一种
<Route exact path="/" render={ () => <Redirect to="/a" /> } />
//第二种 必须在Swtich		form就是pathname对应的值
<Switch>
    <Route to="/a" component={A} />
	<Route to="/b" render={B} />
    <Redirect from="/c" to="/a" />
</Switch>
```

#### to: string

要重定向到的 URL，可以是 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的 URL 路径。所有要使用的 URL 参数必须由 `from` 提供。

```jsx
<Redirect to="/a" />
```

#### to: object

要重定向到的位置，其中 `pathname` 可以是 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的 URL 路径。

```jsx
<Redirect to={{
  pathname: '/login',
  search: '?utm=your+face',
  state: {				//可以在这个属性中进行location中的传数据， 在渲染组件的location中可以获取
    referrer: currentLocation
  }
}} />
```

上例中的 `state` 对象可以在重定向到的组件中通过 `this.props.location.state` 进行访问。

#### push: bool

**如果为 `true`，重定向会将新的位置推入历史记录，而不是替换当前条目。**

```jsx
<Redirect push to="/a />
```

#### from: string

要从中进行重定向的路径名，可以是 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的 URL 路径。所有匹配的 URL 参数都会提供给 `to`，必须包含在 `to` 中用到的所有参数，`to` 未使用的其它参数将被忽略。

**只能在 `<Switch>` 组件内使用 `<Redirect from>`，以匹配一个位置，`from` 只是 `path` 的别名 **。有关更多细节，请参阅 [`<Switch child>`](https://reacttraining.com/react-router/web/api/Switch/children-node)。



```jsx
<Switch>
  <Redirect from='/old-path' to='/new-path' />
  <Route path='/new-path' component={Place} />
</Switch>
```

#### exact: bool

完全匹配，相当于 [Route.exact](https://reacttraining.com/react-router/web/api/Route/exact-bool)。

#### strict: bool

严格匹配，相当于 [Route.strict](https://reacttraining.com/react-router/web/api/Route/strict-bool)。



## `<Route>`

它最基本的职责是在其 `path` 属性与某个 [location](https://reacttraining.com/react-router/web/api/location) 匹配时呈现相应的组件。

```jsx
import { BrowserRouter as Router, Route } from 'react-router-dom';

<Router>
  <div>
    <Route exact path="/" component={Home} />
    <Route path="/news" component={News} />
  </div>
</Router>
```

对于想在Route上设置自定义属性，想用于在路由上的组件。  我们只能将自定义属性写在组件上。

**记住Route的三种渲染方式中的props，只有match、location、history这三种属性**。

```js
//在Route上直接写自定义属性和组件一样（<Route a="123"/>），是不会包含到props中去的, 在props中只有match、location、history三个属性， 只能把自定属性直接定义到组件上才有效
<Route path="/a" render={(props) => <A {...props} aa="123" doneShow={() => this.show} />} />
```

#### Route render methods

使用 `<Route>` 渲染一些内容有以下三种方式：

- [`<Route component>`](https://reacttraining.com/react-router/web/api/Route/component)   每次都会卸载、重新渲染， `component`上是一个函数名或类名。如`myComponent`
- [`<Route render>`](https://reacttraining.com/react-router/web/api/Route/render-func)  不会每次卸载、重新渲染，`render`上是一个组件标签。如`<myComponent>`
- [`<Route children>`](https://reacttraining.com/react-router/web/api/Route/children-func)  当不管`pathname`和`location`是否匹配，都渲染组件。 如果不匹配`match`为`null`。也是一个组件标签。如`<myComponent>`

在不同的情况下使用不同的方式。在指定的 `<Route>` 中，你应该只使用其中的一种。

#### Route props

三种渲染方式都将提供相同的三个路由属性：

- [match](https://reacttraining.com/react-router/web/api/match)
- [location](https://reacttraining.com/react-router/web/api/location)
- [history](https://reacttraining.com/react-router/web/api/history)

#### component

指定只有当位置匹配时才会渲染的 React 组件，该组件会接收 [route props](http://reacttraining.cn/web/api/Route/Route-props) 作为属性。

```jsx
const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}

<Route path="/user/:username" component={User} />		//注意看这里 User是一个变量名，不是<User />
```

当你使用 `component`（而不是 `render` 或 `children`）时，Router 将根据指定的组件，使用 `React.createElement` 创建一个新的 React 元素。这意味着，如果你向 `component` 提供一个内联函数，那么每次渲染都会创建一个新组件。这将导致现有组件的卸载和新组件的安装，而不是仅仅更新现有组件。当使用 `render` 或 `children`内联函数进行内联渲染时不会重新卸载和安装。

#### render: func

使用 `render` 可以方便地进行内联渲染和包装，而且不会产生上文说的重复装载问题。

你可以传入一个函数，以在位置匹配时调用，而不是使用 `component` 创建一个新的 React 元素。`render` 渲染方式接收所有与 `component` 方式相同的 [route props](https://reacttraining.com/react-router/web/api/Route/route-props)。

```jsx
<Route path="/a" render={(props) => <A/>} />	//注意， 这里返回的是一个组件，一个html
```

> 警告：`<Route component>` 优先于 `<Route render>`，因此不要在同一个 `<Route>` 中同时使用两者。

#### children: func

有时候不论 `path` 是否匹配位置，你都想渲染一些内容。在这种情况下，你可以使用 `children` 属性。除了不论是否匹配它都会被调用以外，它的工作原理与 `render` 完全一样。

不管有没有匹配，都会渲染。

`children` 渲染方式接收所有与 `component` 和 `render` 方式相同的 [route props](https://reacttraining.com/react-router/web/api/Route/route-props)，除非路由与 URL 不匹配，不匹配时 `match` 为 `null`。

```jsx
//Link为/a	这里的结果渲染了A和C组件，  children不管匹不匹配都会渲染，但不匹配match为bull
<Route path="/a" component={A} />		
<Route path="/b" render={(props) => <B/>} />
<Route path="/c" children={(props) => <C/>} /   //注意， 这里返回的是一个组件，一个html
```

> 警告：`<Route component>` 和 `<Route render>` 优先于 `<Route children>`，因此不要在同一个 `<Route>` 中同时使用多个。

#### path: string

可以是 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 能够理解的任何有效的 URL 路径。

```jsx
<Route path="/users/:id" component={User} />
```

没有定义 `path` 的 `<Route>` 总是会被匹配。 就是我们输入一个url结果都没找到匹配，此时我们就渲染这个。

#### exact: bool

如果为 `true`，则只有在 `path` 完全匹配 `location.pathname` 时才匹配。 

```jsx
<Route exact path="/one" component={OneComponent} />
```

| path | location.pathname | exact | matches |
| ---- | ----------------- | ----- | ------- |
| /one | /one/two          | true  | no      |
| /one | /one/two          | false | yes     |

#### strict: bool

如果为 `true`，则具有尾部斜杠的 `path` 仅与具有尾部斜杠的 `location.pathname` 匹配。当 `location.pathname` 中有附加的 URL 片段时，`strict` 就没有效果了。

```jsx
<Route strict path="/one/" component={OneComponent} />
```

| path  | location.pathname | matches |
| ----- | ----------------- | ------- |
| /one/ | /one              | no      |
| /one/ | /one/             | yes     |
| /one/ | /one/two          | yes     |

> 警告：可以使用 `strict` 来强制规定 `location.pathname` 不能具有尾部斜杠，但是为了做到这一点，`strict` 和 `exact` 必须都是 `true`。

#### location: object

一般情况下，`<Route>` 尝试将其 `path` 与当前历史位置（通常是当前的浏览器 URL）进行匹配。但是，也可以传递具有不同路径名的位置进行匹配。

```jsx
//这里不能写path，如果写了会什么都不显示。      这里总是指向location为'/a'
<Route location={{pathname: '/a'}} component={A} />
```

如果一个 `<Route>` 被包含在一个 `<Switch>` 中，并且需要匹配的位置（或当前历史位置）传递给了 `<Switch>`，那么传递给 `<Route>` 的 `location` 将被 `<Switch>` 所使用的 `location` 覆盖。

```jsx
//不管url怎么变化，它location总是指向/a，所以总是渲染A组件。Switch上的location覆盖内部Route上的location
<Switch location={{pathname: '/a'}}>
	···
</Switch>
```

#### sensitive: bool

如果为 `true`，进行匹配时将区分大小写。

```jsx
<Route sensitive path="/one" component={OneComponent} />
```



## `<Router>`

所有 Router 组件的通用低阶接口。通常情况下，应用程序只会使用其中一个高阶 Router：

- [BrowserRouter](https://reacttraining.com/react-router/web/api/BrowserRouter)
- [HashRouter](https://reacttraining.com/react-router/web/api/HashRouter)
- [MemoryRouter](https://reacttraining.com/react-router/web/api/MemoryRouter)
- [NativeRouter](https://reacttraining.com/react-router/native/api/NativeRouter)
- [StaticRouter](https://reacttraining.com/react-router/web/api/StaticRouter)

使用低阶` <Router>` 的最常见用例是同步一个自定义历史记录与一个状态管理库，比如 Redux 或 Mobx。请注意，将 React Router 和状态管理库一起使用并不是必需的，它仅用于深度集成。

```jsx
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

<Router history={history}>
  <App />
</Router>
```

#### history: object

用于导航的历史记录对象。

```jsx
import createBrowserHistory from 'history/createBrowserHistory';

const customHistory = createBrowserHistory();

<Router history={customHistory} />
```

#### children: node

要呈现的[单个子元素（组件）](https://reactjs.org/docs/react-api.html#react.children.only)。

```jsx
<Router>
  <App />
</Router>
```



## `<StaticRouter>`

一个永远不会改变位置的 `<Router>`。

这在服务器端渲染场景中非常有用，因为用户实际上没有点击，所以位置实际上并未发生变化。因此，名称是 `static`（静态的）。当你只需要插入一个位置，并在渲染输出上作出断言以便进行简单测试时，它也很有用。

以下是一个示例，node server 为 `<Redirect>` 发送 302 状态码，并为其它请求发送常规 HTML：

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

#### basename: string

所有位置的基准 URL。`basename` 的正确格式是前面有一个前导斜杠，但不能有尾部斜杠。

```jsx
<StaticRouter basename="/calendar">
  <Link to="/today" />
</StaticRouter>
```

上例中的 `<Link>` 最终将被呈现为：

```jsx
<a href="/calendar/today" />
```

#### location: string

服务器收到的 URL，可能是 node server 上的 `req.url`。

```jsx
<StaticRouter location={req.url}>
  <App />
</StaticRouter>
```

#### location: object

一个形如 `{pathname, search, hash, state}` 的位置对象。

```jsx
<StaticRouter location={{ pathname: '/bubblegum' }}>
  <App />
</StaticRouter>
```

#### context: object

一个普通的 JavaScript 对象。在渲染过程中，组件可以向对象添加属性以存储有关渲染的信息。

```jsx
const context = {};			//给渲染的组件传递信息

<StaticRouter context={context}>
  	<App />
    <Route render={({staticContext}) => (//)} />
</StaticRouter>
//在StaticRouter上的context属性，在StaticRouter中的Route被匹配时，可以从props中的staticContext里得到context上定义的值
```

当一个 `<Route>` 匹配时，它将把 context 对象传递给呈现为 `staticContext` 的组件。查看[服务器渲染指南](https://reacttraining.com/web/guides/server-rendering)以获取有关如何自行完成此操作的更多信息。

渲染之后，可以使用这些属性来配置服务器的响应。

```js
if (context.status === '404') {
  // ...
}
```

#### children: node

要呈现的[单个子元素（组件）](https://reactjs.org/docs/react-api.html#react.children.only)。



## `<Switch>`

用于渲染与路径匹配的第一个子 `<Route>` 或 `<Redirect>`。 只会渲染一个，最先匹配的被渲染。

`<Switch>` 只会渲染一个路由。相反，仅仅定义一系列 `<Route>` 时，每一个与路径匹配的 `<Route>` 都将包含在渲染范围内。 考虑如下代码： 

```jsx
<Route path="/about" component={About} />
<Route path="/:user" component={User} />
<Route component={NoMatch} />
```

如果 URL 是 `/about`，那么 `<About>`、`<User>` 和 `<NoMatch>` 将全部渲染，因为它们都与路径匹配。 

但是，有时候我们只想选择一个 `<Route>` 来呈现。比如我们在 URL 为 `/about` 时不想匹配 `/:user`（或者显示我们的 404 页面），这该怎么实现呢？以下就是如何使用 `<Switch>` 做到这一点： 

```jsx
import { Switch, Route } from 'react-router';

<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/:user" component={User} />
  <Route component={NoMatch} />
</Switch>	
```

现在，当我们在 `/about` 路径时，`<Switch>` 将开始寻找匹配的 `<Route>`。我们知道，`<Route path="/about" />` 将会被正确匹配，这时 `<Switch>` 会停止查找匹配项并立即呈现 `<About>`。同样，如果我们在 `/michael` 路径时，那么 `<User>` 会呈现。 

#### location: object

```jsx
<Switch location={{ pathname: '/c' }}>
    <Route path="/a" component={A} />
    <Route path="/:name" component={B} />
    <Route path="/c" component={C} />
</Switch>

render() {
    //使用this.props.location使Switch上的location还是指向url上你定义的路径，相当于内部Route上匹配的还是能有效
    return (
        <div>
            <Switch location={isModal ? '/a' : this.props.location}>
            	···
            </Switch>
        </div>
    )
}
```

在`<Switch>`上定义了`location`属性，会覆盖当前历史位置，不管你`<Link>`的`pathname`对应`path`是哪一个，都不会匹配。会被`<Switch>`上的`location`所覆盖。 上面例子永远指向`pathname: '/c'`，渲染组件`C`。

#### children: node

所有 `<Switch>` 的子元素都应该是 `<Route>` 或 `<Redirect>`。只有第一个匹配当前路径的子元素将被呈现。 

`<Route>` 组件使用 `path` 属性进行匹配，而 `<Redirect>` 组件使用它们的 `from` 属性进行匹配。没有 `path` 属性的 `<Route>` 或者没有 `from` 属性的 `<Redirect>` 将始终渲染绑定的组件。

如果给 `<Switch>` 提供一个 `location` 属性，它将覆盖匹配的子元素上的 `location` 属性。 

```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/users" component={Users} />
  <Redirect from="/accounts" to="/users" />
  <Route component={NoMatch} />
</Switch>
```



## history

`React`对`history`提供了几种不同的实现方式，用于在各种环境中管理`JavaScript`中的会话历史。

以下术语我们会经常使用： 

- `browser history` - 针对 DOM 环境，用于支持 HTML5 history API 的浏览器
- `hash history` - 针对 DOM 环境，用于传统的旧式（低版本） 浏览器
- `memory history` - `history` 在内存上的实现，用于测试以及 React Native 等非 DOM 环境



`history` 对象通常具有以下属性和方法： 

- `length` - number 历史堆栈中的条目数

- `action` - string 当前的导航操作（`push`、`replace` 或 `pop`）
- `location` - object 当前访问的位置信息，可能具有以下属性： 
  - `pathname` - string URL 路径
  - `search` - string URL 中的查询字符串
  - `hash` - string URL 中的 hash 片段
  - `state` - object 存储至 `location` 中的额外状态数据，仅在 `browser history` 和 `memory history` 中有效。
- `push(path, [state])` - function 将一个新条目推入到历史堆栈中

- `replace(path, [state])` - function 替换历史堆栈中的当前条目

- `go(n)` - function 将历史堆栈中的指针移动 n 个条目

- `goBack()` - function 返回到上一个页面，相当于 go(-1)

- `goForward()` - function 进入到下一个页面，相当于 go(1)

- `block(prompt)` - function 阻止导航（请参阅 [history](https://github.com/ReactTraining/history#blocking-transitions) 文档）

```js
history.block("Are you sure you want to leave this page?")

history.block((location, action) => {
  if (input.value !== "") return "Are you sure you want to leave this page?"
})
```

#### history is mutable

`history` 对象是可变的。因此建议从 `<Route>` 渲染组件时接收的属性中直接访问 `location`，而不是通过 `history.location` 进行访问。这样可以保证 React 在生命周期中的钩子函数正常执行。例如： 

```jsx
class Comp extends React.Component {
  componentWillReceiveProps(nextProps) {
    // locationChanged 会是 true		
    const locationChanged = nextProps.location !== this.props.location;

    // 错误，locationChanged 永远是 false，因为 history 是可变的。
    const locationChanged = nextProps.history.location !== this.props.history.location;
  }
}

<Route component={Comp} />
```



## location

`location` 代表应用程序的位置(url)。如当前的位置，将要去的位置，或是之前所在的位置。它看起来像这样： 

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

Router 将在以下几个地方为您提供一个 `location` 对象： 

- 在 `Route component` 中
- 在 `Route render` 中
- 在 `Route children` 中
- 在 `withRouter` 中

`location` 对象永远不会发生改变，因此可以在生命周期钩子函数中使用 `location` 对象来查看当前访问地址是否发生改变。这种技巧在获取远程数据以及使用动画时非常有用。 

```js
componentWillReceiveProps(nextProps) {
  if (nextProps.location !== this.props.location) {
    // 已经跳转了！
  }
}
```

还可以在以下情况中使用 `location`： 

- Web [`<Link to={location}>`](https://reacttraining.com/react-router/web/api/Link)
- React Native  [`<Link to={location}>`](https://reacttraining.com/react-router/native/api/Link) 
- [`<Redirect to={location}>`](https://reacttraining.com/react-router/web/api/Redirect)
- [history.push(location)](https://reacttraining.com/react-router/web/api/history)
- [history.replace(location)](https://reacttraining.com/react-router/web/api/history)

通常情况下只是使用一个字符串，但是如果你需要添加一些额外的 `state`，以在应用程序跳转到特定位置时可以使用，那么你就可以使用 `location` 对象。 

```js
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

最终，`location` 将传递给以下组件： 

- [Route](https://reacttraining.com/react-router/web/api/Route)
- [Switch](https://reacttraining.com/react-router/web/api/Switch)

这将阻止它们在 Router 状态下使用实际位置。这对动画和等待导航非常有用，或者任何时候你想诱导一个组件在不同于真实位置的地方渲染。 



## match

一个 `match` 对象包含有关 `<Route path>` 如何匹配 URL 的信息。它具有以下属性： 

- `params` - object 根据 `path` 中指定的动态片段，从 URL 中解析出的键值对
- `isExact` - boolean 如果整个 URL 匹配（不包含尾随字符），则为 `true`
- `path` - string 用于匹配的路径模式。可用于构建嵌套的 `<Route>`
- `url` - string URL 的匹配部分。可用于构建嵌套的 `<Link>`

您可以在以下几个地方访问 `match` 对象： 

- 在 `Route component` 中
- 在 `Route render` 中
- 在 `Route children` 中
- 在 `withRouter` 中
- `matchPath` 的返回值

如果 `<Route>` 没有定义 `path`，并因此始终匹配，则会得到最接近的父匹配。`withRouter` 也是一样。 

#### null matches

在 `<Route path="/somewhere" children={({ match }) => ()} />` 中，即使 `path` 与当前位置不匹配，`children` 指定的内联函数也依然会被调用。这种情况下，`match` 为 `null`。 

没有 `path` 的 `<Route>` 从它的父节点继承 `match` 对象。如果它的父匹配为 `null`，那么它的匹配也将为 `null`。

```js
// location.pathname = '/matches'
<Route path='/does-not-match' children={({ match }) => (
  // match === null
  <Route render={({ match: pathlessMatch }) => (
    // pathlessMatch === null
  )} />
)} />
```

这意味着：

- 任何子路由/子链接必须是绝对的
- 一个没有定义 `path` 的 `<Route>`，它的父匹配可以为 `null`，但它本身需要使用 `children` 来呈现内容。



## matchPath

在正常的渲染周期之外，你可以使用和 `<Route>` 所使用的相同的匹配代码，例如在服务器上呈现之前收集数据依赖关系。 

```js
import { matchPath } from 'react-router';

const match = matchPath('/users/123', {
  path: '/users/:id',
  exact: true,
  strict: false
});
```

#### pathname

第一个参数是要匹配的路径名。如果您在服务器上通过 Node.js 使用，它将是 `req.path`。 

#### props

第二个参数是匹配的属性，它们与 `<Route>` 接受的匹配属性相同： 

```js
{
  path, // 例如 /users/:id
  strict, // 可选，默认为 false
  exact // 可选，默认为false
}
```



## withRouter

你可以通过 `withRouter` 高阶组件访问 `history` 对象的属性和最近（UI 结构上靠的最近）的 `<Route>`的 `match` 对象。当组件渲染时，`withRouter` 会将更新后的 `match`、`location` 和 `history` 传递给它。 

```jsx
import { BrowserRouter as Router, Route, Link  } from "react-router-dom";

<Router>
    <div>
        <Title name={this.state.name} />
        <br />
        <Link to="/bar" onClick={this.doneBar} >bar</Link>
        <Link to="/baz" onClick={this.doneBaz} >baz</Link>
        <Link to="/foo" onClick={this.doneFoo} >foo</Link>
        <br />
        <Route path="/bar" component={Bar} />
        <Route path="/baz" component={Baz} />
        <Route path="/foo" component={Foo} />
    </div>
</Router>
```

对于`<Route>`标签，我们可以直接在上面获取`location`、`match`、`history`等属性，但是对于上面的`<Title />`组件却不能得到这3个路由属性，此时我们使用`withRouter`就也能在`<Title />`组件内部得到这几个路由属性了。

```jsx
//Title.js
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
class Title extends Component {
    ···
}

export default withRouter(Title)
```
