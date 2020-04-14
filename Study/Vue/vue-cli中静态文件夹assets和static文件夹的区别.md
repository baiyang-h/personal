### assets和static文件夹的区别

相信有很多人知道vue-cli有两个放置静态资源的地方，分别是src/assets文件夹和static文件夹。

#### assets

assets目录中的文件会被webpack处理解析为模块依赖，只支持相对路径形式。例如，在 `<img src="./logo.png"> `和 `background: url(./logo.png)`中，`./logo.png` 是相对的资源路径，将由Webpack解析为模块依赖。

#### static
static/ 目录下的文件并不会被Webpack处理：它们会直接被复制到最终的打包目录,必须使用绝对路径引用这些文件，这是通过在 config.js 文件中的 `build.assetsPublicPath` 和 `build.assetsSubDirectory` 连接来确定的。
任何放在 `static/` 中文件需要以绝对路径的形式引用：`/static/[filename]`。
<br>

**assets里面的会被webpack打包进你的代码里，而static里面的，就直接引用了。一般在static里面放一些类库的文件，在assets里面放属于该项目的资源文件。在我们实际的开发中，
总的来说：static放不会变动的文件 assets放可能会变动的文件。**

<br>

在*.vue组件中，您的所有模板和CSS都被解析vue-html-loader并css-loader查找资产URL。例如，in `<img src="./logo.png">`和`background: url(./logo.png)`，"./logo.png"是相对的资产路径，将由Webpack解析为模块依赖关系。但static文件夹中的资源就不会被webpack解析。

webpack的解决规则

* 相对URL，例如`./assets/logo.png`将被解释为模块依赖。它们将被基于Webpack输出配置的自动生成的URL替换。

* 非前缀URL，例如`assets/logo.png`将被视为与相对URL相同并被翻译成`./assets/logo.png`。

* 前缀的URL~被视为模块请求，类似于`require('some-module/image.png')`。如果要使用Webpack的模块解析配置，则需要使用此前缀。例如，如果您有一个解决别名assets，则需要使用`<img src="~assets/logo.png">`以确保别名符合。

* 根本相关的URL，例如/assets/logo.png，根本不处理。


为了使Webpack返回正确的资源路径，您需要使用require('./relative/path/to/file.jpg')，

```js
computed: {
    background () {
        return require('./bgs/' + this.id + '.jpg')
    }
}
```

<br>
<br>

参考:[http://www.php.cn/js-tutorial-379068.html](http://www.php.cn/js-tutorial-379068.html)
官方:[https://vuejs-templates.github.io/webpack/static.html](https://vuejs-templates.github.io/webpack/static.html)