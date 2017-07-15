var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res,next) {
  res.render('index', { title: 'uinnova1' });    
});

/* GET login page. */
// router.route("/login").get(function(req,res){    
// 	res.render("login",{title:'User Login'});
// });
//test
router.get("/test",function(req,res){ 
	res.render("test",{title:'test'});         
});
router.get("/testLoad",function(req,res){ 
	res.render("test/testLoad",{title:'testLoad'});         
});


router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render("login",{title:'User Login'});
})

router.get("/register",function(req,res){ 
	res.render("register",{title:'register'});         
});

router.get("/map",function(req,res){ 
	res.render("tile_index",{title:'map'});         
});
router.get("/task",function(req,res){ 
	res.render("task_index",{title:'task'});         
});
router.get("/userManager",function(req,res){ 
	res.render("user_index",{title:'user'});         
});
/* GET logout page. */
router.get("/logout",function(req,res){   
	req.session.user = null;
	req.session.error = null;
	res.redirect("/");
});

module.exports = router;
