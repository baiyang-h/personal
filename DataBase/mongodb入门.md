表、集合、文档



### 连接

------

启动mongodb服务

```
mongod
```

```
mongo
```



### 数据库和集合

------

#### 操作数据库

```
#使用数据库
use DATABASE_NAME

#显示所有数据库
show dbs

#删除当前数据库
db.dropDatabase()
```

#### 操作集合

```
db.createCollection(name, options)
```

- `name`: 要创建的集合名称
- `options`: 可选参数, 指定有关内存大小及索引的选项

```
#显示当前数据库中所有集合
show collections
#删除某个集合
db.COLLECTION_NAME.drop()
```



### 文档

------

#### 插入文档

1. `insert()`
2. `save() `
3. `insertOne()`
4. `insertMany()`

##### insert()

```
db.COLLECTION_NAME.insert(document)
```

3.2 版本后还有以下几种语法可用于插入文档:

- `db.collection.insertOne({x:x})`：向指定集合中插入一条文档数据

- `db.collection.insertMany([{x:x}, {x:x}])`：向指定集合中插入多条文档数据

##### save() 

```
db.COLLECTION_NAME.save(document)
```

如果不指定 `_id `字段 `save()`方法类似于` insert()` 方法。如果指定` _id `字段，则会更新该` _id `的数据。



#### 更新文档

1.  `update()`

2. `save()`

##### update()

```
db.collection.update(
   <query>,
   <update>,
   {
     upsert: <boolean>,
     multi: <boolean>,
     writeConcern: <document>
   }
)
```

- `query` : update的查询条件，类似sql update查询内where后面
- `update`：update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
- `upsert`：可选，这个参数的意思是，如果不存在update的记录，是否插入objNew，`true`为插入，默认是`false`，不插入。
- `multi`：可选，mongodb 默认是`false`,只更新找到的第一条记录，如果这个参数为`true`,就把按条件查出来多条记录全部更新。
- `writeConcern`：可选，抛出异常的级别。

例子：

```
db.col.update({'title':'MongoDB 教程'},{$set:{'title':'MongoDB'}},{multi:true})

db.col.update( { "count": { $gt : 3 } }, { $set: { "test2": "OK"} }, false, true );
```

```
db.admins.update({},{$unset: {"sex":""}},{multi: 1})	//这里是删除sex这个字段，整个列都删除了
```

##### save()

`save()` 方法通过传入的文档来替换已有文档。

```
db.collection.save(
   <document>,
   {
     writeConcern: <document>
   }
)
```

例子：

```
db.col.save({
    "_id" : ObjectId("56064f89ade2f21f36b03136"),		#关键处
    "title" : "MongoDB",
})
```



#### 删除文档

1. `remove()`
2. `deleteMany()`
3. `deleteOne()`

##### remove()

```
db.collection.remove(
   <query>,
   <justOne>
)
```

如果你的 MongoDB 是 2.6 版本以后的，语法格式如下：

```
db.collection.remove(
   <query>,
   {
     justOne: <boolean>,
     writeConcern: <document>
   }
)
```

- `query` :（可选）删除的文档的条件。
- `justOne` : （可选）如果设为 true 或 1，则只删除一个文档，如果不设置该参数，或使用默认值 false，则删除所有匹配条件的文档。
- `writeConcern` :（可选）抛出异常的级别。

```
#删除全部
db.collection.remove({})
```

##### deleteOne()和deleteMany()

`remove()` 方法已经过时了，现在官方推荐使用 `deleteOne()` 和 `deleteMany()` 方法。

如删除集合下全部文档：

```
db.inventory.deleteMany({})
```

删除 status 等于 A 的全部文档：

```
db.inventory.deleteMany({ status : "A" })
```

删除 status 等于 D 的一个文档：

```
db.inventory.deleteOne( { status: "D" } )
```

`remove()` 方法 并不会真正释放空间。需要继续执行 `db.repairDatabase()` 来回收磁盘空间。



#### 查询文档

##### find()

```
db.collection.find(query, projection)

db.col.find().pretty()		#pretty() 格式化，会容易读

db.col.find({},{"title":1,_id:0})		#先查询所有，字段中的值1为返回，0不返回，所以这里只返回title字段
```

- `query` ：可选，使用查询操作符指定查询条件
- `projection` ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）

##### 查询条件

```
db.col.find({"by":"菜鸟教程"}).pretty()
db.col.find({"likes":{$lt:50}}).pretty()
db.col.find({"likes":{$ne:50}}).pretty()
```

##### AND条件

```
db.col.find({key1:value1, key2:value2}).pretty()
```

##### OR条件

使用了关键字 `$or`

```
db.col.find( { $or: [ {key1: value1}, {key2:value2} ] } ).pretty()
```

