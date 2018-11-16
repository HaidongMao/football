
var queryTime = 'select train_date,sec div 60 as mins,sec mod 60 as secs from ' +
                '(select date_format(create_time,"%Y-%m-%d") train_date,sum(TIME_TO_SEC(ifnull(end_time,sysdate()))-TIME_TO_SEC(begin_time)) as sec ' + 
                'from football.train_log  where create_time>current_date() group by date_format(create_time,"%Y-%m-%d")) a;';

var UserSQL = {  
	insert:'insert into score(`hight`, `strength`, `angle`, `x`, `y`, `z`) values (?,?,?,?,?,?)', 
	queryAll:'SELECT * FROM standard_score as a, score as b where b.create_time>current_date()',  
	queryTime:queryTime,
	trainBegin:'INSERT INTO train_log (end_time) VALUES (null);',
	trainEnd:'update train_log set end_time=sysdate() where id=?'
};


module.exports = UserSQL;
