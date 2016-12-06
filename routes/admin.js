var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../config');

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
	res.render('tpl/admin', {
		title: '管理后台',
		routerName: 'admin'
	});
});
router.get('/memberList', function(req, res, next) {
	// var opts = {
	// 	host: '10.28.5.197', 
	// 	port: '3000', 
	// 	path: '/api/admin/getMemberList', 
	// 	method: 'GET' 
	// }
	// var memberListRequest = http.request(opts,function(mres){
	// 	console.log('STATUS: ' + mres.statusCode); 
	// 	console.log('HEADERS: ' + JSON.stringify(mres.headers)); 
	// 	mres.setEncoding('utf8');
	// 	var resData = '';
	// 	mres.on('data',function(data){
	// 		resData+=data;
	// 	})
	// 	mres.on('error',function(error){
	// 		console.log(error.message)
	// 	})
	// 	mres.on('end',function(){
	// 		var resData = JSON.parse(resData);
	// 		console.log(resData)
	// 		res.render('tpl/memberList', {
	// 			title: '会员列表',
	// 			routerName: 'memberList'
	// 		});
	// 	})
	// })
	// memberListRequest.end()
	res.render('tpl/memberList', {
		title: '会员列表',
		routerName: 'memberList'
	});

	
});
router.get('/memberList/memberDetail/:id', function(req, res, next) {
	res.render('tpl/memberDetail', {
		title: '会员详情',
		routerName: 'memberDetail'
	});
});
router.get('/adminList', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/adminList', {
		title: '管理员列表',
		routerName: 'adminList'
	});
});



module.exports = router;