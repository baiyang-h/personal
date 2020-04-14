:nth-child(index)是规定属于其父元素的第index个子元素，不管是不是选定的元素。

:nth-type-of(index)规定你选定的父元素的下的某个元素的第几个

兼容: &gt;IE8

<br/>

:nth-child(2)选取第几个标签，“2可以是你想要的数字”

```css
ul li:nth-child(2){background:#090}
```
<br/>

:nth-child(n+4)选取大于等于4标签，“n”表示从整数，下同

```css
ul li:nth-child(n+4){background:#090}
```
<br/>

:nth-child(-n+4)选取小于等于4标签

```css
ul li:nth-child(-n+4){background:#090}
```
<br/>

:nth-child(2n)选取偶数标签，2n也可以是even

```css
ul li:nth-child(2n){background:#090}
```
<br/>

:nth-child(2n-1)选取奇数标签，2n-1可以是odd

```css
ul li:nth-child(2n-1){background:#090}
```
<br/>

:nth-child(3n+1)自定义选取标签，3n+1表示“隔二取一”

```css
ul li:nth-child(3n+1){background:#090}
```
<br/>

:last-child选取最后一个标签

```css
ul li:last-child{background:#090}
```
<br/>

:nth-last-child(3)选取倒数第几个标签,3表示选取第3个

```css
ul li:nth-last-child(3){background:#090}
```

<br/>

#### 可以选择一个范围

```css
ul li:nth-child(n+3):nth-child(-n+7) //表示ul下的第3-7个li元素
```



