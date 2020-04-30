[toc]



Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

### useState

1. 返回一个 state，以及更新 state 的函数。

2. 在初始渲染期间，返回的状态 (`state`) 与传入的第一个参数 (`initialState`) 值相同。
3. `setState` 函数用于更新 state。它接收一个新的 state 值并将组件的一次重新渲染加入队列。
4. 在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 state。

```js
const [state, setState] = useState(initialState);

/*
initialState也可以传一个函数，必须返回一个初始值
useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
})
*/
```

```js
setState(newState);
```

```jsx
function MyComponent() {
  const [state, setState] = useState(0);
  return <div>
   	<button onClick={setState(state+1)}>setState</button> 
   </div>
}

//改变状态的写法
// setState(0)
// setState(state+1)
// setState(x => x+1)
```



### useEffect

该 Hook 接收一个包含命令式、且可能有副作用代码的函数。

```js
useEffect(didUpdate);
```

1. 在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。使用 `useEffect` 完成副作用操作

2. 赋值给 `useEffect` 的函数会在组件渲染到屏幕之后执行。
3. 默认情况下，effect 将在每轮渲染结束后延迟执行，但你可以选择让它 在只有某些值改变的时候 才执行。

4. 如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**。
5. `useEffect`代表`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`三个生命周期的总和。

```js
// 普通形式
useEffect(() => {
  const subscription = props.source.subscribe();
});

// 清除effect， 有一个返回函数会自动执行，在每次执行 useEffect函数时，会执行前一个useEffect的清除函数
useEffect(() => {
  const subscription = props.source.subscribe();   // 1
  return () => {				// 2
    // 清除订阅
    subscription.unsubscribe();
  };
});

/*
顺序， 每次重新渲染，执行useEffect时, 从第一次初始化开始

第一次
1
第二次
2   先会执行前一次的清除函数
1   在执行本次useEffect的执行函数
第三次
2
1
......
*/

/* useEffect函数第二个参数，传入一个依赖，
1. 默认不传表示观察所有props和state， ComponentDidUpdate
2. 传入一个[]空数组，没有依赖。表示只在初始化的时候执行一次， ComponentDidMount
3. 传入[a， b] 表示 观测a，b，只要他们变化了，就会执行useEffect函数
4. 传入[]， 并且有清除函数。则只会在初始化和卸载时触发,即相当于ComponentDidMount、ComponentWillUnmount
*/
//第一种
useEffect(() => {
  ...
});
// 第二种
useEffect(() => {
  ...
}, []);
// 第三种
useEffect(() => {
 ...
}, [props.a, state.b]);
//第四种
useEffect(() => {
  ...
  return () => {				
   ...
  };
}, []);
```



### useContext

```js
// 第一步 创建一个
const MyContext = React.createContext(null)

// 第二步 提供绑定数据    value绑定数据
<MyContext.Provider value={{a: 1}}>
  <App />
</MyContext.Provider>

// 获取数据
const value = useContext(MyContext);
```

```js
const value = useContext(MyContext);import React from 'react'

const MyContext = React.createContext(null);

function App() {
	return <MyContext.Provider value={{a: 1}}>
    <Main />
  </MyContext.Provider>
}

function Main() {
  // 获取数据
	const value = useContext(MyContext);
  console.log(value)		// {a: 1}
  return <div></div>
}
```



### useReducer

`useState` 的替代方案。它接收一个形如 `(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

- 第一个参数是一个`reducer`函数，即redux中的`reducer`

  ```js
  function useReducer(state, action) {
  	switch (action.type) {
      case 'increment':
        return {count: state.count + 1};
      case 'decrement':
        return {count: state.count - 1};
      default:
        throw new Error();
    }
  }
  ```

- 第二个参数是传给reducer函数的初始值

- 第三个参数是你可以选择惰性地创建初始 `state`。为此，需要将 init 函数作为 `useReducer` 的第三个参数传入，这样初始 `state` 将被设置为 `init(initialArg)`。

```jsx
const MyContext = React.createContext(null);

function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
			// 可以将 dispatch 传入到子组件中，那么就能在子组件内调用 dispatch 改变父组件的state，而又是通过value传入子组件
			// 配合 Context 使用
    	<MyContext.Provider value={{state, dispatch}}>
        <Child />
      </MyContext.Provider>
    </>
  );
}

