
var express = require('express');
var router = express.Router();

//mongoose
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	name:{
		type:String,
		require:true
	},
	password:{
		type:String,
		require:true
	}
});

var userModel = mongoose.model('User',userSchema);

router.post('/login',function(req,res){
	var uname = req.body.name;
	var upswd = req.body.password;
	userModel.findOne({name:uname},function(e,d){
		console.log(d)
		if(e){
			res.send(500);
			res.end();
			return
		}
		if(!d){
			res.json({retCode:1,msg:'用户名不存在',data:null});
			res.end();
			return
		}
		if(upswd !== d.password){
			res.json({retCode:2,msg:'密码错误',data:null});
			res.end();
			return
		}
		res.json({retCode:0,msg:'登录成功',data:null});
		res.end();
	});
})
module.exports = router