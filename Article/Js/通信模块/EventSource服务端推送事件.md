### EventSource服务端推送事件

传统的网页都是浏览器向服务器“查询”数据，但是很多场合，最有效的方式是服务器向浏览器“发送”数据。比如，每当收到新的电子邮件，服务器就向浏览器发送一个“通知”，这要比浏览器按时向服务器查询（polling）更有效率。

服务器发送事件（Server-Sent Events，简称**SSE**）就是为了解决这个问题，而提出的一种新API，部署在EventSource对象上。目前，除了IE，其他主流浏览器都支持。

简单说，所谓SSE，就是浏览器向服务器发送一个HTTP请求，然后服务器不断单向地向浏览器推送“信息”（message）。这种信息在格式上很简单, 前缀`"data:"` + 信息 + `"\n\n"`结尾。 

```
$ curl http://example.com/dates
data: 1394572346452

data: 1394572347457

data: 1394572348463
```

该**EventSource**接口是web内容的接口[server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)。一个`EventSource`实例打开一个持久连接[HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)服务器，它发送[event](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events)的`text/event-stream`格式。连接保持打开状态，直到通过呼叫关闭[`EventSource.close()`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close)。

打开连接后，来自服务器的传入消息将以`message`事件的形式传递给您客户端。

与[WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)不同，服务器发送的事件是单向的; 也就是说，数据消息是从一个方向传递的，从服务器传送到客户端（例如用户的Web浏览器）。当没有必要以消息形式从客户端向服务器发送数据时，这使它们成为一个很好的选择。例如，`EventSource`处理诸如社交媒体状态更新，新闻订阅或将数据传递到[客户端存储](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage)机制（如[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)或[Web存储）之](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)类的内容是一种有用的方法。

`SSE`与`WebSocket`有相似功能，都是用来建立浏览器与服务器之间的通信渠道。两者的区别在于：

- `WebSocket`是全双工通道，可以双向通信，功能更强；`SSE`是单向通道，只能服务器向浏览器端发送。
- `WebSocket`是一个新的协议，需要服务器端支持；`SSE`则是部署在HTTP协议之上的，现有的服务器软件都支持。
- `SSE`是一个轻量级协议，相对简单；`WebSocket`是一种较重的协议，相对复杂。
- `SSE`默认支持断线重连，`WebSocket`则需要额外部署。
- `SSE`支持自定义发送的数据类型。



#### 构造函数

创建一个新的`EventSource`来处理从指定URL接收服务器发送的事件

```js
var evtSource = new EventSource("http://localhost:9000/sendMessage");
```



#### 属性

- [`EventSource.readyState`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/readyState) (只读)

  表示连接状态的数字。可能的值为`connecting`（`0`），`open`（`1`）或`closed`（`2`）。

- [`EventSource.url`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/url)(只读)

  代表源的`url`

- [`EventSource.withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/withCredentials)(只读)

  A `Boolean`指示`EventSource`对象是否使用跨源（[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)）凭据set（`true`）实例化（或者`false`是默认值）。

##### 事件处理程序

- [`EventSource.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onerror)

  是一种[`EventHandler`](https://developer.mozilla.org/en-US/docs/Web/API/EventHandler)发生错误时，被叫`error`事件分派的上`EventSource`对象。

- [`EventSource.onmessage`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onmessage)

  是[`EventHandler`](https://developer.mozilla.org/en-US/docs/Web/API/EventHandler)在`message`收到事件时调用的，即当消息来自源时。

- [`EventSource.onopen`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onopen)

  是[`EventHandler`](https://developer.mozilla.org/en-US/docs/Web/API/EventHandler)当被称为`open`是接收到的事件，当连接刚刚打开的是。

#### 方法

- [`EventSource.close()`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close)

  关闭连接（如果有），并将`readyState`属性设置为`closed`。如果连接已关闭，则该方法不执行任何操作。



#### 例子

```js
if (!!window.EventSource) {
    var evtSource = new EventSource('/sendMessage');
}

//收到服务器发生的事件时触发
evtSource.onmessage = function (e) {
    console.log(e.data);
}
//成功与服务器发生连接时触发
evtSource.onopen = function () {
    console.log("Server open")
} 
//出现错误时触发
evtSource.onerror = function () {
    console.log("Error")
} 

 //自定义事件
evtSource.addEventListener("myEvent", function (e) {
    console.log(e.data);
}, false)

//关闭连接
evtSource.close();
```

服务器端`nodejs`实现：

- 把报头 `Content-Type` 设置为 `text/event-stream`
- 字段：**每个事件之间通过空行来分隔**。

```js
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    if(req.url === '/sendMessage') {
        res.writeHead(200, {
            "Content-Type": "text/event-stream", //设置头信息
            "Cache-Control": "no-cache",		//浏览器和缓存服务器都不应该缓存页面信息；
    		"Connection": "keep-alive"			//TCP连接在发送后将仍然保持打开状态，于是，浏览器可以继续通过相同的连接发送请求。	长连接
        });

        setInterval(function () {
            //输出内容，必须 "data:" 开头 "\n\n" 结尾（代表结束）
            res.write('data:' + Date.now() + '\n\n');
        }, 1000);
    } 
}).listen(3000);
```



参考

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

[https://www.jianshu.com/p/622a3549728a](https://www.jianshu.com/p/622a3549728a)

[https://www.cnblogs.com/goody9807/p/4257192.html](https://www.cnblogs.com/goody9807/p/4257192.html)