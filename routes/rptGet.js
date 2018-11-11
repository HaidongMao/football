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
		var sqlstr = "select count(*)-sum(f_ok) as fail, " +
                     "sum(f_ok) as succ, " +
                     "if(sum(f_strength)/count(*)-1>0.5, 1, 0) as strength_ok, " +
                     "if(sum(f_angle)/count(*)-1>0.5, 1, 0) as angle_ok, " +
                     "if(sum(f_hight)/count(*)-1>0.5, 1, 0) as hight_ok " +
                     "from(" +
	                 "select id,strength,angle,hight,s_strength,s_angle,s_hight,f_strength,f_angle,f_hight,f_strength+f_angle+f_hight as f_ok " +
	                 "from	(SELECT b.id,strength,angle,hight,s_strength,s_angle,s_hight, " +
				     "if(abs(strength/s_strength-1)<0.5, 1, 0) as f_strength, " +
				     "if(abs(angle/s_angle-1)<0.5, 1, 0) as f_angle, " +
				     "if(abs(hight/s_hight-1)<0.5, 1, 0) as f_hight " +
				     "FROM standard_score as a, score as b) as t) " +
                     "as t2 " +
                     "group by f_ok,f_strength,f_angle,f_hight ;";

        var good = "请保持";
        var bad  = "请注意";
        var res_result = {};
		connection.query(sqlstr, function(err, result) {
			// 以json形式，把操作结果返回给前台页面 
			if(result.strength_ok == 1){
				good = good + '高度/';
			} else {
				bad = bad +  '高度/';
			}

			if(result.angle_ok == 1) {
				good = good + '角度/';
			} else {
				bad =  bad + '角度/';
			}

			if(result.hight_ok == 1) {
				good = good + '力度/';
			} else {
				bad =  bad + '力度/';
			}

			if(good.charAt(good.length-1) == '/') {
				good = good.slice(1,-1);
			}
			if(bad.charAt(bad.length-1) == '/') {
				bad = bad.slice(1,-1);
			}

			if(good == "请保持") {
				good = "";
			}
			if(bad == "请注意"){
				bad = "";
			}

			res_result = {good:good,bad:bad};
		 
		});

		connection.query(userSQL.queryTime, function(err, result) {
			console.log(JSON.stringify(result));
			if(result) {
				res_result["mins"] = result[0].mins;
				res_result["secs"] = result[0].secs;
			}
			responseJSON(res, res_result);   
			// 释放连接  
			connection.release();  
		});
	});
});

module.exports = router;
