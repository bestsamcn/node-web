
var express = require('express');
var router = express.Router();

//mongoose
var UserModel = require('../mongo/schema/User').UserModel;


//登录
router.post('/login',function(req,res){
	var uname = req.body.name;
	var upswd = req.body.password;
	UserModel.findOne({name:uname},function(e,d){
		console.log(d)
		if(e){
			res.send(500);
			res.end();
			return
		}
		if(!d){
			res.json({retCode:1,msg:'用户名不存在',data:null});
			res.end();
			return
		}
		if(upswd !== d.password){
			res.json({retCode:2,msg:'密码错误',data:null});
			res.end();
			return
		}
		res.json({retCode:0,msg:'登录成功',data:null});
		res.end();
	});
});

//注册
router.post('/register',function(req,res){
	var uname = req.body.name;
	var upswd = req.body.password;
	var createTime = new Date().getTime();
	var User = new UserModel({
		name:uname,
		password:upswd,
		createTime:createTime
	});
	User.save(function(e){
		if(e){
			res.send(500);
			res.end();
			return
		}
		res.json({retCode:0,msg:'注册成功',data:null});
		res.end();
	});
})
module.exports = router