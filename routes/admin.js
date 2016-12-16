var express = require('express');
var router = express.Router();
var http = require('http');
var config = require('../config');
var requestify = require('requestify');
var getAllAdmins = require('../api/index').getAllAdmins;
var $$ = require('../utilTools');

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
	next();
});
router.get('/', function(req, res) {
	requestify.request('http://'+globalConfig.host+'/api/admin/getWebPreview',{
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

//会员列表
router.get('/memberList', function(req, res) {
	res.render('tpl/admin/memberList', {
		title: '会员列表',
		routerName: 'memberList'
	});
	
});

//添加会员
router.get('/addUser',function(req,res){
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
router.get('/memberList/memberDetail/:id', getAllAdmins, function(req, res) {
	console.log(req.session.adminIdList,'管理员id列表');
	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	//判断id是否是用户自己赋值到地址栏，并且id隶属管理员，但是不是该管理员的id，这是不允许的。但是超级管理员除外
	if(req.session.user.userType !== 2 && $$.inArray(req.params.id ,req.session.adminIdList) && req.session.user._id != req.params.id){
		res.sendStatus(401);
		res.end();
		return;
	}
	
	requestify.request('http://'+globalConfig.host+'/api/admin/getUserDetail',{
		method:'GET',
		headers:{
			authSecret:globalConfig.authSecret,
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
router.get('/adminList', function(req, res) {
	res.render('tpl/admin/adminList', {
		title: '管理员列表',
		routerName: 'adminList'
	});
});

//留言列表
router.get('/messageList', function(req, res) {
	res.render('tpl/admin/messageList', {
		title: '留言列表',
		routerName: 'messageList'
	});
});

//留言详情
router.get('/messageList/messageDetail/:id', function(req, res) {

	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	requestify.request('http://'+globalConfig.host+'/api/admin/getMessageDetail',{
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
router.get('/loginLogsList',function(req,res){
	if(!req.session.isLogin || req.session.user.userType !== 2){
		res.sendStatus(401);
		res.end();
		return;
	}
	res.render('tpl/admin/loginLogsList', {
		title: '留言详情',
		routerName: 'loginLogsList'
	});
});

//敏感词汇
router.get('/sensitiveList',function(req,res){
	res.render('tpl/admin/sensitiveList', {
		title: '敏感词汇',
		routerName: 'sensitiveList'
	});
});
//敏感词汇
router.get('/addSensitive',function(req,res){
	res.render('tpl/admin/addSensitive', {
		title: '添加敏感词汇',
		routerName: 'addSensitive'
	});
});
//敏感词汇详情
router.get('/sensitive/sensitiveDetail/:id',function(req,res){
	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	requestify.request('http://'+globalConfig.host+'/api/sensitive/getSensitiveDetail',{
		method:'GET',
		headers:{
			authSecret:globalConfig.authSecret,
		},
		params:{
			id:req.params.id
		},
		dataType:'json'
	}).then(function(mres){
		console.log(mres)
		var body = JSON.parse(mres.body);
		res.render('tpl/admin/sensitiveDetail', {
			title: '敏感词汇详情',
			routerName: 'sensitiveDetail',
			sensitiveDetail:body.data
		});
	}).fail(function(err){
		res.sendStatus(err.code);
		res.end();
	});
});

//敏感词汇
router.get('/accessLogsList',function(req,res){
	res.render('tpl/admin/accessLogsList', {
		title: '访问日志',
		routerName: 'accessLogsList'
	});
});

module.exports = router;