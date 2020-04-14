**async函数返回的值永远是一个Promise对象**

1. async函数为异步函数，内部await会执行等待， 但是async函数外面的代码是不会被阻塞的。

   ```js
   async function show(params) {
       let a = await new Promise((resolve, reject) => {
           setTimeout(() => {
               resolve('111');
           }, 2000)
       })
       console.log(a)
   }
   show();					//等待2秒后输出
   console.log(222)		//先输出
   ```

2. `await` 只能出现在 `async` 函数中, 等待执行结束，然后下一次。

   ```js
   async function test() {
       let a = await 异步;
       let b = await 异步;	//等a执行完了再执行
       let c = await 异步;	//等c执行完了再执行
       return '一个Promise'
   }
   ```

3. `async`函数中`return`返回的值是一个`Promise`对象

   ```js
   async function testAsync() {
       return "hello async";
   }
   
   const result = testAsync();
   console.log(result);		//是一个promise
   ```

   如果在函数中 `return` 一个直接量，`async` 会把这个直接量通过 `Promise.resolve()` 封装成 `Promise` 对象。

   如果 `async` 函数没有返回值，又该如何？很容易想到，它会返回 `Promise.resolve(undefined)`也是一个Promise对象。

4. **`await`后面是一个 Promise 对象，或者其它值**。

   `await` 是个运算符，用于组成表达式，`await` 表达式的运算结果取决于它等的东西。如果后面不是一个`Promise`，那 `await` 表达式的运算结果就是它等到的东西。如果它等到的是一个 `Promise` 对象，`await` 就忙起来了，它会阻塞后面的代码，等着 `Promise.resolve(值)`，然后得到 `resolve` 的值，作为 `await` 表达式的运算结果。

   ```js
   //async函数返回的是一个Promise对象， 会转为Promise.resolve('a')
   async function test() {	 	
       return "a";	
   }	
   
   async function test() {
       let a = await 'aaa';	//await 'aaa' 表达式返回的'aaa'
       let b = await (() => 'bbb')()
       return b;
   }
   //await后面是一个Promise。Promise.resolve(值)
   async function test() {
       let a = await new Promise((resolve, reject) => {
           resolve('a')
       })
       return a;
   }
   //async函数的本质返回的是一个Promise
   async function test() {
       let a = await (async function() {
           return 'aa'
       })()
   }
   test();
   ```

5. `async`、`await`错误处理。

   第一种：上面也说到了`async`返回的是一个`Promise`对象。既然是返回一个`Promise`对象的话那处理当异步请求发生错误的时候我们就要处理`reject`的状态了。

   ```js
   async function f() {
       await Promise.reject('error');	
       console.log(111)  //await Promise.reject，如果有捕获异常，那么下面的代码就不会执行了。没有捕获，那么就会报错
       return 222
   }
   //这里进行了捕获异常
   f().catch(err => {	//直接捕获reject
       console.log(err)
   });
   
   async function f() {
       await Promise.reject('error').catch(error => {
           //如果直接使用catch捕捉错误，那么下面还能执行下去 
       });	
       console.log(111)  
   }
   ```

   第二种：是直接在`async`函数中报错，或者`throw`一个错误;

   ```js
    async function f() {
          //或者return new Error("Not Greater");
          throw 1111
      }
      f().catch(err => {
          console.log(2, err)
      });
   ```

   第三种：在`async`函数中使用`try catch`来捕获异常;

   ```js
   async function f() {
     //使用await Promise.reject或throw一个错误，如果进行了捕获， 代码就到捕获处去执行。如果没有捕获就会报错
     //而使用try catch 函数中下面的代码还是能继续执行的，
     try {				
       //throw new Error('123')
       await Promise.reject('error')
     } catch(e) {
       console.log(e)
     }
     a = await 1;
     return a;
   }
   f().catch(err => {
     console.log(err)
   });
   ```