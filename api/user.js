
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

//mongoose
var UserModel = require('../mongo/schema/User').UserModel;


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
			console.log(ee,dd,'更新登录信息')
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
	res.clearCookie('nsesionid');
	// res.json({retCode:0,msg:'退出成功',data:null});
	res.redirect('/');
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

	var UserEntity = new UserModel({
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
    	UserEntity.save(function(e){
    		console.log(e)
			if(e){
				res.send(e.status);
				res.end();
				return
			}
			res.json({retCode:0,msg:'注册成功',data:null});
			res.end();
		});
    })
	
})

//更新用户信息
router.post('/update',function(req,res,next){

	if(!req.session.isLogin){
		res.send(404);
		res.end();
		return;
	}

	var urealName = req.body.realName || req.session.user.realName;
	var umobile = req.body.mobile || req.session.user.mobile;
	var uemail = req.body.email || req.session.user.email;
	var ugender = parseInt(req.body.gender) || req.session.user.gender;
    console.log(ugender,'用户信息')

	if(urealName !== ''){
		if(urealName.length < 2){
			res.json({retCode:100005,msg:'用户名不能少于2位',data:null});
    		res.end();
    		return;
		}
	}
	if(umobile !== ''){
		if(!/^1[3-9]{1}[0-9]{9}$/.test(umobile)){
			res.json({retCode:100006,msg:'手机号码格式错误',data:null});
    		res.end();
    		return;
		}
	}

	if(uemail !== ''){
		//645298225@qq.com
		if(!/^\w+@\w+\.\w+$/g.test(uemail)){
			res.json({retCode:100007,msg:'邮箱格式不正确',data:null});
    		res.end();
    		return;
		}
	}
	UserModel.update({
		_id:req.session.user._id
	},{
		realName:urealName,
		mobile:umobile,
		email:uemail,
		gender:ugender
	},function(e,d){
		console.log(e,d,'更新登录信息')
		//d{ok:boolean,nMoidify:number,n:number}
		if(e){
			res.send(500);
			res.end();
			return;
		}
		if(d){
			console.log(d);
			res.json({retCode:0,msg:'更新成功',data:null});
    		res.end();
    		return;
		}else{
			res.json({retCode:100013,msg:'无登录信息',data:null});
    		res.end();
    		return;
		}
	})
});

//修改密码
router.post('/modifyPassword',function(req,res,next){
	if(!req.session.isLogin){
		res.send(404);
		res.end();
		return;
	}

	var opswd = req.body.opassword,
		npswd = req.body.npassword,
		rpswd = req.body.repassword;
	var md5 = crypto.createHash('md5');
	
	if(opswd.length < 6){
		res.json({retCode:100008,msg:'密码长度不能少于6位',data:null});
    	res.end();
		return;
	}
	if(npswd.length < 6){
		res.json({retCode:100009,msg:'密码长度不能少于6位',data:null});
    	res.end();
		return;
	}
	if(rpswd !== npswd){
		res.json({retCode:100011,msg:'新密码两次输入不一致',data:null});
    	res.end();
		return;
	}
	npswd = md5.update(npswd).digest('hex');
	if(npswd === req.session.user.password){
		res.json({retCode:100010,msg:'新旧密码不能相同',data:null});
    	res.end();
		return;
	}
	
	UserModel.findOne({_id:req.session.user._id},function(e,d){
		if(e){
			res.send(500);
			res.end();
			return;
		}
		console.log(d)
		if(d){
			UserModel.update({_id:req.session.user._id},{password:npswd},function(re,rd){
				if(re){
					res.send(500);
					res.end();
					return;
				}
				if(!!rd.ok){
					res.json({retCode:0,msg:'修改成功',data:null});
		    		res.end();
		    		return;
				}else{
					res.json({retCode:100012,msg:'修改失败',data:null});
		    		res.end();
		    		return;
				}
			})
		}else{
			res.json({retCode:100013,msg:'无登录信息',data:null});
    		res.end();
    		return;
		}
	})
})

module.exports = router