const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url');
const formidable = require('formidable');
const util = require('util');

http.createServer((req, res) => {
    console.log(req)
    let mimeType = mime.getType(req.url); 
    if(req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            res.end(data)
        })
    }
    else if(/^\/static/.test(req.url)) {
        fs.readFile(path.join(__dirname, req.url), (err, data) => {
            res.setHeader('Content-Type', mimeType);
            res.end(data);
        })
    }
    //文件夹目录
    else if(req.url === '/getfilesList') {
        doneReaddir(path.join(__dirname, 'data'), res)
    }
    //添加文件夹名字
    else if(/^\/addfilefoldername/.test(req.url)) {
        let query = url.parse(req.url, true).query;
        if(query.name == 'null') {
            return false
        }
        fs.mkdir(path.join(__dirname, 'data', query.name), (err) => {
            if(err) {
                throw err;
            }
            else {
                doneReaddir(path.join(__dirname, 'data'), res)
            }
        })
    }
    //删除文件夹
    else if(/^\/removefilefoldername/.test(req.url)) {
        let query = url.parse(req.url, true).query;
        if(query.name == 'null') {
            return false
        }
        fs.rmdir(path.join(__dirname, 'data', query.name), (err) => {
            if(err) {
                throw err;
            }
            else {
                doneReaddir(path.join(__dirname, 'data'), res)
            }
        })
    }
    //上传图片
    else if(req.url === '/upfile' && req.method.toLowerCase() === 'post') {
        /* let chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        })
        req.on('end', () => {
            let bufferconcat = Buffer.concat(chunks);

            res.end(bufferconcat)
        }) */
        var form = new formidable.IncomingForm();
 
        form.parse(req, function(err, fields, files) {
            console.log(fields)
            console.log(files)
            res.end('aaa')
        });
    }
    else {
        res.end('404')
    }
}).listen('9000', () => {
    console.log('服务器启动了')
})

//读取文件夹目录
function doneReaddir(path, res) {
    fs.readdir(path, (err, files) => {
        res.setHeader('Content-Type', 'application/json;charset=UTF-8');
        res.end(JSON.stringify(files))
    })
}