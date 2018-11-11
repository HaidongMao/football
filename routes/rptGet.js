var express = require('express');
var router = express.Router();
var userSQL = require('../db/userSQL');
var pool = require('../db/dbpool');

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
	var res_result = {};
 	// 从连接池获取连接 
	pool.getConnection(function(err, connection) { 
		// 获取前台页面传过来的参数  
		var param = req.query || req.params;   
		// 建立连接 增加一个用户信息 
		

        var good = "请保持:";
        var bad  = "请注意:";
        
		connection.query(userSQL.rptsql, function(err, result) {
			// 以json形式，把操作结果返回给前台页面 
			if(result[0].strength_ok == 1){
				good = good + '高度/';
			} else {
				bad = bad +  '高度/';
			}

			if(result[0].angle_ok == 1) {
				good = good + '角度/';
			} else {
				bad =  bad + '角度/';
			}

			if(result[0].hight_ok == 1) {
				good = good + '力度/';
			} else {
				bad =  bad + '力度/';
			}

			if(good.charAt(good.length-1) == '/') {
				good = good.slice(0,-1);
			}
			if(bad.charAt(bad.length-1) == '/') {
				bad = bad.slice(0,-1);
			}

			if(good == "请保持:") {
				//good = "";
			}
			if(bad == "请注意:"){
				bad = "";
			}
			console.log(JSON.stringify(result));
			res_result = {good:good,bad:bad,count:result[0].cnt};
			connection.release();  
		});
	});

	pool.getConnection(function(err, connection) {
		connection.query(userSQL.queryTime, function(err, result) {
			console.log(JSON.stringify(result));
			if(result) {
				res_result["type"] = "report";
				res_result["duration"] = result[0].mins + '分' + result[0].secs + '秒';
				res_result["train_date"] = result[0].train_date;
			}
			responseJSON(res, res_result);   
			// 释放连接  
			connection.release();  
		});
	});
});

module.exports = router;
