/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-12 22:47:27
 * @version $Id$
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(res.locals.session,'用户状态')
	res.render('tpl/about', {
		title: '关于我们',
		routerName: 'about'
	});
});

module.exports = router;