### Buffer

用于创建一个专门存放二进制数据的缓冲区

- `Buffer`的用途：文件传输或者大数据传输
- `Buffer`的字节管理
- `Buffer`对象与其他对象的转换
- `Buffer`的保存

不管是可读流还是可写流都会将数据存储到内部的缓冲区中。

一种是直接一次性的传输，一种是以流的形式持续传输。

### Stream(流)

`Stream`是一个抽象接口。 `stream` 模块提供了一些基础的 API，用于构建实现了流接口的对象。

Node.js 提供了多种流对象。 例如，[发送到 HTTP 服务器的请求](http://nodejs.cn/s/2RqpEw)和 [`process.stdout`](http://nodejs.cn/s/tQWUzG) 都是流的实例

例如，对`http`服务器发起请求的request对象就是一个`Stream`,还有`stdout`(标准输出)。

对于我们操作大文件或者大传输的时候，我们就可以使用`Stream`，可以选择分批处理，而不是一次性把内容读取到缓冲区才开始处理。

在一个应用中，流是一组有序的、有起点和终点的字节数据的传输手段。

`Node.js`的`Stream`有四种类型：

- `Readable` - 可读操作。
- `Writable` - 可读操作。

- `Duplex` - 可读写操作。

- `Transfrom`- 操作被写入数据，然后读出结果。

所有的`Stream`对象都是`EventEmitter`的实例。常用的事件有：

- `data` - 当有数据可读时触发。
- `end` - 没有更多的数据可读时触发。
- `error` - 在接收和写入过程中发生错误时触发。
- `finish` - 所有数据已被写入到底层系统时触发。

`fs`模块中也存在操作流的方法`fs.ReadStream`类(可读流)、`fs.WriteStream`(可写流)

成功调用 `fs.createReadStream()` 会返回一个新的 `fs.ReadStream` 对象。`fs.ReadStream` 对象都是[可读流](http://nodejs.cn/s/YuDKX1)。

#### 为什么使用Stream

1. 在后端中应用，因为在后端与前端、后端的`IO`中，很大机会会出现文件太大，不能一次性读取的问题。因此在前端中使用的方法：整体读取后再进行操作，会导致程序的等待时间过长，因此，流操作（`stream`）便营运而生。
2. 在`readable`和`writable`的`Stream`之间筑起沟通，如果仅仅使用事件方法来进行的话，代码会显得很冗杂，因此需要出现`pipe`（管道）方法来进行。

##### 使用场景

- 大文件传输(不能短期阻塞完成的)
- 文件需要多次传输的，使用`pipe`(防止代码过于冗杂)

##### 前端如何以流的方式发送给后端

1. 可操作的流：`socket`、`webSocket`。

   以`socket`形式传输的流，前端是可以控制传输的量，并且得到反馈的。例如传输一张图片，用流(二进制)的方式来传输，可以精确到传输的百分比等

2. 一次性的流：`http`

   HTTP传输的`Request`和`Response`，则是一次性后端读取到一系列信息，但是后端在处理的时候，是完全可以用`Readable Stream`的形式来读取的

### Stream与readFile的不同

`Stream`是每次读取一部分进入缓冲区，并且根据开发者定义的事件进行处理。而`readFile`、`readFileSync`这些则是异步(或者同步)一次性把文件读取进入缓冲区，然后再进行操作。

而`fs`模块也存在处理流的`api`，比如`fs.createReadStream`是一个`ReadableStream`，可以监听`data`事件，一点点处理文件。而`readfile`是把整个文件全部读到内存里。

### 从流中读取数据

```js
var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});
```

### 写入流

```js
var fs = require("fs");
var data = '菜鸟教程官网地址：www.runoob.com';

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> data, end, and error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});
```

### 管道流

管道提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。

我们把文件比作装水的桶，而水就是文件里的内容，我们用一根管子(pipe)连接两个桶使得水从一个桶流入另一个桶，这样就慢慢的实现了大文件的复制过程。

注意过程必须是 `readStream`流向(`pipe`)`writeStream`,  `readStream.pipe(writeStream)`是一个写的流

```js
var fs = require("fs");

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log("程序执行完毕");
```

### 链式流

链式是通过连接输出流到另外一个流并创建多个流操作链的机制。链式流一般用于管道操作。

接下来我们就是用管道和链式来压缩和解压文件。

```js
var fs = require("fs");
var zlib = require('zlib');

// 压缩 input.txt 文件为 input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
  
console.log("文件压缩完成。")
```

```js
var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));
  
console.log("文件解压完成。");
```

### 其他

几乎所有的 `Node.js` 应用都在某种程度上使用了流。 下面是一个例子，在 `Node.js` 应用程序中使用流实现了一个` HTTP` 服务器：

```js
const http = require('http');

const server = http.createServer((req, res) => {
  // req 是一个 http.IncomingMessage 实例，它是可读流。
  // res 是一个 http.ServerResponse 实例，它是可写流。

  let body = '';
  // 接收数据为 utf8 字符串，
  // 如果没有设置字符编码，则会接收到 Buffer 对象。
  req.setEncoding('utf8');

  // 如果添加了监听器，则可读流会触发 'data' 事件。
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' 事件表明整个请求体已被接收。 
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 响应一些信息给用户。
      res.write(typeof data);
      res.end();
    } catch (er) {
      // json 解析失败。
      res.statusCode = 400;
      return res.end(`错误: ${er.message}`);
    }
  });
});

server.listen(1337);
```

[可写流](http://nodejs.cn/s/9JUnJ8)（比如例子中的 `res`）会暴露了一些方法，比如 `write()` 和 `end()` 用于写入数据到流。

当数据可以从流读取时，[可读流](http://nodejs.cn/s/YuDKX1)会使用 [`EventEmitter`](http://nodejs.cn/s/pGAddE) API 来通知应用程序。 从流读取数据的方式有很多种。

[可写流](http://nodejs.cn/s/9JUnJ8)和[可读流](http://nodejs.cn/s/YuDKX1)都通过多种方式使用 [`EventEmitter`](http://nodejs.cn/s/pGAddE) API 来通讯流的当前状态。

[`Duplex`](http://nodejs.cn/s/2iRabr) 流和 [`Transform`](http://nodejs.cn/s/fhVJQM) 流都是可写又可读的。

对于只需写入数据到流或从流消费数据的应用程序，并不需要直接实现流的接口，通常也不需要调用 `require('stream')`。

需要实现新类型的流的开发者可以参考[用于实现流的API](http://nodejs.cn/s/d2EgSi)章节。

### 例子

例子1：

有个用户需要在线看视频场景，假定我们通过`HTTP`请求返回给用户电影内容，那么代码可以写成

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
   fs.readFile(moviePath, (err, data) => {
      res.end(data);
   });
}).listen(8080);
```

这样的代码又两个明显的问题

1. 电影文件需要读完之后才能返回给客户，等待时间超长
2. 电影文件需要一次放入内存中，相似动作多了，内存吃不消

用流可以将电影文件一点点的放入内存中，然后一点点的返回给客户（利用了 HTTP 协议的 Transfer-Encoding: chunked 分段传输特性），用户体验得到优化，同时对内存的开销明显下降

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
   fs.createReadStream(moviePath).pipe(res);
}).listen(8080);

```

除了上述好处，代码优雅了很多，拓展也比较简单。比如需要对视频内容压缩，我们可以引入一个专门做此事的流，这个流不用关心其它部分做了什么，只要是接入管道中就可以了

```js
const http = require('http');
const fs = require('fs');
const oppressor = require(oppressor);

http.createServer((req, res) => {
   fs.createReadStream(moviePath)
      .pipe(oppressor)
      .pipe(res);
}).listen(8080);
```



例子2：

```js
//大文件的备份
var fs = require('fs');  
var readStream = fs.createReadStream('/path/to/source');  
var writeStream = fs.createWriteStream('/path/to/dest');  
  
readStream.on('data', function(chunk) { // 当有数据流出时，写入数据  
    writeStream.write(chunk);  
});  
  
readStream.on('end', function() { // 当没有数据时，关闭数据流  
    writeStream.end();  
}); 
```

上面的写法有一些问题，如果写入的速度跟不上读取的速度，有可能导致数据丢失。正常的情况应该是，写完一段，再读取下一段，如果没有写完的话，就让读取流先暂停，等写完再继续，于是代码可以修改为：

```js
var fs = require('fs');  
var readStream = fs.createReadStream('/path/to/source');  
var writeStream = fs.createWriteStream('/path/to/dest');  
  
readStream.on('data', function(chunk) { // 当有数据流出时，写入数据  
    if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流  
        readStream.pause();  
    }  
});  
writeStream.on('drain', function() { // 写完后，继续读取  
    readStream.resume();  
});  
readStream.on('end', function() { // 当没有数据时，关闭数据流  
    writeStream.end();  
}); 
```

或者使用更直接的`pipe`

```js
// pipe自动调用了data,end等事件  
fs.createReadStream('/path/to/source').pipe(fs.createWriteStream('/path/to/dest'));  
```

下面是一个更加完整的复制文件的过程

```js
var fs = require('fs'),  
    path = require('path'),  
    out = process.stdout;  
  
var filePath = '/Users/chen/Movies/Game.of.Thrones.S04E07.1080p.HDTV.x264-BATV.mkv';  
  
var readStream = fs.createReadStream(filePath);  
var writeStream = fs.createWriteStream('file.mkv');  
  
var stat = fs.statSync(filePath);  
  
var totalSize = stat.size;  
var passedLength = 0;  
var lastSize = 0;  
var startTime = Date.now();  
  
readStream.on('data', function(chunk) {  
  
    passedLength += chunk.length;  
  
    if (writeStream.write(chunk) === false) {  
        readStream.pause();  
    }  
});  
  
readStream.on('end', function() {  
    writeStream.end();  
});  
  
writeStream.on('drain', function() {  
    readStream.resume();  
});  
  
setTimeout(function show() {  
    var percent = Math.ceil((passedLength / totalSize) * 100);  
    var size = Math.ceil(passedLength / 1000000);  
    var diff = size - lastSize;  
    lastSize = size;  
    out.clearLine();  
    out.cursorTo(0);  
    out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');  
    if (passedLength < totalSize) {  
        setTimeout(show, 500);  
    } else {  
        var endTime = Date.now();  
        console.log();  
        console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');  
    }  
}, 500);  
```

我们添加了一个递归的`setTimeout`（或者直接使用`setInterval`）来做一个旁观者，每500ms观察一次完成进度，并把已完成的大小、百分比和复制速度一并写到控制台上，当复制完成时，计算总的耗费时间。



参考文章:

 [https://www.cnblogs.com/dolphinX/p/6285240.html](https://www.cnblogs.com/dolphinX/p/6285240.html)

[http://justcoding.iteye.com/blog/2307215](http://justcoding.iteye.com/blog/2307215)

[http://www.runoob.com/nodejs/nodejs-stream.html](http://www.runoob.com/nodejs/nodejs-stream.html)