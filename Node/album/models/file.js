const fs = require('fs');

exports.getAllAlbums = (callback) => {
    //寻找文件夹   这里之所以是./uploads的路径，是因为最后file.js文件也是被导入到app.js中，所以基于app.js的执行环境
    fs.readdir('./uploads', (err, files) => {
        if(err) {
            callback(err, null);
            return false;
        }
        let allAlbums = [];
        (function iterator(i) {
            if(i === files.length) {
                // console.log(allAlbums); //遍历结束
                // return allAlbums;    //存在异步， 使用回调
                callback(null, allAlbums);
                return false
            }
            else {
                fs.stat('./uploads/' + files[i], (err, states) => {
                    if(err) {
                        callback(err, null);
                    }
                    if(states.isDirectory()) {
                        allAlbums.push(files[i]);
                    }
                    iterator(++i);
                })
            }
        })(0);
    }) 
}
//通过文件名得到所有图片
exports.getAllImagesByAlbumName = (albumName, callback) => {
    fs.readdir(`./uploads/${albumName}`, (err, files) => {
        if(err) {
            callback(err, null);
            return false
        }
        let allImages = [];
        (function iterator(i) {
            if(i === files.length) {
                // console.log(allImages); //遍历结束
                // return allImages;    //存在异步， 使用回调
                callback(null, allImages);
            }
            else {
                fs.stat(`./uploads/${albumName}/${files[i]}`, (err, states) => {
                    if(err) {
                        callback(err, null);
                    }
                    if(states.isFile()) {
                        allImages.push(`/${albumName}/${files[i]}`);
                    }
                    iterator(++i);
                })
            }
        })(0);
    })
}