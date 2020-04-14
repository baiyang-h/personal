### 判断是否是整数

1. 使用正则针对于字符串

```js
/^\d+$/.test(str)			//正整数 + 0  负的话可以加-
/^[0-9]*[1-9][0-9]*$/		//正整数
/^-?\d+$/					//整数

/^\d+(\.\d+)?$/				//正数+0
/^(-?\d+)(\.\d+)?$/			//数值
```

2. 取模

```js
3%1 === 0 		//true
3.1%1 === 0		//false

//但对于字符串和某些特殊值显得力不从心
isInteger('') // true
isInteger('3') // true
isInteger(true) // true
isInteger([]) // true

//所以先判断是不是Number
function isInteger(obj) {
    return typeof obj === 'number' && obj%1 === 0
}
```

3. 使用`Math.round`、`Math.ceil`、`Math.floor`判断

整数取整后还是等于自己。

```js
function isInteger(obj) {
    return Math.floor(obj) === obj
}
```

4. 通过parseInt判断

```js
function isInteger(obj) {
    return parseInt(obj, 10) === obj
}
```

5. 通过位运算符判断

位运算只能处理32位以内的数字，对于超过32位的无能为力

```js
function isInteger(obj) {
    return (obj | 0) === obj
}

isInteger(Math.pow(2, 32)) // 32位以上的数字返回false了
```

6. ES6提供的`Number.isInteger`

```js
Number.isInteger(3) // true
Number.isInteger(3.1) // false
Number.isInteger('') // false
Number.isInteger('3') // false
Number.isInteger(true) // false
Number.isInteger([]) // false
```

