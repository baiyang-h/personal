1. 对于`new Promise()`对象，如果内部只有`resovle()`或`reject()`方法，那么返回的是一个`Promise`对象
2. 如果还使用`.then`或`.catch`方法来链式计算了，那么返回的是`undefined`。
3. 如果还使用`.then`或`.catch`方法来链式计算了，并且在方法里面使用`return`返回了，那么得到的也是一个`Promise`对象,而且`[[PromiseStatus]]`还是一个`resolved`，除了直接`reject()`才是`[[PromiseStatus]]`为`rejected`。

```js
let a = new Promise((resolve, reject) => {
    resovle(111)
})
console.log(a)	// //Promise {__proto__: {[[PromiseStatus]]: 'resolve', [[PromiseValue]]: 111}}

let a = new Promise((resolve, reject) => {
    resovle(111)
}).then(res => {
    console.log(222)
})
console.log(a);	//Promise {__proto__: {[[PromiseStatus]]: 'resolve', [[PromiseValue]]: undefined}}

let a = new Promise((resolve, reject) => {
    resovle(111)
}).then(res => {
    return 222;
})
console.log(a); //Promise {__proto__: {[[PromiseStatus]]: 'resolve', [[PromiseValue]]: 222}}

let a = new Promise((resolve, reject) => {
    reject(111)
}).catch(res => {
})
console.log(a); //Promise {__proto__: {[[PromiseStatus]]: 'resolve', [[PromiseValue]]: undefined}}

let a = new Promise((resolve, reject) => {
    reject(111)
})
console.log(a); //Promise {__proto__: {[[PromiseStatus]]: 'reject', [[PromiseValue]]: 111}}

//throw
let a = new Promise((resolve, reject) => {
    throw 1111		//报错， 需要.catch 或 try catch
})
console.log(a)
```

`async`函数中`await`的返回：

1. 如果await返回的是一个`Promise`对象，则对`Promise`对象中的`resolve()`计算后的表达式的值返回，如果为`reject()`则会报错，需要`.catch`或`try catch`来捕获。
2. 如果`await`后面是一个表达式或值，那么直接返回这个值。

```js
//resolve
async function show() {
    let a = await Promise.resolve(111)
    console.log(a)		//111
}

async function show() {
    let a = await new Promise((resolve, reject) => {
        resolve(111)
    })
    console.log(a)		//111
}

async function show() {
    let a = await new Promise((resolve, reject) => {
        resolve(111)
    }).then(res => {

    })
    console.log(a)	//undefined
}

async function show() {
    let a = await new Promise((resolve, reject) => {
        resolve(111)
    }).then(res => {
        return 222
    })
    console.log(a)		//222
}

//reject
async function show() {
    let a = await Promise.reject(111)
    console.log(a)		//报错 需要.catch捕获或者try catch
}

async function show() {
    let a = await new Promise((resolve, reject) => {
        reject(111)
    })
    console.log(a)		//报错 需要.catch捕获或者try catch
}

async function show() {
    try{
        let a = await new Promise((resolve, reject) => {
            reject(111)
        })
    } catch(e) {
        console.log(e)		//111
    }
}

async function show() {
    let a = await new Promise((resolve, reject) => {
        reject(111)
    }).catch(e => {
        console.log(e)
    })
    console.log(a)		//undefined
}

 async function show() {
     let a = await new Promise((resolve, reject) => {
         reject(111)
     }).catch(e => {
         return e
     })
     console.log(a)		//111
 }

//throw
async function show() {
    let a = await new Promise((resolve, reject) => {
        throw 1111
    })
    console.log(a)		//报错, 需要.catch或者try catch来捕获错误
}
```

async函数返回的永远是一个Promise对象