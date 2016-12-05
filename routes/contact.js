var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/contact', {
		title: '联系我们',
		routerName: 'contact'
	});
});


module.exports = router;