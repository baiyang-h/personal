#### Http报头Accept与Content-Type的区别

##### Accept属于请求头， Content-Type属于实体头。

Http报头分为通用报头，请求报头，响应报头和实体报头。
* 请求方的http报头结构：通用报头|请求报头|实体报头
* 响应方的http报头结构：通用报头|响应报头|实体报头
* Accept代表发送端（客户端）希望接受的数据类型。
比如：Accept：text/xml; 代表客户端希望接受的数据类型是xml类型
* Content-Type代表发送端（客户端|服务器）发送的实体数据的数据类型。比如：Content-Type：text/html; 代表发送端发送的数据格式是html。
* 二者合起来， Accept:text/xml；Content-Type:text/html 即代表希望接受的数据类型是xml格式，本次请求发送的数据的数据格式是html。

#### Content-Type

实体首部字段Content-Type说明了实体主体内对象的媒体类型。

Content-Type，内容类型，一般是指网页中存在的Content-Type，用于定义网络文件的类型和网页的编码，决定文件接收方将以什么形式、什么编码读取这个文件。

**ContentType属性指定响应的 HTTP内容类型。如果未指定 ContentType，默认为TEXT/HTML。**

```Content-Type: text/html; charset=UTF-8```

##### 常见的媒体格式类型如下：

* text/html ： HTML格式
* text/plain ：纯文本格式
* text/xml ： XML格式
* image/gif ：gif图片格式
* image/jpeg ：jpg图片格式
* image/png：png图片格式

以application开头的媒体格式类型：

* application/xhtml+xml ：XHTML格式
* application/xml ： XML数据格式
* application/atom+xml ：Atom XML聚合格式
* **application/json ： JSON数据格式**
* application/pdf ：pdf格式
* application/msword ： Word文档格式
* application/octet-stream ： 二进制流数据（如常见的文件下载）
* **application/x-www-form-urlencoded ： `<form encType=””>`中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）**

另外一种常见的媒体格式是上传文件之时使用的：

* multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式

以上就是我们在日常的开发中，经常会用到的若干content-type的内容格式。

<br>

#### 浅析application/x-www-form-urlencoded和multipart/form-data的区别

在Form元素的语法中，EncType表明提交数据的格式,用 Enctype 属性指定将数据回发到服务器时浏览器使用的编码类型。

* application/x-www-form-urlencoded: 窗体数据被编码为名称/值对。这是标准的编码格式。会将表单内的数据转换为键值对，比如,name=java&age = 23
* multipart/form-data ：** 窗体数据被编码为一条消息（最后会转化为一条信息）**，页上的每个控件对应消息中的一个部分。**通过表单上传文件时必须指定编码类型为"multipart/form-data" **
* text/plain ： 窗体数据以纯文本形式进行编码，其中不含任何控件或格式字符。

补充:
form的enctype属性为编码方式，常用有两种： application/x-www-form-urlencoded 和 multipart/form-data ， **默认为application/x-www-form-urlencoded 。**

* 当action为get时候，浏览器用x-www-form-urlencoded的编码方式把form数据转换成一个字串（name1=value1&name2=value2...），然后把这个字串append到url后面。
* 当action为post时候，浏览器把form数据封装到http body中，然后发送到server。
* 如果没有 type=file 的控件，用默认的 application/x-www-form-urlencoded 就可以了。**但是如果有 type=file 的话，就要用到 multipart/form-data 了**。**浏览器会把整个表单以控件为单位分割，并为每个部分加上Content-Disposition(form-data或者file)、Content-Type(默认为text/plain)、name(控件name)等信息，并加上分割符(boundary)。**
* http请求中的multipart/form-data,它会将表单的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。当上传的字段是文件时，会有Content-Type来表名文件类型；content-disposition，用来说明字段的一些信息；由于有boundary隔离，所以multipart/form-data既可以上传文件，也可以上传键值对

html5的FormData()对象也能实现这种功能

![](/assets/微信图片_20171129174541.png)

#### 对于FormData
上图，可以看到这是一种区别于用&连接参数的方式，它的编码格式是multipart/form-data，就是上传文件form表单写的enctype：

```html
<form enctype="multipart/form-data" method="post">
    <input type="file" name="fileContent">
</form>
```

如果xhr.send的是**FormData类型话，它会自动设置enctype='multipart/form-data'**，，**如果你用默认表单提交上传文件的话就得在form上面设置这个属性（multipart/form-data），因为上传文件只能使用POST的这种编码。**

常用的POST编码是application/x-www-form-urlencoded，它和GET一样，发送的数据里面，参数和参数之间使用&连接，如：key1=value1&key2=value2特殊字符做转义，这个数据POST是放在请求body里的，而GET是拼在url上面的。

而上传文件用的这种multipart/form-data，参数和参数之间是且一个相同的字符串隔开的，如:

`------WebKitFormBoundary72yvM25iSPYZ4a3F`

请求的contentType被浏览器设置成：
```
Content-Type:multipart/form-data; boundary=----WebKitFormBoundary72yvM25iSPYZ4a3F
```
