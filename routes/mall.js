var express = require('express');
var router = express.Router();

//商城
router.get('/', function(req, res) {
	res.render('tpl/mall/index', {
		routerName: 'mall',
		title: '商城'
	});
});


module.exports = router;