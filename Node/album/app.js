const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const router = require('./controller/router.js');

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads', req.body.selectFile))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
var upload = multer({ storage: storage })
  
app.set('view engine', 'ejs');

//当是/images/a.jpg则将其http响应头，设置为可以下载的
app.use('/images/a.jpg', (req, res) => {
    fs.readFile('./static/images/a.jpg', (err, data) => {
        if(err) {
            throw err
        }
        else {
            let fileName = 'a.jpg'
            res.set({           //设不设置都一样， 浏览器默认设置以application/octet-stream的格式
                // "Content-type":"image/jpeg;",    //设置这个是只在浏览器端显示
                "Content-type":"application/octet-stream;", 
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
            });
            res.send(data);
        }
    })
})

app.use(express.static('./static'));
app.use(express.static('./uploads'));

//首页
app.get(['/home', '/'], router.showIndex);
app.get('/downloadshow', router.showDownLoadShow)

app.get('/downloadonlyfilebuffer', router.downloadfileBuffer)
app.get('/downloadonlyfileurl', router.downloadfileUrl)

app.get('/home/:albumName', router.showAlbum);
app.get('/up', router.showUp);
app.post('/up', upload.single('pic'), router.imgUp);

app.use((req, res) => {
    res.render('404');
})

app.listen('9000', () => {
    console.log('服务启动了')
})