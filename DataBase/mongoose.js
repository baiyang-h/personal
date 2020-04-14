const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aa', {useNewUrlParser: true});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成。
const testSchema = new Schema({
  name: String,
  age: Number,
  sex: Number
})
/*
Models 是从 Schema 编译来的构造函数。
它们的实例就代表着可以从数据库保存和读取的 documents。 
从数据库创建和读取 document 的所有操作都是通过 model 进行的。

1. 第一个参数是跟 model 对应的集合（ collection ）名字的单数形式。 Mongoose 会自动找到名称是model名字复数形式的 collection 。
2. 第二参数是上面的Schema实例
3. 第三个参数可选，如果写上，将覆盖第一个参数，表示在数据中test文档
*/
 const TestModel = mongoose.model('Test', testSchema, 'test');

//增加
/*
let test = new TestModel({
  name: '张三',
  age: 24,
  sex: 1
})
test.save((err, result) => {
  console.log(result)
})
*/

//删除全部
/*
TestModel.remove({name: 'aa'}, (err, result) => {
  console.log(result)
})
*/
//删除单个
/*
TestModel.deleteOne({name: 'aa'}, (err, result) => {
  console.log(result)
})
*/
// 删除全部
/*
TestModel.deleteMany({name: 'aa'}, (err, result) => {
  console.log(result)
})
*/

//查询
/*
TestModel.find({}, (err, result) => {
  console.log(result)
})
*/

//更新
//默认只改变一个，   如果想查询到的全部改变，要设置第三个参数，设置{multi: true}全部修改
/*
TestModel.update({name: 'aa'}, {age: 23}, (err, result) => {
  console.log(result)
})
*/
/*
TestModel.update({name: 'aa'}, {age: 55}, {multi: true}, (err, result) => {
  console.log(result)
})
*/
// 更新所有
/*
TestModel.updateMany({name: 'aa'}, {age: 66}, (err, result) => {
  console.log(result)
})
*/
// 更新一个
/*
TestModel.updateOne({name: 'aa'}, {age: 66}, (err, result) => {
  console.log(result)
})
*/

//索引
//方法1
/**
 new Schema({
   name: {
    type: String,
    index: true
  },
  age: {
    type: Number
    unique: true
  }
 })
 */
//方法2
/*
const testSchema = new Schema({
  name: String,
  age: Number,
  sex: Number
})
testSchema.index({
  name: 1
})

db.test.dropIndex({name: 1})
*/

//聚合
/*
TestModel.aggregate([
  {
    $lookup: {
      from: 'sexinfo',
      localField: 'sex',
      foreignField: 'sex_num',
      as: 'other'
    }
  },
  {
    $project: {
      sex: 0
    }
  }
]).then(function (res) {
  console.log(res);
});
*/