var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../config');
var requestify = require('requestify');
var UserModel = require('../mongo/schema/User').UserModel;
//请求密钥
var globalConfig =require('../config');


/* GET home page. */
//权限管理
router.all('*', function(req, res, next) {
	if(!req.session.isLogin || req.session.user.userType<1){
		res.send(401);
		return;
	}
	next()
});
router.get('/', function(req, res, next) {
	requestify.request('http://10.28.5.197:3000/api/admin/getWebPreview',{
		method:'GET',
		headers:{
			authSecret:globalConfig.authSecret
		},
		dataType:'json'
	}).then(function(mres){
		var body = JSON.parse(mres.body);
		res.render('tpl/admin/index', {
			title: '管理后台',
			routerName: 'admin',
			webPreview:body.data
		});
	}).fail(function(err){
		res.sendStatus(err.code);
		res.end();
	});
	
});

router.get('/memberList', function(req, res, next) {
	// cosole.log(res.locals)
	requestify.get('http://10.28.5.197:3000/api/admin/getMemberList?auth=admin').then(function(response) {
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

//添加会员
router.get('/addUser',function(req,res,next){
	res.render('tpl/admin/addUser',{
		title:'添加会员',
		routerName:'addUser'
	});
});

//添加管理员
router.get('/addAdmin',function(req,res,next){
	res.render('tpl/admin/addAdmin',{
		title:'添加管理员',
		routerName:'addAdmin'
	});
})


//会员详情
router.get('/memberList/memberDetail/:id', function(req, res, next) {

	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	requestify.request('http://10.28.5.197:3000/api/admin/getUserDetail',{
		method:'GET',
		headers:{
			authSecret:globalConfig.authSecret
		},
		params:{
			id:req.params.id
		},
		dataType:'json'
	}).then(function(mres){
		var body = JSON.parse(mres.body);
		console.log(body,'返回sadfsadfsadf');

		res.render('tpl/admin/memberDetail', {
			title: '会员详情',
			routerName: 'memberDetail',
			memberDetail:body.data
		});
	}).fail(function(err){
		res.sendStatus(err.code);
		res.end();
	});
	
});

//管理员列表
router.get('/adminList', function(req, res, next) {
	res.render('tpl/admin/adminList', {
		title: '管理员列表',
		routerName: 'adminList'
	});
});



module.exports = router;