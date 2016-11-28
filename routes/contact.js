/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-16 17:04:56
 * @version $Id$
 */

var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
	res.render('tpl/contact',{title:'联系',routerName:'contact'})
});
module.exports = router;

