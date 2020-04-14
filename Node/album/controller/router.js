const fs = require('fs');
const path = require('path');
const file = require('../models/file.js')

exports.showIndex = (req, res) => {
    /* 
    这就是node.js的编程思维，就是所有东西，都是异步的，所以内层函数，不要return回来东西，
    而是调用高层函数提供的回调函数。把数据当做回调函数的参数来使用
    */
    file.getAllAlbums((err, allAlabums) => {
        if(err) {
            res.send(err);
            return false;
        }
        res.render('index', {
            albums: allAlabums
        })
    })
}
exports.showDownLoadShow = (req, res) => {
    res.render('downshow');
}
//文件夹中的图片
exports.showAlbum = (req, res) => {
    //遍历相册中的所有图片
    let albumName = req.params.albumName;
    file.getAllImagesByAlbumName(albumName, (err, imagesArray) => {
        if(err) {
            res.send(err);
            return false;
        }
        //具体业务交给models
        res.render('album', {
            albumName,
            images: imagesArray
        })
    });
}
//下载 返回的图片buffer
exports.downloadfileBuffer = (req, res) => {
    let currFilePath = path.join(__dirname, '..', 'static/images/a.jpg');
    let readStream = fs.createReadStream(currFilePath);
    let chunks = [];
    let fileName = 'a.jpg'
        res.set({
            "Content-type":"application/octet-stream",      //以流的形式下载文件,这样可以实现任意格式的文件下载
            "Content-Disposition":"attachment;filename="+encodeURI(fileName)
        });
    readStream.on('data', (chunk) => {
        chunks.push(chunk);
    })
    readStream.on('end', () => {
        let buffers = Buffer.concat(chunks);
        res.send(buffers);
    })
    /* 
    fs.createReadStream(filepath).pipe(res);            //也可以直接使用管道
    */
}
//下载 返回的图片url
exports.downloadfileUrl = (req, res) => {
    res.send('/images/a.jpg');
}

//上传
exports.showUp = (req, res) => {
    file.getAllAlbums((err, allAlabums) => {
        if(err) {
            res.send(err);
            return false;
        }
        res.render('up', {
            albums: allAlabums
        })
    })
}
exports.imgUp = (req, res) => {
    res.send('11')
}