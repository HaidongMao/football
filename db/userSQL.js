var UserSQL = {  
	insert:'insert into score(`hight`, `force`, `angle`, `x`, `y`, `z`) values (?,?,?,?,?,?)', 
	queryAll:'SELECT * FROM standard_score as a, score as b',  
	getUserById:'SELECT * FROM User WHERE uid = ? ',
};
module.exports = UserSQL;