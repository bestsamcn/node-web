var express = require('express');
var router = express.Router();
var keywordFilter = require('../keywordFilter/lib/index');

//商城
router.get('/', function(req, res) {
	res.render('tpl/mall/index', {
		routerName: 'mall',
		title: '商城'
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