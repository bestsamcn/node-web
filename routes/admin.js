var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../config');
var requestify = require('requestify');

/* GET home page. */
//权限管理
router.all('*', function(req, res, next) {
	if(!req.session.isLogin || req.session.user.userType<1){
		res.send(404);
		return;
	}
	next()
});
router.get('/', function(req, res, next) {
	res.render('tpl/admin/index', {
		title: '管理后台',
		routerName: 'admin'
	});
});

router.get('/memberList', function(req, res, next) {
	// cosole.log(res.locals)
	requestify.get('http://127.0.0.1:3000/api/admin/getMemberList?auth=admin').then(function(response) {
	    // Get the response body
	    if(response.code !== 200){
	    	res.sendStatus(500);
	    	res.end();
	    	return;
	    }
	    var body = JSON.parse(response.body)
	    console.log(body.length,'刷刷的发生率打开')
	    res.render('tpl/admin/memberList', {
			title: '会员列表',
			routerName: 'memberList',
			memberList: body.data
		});
	    

	},function(err){
		res.sendStatus(500);
    	res.end();
    	return;
	});
	

	
	
});
router.get('/memberList/memberDetail/:id', function(req, res, next) {
	res.render('tpl/admin/memberDetail', {
		title: '会员详情',
		routerName: 'memberDetail'
	});
});
router.get('/adminList', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/admin/adminList', {
		title: '管理员列表',
		routerName: 'adminList'
	});
});



module.exports = router;