```



------

在子组件不需要父组件的值和函数的情况下，只需要使用`memo`函数包裹子组件即可。而在使用值和函数的情况，需要考虑有没有函数传递给子组件使用`useCallback`，值有没有所依赖的依赖项而使用`useMemo`，而不是盲目使用这些hooks等。

```jsx
<Child a={a} fn={fn} />
```

一般情况当属性改变时，`Child组件`就会重新渲染，对于组件重复的渲染，我们可以使用`React.PureComponent`和`React.memo`来进行优化（当state值相同时不重复渲染，当props值相同时不重复渲染）。但他们只能做到浅对比，对于深层次的改变没法做到对比，此时我们就可以使用`useCallback`（对应函数）和`useMemo`（对应对象等）函数了。

### useCallback

执行和`effect`函数类似，只是有返回值，返回处理过的函数。

```jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。

当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

```jsx
import React, { useState, useCallback } from 'react';

const Button = React.memo({ onClickButton, children }) => {
  return (
    <>
      <button onClick={onClickButton}>{children}</button>
      <span>{Math.random()}</span>
    </>
  );
});


export default function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleClickButton1 = () => {
    setCount1(count1 + 1);
  };

  const handleClickButton2 = useCallback(() => {
    setCount2(count2 + 1);
  }, [count2]);

  return (
    <div>
      <div>
        // 每次重新渲染时，即state或props有改变，该Button组件就会重新渲染，因为每次都重新生成了一个新的handleClickButton1函数
        <Button onClickButton={handleClickButton1}>Button1</Button>
      </div>
      <div>
        // 而该组件因为useCallback hook的原因，只有在count2依赖改变时，才会重新生成一个handleClickButton2函数，不然都缓存着前一个或者初始化时的那一个。  又因为React.memo的原因，handleClickButton2如果没变，那么该组件就不会重新渲染，减少不必要的重复渲染
        <Button onClickButton={handleClickButton2}>Button2</Button>
      </div>
    </div>
  );
}
```



### useMemo

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 memoized 值。

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

记住，传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。

`useMemo` 与 `useCallback` 很像，根据上述 useCallback 已经可以想到 useMemo 也能针对传入子组件的值进行缓存优化，当然这个值必须是一个对象，如果不是对象而是一些简单类型的如字符串等，那么没更改 **`React.memo`** 也能对比出来。

```js
// ...
const [count, setCount] = useState(0);

const userInfo = {
  // ...
  age: count,
  name: 'Jace'
}
// 当count每次改变，重新渲染的时候，UserCard也会重新渲染，因为userInfo对象，每次都是生成一个新的
return <UserCard userInfo={userInfo}>
```

```js
// ...
const [count, setCount] = useState(0);

const userInfo = useMemo(() => {
  return {
    // ...
    name: "Jace",
    age: count
  };
}, [a]);

// 当count每次改变时，UserCard组件不会重新渲染，因为useMemo函数做了缓存，而且只依赖a，只有a改变了才会生成一个userInfo对象。因为React.memo的原因
return <UserCard userInfo={userInfo}>
```



### useRef

和原来的`React.createRef`类似

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}

// dom  	得到dom元素
<input ref={myRef} type="text" />
// 组件   得到组件对象
<Child ref={myRef} />
// 函数写法
<div ref={(el) => myRef = el}>dom</div>
```

如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[回调 ref](https://react.docschina.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 来实现。



### useImperativeHandle

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 ref 这样的命令式代码。`useImperativeHandle` 应当与 [`forwardRef`](https://react.docschina.org/docs/react-api.html#reactforwardref) 一起使用：

```jsx
// ref 就是组件传进来的ref属性值
function FancyInput(props, ref) {
  const inputRef = useRef();
  // 使用这个方法给父的ref，附上一个返回值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);

function App() {
  const myRef = useRef();
  
  useEffect(() => {
    console.log(myRef)   // { current: {focus: fn} }
  })   
  
  return <FancyInput ref={myRef} />
}
```



### useLayoutEffect

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

**该函数会比useEffect更先触发**

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。



### useDebugValue

```js
useDebugValue(value)
```

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。

```jsx
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签  // e.g. "FriendStatus: Online"  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```



  [详解 useCallback & useMemo](https://juejin.im/post/5e78884c6fb9a07c8679220d)

