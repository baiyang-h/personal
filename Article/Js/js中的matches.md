在SELECTORS API Level 2规范中, 为DOM节点添加了一个方法，主要是用来判断当前DOM节点是否能完全匹配对应的CSS选择器规则；如果匹配成功，返回true，反之则返回false。

```js
element.matches(String selector); //element为dom元素
```

这个方法在我们做事件委托时就显得非常有用，示例代码如下：

```js
document.querySelector('#wrap').addEventListener('click',function(e){
        if(e.target.matches('a.btn')) { //这里根据事件冒泡， 该节点匹配的css规则是否符合
        e.preventDefault();
        //TODO something
    }
},false);
```

对应的HTML代码如下:

```js
<div id="wrap">
    <a class="btn" href="http://www.lyblog.net">点击代码</a>
    <span class="btn">不可点击按钮</span>
</div>
```

对于以上，jq的一种写法可以如下： (所以是可以取代jq中的delegate方法的)

```js
$('#wrap').delegate('a.btn','click',function(e){
    //TODO something
});
```

实际情况下，'matches'支持情况也不太尽人意，你可以到 caniuse 查看参考结果。但几乎所有的现代浏览器实验性的实现了这个方法（如：chrome中以webkitMatchesSelector，firefox中以mozMatchesSelector，IE 9+中则以msMatchesSelector替代）。

<br>

通常在开发阶段兼容IE 8+及移动端，我更偏向于脱离jq等重量级的库。所以有了以下的兼容写法：

```js
function matchesSelector(element, selector){
    if(element.matches){
        return element.matches(selector);
    } else if(element.matchesSelector){
        return element.matchesSelector(selector);
    } else if(element.webkitMatchesSelector){
        return element.webkitMatchesSelector(selector);
    } else if(element.msMatchesSelector){
        return element.msMatchesSelector(selector);
    } else if(element.mozMatchesSelector){
        return element.mozMatchesSelector(selector);
    } else if(element.oMatchesSelector){
        return element.oMatchesSelector(selector);
    }
}
```

但主要IE 8正好不支持msMatchesSelector方法，可以用如下方法处理以上函数，以便支持IE 8，完善之后的代码如下：

```js
function matchesSelector(element,selector){
    if(element.matches){
        return element.matches(selector);
    } else if(element.matchesSelector){
        return element.matchesSelector(selector);
    } else if(element.webkitMatchesSelector){
        return element.webkitMatchesSelector(selector);
    } else if(element.msMatchesSelector){
        return element.msMatchesSelector(selector);
    } else if(element.mozMatchesSelector){
        return element.mozMatchesSelector(selector);
    } else if(element.oMatchesSelector){
        return element.oMatchesSelector(selector);
    } else if(element.querySelectorAll){
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
        i = 0;
        while(matches[i] && matches[i] !== element) i++;
        return matches[i] ? true: false;
    }
    throw new Error('Your browser version is too old,please upgrade your browser');
}
```

由于querySelectorAll是SELECTORS API Level 1中提出来的，所以在浏览器中的表现的比较不错。所以以上的解决方案可以在不考虑IE 7-以下浏览器的情况下使用。

文章地址：[https://www.lyblog.net/detail/601.html](https://www.lyblog.net/detail/601.html)






