// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('./dbconf');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );

module.exports = pool;