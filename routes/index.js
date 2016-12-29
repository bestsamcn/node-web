var express = require('express');
var router = express.Router();
var config = require('../config');
var keywordFilter = require('../keywordFilter/lib/index');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: '首页',
		routerName: 'index'
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