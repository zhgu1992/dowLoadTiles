// sql语句
var sqlMap = {
	// 用户
	user: {
		add: 'insert into user(id, name, password) values (0, ?, ? )',
		search:'select * from user where name = ? and password = ?'
	},
	task : {
		selectAll: 'select * from task'
	}
}
module.exports = sqlMap;