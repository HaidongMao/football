var express = require('express');
var router = express.Router();
var userSQL = require('../db/userSQL');
var pool = require('../db/dbpool');

var responseJSON = function (res, ret) {
	if(typeof ret === 'undefined') { 
		res.json({
			code:'-200',
			msg: '操作失败'   
		}); 
    } else { 
		res.json(ret); 
	}
};

router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.get('/', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		var param = req.query || req.params;   
		//console.log("param=" + param);

	    //console.log("db connection id:" + connection.threadId);
		var res_json = {};
		connection.query(userSQL.rptsql, function(err, result) {
			console.log(JSON.stringify(result));
			if(result && result.count>0){
				res_json['count'] = [{name:'成功', value:result[0].succ},{name:'失败',value:result[0].fail}];
			} else {
				res_json['count'] = [{name:'成功',value:0},{name:'失败',value:0}];
			}
		});

		connection.query(userSQL.queryAll, function(err, result) {
			if (result){
				res_json['data'] = result;
			} else {
				res_json['data'] = [];
			}
			
			responseJSON(res, res_json);   
			connection.release();  
		 
		});
	});
});

module.exports = router;
