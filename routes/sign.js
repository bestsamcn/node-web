var express = require('express');
var router = express.Router();
var keywordFilter = require('../keywordFilter/lib/index');

/* GET users listing. */
router.get('/login', function(req, res, next) {
    if(req.session.user){
    	res.redirect('/');
    	return;
    }
	res.render('tpl/user/login', {
		title: '登录',
		routerName: 'login'
	},function(rerr,rhtml){
	    if(rerr){
	        res.sendStatus(500);
	        return;
	    }
	    var filterHtml = keywordFilter.hasKeyword(rhtml) ? keywordFilter.replaceKeyword(rhtml,'*') : rhtml;
	    res.send(filterHtml)
	});
});

router.get('/register', function(req, res, next) {
	res.render('tpl/user/register', {
		title: '注册',
		routerName: 'register'
	},function(rerr,rhtml){
	    if(rerr){
	        res.sendStatus(500);
	        return;
	    }
	    var filterHtml = keywordFilter.hasKeyword(rhtml) ? keywordFilter.replaceKeyword(rhtml,'*') : rhtml;
	    res.send(filterHtml)
	});
});
module.exports = router;