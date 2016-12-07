var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var $$ = require('../utilTools');
var UserModel = require('../mongo/schema/User').UserModel;
var globalConfig =require('../config');


//会员列表
router.get('/getMemberList',function(req,res,next){
	if(req.query.auth !== 'admin' && (!req.session.isLogin || req.session.user.userType < 1)){
		res.sendStatus(404);
		res.end();
		return;
	}
	var _pageIndex = parseInt(req.query.pageIndex)-1 || 0;
	var _pageSize = parseInt(req.query.pageSize) || 10;
	var _total = 0;
	UserModel.find({}).skip(_pageIndex*_pageSize).limit(_pageSize).sort({_id:-1}).exec(function(err,data){
		if(err){
			res.sendStatus(500);
			res.end();
			return;
		}
		UserModel.find(function(rerr,rdata){
			if(rerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			_total = rdata.length || 0;
			res.json({retCode:0, msg:'查询成功', data:data, pageIndex:_pageIndex+1, pageSize:_pageSize, total:_total});
			res.end()
		});
	});
});

//添加会员
router.post('/addUser',function(req,res){
	if(!req.session.isLogin && req.session.user.userType<1){
		res.sendStatus(401);
		res.end();
		return;
	}
	var uaccount = req.body.account;
	var upswd = req.body.password;
	var uuserType = parseInt(req.body.userType) || 0;
	if(uuserType >1){
		res.json({retCode:401,msg:'你的权限不足',data:null});
		res.end();
		return
	}
	// var uip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
	var uip = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0];
	
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

	var createTime = new Date().getTime();
	var md5 = crypto.createHash('md5');
	upswd = md5.update(upswd).digest('hex');

	var UserEntity = new UserModel({
		account:uaccount,
		password:upswd,
		userType:uuserType,
		createLog:{
			createTime:Date.now(),
			createIp:uip
		}
	});
	// $$.getIpInfo(uip,function(err,info){})

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
    });
});

//获取用户信息
router.get('/getUserDetail',function(req,res,next){
	//如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
	if((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType>0)){
		var user_id = req.query.id;
		if(!user_id){
			res.sendStatus(404);
			res.end();
			return;
		}
		UserModel.findById(user_id,function(err,doc){
			if(err){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({retCode:0,msg:'查询成功',data:doc});
			res.end();
		})
	}else{
		res.sendStatus(401);
		res.end();
		return;
	}
});

//删除用户
router.delete('/delUser',function(req,res,next){
	//如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
	if((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType>0)){
		var user_id = req.query.id;
		if(!user_id){
			res.sendStatus(404);
			res.end();
			return;
		}
		UserModel.findById(user_id,function(err,doc){
			if(err){
				res.sendStatus(500);
				res.end();
				return;
			}
			//检测是否是管理员
			if(doc.userType > 0){
				res.json({retCode:100016,msg:'管理员不能直接删除',data:null});
				res.end();
				return;
			}
			UserModel.remove({_id:user_id},function(rerr,rdoc){
				if(rerr){
					res.sendStatus(500);
					res.end();
					return;
				}
				res.json({retCode:0,msg:'查询成功',data:doc});
				res.end();
			})
			
		});
	}else{
		res.sendStatus(401);
		res.end();
		return;
	}
});

//修改用户信息
router.post('/updateUser',function(req,res,next){
	if(!req.body.userId){
		res.json({retCode:100017,msg:'非法请求',data:null});
		res.end();
		return;
	}
	if((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType>0)){
		var user_id = req.body.userId;


		UserModel.findById(user_id,function(ferr,fdoc){
			if(ferr){
				res.json({retCode:100020,msg:'无该用户信息',data:null});
	    		res.end();
	    		return;
			}

			var uaccount = req.body.account || fdoc.account;
			var urealName = req.body.realName || fdoc.realName;
			var umobile = req.body.mobile || fdoc.mobile;
			var uemail = req.body.email || fdoc.email;
			var ugender = parseInt(req.body.gender) || fdoc.gender;
			var uuserType = parseInt(req.body.userType) || fdoc.userType;

	   		if(uaccount.length < 2 || uaccount.length > 24){
				res.json({retCode:100002,msg:'用户名格式错误',data:null});
				res.end();
				return;
			}
			console.log(uuserType)
			if(uuserType < 0 || uuserType > 1){
				res.json({retCode:100018,msg:'用户类型设置错误',data:null});
				res.end();
				return;
			}

			if(ugender < 1 || ugender > 2){
				res.json({retCode:100019,msg:'用户性别设置错误',data:null});
				res.end();
				return;
			}


			if(urealName !== ''){
				if(urealName.length < 2){
					res.json({retCode:100005,msg:'姓名不能少于2位',data:null});
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
				_id:user_id
			},{
				account:uaccount,
				realName:urealName,
				mobile:umobile,
				email:uemail,
				gender:ugender,
				userType:uuserType
			},function(uerr,udoc){
				//d{ok:boolean,nMoidify:number,n:number}
				if(uerr){
					res.send(500);
					res.end();
					return;
				}
				if(!udoc.ok){
					res.send(500);
					res.end();
					return;
				}
				res.json({retCode:0,msg:'更新成功',data:null});
	    		res.end();
	    		return;
			});
		});
	}else{
		res.sendStatus(401);
		res.end();
		return;
	}
});

//获取用户登录日志分页
router.get('/getUserLoginList',function(req,res,next){
	if((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType>0)){
		var _pageIndex = parseInt(req.query.pageIndex)-1 || 0;
		var _pageSize = parseInt(req.query.pageSize) || 10;
		var _total = 0;
		
	}else{
		res.sendStatus(401);
		res.end();
		return;
	}
});
module.exports = router;