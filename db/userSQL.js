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
var queryTime = 'select train_date,sec div 60 as mins,sec mod 60 as secs from ' +
                '(select date_format(create_time,"%Y-%m-%d") train_date,sum(TIME_TO_SEC(ifnull(end_time,sysdate()))-TIME_TO_SEC(begin_time)) as sec ' + 
                'from football.train_log  where create_time>current_date() group by date_format(create_time,"%Y-%m-%d")) a;';

var UserSQL = {  
	insert:'insert into score(`hight`, `strength`, `angle`, `x`, `y`, `z`) values (?,?,?,?,?,?)', 
	queryAll:'SELECT * FROM standard_score as a, score as b where b.create_time>current_date()',  
	queryTime:queryTime,
	trainBegin:'INSERT INTO train_log (end_time) VALUES (null);',
	trainEnd:'update train_log set end_time=sysdate() where id=?',
	rptsql:rptsql
};


module.exports = UserSQL;
