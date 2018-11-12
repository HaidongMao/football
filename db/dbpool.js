var mysql = require('mysql');
var dbConfig = require('./dbconf');
var pool = mysql.createPool( dbConfig.mysql );

var query=function(sql,options,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,options,function(err,results,fields){
                conn.release();
                callback(err,results,fields);
            });
        }
    });
};

module.exports = pool;