##### AND和OR联合使用

```
db.col.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()
```

##### 模糊查询

```
db.col.find({title:/^教/})		#正则
```

##### 直接通过_id去查找

mongodb在添加数据的时候以自增长的形式为我们的数据增加的`_id`，但当我们获取`_id`值的时候只是获取到了里面的字符串，并没有获取到`ObiectID()`。这时候我们在拿到这个`_id`进行其他操作的时候就无法实现，是因为与数据库中的`_id`形式不一样。

解决上面的方式：

```js
//与数据库默认的_id进行匹配
var ObjectID = require('mongodb').ObjectID;
```

js代码中的使用：

```js
new ObjectID(id)
```

##### 查询集合中的所有文档数量

```
如总数有18

db.collection.find().count()		# 8

db.users.find().skip(10).limit(5).count();   # 8 还是返回整个users的文档数量
# 如果希望返回限制之后的记录数量，要使用count(true)或者count(非0)
db.users.find().skip(10).limit(5).count(true);			# 5
```



### 条件操作符

------

- `$gt`：>
- `$lt`：<
- `$gte`：>=
- `$lte`：<=
- `$ne`：!=
- `$eq`：=

```
db.col.find({likes : {$lt :200, $gt : 100}})
#类似于
Select * from col where likes>100 AND  likes<200;
```



### $type操作符

------
| 类型                    | 数字 | 备注             |
| ----------------------- | ---- | ---------------- |
| Double                  | 1    |                  |
| String                  | 2    |                  |
| Object                  | 3    |                  |
| Array                   | 4    |                  |
| Binary data             | 5    |                  |
| Undefined               | 6    | 已废弃。         |
| Object id               | 7    |                  |
| Boolean                 | 8    |                  |
| Date                    | 9    |                  |
| Null                    | 10   |                  |
| Regular Expression      | 11   |                  |
| JavaScript              | 13   |                  |
| Symbol                  | 14   |                  |
| JavaScript (with scope) | 15   |                  |
| 32-bit integer          | 16   |                  |
| Timestamp               | 17   |                  |
| 64-bit integer          | 18   |                  |
| Min key                 | 255  | Query with `-1`. |
| Max key                 | 127  |                  |

```
db.col.find({"title" : {$type : 2}})
或
db.col.find({"title" : {$type : 'string'}})
```



### limit()、skip()、sort()

------

```
db.COLLECTION_NAME.find().limit(NUMBER)
```

```
db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
# 例子
db.col.find({},{"title":1,_id:0}).limit(1).skip(1)
```

```
# 1为升序排列，-1为降序排列
db.COLLECTION_NAME.find().sort({KEY:1})
# 例子
db.col.find({},{"title":1,_id:0}).sort({"likes":-1})
```

> skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。



### 索引

------

索引通常能够极大的提高查询的效率，如果没有索引，MongoDB在读取数据时必须扫描集合中的每个文件并选取那些符合查询条件的记录。这种扫描全集合的查询效率是非常低的，特别在处理大量的数据时，查询可以要花费几十秒甚至几分钟，这对网站的性能是非常致命的。索引是特殊的数据结构，索引存储在一个易于遍历读取的数据集合中，索引是对数据库表中一列或多列的值进行排序的一种结构

```
db.collection.createIndex(keys, options)
```

语法中 Key 值为你要创建的索引字段，`1` 为指定按升序创建索引，如果你想按降序来创建索引指定为` -1` 即可。

例子：

```
db.values.createIndex({open: 1, close: 1}, {unique: true})   //创建了唯一索引
```

其他：

```
# 查看集合索引
db.col.getIndexes()

# 查看集合索引大小
db.col.totalIndexSize()

#删除集合所有索引
db.col.dropIndexes()

#删除集合指定索引
db.col.dropIndex("索引名称")
```



### 聚合

------

MongoDB中聚合(`aggregate`)主要用于处理数据(诸如统计平均值,求和等)，并返回计算后的数据结果。有点类似sql语句中的 `count(*)`。

#### aggregate()

```
db.COLLECTION_NAME.aggregate(AGGREGATE_OPERATION)
```
| 表达式    | 描述                                                         | 实例                                                         |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| $sum      | 计算总和。                                                   | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| $avg      | 计算平均值                                                   | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| $min      | 获取集合中所有文档对应值得最小值。                           | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| $max      | 获取集合中所有文档对应值得最大值。                           | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| $push     | 在结果文档中插入值到一个数组中。                             | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}]) |
| $addToSet | 在结果文档中插入值到一个数组中，但不创建副本。即不重复出现相同的值，集合。就像ES6中的Set数据结构 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}]) |
| $first    | 根据资源文档的排序获取第一个文档数据。                       | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}]) |
| $last     | 根据资源文档的排序获取最后一个文档数据                       | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}]) |

