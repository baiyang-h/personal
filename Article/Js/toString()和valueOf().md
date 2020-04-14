### toString()函数详解

`toString()`函数用于将当前对象以字符串的形式返回。

该方法属于Object对象，由于所有的对象都继承了Object的对象实例，因此几乎所有的实例对象都可以使用该方法。

#### 语法

`object.toString()`

#### 返回值

`toString()函数的返回值为Sring类型。返回当前对象的字符串形式。`

JavaScript的许多内置对象都重写了该函数。

| 类型     | 行为描述                                                     |
| -------- | ------------------------------------------------------------ |
| Array    | 将Array的每个元素转换为字符串，并将它们依次连接起来，两个元素之间用英文逗号作为分隔符进行拼接 |
| Boolean  | true变为'true'，false变为'false'                             |
| Date     | 返回日期的文本表示                                           |
| Error    | 返回一个包含相关错误信息的字符串                             |
| Function | 返回如"function functionname() { [native code] }"            |
| Number   | 返回数值的字符串表示。还可以返回以指定进制表示的字符串。     |
| String   | 返回String对象的值                                           |
| Object   | 返回'[object ObjectName]'，其中ObjectName是对象类型的名称。  |



### valueOf()

#### 语法

`object.valueOf()`

### 返回值

返回值为该对象的原始值

JavaScript调用`valueOf()`方法用来把对象转换成原始类型的值(数值、字符串和布尔值)，当遇到要预期的原始值的对象时，JavaScript会自动调用它。

默认情况下，`valueOf()`会被每个对象Object继承。每一个内置对象都会覆盖这个方法为了返回一个合理的值，如果对象没有原始值，`valueOf()`就会返回对象自身。

JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的valueOf()方法的返回值和返回值类型均可能不同。

| 对象     | 返回值                                          |
| -------- | ----------------------------------------------- |
| Array    | 返回数组对象本身                                |
| Boolean  | 布尔值                                          |
| Date     | 存储的时间是从1970年1月1日午夜开始计的毫秒数UTC |
| Function | 函数本身                                        |
| Number   | 数字值                                          |
| Object   | 对象本身。这是默认情况                          |
| String   | 字符串值                                        |
|          | Math和Error对象没有valueOf方法                  |

也可以自定义`vlaueOf`方法

如：

```js
MyNumberType.prototype.valueOf = function() { return customPrimitiveValue; };
```

```js
//修改valueOf()的返回值
String.prototype.valueOf = function() {
    return 222
}
let str = 'abc';
console.log(str.valueOf());

let o = {
    a: 1,
    valueOf() {
        return this.a
    }
}
```

```js
// Array：返回数组对象本身
var array = ["ABC", true, 12, -5];
console.log(array.valueOf());   // ["ABC", true, 12, -5]

// Date：当前时间距1970年1月1日午夜的毫秒数
var date = new Date(2013, 7, 18, 23, 11, 59, 230);
console.log(date.valueOf());   // 1376838719230

// Number：返回数字值
var num =  15.26540;
console.log(num.valueOf());   // 15.2654

// 布尔：返回布尔值true或false
var bool = true;
console.log(bool.valueOf());   // true

// new一个Boolean对象
var newBool = new Boolean(true);
console.log(typeof newBool.valueOf());   // boolean  返回原始值
console.log(typeof newBool);			//object

// Function：返回函数本身
function foo(){}
console.log( foo.valueOf()); 	//foo

// Object：返回对象本身
var obj = {name: "张三", age: 18};
console.log( obj.valueOf());   // {name: "张三", age: 18}

// String：返回字符串值
var str = "http://www.xyz.com";
console.log( str.valueOf() );   // 'http://www.xyz.com'

// new一个字符串对象
var str2 = new String("http://www.xyz.com");
// 两者的值相等，但不全等，因为类型不同，前者为string类型，后者为object类型
console.log( str2.valueOf() === str2 );   // false
```

