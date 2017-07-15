var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();



// 查询所有任务,对其封装
router.get('/searchAllTask-list', (req, res) => {
	var sql = $sql.task.selectAll;
	conn.query(sql, [], function(err, result) {
		if (err) {
			console.log(err);
		}
        var resultDatas = [];
		if (result) {
            for (var i = 0; i < result.length;  i++){
                var resultData = {};
                resultData.fields = result[i];
                 resultData.model = "task.taskdetail";
                 resultData.pk = 5;
                 resultDatas.push(resultData);
            }
            res.json(resultDatas);
			// res.json({fields:result, model:"task.taskdetail", pk:4});
		}
	})
});

module.exports = router;