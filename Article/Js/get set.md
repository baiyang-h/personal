#### Get Set
get和set我个人理解本身只是一个语法糖，它定义的属性相当于“存储器属性”。本质并不是属性，而是属性的特性。在读取访问器属性时，会调用 getter 函数，这个函数负责返回有效的值；在写入访问器属性时，会调用setter 函数并传入新值，这个函数负责决定如何处理数据。

实现有2种，一种是直接使用get和set语法糖。 另一种是在Object.defineproperty或者defineProperties中修改属性特性。

其中我们在前面加上‘_’符号来表示对象内部的私有属性。

例子:
```js
var person = {
    _name: "chen",  //私有     //这里的_name和get/set方法name()不能重名就行
    age: 21,
    get name() {
        return this._name;
    },
    set name(name) {
        this._name = name;
    }
}
console.log(person.name);       //chen
person.name = "lunc";
console.log(person.name);       //lunc
```
或者
```js
 var p = {
    name:"chen",
    work:function() {
        console.log("wording...");
    },
    _age:18,
    get age(){
        return this._age;
    },
    set age(val) {
        if (val<0 || val> 100) {//如果年龄大于100就抛出错误
            throw new Error("invalid value")
        }else{
            this._age = val;
        }
    }
};
console.log(p.name);//输出chen

p.age
"18"
p.age=23
"23"
p.age=200
Uncaught Error: invalid value
```
<br/>

#### 对于类和构造函数
es5写法
```js
function Number(num) {
  this._num = num           
}

//get/set方法使用同一个命名，增加可读性
Number.prototype = {
  get num() {
    return this._num;
  },
  
  set num(num) {
    this._num = num;
  }
}

var test = new Number(8);
console.log(test.num);
test.num = 88;
console.log(test.num);
```
es6写法
```js
class Num {
  constructor(num) {
        this._num = num;
  }
  
  get num() {
    return this._num;
  }
  
  set num(num) {
    this._num = num;
  }
}

var test = new Num(9);
console.log(test.num);
test.num = 99;
console.log(test.num);
```