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

router.post('/', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		var param = req.body;   
		//console.log("param=" + JSON.stringify(param));
		connection.query(userSQL.insert, [param.hight,param.force,param.angle,param.x,param.y,param.z], function(err, result) {
			if(result) {
				//console.log(JSON.stringify(result)); 
				result = {
					id:result.insertId,
					code: 200,   
					data:param
				};  
			} else {
				console.log(err);
			}
			responseJSON(res, result);   
			connection.release();  
		});
	});
});

module.exports = router;
