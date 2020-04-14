#### 什么是*args和**kwargs

*当我要传入的参数个数不定、长度不定时，可以使用这两个变量。*
*叫做可变长参数列表，本质上是tuple和dict。*


```python
#*args参数 会将参数转成一个tuple

def test(*args):
    print(args)

test(1, 2, 3, 4) #(1, 2, 3, 4)

val = 1, 2, 3 #((1, 2, 3),)
val = [1, 2, 3] #((1, 2, 3),)
test(val)
```


```python
#**kwargs参数 会将参数转成一个dict

def test(**kwargs):
    print(kwargs)

test(a=1) #正确 {'a': 1}
test({'b': 1}) #错误 TypeError: test() takes 0 positional arguments but 1 was given

```

#### *args参数的使用

* \*args是位置参数，按照位置传值。不光像上面说的，可以传可变长度的参数；同时还能接收剩余的参数，


```python
def test(x, y, *args):
    print(x, y, args)

test(1, 2, 3, 4, 5) #1 2 (3, 4, 5)
```

当\*args参数位置不是最后一个时，也就是说\*args参数后面还有一个参数的时候会是什么样？

```python
def test(x, y, *args, z):
    print(x, y, args, z)

test(1, 2, 3, 4, 5)
```

结果就报错了：

```python
TypeError: test() missing 1 required keyword-only argument: 'z'
```

这时候指定参数，z=6就不会报错了。

```python
def test(x, y, *args, z=6):
    print(x, y, args, z)

test(1, 2, 3, 4, 5) #1 2 (3, 4, 5) 6
```

* 注意:\*args如果不是最后一个参数，那么后面的参数就必须指定一个默认值,\*args是针对你传入的参数的剩余值

<br>

#### **kwargs参数的使用

* **kwargs是可变的关键词参数列表。python中以dict类型展示出来。
* 这个参数的作用与上类似，可以接收变长参数，接收剩余参数。不同的是这个类型是字典。

```python
def test(**kwargs):
    print(kwargs)

test(a=1, b=2, c=3) #{'a': 1, 'b': 2, 'c': 3}
```

接收剩余参数的例子：

```python
def test(x, **kwargs):
    print(x, kwargs)
    print("=" * 40)

test(10, a=1, b=2, c=3) #10 {'a': 1, 'c': 3, 'b': 2}
```

如果我把x和**kwargs位置调换呢？

```python
def test(**kwargs, x):
    print(x, kwargs)

test(a=1, b=2, c=3, 10)
```

结果报错了，说我语法错误： 就算像上面的将x=6也是错误的

```python
def function(**kwargs, x):
^
SyntaxError: invalid syntax
```

#### 参数x、*args、**kwargs的位置

我们再试一下，参数x在前面，更换*args和**kwargs位置，会发生什么？

```python
def test(x, **kwargs, *args):
    print(x, args, kwargs)
    print("=" * 40)

test(1, a=3, b=4, c=5, 6, 7)
```

结果报错了，又说我语法错误：

```python
def function(x, **kwargs, *args):
^
SyntaxError: invalid syntax
```

<br>

#### 通过以上的实验总结，参数x、*args、**kwargs三个参数的位置必须是一定的。必须是(x,*args,**kwargs)这个顺序。

<br>

下面是在js中的...args

```js
function show(a, ...args) {
    console.log(a, args)
}
show(1, 2, 3, 4)	//1, [2, 3, 4]
```
**js中...args规定必须是最后一个参数，后面不能再有参数了。js会将剩余的参数转成一个数组arr**
