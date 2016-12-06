var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/login', function(req, res, next) {
    if(req.session.user){
    	res.redirect('/');
    	return;
    }
	res.render('tpl/user/login', {
		title: '登录',
		routerName: 'login'
	});
});

router.get('/register', function(req, res, next) {
	res.render('tpl/user/register', {
		title: '注册',
		routerName: 'register'
	});
});
module.exports = router;