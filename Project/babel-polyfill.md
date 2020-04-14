vue-cli在ie9,中打开的是空白, 需要babel-polyfill插件
[http://babeljs.io/docs/usage/polyfill/](http://babeljs.io/docs/usage/polyfill/)


#### Usage in Node / Browserify / Webpack
```
npm install --save babel-polyfill

require("babel-polyfill");
或者
import "babel-polyfill";
```

With webpack.config.js, add babel-polyfill to your entry array:

```js
module.exports = {
    entry: ["babel-polyfill", "./app/js"]
};
```

