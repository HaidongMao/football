var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/dbconf');
var userSQL = require('../db/userSQL');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
var responseJSON = function (res, ret) {
	if(typeof ret === 'undefined') { 
		res.json({
			code:'-200',
			msg: '操作失败'   
		}); 
    } else { 
		res.json(ret); 
  }};

 //设置跨域请求头
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 添加用户
router.get('/', function(req, res, next){
 	// 从连接池获取连接 
	pool.getConnection(function(err, connection) { 
	// 获取前台页面传过来的参数  
		var param = req.query || req.params;   
		// 建立连接 增加一个用户信息 
		//console.log("param=" + param);
		connection.query(userSQL.queryAll, function(err, result) {
				 
			// 以json形式，把操作结果返回给前台页面 
			var res_json = {count:[{name:'成功',value:'7'},{name:'失败',value:'3'}],
							data:result};
			responseJSON(res, res_json);   
		 
			// 释放连接  
			connection.release();  
		 
		});
	});
});

module.exports = router;
