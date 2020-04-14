var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';

const dbName = 'myproject';

const _connect = (callback) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    callback(client)
  });
}

//插入
exports.insertOne = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.insertOne(queryObject, function (err, result) {
      // if(err) throw err;
      assert.equal(err, null);
      callback(err, result);   //{ n: 1, ok: 1 }
      client.close();
    });
  })
}
exports.insertMany = (collectionName, queryArray, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.insertMany(queryArray, function (err, result) {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    });
  })
}
//删除
exports.deleteOne = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.deleteOne(queryObject, function (err, result) {
      assert.equal(err, null);
      callback(err, result.result);
      client.close();
    });
  })
}
exports.deleteMany = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.deleteMany(queryObject, function (err, result) {
      assert.equal(err, null);
      callback(err, result.result);
      client.close();
    });
  })
}
//更新
exports.updateOne = (collectionName, queryObject, updateObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.updateOne(queryObject, { $set: updateObject },  function (err, result) {
      assert.equal(err, null);
      callback(err, result.result);
      client.close();
    });
  })
}
exports.updateMany = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.updateMany(queryObject, { $set: updateObject },  function (err, result) {
      assert.equal(err, null);
      callback(err, result.result);
      client.close();
    });
  })
}
//查询
exports.find = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find(queryObject).toArray(function(err, result) {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    });
  })
}
//查询分页
exports.findSlice = (collectionName, queryObject, { currentPage, pageSize }, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find(queryObject).count(function(err, total) {
      assert.equal(err, null);
      collection.find(queryObject).skip((currentPage-1)*pageSize).limit(pageSize).toArray(function(err, result) {
        assert.equal(err, null);
        callback(err, result, total);
        client.close();
      });
    })
  })
}
//计算数量
exports.count = (collectionName, queryObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find(queryObject).count(function(err, result) {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    });
  })
}
//排序
exports.findSort = (collectionName, queryObject, sortObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.find(queryObject).sort(sortObject).toArray(function(err, result) {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    });
  })
}
//聚合
exports.lookup = (collectionName, {from, localField, foreignField, as}, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.aggregate([
      {
        $lookup: {
          from,                   // 右集合
          localField,           // 左集合 join 字段
          foreignField,         // 右集合 join 字段
          as                    // 新生成字段（类型array）
        }
      }
    ]).toArray(function(err, result) {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    });
  })
}
//索引
exports.indexCollection = (collectionName, setIndexObject, callback) => {
  _connect(function(client){
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.createIndex(setIndexObject, null, (err, result) => {
      assert.equal(err, null);
      callback(err, result);
      client.close();
    })
  })
}