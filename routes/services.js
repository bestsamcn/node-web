var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/services', {
		title: '服务',
		routerName: 'services'
	});
});


module.exports = router;