在ie浏览器下使用`getFullYear`、`getMonth`、`getDate`  不兼容，会返回`NaN`。

```js
let t = new Date('2018-10-01 19:00:00')
let   year = t.getFullYear();
let   month = t.getMonth()+1;
let   date = t.getDate();
return year+"-"+month+"-"+date;
```

直接使用字符串切割的方法

```js
let time = '2018-10-01 19:00:00'.split(' ');
time[0];
```

