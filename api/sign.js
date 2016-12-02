
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//mongoose
var UserModel = require('../mongo/schema/User').UserModel;

//java connect
var opt = {
    host:'10.28.2.62',
    port:'8080',
    path:'/swycnd/pipes',
}

// var http  = require('http');


//登录
router.post('/login',function(req,res){

	var uaccount = req.body.account;
	var upswd = req.body.password;
	var ucode = req.body.code;

	//检测验证码
	if(ucode !== req.session.randomCode){
		res.json({retCode:100001,msg:'验证码错误',data:null});
		res.end();
		return;
	}

	//数据格式验证
	if(uaccount.length < 2 || uaccount.length > 24){
		res.json({retCode:100002,msg:'用户名格式错误',data:null});
		res.end();
		return;
	}
	if(upswd.length < 6 || upswd.length > 24){
		res.json({retCode:100003,msg:'密码格式错误',data:null});
		res.end();
		return;
	}

	var md5 = crypto.createHash('md5');
	upswd = md5.update(upswd).digest('hex');
	UserModel.findOne({account:uaccount},function(e,d){
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
		UserModel.update({account:uaccount},{lastLoginTime:uLastLoginTime},function(ee,dd){
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
	res.end();
});

//注册
router.post('/register',function(req,res){
	console.log(req.body)
	var uaccount = req.body.account;
	var upswd = req.body.password;
	var ucode = req.body.code;
	var umobile = req.body.mobile;


	//检测验证码
	if(ucode !== req.session.randomCode){
		res.json({retCode:100001,msg:'验证码错误',data:null});
		res.end();
		return;
	}

	//数据格式验证
	if(uaccount.length < 2 || uaccount.length > 24){
		res.json({retCode:100002,msg:'用户名格式错误',data:null});
		res.end();
		return;
	}
	if(upswd.length < 6 || upswd.length > 24){
		res.json({retCode:100003,msg:'密码格式错误',data:null});
		res.end();
		return;
	}

	if(umobile !== ''){
		if(!/^1[3-9]{1}[0-9]{9}$/.test(umobile)){
			res.json({retCode:100004,msg:'手机号码格式错误',data:null});
			res.end();
			return;
		}
	}


	var createTime = new Date().getTime();
	var md5 = crypto.createHash('md5');
	upswd = md5.update(upswd).digest('hex');

	var User = new UserModel({
		account:uaccount,
		password:upswd,
		mobile:umobile,
		createTime:createTime
	});

    UserModel.findOne({account:uaccount},function(e,d){
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