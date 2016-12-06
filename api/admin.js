var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var $$ = require('../utilTools');
var UserModel = require('../mongo/schema/User').UserModel;


//会员列表
router.get('/getMemberList',function(req,res,next){
	if(req.query.auth !== 'admin' && (!req.session.isLogin || req.session.user.userType < 1)){
		res.sendStatus(404);
		res.end();
		return;
	}
	var _page = parseInt(req.query.page)-1 || 0;
	var _pageSize = parseInt(req.query.pageSize) || 10;
	var _total = 0;
	UserModel.find({}).skip(_page*_pageSize).limit(_pageSize).sort({_id:-1}).exec(function(err,data){
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
			res.json({retCode:0, msg:'查询成功', data:data, page:_page+1, pageSize:_pageSize, total:_total});
			res.end()
		})
		
	})
	
})

module.exports = router;