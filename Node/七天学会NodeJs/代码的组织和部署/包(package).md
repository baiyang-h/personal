#### 包(packgae)

我们已经知道了`JS`模块的基本单位是单个`JS`文件，但复杂些的模块往往由多个子模块组成。为了便于管理和使用，我们可以把由多个子模块组成的大模块称做`包`，并把所有子模块放在同一个目录里。

在组成一个包的所有子模块中，需要有一个入口模块，入口模块的导出对象被作为包的导出对象。在`package.json`的`main`字段中指定了入口文件，如果没有`package.json`文件或者没有这个字段，则默认`index.js` > `index.json` > `index.node` > `父级node_modules`的顺序寻找。

```js
- /home/user/lib			//包的核心模块都在lib文件夹下
	- cat
		head.js
		body.js
		main.js		//入口文件
		package.json
```

其中`cat`文件夹是一个包，其中包含了3个子模块。`main.js`作为入口模块，其内容如下：

```js
var head = require('./head');
var body = require('./body');

exports.create = function (name) {
    return {
        name: name,
        head: head.create(),
        body: body.create()
    };
};
```

