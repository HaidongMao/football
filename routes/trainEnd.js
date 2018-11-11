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

// 添加用户
router.post('/', function(req, res, next){
 	// 从连接池获取连接 
	pool.getConnection(function(err, connection) { 
	// 获取前台页面传过来的参数  
		var param = req.body;   
		// 建立连接 增加一个用户信息 
		console.log("param=" + JSON.stringify(param));
		connection.query(userSQL.trainEnd, [param.id], function(err, result) {
			if(result) {
				console.log(JSON.stringify(result)); 
				result = {
					affectedRows:result.affectedRows,
					code: 200,   
					data:param
				};  
			} else {
				console.log(err);
			}
				 
			// 以json形式，把操作结果返回给前台页面     
			responseJSON(res, result);   
		 
			// 释放连接  
			connection.release();  
		 

		});
		
	//res.send(req.body);
	});
});

module.exports = router;
