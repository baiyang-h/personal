#### 单向数据流

每次父组件更新时，子组件的所有 prop 都会更新为最新值。这意味着你不应该在子组件内部改变 prop。如果你这么做了，Vue 会在控制台给出警告。

在两种情况下，我们很容易忍不住想去修改 prop 中数据：

1. Prop 作为初始值传入后，子组件想把它当作局部数据来用；
2. Prop 作为原始数据传入，由子组件处理成其它数据输出。

对这两种情况，正确的应对方式是：

1.定义一个局部变量，并用 prop 的值初始化它：
```js
props: ['initialCounter'],
data: function () {
  return { counter: this.initialCounter }
}
```

2.定义一个计算属性，处理 prop 的值并返回：
```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

> 注意在 JavaScript 中对象和数组是引用类型，指向同一个内存空间，如果 prop 是一个对象或数组，在子组件内部改变它会影响父组件的状态。

<br/>

- 这里有个点需要注意，对于data中prop初始化是值他不会随着从父传入子的prop变动而变动，他就一直是一开始那个初始化的prop， 除非直接改变data。
- 对于computed中的初始化，因为计算属性根据数据而变动， 所以会随着父传子的prop变动而变动。
- 如果data里的初始化数据也想随着prop变动而变动，那么可以使用watch来监听prop， 当prop改变的时候，我们对data数据做更新。

```html
    <div id='app'>
        <button @click='msg=222'>click</button>
        <my-component :msg='msg' />
    </div>
```
```js
//parent
    new Vue({
        el: '#app',
        data: {
            msg: 111
        }
    })

//child
    {
        props: ['msg'],
        data() {
            return {
                dmsg: this.msg
            }
        },
        computed: {
            cmsg() {
                return this.msg
            }
        }
    }
```
点击button按钮的时候， child组件里的dmsg没有变还是初始化的prop， cmsg计算属性根据数据变，改变了。
```js
//通过vuetools

dmsg      //111
cmsg      //222
```

对于data里的数据也想根据prop的数据共同变化的解决办法；
```js
watch: {
    msg(new, oldValue) {
        this.dmsg = new
    }
}
```