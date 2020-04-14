[参考文章，Vue.js中 watch 的高级用法](https://juejin.im/post/5ae91fa76fb9a07aa7677543?utm_source=gold_browser_extension)

### watch

- 类型 `{ [key: string]: string | Function | Object | Array }`

- 详细：
一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。

- 示例：
```js
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    a: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // 方法名
    b: 'someMethod',
    // 深度 watcher
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    // 该回调将会在侦听开始之后被立即调用
    d: {
      handler: function (val, oldVal) { /* ... */ },
      immediate: true
    },
    e: [
      function handle1 (val, oldVal) { /* ... */ },
      function handle2 (val, oldVal) { /* ... */ }
    ],
    // watch vm.e.f's value: {g: 5}
    'e.f': function (val, oldVal) { /* ... */ }
  }
})
vm.a = 2 // => new: 2, old: 1
```

#### immediate
当watch绑定监听开始时，如果设置`immediate： true`， 那么该会调就会默认先执行一下。

#### deep
当我们在在输入框中输入数据视图改变`obj.a`的值时，我们发现是无效的。受现代 JavaScript 的限制 (以及废弃 `Object.observe`)，Vue 不能检测到对象属性的添加或删除。

比如
```html
<div id='app'>
    <input type='text' v-model='o.name'>    
</div>
```
```js
new Vue({
    el: '#app',
    data: {
        o: {
            name: 'zhangsan',
            age: 24
        }
    },
    watch: {
        o(val, oldValue) {
            console.log(val, oldValue)
        }
    }
})
```
结果是当你改变`o.name`的值时，watch里的o并没有被监听到， 没有执行回调。虽然在vue-devtools工具里我们能够看到o的数据在变化， 但是确实对于watch没有能够监听到对象的改变， 函数没有被执行。 

只有
```js
watch: {
    o: {
        handler(val, oldValue) {
            console.log(val, oldValue)
        },
        deep: true
    }
}
```
或者我们可以是使用字符串形式监听。
```js
watch: {
    'o.name'：function(val, oldValue) {
            console.log(val, oldValue)
    }
}
```
才能被watch监听到，执行回调。

<br/>

### [$watch](https://cn.vuejs.org/v2/api/#vm-watch)
vm.$watch( expOrFn, callback, [options] )
- 参数
    - `{string | Function} expOrFn`
    - `{Function | Object} callback`
    - `{Object} [options]`
        - `{boolean} deep`
        - `{boolean} immediate`
- 返回值：`{Function} unwatch`
- 示例：
```js
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
  // 做点什么
})

// 函数
vm.$watch(
  function () {
    return this.a + this.b
  },
  function (newVal, oldVal) {
    // 做点什么
  }
)

vm.$watch('someObject', callback, {
  deep: true,   //深度监听
  immediate: true   //初始默认执行回调
})
vm.someObject.nestedValue = 123
```

对于在单个组件里定义的watch，我们不用担心他一直存在内存中，当组件切换时，也随着组件一起被销毁了，但对于实例上的`$watch`我们就要手动清除。
```js
const unWatch = app.$watch('text', (newVal, oldVal) => {
  console.log(`${newVal} : ${oldVal}`);
})

unWatch(); // 手动注销watch
```
`app.$watch`调用后会返回一个值，就是`unWatch`方法，你要注销 `watch` 只要调用`unWatch`方法就可以了。