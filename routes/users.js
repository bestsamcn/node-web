var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('tpl/login',{title:'登录'});
});

router.get('/admin', function(req, res, next) {
  res.send('admin');
});
module.exports = router;
