## 安装

```
# 服务端
npm install --save socket.io

# 客户端
npm install --save socket.io-client
```



## 初始化

```js
//服务端
io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('news', {a: 1});		//触发客户端news( io.emit()全部链接该io的客户端中的news )
  socket.broadcast.emit（'hi'）; 	//broadcast发送除了自己以外的其他所有客户端
  socket.on('news', function(data){
    console.log('news');
    socket.emit('other', 1111)	//触发客户端other( socket.emit()只触发该socket链接的客户端的other )
  });
});
```

```js
// 客户端1
var socket = io();
socket.on('news', function(data) {
  console.log(data)
  socket.emit('news', {b: 1});	//触发服务端的news
})
socket.on('other', function(data) {
  console.log(data)
})
socket.on('hi', function(data) {
  console.log(data)
})
```

```js
// 客户端2
socket.on('news', function(data) {
  console.log(data)
})
socket.on('other', function(data) {
  console.log(data)
})
socket.on('hi', function(data) {
  console.log(data)
})
```

### message和send代替WebSocket

可以监听默认的`message`，通过`send`来触发。

```js
//服务端
var io = require('socket.io')(80);

io.on('connection', function (socket) {
  socket.on('message', function () { });
  socket.on('disconnect', function () { });
});
```

```js
var socket = io('http://localhost/');
socket.on('connect', function () {
  socket.send('hi');		//会触发服务端的message

  socket.on('message', function (msg) {
    // my msg
  });
});
```

### Socket.io发送消息的不同含义

```js
// 给本次连接的客户端发消息
socket.emit('hello', 'can you hear me?', 1, 2, 'abc');

// 给除了本次连接的其他所有连接者发消息
socket.broadcast.emit('broadcast', 'hello friends!');

// 给除了本次连接者之外的所有game房间的人发消息
socket.to('game').emit('nice game', "let's play a game");

//给除了本次连接者之外的所有game1、game2房间的人发消息
socket.to('game1').to('game2').emit('nice game', "let's play a game (too)");

// 给所有game中的人发消息
io.in('game').emit('big-announcement', 'the game will start soon');

// 给myNamespace命名空间的所有人发消息
io.of('myNamespace').emit('bigger-announcement', 'the tournament will start soon');

//给特定的socketid发消息（私信）
socket.to(<socketid>).emit('hey', 'I just met you');

// 发送需要回执的消息
socket.emit('question', 'do you think so?', function (answer) {});

// 发送无需压缩的消息
socket.compress(false).emit('uncompressed', "that's rough");

// sending a message that might be dropped if the client is not ready to receive messages
socket.volatile.emit('maybe', 'do you really need it?');

socket.binary(false).emit('what', 'I have no binaries!');

// 发送给所有的客户端
io.emit('hi', 'my lovely babies');
```

默认保留的事件名：

- `error`
- `connect`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`
- `ping`
- `pong`



## Rooms and Namespaces

### Namespaces

如果你想为特定的应用程序发出消息和事件，则可以使用默认/命名空间。这实际上意味着可以分配不同的端口或路径。

这是一个有用的功能，可以最大限度地减少资源（TCP连接）的数量，同时通过在通信通道之间引入分离来分离应用程序中的问题。

```js
//默认命名空间 '/'
io.sockets.emit('hi', 'everyone');
io.emit('hi', 'everyone'); // 简写

//自定义命名空间
const nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');
});
nsp.emit('hi', 'everyone!');

//客户端
const socket = io('/my-namespace');		//写上服务端中定义的路径
```

例子：

```js
//服务端
var io = require('socket.io')(80);
var chat = io
  .of('/chat')			//可以定义路径了
  .on('connection', function (socket) {
    socket.emit('a message', {
        that: 'only'
      , '/chat': 'will get'
    });
    chat.emit('a message', {
        everyone: 'in'
      , '/chat': 'will get'
    });
  });

var news = io
  .of('/news')
  .on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
  });
```

```js
//客户端
var chat = io.connect('http://localhost/chat'),			//路径
    news = io.connect('http://localhost/news');
chat.on('connect', function () {
  chat.emit('hi!');
});
news.on('news', function () {
  news.emit('woot');
});
```

### Rooms

在每个命名空间内，您还可以定义房间可以`join`和的`leave`。

#### join/leave/say

加入、离开、发送

```js
// join和leave
io.on('connection', function(socket){
  socket.join('room1');
  // socket.leave('room1');
});
```

```js
// say to room  broadcasting or emitting
io.to('room1').emit('some event');
io.in('room1').emit('some event');
socket.broadcast.to('room1').emit('some event');
```

#### Default room

```js
io.on('connection', function(socket){
  socket.on('say to someone', function(id, msg){
    socket.broadcast.to(id).emit('my message', msg);
  });
});
```

