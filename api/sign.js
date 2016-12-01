
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//mongoose
var UserModel = require('../mongo/schema/User').UserModel;


//登录
router.post('/login',function(req,res){
	console.log(req.body)
	var uname = req.body.name;
	var upswd = req.body.password;
	var md5 = crypto.createHash('md5');
	upswd = md5.update(upswd).digest('hex');
	UserModel.findOne({name:uname},function(e,d){
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
		var uLastLoginTime = new Date().getTime();
		UserModel.update({name:uname},{lastLoginTime:uLastLoginTime},function(e,d){
			console.log(e,d)
		})
		req.session.user = d;
		req.session.isLogin = true;
		res.json({retCode:0,msg:'登录成功',data:null});
		res.end();
	});
});
//退出登录
router.get('/logout',function(req,res){
	req.session.user = null;
	req.session.isLogin = false;
	res.clearCookie('connect.sid');
	res.json({retCode:0,msg:'退出成功',data:null});
});

//注册
router.post('/register',function(req,res){
	var uname = req.body.name;
	var upswd = req.body.password;
	var createTime = new Date().getTime();

	var md5 = crypto.createHash('md5');
	upswd = md5.update(upswd).digest('hex');

	var User = new UserModel({
		name:uname,
		password:upswd,
		createTime:createTime
	});

    UserModel.findOne({name:uname},function(e,d){
    	if(d){
    		res.json({retCode:4,msg:'用户名已经存在',data:null});
    		res.end();
    		return;
    	}
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
	
})

module.exports = router