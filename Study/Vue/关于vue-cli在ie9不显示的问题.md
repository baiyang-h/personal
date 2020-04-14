这里你可能需要babel-polyfill的插件依赖

polyfill指的是“用于实现浏览器不支持原生功能的代码”，比如，现代浏览器应该支持fetch函数，对于不支持的浏览器，网页中引入对应fetch的polyfill后，这个polyfill就给全局的window对象上增加一个fetch函数，让这个网页中的JavaScript可以直接使用fetch函数了，就好像浏览器本来就支持fetch一样。

```
npm install --save-dev babel-polyfill
```

babel-polyfill用正确的姿势安装之后，引用方式有三种：
node/Browserify/webpack

```
require("babel-polyfill");
```

或者

```
import "babel-polyfill";
```

或者

```
module.exports = {
entry: ["babel-polyfill", "./app/js"]
};
```

其中一个就行，直接引入使用就行
具体看babel官网[http://babeljs.io/docs/usage/polyfill/](http://babeljs.io/docs/usage/polyfill/)

[https://segmentfault.com/q/1010000007401974?_ea=1337523](https://segmentfault.com/q/1010000007401974?_ea=1337523)