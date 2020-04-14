```js
//vue
import aa from './zj.js'      //是个对象
import bb from './community.js'  //是个数组
export default {
    mounted() {
        let a = require('./zj.js');
        let b = require('./community.js');
        /*
        结果是a不等于aa， b不等于bb。  aa和bb是得到我们要的数据， 
        而使用require得到的是一个{default: {…}, __esModule: true}和{default: Array(13), __esModule: true}模块对象
        */
    }
}
```