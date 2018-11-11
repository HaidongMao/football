var UserSQL = {  
	insert:'insert into score(`hight`, `strength`, `angle`, `x`, `y`, `z`) values (?,?,?,?,?,?)', 
	queryAll:'SELECT * FROM standard_score as a, score as b',  
	queryTime:'select sec div 60 as mins,sec mod 60 as secs from (select sum(TIME_TO_SEC(end_time)-TIME_TO_SEC(begin_time)) as sec from football.train_log ) a;',
	getUserById:'SELECT * FROM User WHERE uid = ? ',
	trainBegin:'INSERT INTO train_log (end_time) VALUES (null);',
	trainEnd:'update train_log set end_time=sysdate() where id=?'
};
module.exports = UserSQL;