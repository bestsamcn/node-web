var express = require('express');
var router = express.Router();

var keywordFilter = require('../keywordFilter/lib/index');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session)
	res.render('tpl/contact', {
		title: '联系我们',
		routerName: 'contact'
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