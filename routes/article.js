var express = require('express');
var router = express.Router();
var requestify = require('requestify');
var globalConfig = require('../config/index');
var template = require('art-template');
template.config('escape',false);
var keywordFilter = require('../keywordFilter/lib/index');


router.get('/',function(req,res){
	res.render('tpl/article/index',{
		routerName:'article',
		title:'文章'
	});
});
router.get('/articleDetail/:id', function(req, res){
	if(!req.params.id || req.params.id.length !== 24){
		res.sendStatus(404);
		res.end();
		return;
	}
	requestify.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/article/getArticleDetail',{
		method:'GET',
		dataType:'json',
		params:{id:req.params.id}
	}).then(function(mres){
		var body = JSON.parse(mres.body);
		res.render('tpl/article/articleDetail', {
			title: '文章详情',
			routerName: 'article',
			article:body.data
		},function(rerr,rhtml){
		    if(rerr){
		        res.sendStatus(500);
		        return;
		    }
		    var filterHtml = keywordFilter.hasKeyword(rhtml) ? keywordFilter.replaceKeyword(rhtml,'*') : rhtml;
		    res.send(filterHtml)
		});
	}).fail(function(err){
		res.sendStatus(err.code);
		res.end();
	});
});

module.exports = router;