/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-12 22:47:27
 * @version $Id$
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tpl/about',{title:'关于'});
});
router.get('/team', function(req, res, next) {
  res.render('tpl/about',{title:'团队'});
});
router.get('/pictures', function(req, res, next) {
  res.render('tpl/pictures',{title:'图s片'});
});
router.get('/products', function(req, res, next) {
  res.render('tpl/products',{title:'产品'});
});

module.exports = router;

