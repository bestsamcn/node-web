var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session.isLogin){
		res.redirect('/');
	}
	res.render('tpl/user', {
		title: '用户中心',
		routerName: 'user',
		loginInfo: req.session
	});
});
router.get('/modifyPassword', function(req, res, next) {
	if(!req.session.isLogin){
		res.redirect('/');
	}
	res.render('tpl/modifyPassword', {
		title: '修改密码',
		routerName: 'modifyPassword',
		loginInfo: req.session
	});
});


module.exports = router;