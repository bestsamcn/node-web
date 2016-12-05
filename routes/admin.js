var express = require('express');
var router = express.Router();

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
router.get('/memberList/:page', function(req, res, next) {
	res.render('tpl/memberList', {
		title: '会员列表',
		routerName: 'memberList'
	});
});
router.get('/memberDetail/:id', function(req, res, next) {
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