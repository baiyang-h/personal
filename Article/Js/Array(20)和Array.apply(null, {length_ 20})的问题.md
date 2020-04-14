#### Array(20)和Array.apply(null, {length: 20})的问题

这个问题源自于vue官方文档中jsx章节中。
1. apply
2. 本节讲了`{length; 20}`length属性为类数组, 
3. `Array(number)`和`Array.apply(null, {length: num})`的区别
4. 为什么要写{length: 20}这么复杂

##### apply
```js
Function.prototype.apply(xx, 类数组)
```

##### {length: 20}就是一个类数组
怎么样算一个类数组呢？ 只要有length属性的对象就可以当成是一个类数组（即包含length属性，且length属性值是个数字的对象）。

对象{length: 2}就是一个类数组对象，因为没有初始化下标0，1的值，所以0，1下标的取值都是undefined

<br/>

##### Array(20)
`Array(20)` 就是等价于 `new Array(20)`
```js
let a = Array(20)    //[empty × 20]    创建20个值为空的数组，内部值没有初始化
```
但是`a[index]`值为`undefined`, 因为数组下标0还未初始化,访问不存在的属性返回`undefined`

<br/>

##### Array.apply(null, {length: 20})
```js
let a = Array.apply(null, {length: 20})  //[undefined, undefined, undefined, undefined, ···] 20个undefined   
```
执行`Array.apply(null, {length: 20})`为数组创建了一个长度为20，并且每个值初始化为undefined。

所以
```js
Array.apply(null, {length: 2})
//等价于
Array.apply(null, [undefined, undefined]); // {length: 2} -> [undefined, undefined]
Array(undefined, undefined); // apply方法的执行结果
new Array(undefined, undefined); // Array方法直接调用和new方式调用等价
```

这样就很容易知道该表达式的值是一个长度为2，且每个元素值都被初赋值为undefined的数组（注意不是数组元素没有初始化，而是初始化成undefined，这就是跟Array(2)的区别）。

如果要赋值，可以这样
```js
console.log(Array.apply(null, {0:'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', length:5})); //["a", "b", "c", "d", "e"]
```
和ES6的[Array.from](http://es6.ruanyifeng.com/#docs/array#Array-from)有点类似。  `Array.from(类数组)`

<br/>

##### 为什么要写{length: 20}这么复杂
原因是map函数并不会遍历数组中没有初始化或者被delete的元素（有相同限制还有forEach, reduce方法）。
```js
// 被初始化的数组
Array.apply(null, {length: 20}).map(function(val, index){
   console.log(index); // 循环20次
});
// 未被初始化的数组
Array(20).map(function(val, index){
   console.log(index); // 不会被执行
});
```

```js
Array.apply(null, Array(20)); // 第二个参数用Array(20)代替{length: 20} 结果也是和{length: 20}一样的
```

<br/>

##### 其他
Array(2) 等价于[,]，不等价于[undefined, undefined]

<br/>
<br/>
参考文章：
[https://segmentfault.com/q/1010000006793990](https://segmentfault.com/q/1010000006793990)