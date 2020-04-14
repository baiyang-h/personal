#### NPM

`NPM`是随同`NodeJS`一起安装的包管理工具，能解决`NodeJS`代码部署上的很多问题，常见的使用场景有以下几种：

- 允许用户从`NPM`服务器下载别人编写的三方包到本地使用。
- 允许用户从`NPM`服务器下载并安装别人编写的命令行程序到本地使用。
- 允许用户将自己编写的包或命令行程序上传到`NPM`服务器供别人使用。

#### 下载第三方包

```
npm install argv

npm install argv@0.0.1		#@后跟版本号
```

下载好之后，`argv`包就放在了工程目录下的`node_modules`目录中，因此在代码中只需要通过`require('argv')`的方式就好，无需指定三方包路径。

#### 安装命令行程序

从`NPM`服务上下载安装一个命令行程序的方法与三方包类似。例如上例中的`node-echo`提供了命令行使用方式，只要`node-echo`自己配置好了相关的`package.json`字段，对于用户而言，只需要使用以下命令安装程序。

```js
npm install node-echo -g
```

参数中的`-g`表示全局安装，因此`node-echo`会默认安装到以下位置，并且`NPM`会自动创建好`Linux`系统下需要的软链文件或`Windows`系统下需要的`.cmd`文件。

```
- /usr/local/               # Linux系统下
    - lib/node_modules/
        + node-echo/
        ...
    - bin/
        node-echo
        ...
    ...

- %APPDATA%\npm\            # Windows系统下
    - node_modules\
        + node-echo\
        ...
    node-echo.cmd
    ...
```

就像`vue-cli`脚手架一样是命令行工具。

#### 版本号

语义版本号分为`X.Y.Z`三位，分别代表主版本号、次版本号和补丁版本号。当代码变更时，版本号按以下原则更新。

- 如果只是修复`bug`，需要更新`Z`位。
- 如果是新增了功能，但是向下兼容，需要更新`Y`位。
- 如果有大变动，向下不兼容，需要更新`X`位。