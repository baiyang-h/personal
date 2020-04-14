### 关于margin-top和padding-top百分比的问题
对于`margin-top`和`padding-top`或者`margin-bottom`和`padding-bottom`的百分比，都是根据其父级的`width`来决定的， 值为父亲`width`的百分比;
```css
.parent {
    width: 300px;
    height: 400px;
    overflow: hidden;
}
.child {
    width: 100px;
    margin-top: 50%;        /* 300*0.5==150  */
    /*padding-top: 50%; */
}
```
```html
<div class='parent'>
    <div class='child'></div>
</div>
```
`child`的`height`值为父级的`width`的百分比;

##### 高度根据宽度自适应
所以我们可以根据这一特性做出高度根据宽度来自适应变化
```css
.one {
    width: 300px;
    background: red;
    overflow: hidden;
}
.two {
    width: 0;
    height: 0;
    margin-top: 100%;
}
```
```html
<div class="one">
    <div class="two"></div>
</div>
```
其中高度根据宽度做变化，我们还可以使用
1. js来控制
2. 通过vw或者vh单位来控制