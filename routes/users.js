var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('tpl/login',{title:'登录',routerName:'login'});
});

router.get('/register', function(req, res, next) {
  res.render('tpl/register',{title:'注册',routerName:'register'});
});
module.exports = router;
