var express = require('express');
var router = express.Router();


/* GET home page. */
//权限管理
router.all('*', function(req, res, next) {
	if(!req.session.isLogin){
		res.redirect('/sign/login');
		return;
	}
	next()
});
router.get('/', function(req, res, next) {
	if(!req.session.isLogin){
		res.redirect('/');
	}
	res.render('tpl/user/index', {
		title: '用户中心',
		routerName: 'user'
	});
});
router.get('/modifyPassword', function(req, res, next) {
	if(!req.session.isLogin){
		res.redirect('/');
	}
	res.render('tpl/user/modifyPassword', {
		title: '修改密码',
		routerName: 'modifyPassword'
	});
});


module.exports = router;