`html`的高度根据内部撑开，

`body`的高度根据内部撑开

所以

```html
<style>
    div {
        height: 300px;		//所以div是多少高度，那么body和html的高度就是300px
    }
</style>
<html>
    <body>
        <div></div>
    </body>
</html>
```



如果内部的`div`是固定定位`fixed`，那么此时脱硫文档流，此时`html`、`body`高度都为0，而`div`的高度如果设置为百分比，则根据窗口来计算。

```html
<style>
    div {
        position: fixed;
        height: 80%;		//固定定位 高度如果百分比，是根据窗口计算。  定位也是根据窗口的，不是根据父级
    }
</style>
<html>
    <body>
        <div></div>
    </body>
</html>
```

