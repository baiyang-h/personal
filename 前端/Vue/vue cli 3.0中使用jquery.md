```js
npm install jquery --save
```

配置vue.config.js文件

Vue CLI3.0 中的所有配置都在 vue.config.js 文件，你在这里配置好，脚手架自动使用你的配置覆盖掉默认的配置。

如果你的项目中没有 vue.config.js 文件，请你在 package.json 文件的同级目录新建一个 vue.config.js 文件。文件内具体的配置如下：

```js
const webpack = require("webpack");

module.exports = {
//configureWebpack 是Vue CLI3.0 中用于配置 webpack 插件参数的地方，你在这里设置，会新建或者覆盖 webpack 默认配置。
//webpack ProvidePlugin 的含义是创建一个全局的变量，使这个变量在 webpack 各个模块内都可以使用。这里的配置含义是创建 '$'、'jQuery'、'window.jQuery' 三个变量指向 jquery 依赖
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      })
    ]
  }
}

//或者
configureWebpack: config => {  
  config.plugins.push(
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    })
  )
 	/*
 	不要用以下写法，会将vue cli默认的plugins给覆盖掉，使用push进去
 	config.plugins = [
    	new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      })
 	]
 	*/
}
```

然后就可以在外部直接使用jquery了



自动加载模块，而不必导出import或require

```js
new webpack.ProvidePlugin({
  identifier: 'module1',
  // ...
})
```

任何时候，当 `identifier` 被当作未赋值的变量时，`module` 就会自动被加载，并且 `identifier` 会被这个 `module` 输出的内容所赋值。



可以直接看[webpack官网](!https://www.webpackjs.com/plugins/provide-plugin/)