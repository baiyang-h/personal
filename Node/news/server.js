const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const querystring = require('querystring');

http.createServer((req, res) => {
    //将req.url都转为小写字母
    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();
    
    //根据不同的请求地址，返回不同的资源，其中html文件，因为在.html文件的<meta>标签中写入了utf8，所以这里可以省略不设置utf8了
    if(req.url === '/' || req.url === '/index') {
        let filename = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filename, (err, data) => {
            if(err) {
                throw err
            }
            res.end(data);
        })
    } else if(req.url === '/list') {
        let filename = path.join(__dirname, 'public', 'newsList.html');
        fs.readFile(filename, (err, data) => {
            if(err) {
                throw err
            }
            res.end(data);
        })
    } else if(req.url === '/edit') {
        let filename = path.join(__dirname, 'public', 'newsEdit.html');
        fs.readFile(filename, (err, data) => {
            if(err) {
                throw err
            }
            res.end(data);
        })
    } else if(/^\/static/.test(req.url)) {   //静态资源路径，用正则表示，以static开头的
        let filename = path.join(__dirname, req.url);
        fs.readFile(filename, (err, data) => {
            if(err) {
                throw err
            }
            //mime模块，相应的后缀文件，通过mine模块配置相应的Content-Type
            res.setHeader('Content-Type', mime.getType(req.url))
            res.end(data);
        })
    } else if(/^\/submitnews/.test(req.url) && req.method === 'get') {  //submit提交， get请求， 参数在请求头中
        let filename = path.join(__dirname, 'data', 'index.json');
        fs.readFile(filename, 'utf8', (err, data) => {
            if(err && err.code != 'ENOENT') {   //当文件中没有内容时 err.code === 'ENOENT'
                throw err;
            }
            let list = JSON.parse(data || '[]');    //文件中没有内容时，是undefined
            //node的url内置模块， url.parse(req.url).query获取❓后信息， 加上参数true，会将query这个键值中的值变为对象
            list.push(url.parse(req.url, true).query);
            fs.writeFile(filename, JSON.stringify(list), (err) => {
                if(err) {
                    throw err;
                }
                //http中302表示重定向，  res.setHeader('location', '/')跳转 
                res.statusCode = 302;
                res.statusMessage = 'found';
                res.setHeader('location', '/');
                res.end();
            })
        })
    } else if(/^\/submitnews/.test(req.url) && req.method === 'post') { //post的话参数在请求体中
        /* 
        因为post提交数据的时候，数据量可能比较大，所以会分多次进行提交，每次提交一部分数据，此时要
        想在服务器中获取用户提交的所有数据，就必须监听 request 事件的 data 事件(因为每次浏览器提交一部分数据到服务器就会触发一次data事件)，
        那么什么时候才表示浏览器把所有数据都提交到服务器了呢？就是当request对象的end事件被触发的时候。
        */

        //监听 request 的对象的 data 事件和 end 事件
        // 声明一个数组，用来保存用户每次提交过来的数据
        let array = [];
        req.on('data', (chunk) => {
            //此处的chunk参数，就是浏览器本次提交过来的一部分数据
            // chunk的数据类型是Buffer(chunk就是一个Buffer对象)
            array.push(chunk);
        })
        //监听 request 对象的end事件
        //当end事件被触发的时候，表示所有的数据都已经提交完毕了
        req.on('end', () => {
            /* 
            在这个事件中只要把array中的所有数据汇总起来就好了
            把array中的每个buffer对象，集合起来转换为一个buffer对象
            title=111&url=222&text=333
            {title: 111, url: 222, text: 333}
            JSON.parse();
            */
            let postBody = Buffer.concat(array);
            //把获取到buffer对象转为一个字符串
            postBody = postBody.toString('utf8');
            //把post请求的查询字符串，转为一个json对象.
            postBody = querystring.parse(postBody);
            console.log(postBody)
            
            res.end('over')

        })
        res.end();
    } else {
        res.write('not found 404')
        res.end()
    }
}).listen(8000, () => {
    console.log('服务器启动了')
})