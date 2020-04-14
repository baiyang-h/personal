const http = require('http');
const path = require('path');
const fs = require('fs');

http.createServer((req, res) => {
    if (req.url === '/form') {
        let chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            chunks.push(chunk);
            size += chunk.length;
        })
        req.on('end', () => {
            let buffer = Buffer.concat(chunks, size);

            var rems = [];
            //根据\r\n分离数据和报头
            for (var i = 0; i < buffer.length; i++) {
                var v = buffer[i];
                var v2 = buffer[i + 1];
                if (v == 13 && v2 == 10) {      //ascll码
                    rems.push(i);
                }
            }
            // console.log(rems);   
            
            // console.log(buffer.slice(0, rems[0]).toString());
            // console.log(buffer.slice(rems[0]+2,rems[1]).toString());

            // console.log(buffer.slice(rems[2]+2,rems[3]).toString());
            // console.log(buffer.slice(rems[3]+2,rems[4]).toString());
            // console.log(buffer.slice(rems[4]+2,rems[5]).toString());

            // console.log(buffer.slice(rems[6]+2,rems[7]).toString());
            // console.log(buffer.slice(rems[7]+2,rems[8]).toString());
            // console.log(buffer.slice(rems[8]+2,rems[9]).toString());
            // console.log(buffer.slice(rems[9]+2,rems[10]).toString());

            // console.log(buffer.slice(rems[11]+2,rems[rems.length-2]));
            // console.log(buffer.slice(rems[rems.length-2]+2,rems[rems.length-1]));

            //文件数据
            let getbodyfile = buffer.slice(rems[8]+2,rems[9]).toString()
            let filename = getbodyfile.match(/filename=".*"/g)[0].split('"')[1];

            let nbuf = buffer.slice(rems[11]+2,rems[rems.length-2]);
            let savepath = path.join(__dirname, 'data', filename);
            
            fs.writeFileSync(savepath, nbuf);

            res.end('200')
        })
    }
}).listen(9000, () => console.log('服务器启动了'));