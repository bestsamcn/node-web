/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-12 22:47:27
 * @version $Id$
 */
var express = require('express');
var router = express.Router();
var keywordFilter = require('../keywordFilter/lib/index');


router.get('/', function(req, res, next) {
	console.log(req.online.length + ' users online');
	res.render('tpl/about', {
		title: '关于我们',
		routerName: 'about'
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