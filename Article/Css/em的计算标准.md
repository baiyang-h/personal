## 相对长度单位em
### em
<font face="微软雅黑">
    相对长度单位，这个单位表示元素的font-size的计算值。如果用在font-size 属性本身，它会继承父元素的font-size。
</font>

```html
<div class='parent'>
    parent
    <div class='child'>
        child
    </div>
</div>
```
```css
html{
    font-size:50px;
}
.parent{
    font-size:30px;
}
.child{
    font-size:2em;      /*60px，相对于父元素的font-size大小*/
    line-height: 1em;   /*60px，相对于当前元素的font-size大小*/
    background:#CCC;
    height:2em;         /*120px，相对于当前元素的font-size大小*/
    width:2rem;         /*100px，相对于根元素html的font-size大小*/
}
```

<font face="微软雅黑">
    使用em单位，如果不是应用在font-size属性上，它就是根据当前元素的font-size来计算的。如果是应用在font-size属性上，就会相对于父元素的font-size来计算。
</font>

<br/>
### rem
<font face="微软雅黑">
    这个单位代表根元素的 font-size 大小（例如 `<html>` 元素的font-size）。当用在根元素的font-size上面时 ，它代表了它的初始值(译者注:默认的初始值是html的默认的font-size大小,比如当未在根元素上面设置font-size大小的时候,此时的1rem==1em,当设置font-size=2rem的时候,就使得页面中1rem的大小相当于html的根字体默认大小的2倍,当然此时页面中字体的大小也是html的根字体默认大小的2倍)。
</font>
<br/>
<br/>

[mdn链接](http://github.com)