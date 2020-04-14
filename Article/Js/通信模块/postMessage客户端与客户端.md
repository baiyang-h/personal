### 客户端与客户端之前的通信(postMessage)

`window.postMessage()`方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为`https`），端口号（`443`为`https`的默认值），以及主机  (两个页面的模数 [`Document.domain`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/domain)设置为相同的值) 时，这两个脚本才能相互通信。`window.postMessage()` 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

`window.postMessage()`方法被调用时，会在所有页面脚本执行完毕之后（e.g., 在该方法之后设置的事件、之前设置的`timeout` 事件,etc.）向目标窗口派发一个  [`MessageEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent) 消息。 该[`MessageEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent)消息有四个属性需要注意：

1.  `message` 属性表示该`message` 的类型；
2.  `data` 属性为 `window.postMessage` 的第一个参数；
3. `origin` 属性表示调用`window.postMessage()` 方法时调用页面的当前状态； 
4. `source` 属性记录调用 `window.postMessage()` 方法的窗口信息。

#### 语法

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

- `otherWindow`

  其他窗口的一个引用，比如`iframe`的`contentWindow`属性、执行[window.open](https://developer.mozilla.org/en-US/docs/DOM/window.open)返回的窗口对象、或者是命名过或数值索引的[window.frames](https://developer.mozilla.org/en-US/docs/DOM/window.frames)。

- `message`

  将要发送到其他 window的数据。它将会被[结构化克隆算法](https://developer.mozilla.org/en-US/docs/DOM/The_structured_clone_algorithm)序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。[[1](https://developer.mozilla.org/en-US/docs/)]

- `targetOrigin`

  通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用postMessage传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的origin属性完全一致，来防止密码被恶意的第三方截获。**如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin，而不是\*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。**

- `transfer`  

  是一串和message 同时传递的 [`Transferable`](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable) 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。



#### 例子

`index.html`

```html
<div class="warp">
    <div class="left warp">
        <iframe src="./post1.html" frameborder="0" id="post1" name="post1"></iframe>
    </div>
    <div class="right warp">
        <iframe src="./post2.html" frameborder="0" id="post2" name="post2"></iframe>
    </div>
</div>

<div class="warp">
    <div class="left">
        <button id="postBtn1">向左边的(iframe)推送信息代码</button>
    </div>
    <div class="right">
        <button id="postBtn2">向右边的(iframe)推送信息代码</button>
    </div>
</div>
```

```js
document.getElementById('postBtn1').addEventListener('click', function () {
    console.log('postBtn1');
    window.post1.postMessage('来自postBtn1的消息', '*');		//向window.post1窗口发送信息
});
document.getElementById('postBtn2').addEventListener('click', function () {
    console.log('postBtn2');
    window.post2.postMessage('来自postBtn2的消息', '*');		//向window.post2窗口发送信息
});
window.addEventListener('message', function (e) {			//监听当前窗口，收到信息时触发
    if (e.data) {
        console.log('顶级', e.data);
        console.log('顶级', e);
        window.post1.postMessage(e.data, '*');
    }
}, false);
```



`post1.html`

```html
<div class="sendbox">
    <button id="sendbox2">直接发送到右边iframe</button>
</div>
<div id="box2"></div>
```

```js
document.getElementById('sendbox2').addEventListener('click', function () {
    console.log('post1向post2发送信息')
    window.parent.post2.postMessage('收到来自post1的消息', '*');
});

function addbox(html) {
    var item = document.createElement('div');
    item.innerHTML = html;
    document.getElementById('box2').append(item);
}
window.addEventListener('message', function (e) {
    console.log('post1', e.data);
    if (e.data) {
        addbox(e.data);
    }
}, false);
```



`post2.html`

```html
<div class="sendbox" style="text-align: right;">
    <button id="sendbox">中转到左边</button>
    <button id="sendbox2">直接到左边</button>
</div>
<div id="box"></div>
```

```js
document.getElementById('sendbox').addEventListener('click', function () {
    /*- 向父级页面传 -*/
    console.log('post2向父级发送信息');
    window.parent.postMessage('来自post2的消息', '*');
});
document.getElementById('sendbox2').addEventListener('click', function () {
    console.log('post2向post1发送信息');
    window.parent.post1.postMessage('来自post2的消息', '*');
});

function addbox(html) {
    var item = document.createElement('div');
    item.innerHTML = html;
    document.getElementById('box').append(item);
}
window.addEventListener('message', function (e) {
    console.log('post2', e.data);
    if (e.data) {
        addbox(e.data);
    }
}, false);
```



参考：

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

[https://blog.csdn.net/u011001084/article/details/74331611?locationNum=2&fps=1](https://blog.csdn.net/u011001084/article/details/74331611?locationNum=2&fps=1)