例子：

```
{
  _id: ObjectId(7df78ad8902c),
  name: "张三",
  value: 10
}
{
  _id: ObjectId(7df78ad8902d),
  name: "李四",
  value: 15
}
{
  _id: ObjectId(7df78ad8902e),
  name: "张三",
  value: 20
}
```

```
#整个集合中文档，相同名字的合成以一个文档，不同的独立一个文档， 一个相同就+1
db.mycol.aggregate([{$group : {_id : "$name", total : {$sum : 1}}}])	

{_id: '张三', total: 2}		#有2个张三
{_id: '李四', total: 1}

#{$sum : "$value"}是对所有的value字段相加
db.mycol.aggregate([{$group : {_id : "$name", total : {$sum : "$value"}}}])

{_id: "张三", total: 30}		#10+20
{_id: "李四", total: 15}

```

```
#$avg
db.mycol.aggregate({$group : {_id : "$name", avg: {$avg : "$value"}}})	

#$min
db.mycol.aggregate({$group : {_id : "$name", min: {$min : "$value"}}})	

#$max
db.mycol.aggregate({$group : {_id : "$name", max: {$max : "$value"}}})	

#$push 返回的是一个数组，数组中是该同名的value值
db.mycol.aggregate({$group : {_id : "$name", push: {$push : "$value"}}})	
{_id: '张三', push: [10, 20]}		
{_id: '李四', push: [15]}
db.mycol.aggregate({$group : {_id : "$name", push: {$push : 10}}})	
{_id: '张三', push: [10, 10]}		
{_id: '李四', push: [10]}

#$addToSet 返回的是一个数组，插入值，如果相同，那么只显示一个。就像数学的集合中，不会有重复的值。ES6中的Set
db.mycol.aggregate({$group : {_id : "$name", push: {$push : 10}}})	
{_id: '张三', push: [10]}	
{_id: '李四', push: [10]}

#$first
db.mycol.aggregate({$group : {_id : "$name", first: {$first : "$value"}}})	

#$last
db.mycol.aggregate({$group : {_id : "$name", last: {$last : "$value"}}})	
```

#### 管道操作符

管道在Unix和Linux中一般用于将当前命令的输出结果作为下一个命令的参数。

MongoDB的聚合管道将MongoDB文档在一个管道处理完毕后将结果传递给下一个管道处理。管道操作是可以重复的。

- `$project`：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。
- `$match`：用于过滤数据，只输出符合条件的文档。$match使用MongoDB的标准查询操作。
- `$limit`：用来限制MongoDB聚合管道返回的文档数。
- `$skip`：在聚合管道中跳过指定数量的文档，并返回余下的文档。
- `$unwind`：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。
- `$group`：将集合中的文档分组，可用于统计结果。
- `$sort`：将输入文档排序后输出。
- `$geoNear`：输出接近某一地理位置的有序文档。
- `$lookup`：用以引入其他集合的数据(表关联查询)。

例子：

1. `$project`

```
db.article.aggregate(
    {
      $project : {title : 1, author : 1}
    }
 );
```

这样的话结果中就只还有`_id`，`tilte`和`author`三个字段了，默认情况下`_id`字段是被包含的，如果要想不包含`_id`可以设置为`_id: 0`

2. `$match`

```
db.aaa.aggregate(
	{
		$match: {age: {$gt: 25, $lt: 28}}
	},
	{
		$limit: 2
	}
)
```

只会输出age>25、age<28的文档

3. `$limit`

```
db.aaa.aggregate(
	{$limit: 2}
)
```

4. `$skip`

```
db.aaa.aggregate(
	{$skip: 1},
	{$limit: 2}
)
或
db.aaa.aggregate(
	[
		{$skip: 1}, 
		{$limit: 2}
	]
)
```

5. `$unwind`

```
{
  name: '张三',
  hobby: ['打球', '跑步']
}

db.aaa.aggregate(
	{$unwind: '$hobby'}
)
#结果
{
  name: '张三',
  hobby: '打球'
}
{
  name: '张三',
  hobby: '跑步'
}
```

6. `$group`

```
db.aaa.aggregate(
	{
		$group : {_id : "$name", total: {$sum : 1}}     //每个+1
	}
)

db.aaa.aggregate(
	{
		$group : {_id : "$name", total: {$sum : '$num'}}		//对组里面的num字段求总数，就是total的返回值
	}
)
```

根据name来归类成一个文档。

7. `$sort`

```
db.aaa.aggregate(
	{
		$sort : {age : -1}
	}
)
```

1(升序)，-1(降序)