var express = require('express');
var router = express.Router();
var xss = require('xss');
var isIncludeSensitive = require('./index').isIncludeSensitive;
var MessageModel = require('../mongo/schema/Message').MessageModel;
//关联查询
// MessageModel.findOne({realName:'sam'}).populate('member').exec(function(e,d){
// 	console.log(d)
// })

//留言
router.post('/post',function(req,res,next){
	var upostName = req.body.postName,
		upostEmail = req.body.postEmail,
		upostContent = req.body.postContent,
		u_id = null;

	//敏感字符拦截
	if(isIncludeSensitive(upostName,upostContent)){
		res.json({retCode:100027,msg:'不能包含敏感字符',data:null});
		res.end();
		return;
	}

	if(req.session.isLogin && req.session.user.userType === 0){
		u_id = req.session.user._id;
	}
	if(!upostName || upostName.length < 2){
		res.json({retCode:100014,msg:'姓名不能少于2位',data:null});
		res.end();
		return;
	}

	//645298225@qq.com
	if(!/^\w+@\w+\.\w+$/g.test(upostEmail)){
		res.json({retCode:100015,msg:'邮箱格式错误',data:null});
		res.end();
		return;
	}

	var MessageEntity = new MessageModel({
		realName:upostName,
		email:upostEmail,
		content:xss(upostContent),
		createTime:new Date().getTime(),
		isMember:!!u_id,
		member:u_id
	});

	MessageEntity.save(function(serr,sdoc){
		if(!serr){
			if(sdoc){
				res.json({retCode:0,msg:'留言成功',data:null});
				res.end();
				return;
			}
			res.send(500);
			return;
		}
		res.send(500);
		return;
	});
});


module.exports = router