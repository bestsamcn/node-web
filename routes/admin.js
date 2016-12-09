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
	requestify.request('http://'+globalConfig.host+':3000/api/admin/getWebPreview',{
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

	res.render('tpl/admin/memberList', {
		title: '会员列表',
		routerName: 'memberList'
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
	requestify.request('http://'+globalConfig.host+':3000/api/admin/getUserDetail',{
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

//留言列表
router.get('/messageList', function(req, res, next) {
	res.render('tpl/admin/messageList', {
		title: '留言列表',
		routerName: 'messageList'
	});
});

//留言详情
router.get('/messageList/messageDetail/:id', function(req, res, next) {
	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	requestify.request('http://'+globalConfig.host+':3000/api/admin/getMessageDetail',{
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
		res.render('tpl/admin/messageDetail', {
			title: '留言详情',
			routerName: 'messageDetail',
			messageDetail:body.data
		});
	}).fail(function(err){
		res.sendStatus(err.code);
		res.end();
	});
});

//全部的登录日志
router.get('/loginLogsList',function(req,res,next){
	if(!req.session.isLogin || req.session.user.userType !== 2){
		res.sendStatus(401);
		res.end();
		return;
	}
	res.render('tpl/admin/loginLogsList', {
		title: '留言详情',
		routerName: 'loginLogsList'
	});
})

module.exports = router;