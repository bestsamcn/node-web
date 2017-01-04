var express = require('express');
var router = express.Router();
var xss = require('xss');
var ArticleModel = require('../mongo/schema/Article').ArticleModel;
console.log(ArticleModel)
var allowAdminOnly = require('./index').allowAdminOnly;

router.post('/addArticle', allowAdminOnly, function(req,res){
	var _category = req.body.category,
		_isHot = req.body.isHot,
		_title = req.body.title,
		_content = req.body.content;
	console.log(req.body)
	if(!_content){
		res.json({ retCode:100030, msg:'文章内容不能为空', data:null });
		res.end();
		return;
	}
	ArticleModel.create({
		author:req.session.user._id,
		deliverTime:Date.now(),
		isHot:parseInt(_isHot),
		category:parseInt(_category),
		title:_title,
		content:xss(_content)
	},function(cerr,cdoc){

		if(cerr){
			res.sendStatus(500);
			res.end();
			return;
		}
		res.json({ retCode:0, msg:'文章发布成功', data:null });
		res.end();
		return;
	});

});


module.exports = router;