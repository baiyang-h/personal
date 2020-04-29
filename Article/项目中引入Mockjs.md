## 方式一

在项目中创建一个Mock文件夹，里面创建对应的mockjs文件。

主要是分发前端过来的请求 URL 以及启动本地服务。

```js
// server 文件
let Mock = require('mockjs');
let express = require('express');
let app = express();

let bodyParser = require('body-parser'); // 解析post请求

// mock 数据相关 api
let homeAPI = require('./home');
let specialAPI = require('./special');
let appAPI = require('./app');

app.use(bodyParser.json());

// 设置跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // 此处根据前端请求携带的请求头进行配置
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});

// 1.首页接口: post
app.post('/android/home', (req, res) => {
    // 模拟超时
    // setTimeout(() => {
    //     res.json(Mock.mock(homeAPI.getHome(req)));
    // }, 12000);
    res.json(Mock.mock(homeAPI.getHome(req)));
    console.log('请求首页数据成功...');
})

// 2.专题接口: post
app.post('/android/special/list', (req, res) => {
    res.json(Mock.mock(specialAPI.getSpecialList(req)))
    console.log('请求专题列表数据成功...');
})
app.post('/android/special/detail', (req, res) => {
    res.json(Mock.mock(specialAPI.getSpecialDetail(req)))
    console.log('请求专题详情数据成功...');
})

// 3.APP 应用接口: post
app.post('/android/special/app', (req, res) => {
    res.json(Mock.mock(appAPI.getAppList(req)))
    console.log('请求app列表数据成功...');
})

app.listen('3000', () => {
    console.log('mock服务器启动ing中... port: 3000')
})
```

```js
// mock 文件
let Mock = require('mockjs');
let Random = Mock.Random;
// 专题模块
// 1.专题列表
let specialList = [];
let total = 100;
// 准备 100 条专题列表数据
for (let index = 0; index < total; index++) {
    specialList.push(
        Mock.mock({
            id: '@increment',
            title: '@ctitle',
            desc: '<p>'+Random.cparagraph()+'</p>',
            icon: 'photo/special/1380/special_1380.jpg',
            view_count: '@natural(60, 1000)',
            comment_count: '@natural(60, 100)',
            save_money: '@float(10, 50, 2, 2)',
            app_count: '@natural(10, 100)',
            detail_icon: 'https://images.tutuapp.com/photo/special/000/001/' + '@natural(100, 200)' + '/414x155.jpg',
        })
    );
}

module.exports = {
// 列表数据返回
  getSpecialList: config => {
    // 参数解析
    console.log(config.body);
    let { page = 1, size, lang, order_by } = config.body;
    let tempList = [];
    let pageList;
    // 排序类型
    tempList = order_by === 'view' ? specialList.reverse() : specialList;
    // 分页处理
    pageList = tempList.filter((item, index) => index < page * size && index >= (page-1)*size);
    // 返回处理结果, 这里没做异常状态码处理
    return {
      status: {
        code: 0,
        message: '请求成功',
        time: '2019-07-03 16:45:12',
      },
      data: pageList,
    };
  },
  // 列表详情数据返回
  getSpecialDetail: config => {
    let { id, page = 1, size, lang } = config.body;
    return {
      status: {
        code: 0,
        message: '请求成功',
        time: '2019-07-03 16:45:12',
      },
      data: {
        detail: specialList[Math.ceil(1 + Math.random() * 98)],
        total: Math.ceil(Math.random() * 100),
      },
    };
  },
};
```

启动，在package.json文件中设置

```
"mock": "node src/mock/index.js"
在终端下执行 npm run mock 即可开启服务, 接下来我们就可以放心去请求数据了
```



## 方法二

在Mock文件夹下创建一个`mock-server.js`文件

```js
module.exports = app => {
  // 解析 application/json
  app.use(bodyParser.json());
  // 解析 application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  
  app['post']('/user/login', function(req) {
    // ...
    return {
      code: 60204,
      message: '获取token失败',
      success: false
    }
  })
  
  app['post']('xxx, function(req) {
    // ...
    return {
      // ...
    }
  })
  // ...
};
```

在`vue.config.js`中引入这个文件

```js
module.exports = {
  devServer: {
    before: require('./mock/mock-server')   // 就是一个函数
    /*
    before(app) {
    	......
    }
    */
  }
}
```

