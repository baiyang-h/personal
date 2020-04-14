### margin-top存在的问题
开始
```css
.parent {
    width: 400px;  
    height: 400px;  
    background: red;  
}
.child {
    width: 200px;  
    height: 200px;  
    background: green;
    margin-top: 100px; 
}
```
```html
<div class="parent">
    <div class="child"></div>
</div>
```
存在塌陷，`<div class="child"></div>`的`margin-top`效果，会作用于`<div class="parent"></div>`。

#### 解决margin-top塌陷的方法
解决办法：
1. 给父盒子添加border
2. 给父盒子添加padding-top
3. 给父盒子添加overflow:hidden
4. 父盒子:position:fixed
5. 父盒子:display:table
6. margin的塌陷只存在于块级元素上，行块级或者行级元素不受影响
7. 浮动元素的margin不与任何margin发生折叠
8. 绝对定位元素的margin不与任何margin发生折叠

#### margin-top的合并问题
```css
.parent {
    margin-top: 100px;
}
.child {
    margin-top: 50px;
}
```
```html
<div class="parent">
    <div class="child"></div>
</div>
```
合并，最后离视窗为`100px`, 如果子的大，就以大的优先。
