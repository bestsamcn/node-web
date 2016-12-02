
var express = require('express');
var router = express.Router()

var captchapng = require('captchapng');

router.get('/get',function(req,res,next){
	
    var code = '0123456789';
    var length = 4;
    var randomcode = '';
    for (var i = 0; i < length; i++) {
        randomcode += code[parseInt(Math.random() * 10)];
    }
    // 保存到session
     console.log(randomcode,'验证码')
    req.session.randomCode= randomcode;

   // 输出图片
    var p = new captchapng(100,36,(randomcode)); // width,height,numeric captcha
    p.color(96, 125, 139, 255);  // First color: background (red, green, blue, alpha)
    p.color(255, 255, 255, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
})
module.exports = router