var express = require('express');
var router = express.Router();



router.get('/',function(req,res){
	res.render('tpl/article/index',{
		routerName:'article',
		title:'文章'
	})
});


module.exports = router;