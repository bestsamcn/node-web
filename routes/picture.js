var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/picture', {
		title: '图片',
		routerName: 'picture'
	});
});


module.exports = router;