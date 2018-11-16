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
	    var rptsql = "select count(*)-sum(f_ok) as fail, " +
                     "sum(f_ok) as succ, count(*) as cnt," +
                     "if(sum(f_strength)/count(*)-1>0.5, 1, 0) as strength_ok, " +
                     "if(sum(f_angle)/count(*)-1>0.5, 1, 0) as angle_ok, " +
                     "if(sum(f_hight)/count(*)-1>0.5, 1, 0) as hight_ok " +
                     "from(" +
	                 "select id,strength,angle,hight,s_strength,s_angle,s_hight,f_strength,f_angle,f_hight," +
	                 "if(f_strength+f_angle+f_hight>2,1,0) as f_ok " +
	                 "from	(SELECT b.id,strength,angle,hight,s_strength,s_angle,s_hight, " +
				     "if(abs(strength/s_strength-1)<0.5, 1, 0) as f_strength, " +
				     "if(abs(angle/s_angle-1)<0.5, 1, 0) as f_angle, " +
				     "if(abs(hight/s_hight-1)<0.5, 1, 0) as f_hight " +
				     "FROM standard_score as a, score as b  where create_time>current_date()) as t) " +
                     "as t2 " +
                     "group by f_ok,f_strength,f_angle,f_hight ;";

		var res_json = {};
		//console.log('pie sql:') + rptsql;
		connection.query(rptsql, function(err, result) {
			//console.log('pie result:'+ JSON.stringify(result));
			if(result && result.length>0){
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
