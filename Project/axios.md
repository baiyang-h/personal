#### Request Config
问题


```js
//关于这两个转换方法存在个问题，我直接用突然报错，后来发现data竟然是String，我这里的项目要转成json， JSON.phares(data)
{
    transformRequest: [function (data, headers) {
        //http请求之前的修改
        return data;
    }],
    transformResponse: [function (data) {
        //http响应得到数据的修改
        return data;
    }],
}
```



#### 全局配置

例子
```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```


```js
console.log(axios.defaults)
{
    adapter(){},
    baseURL: '',
    headers: {},
    maxContentLength: '',
    timeout: '',
    transformRequest: Array(1),
    transformResponse: Array(1),
    validateStatus(){},
    xsrfCookieName: '',
    xsrfHeaderName: '',
    ···
}
//自己设置
```

<br>

#### 拦截器

```js
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
```

<br>

#### Using application/x-www-form-urlencoded format表单序列化的格式

##### 方法1
In a browser, you can use the URLSearchParams API as follows:

```js
var params = new URLSearchParams();
params.append('param1', 'value1');
params.append('param2', 'value2');
axios.post('/foo', params);
```

#####方法2
var qs = require('qs');
axios.post('/foo', qs.stringify({ 'bar': 123 }));

####方法3
formData



