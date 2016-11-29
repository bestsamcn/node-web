require('../connect');
var mongoose =  require('mongoose');

//用户信息
var UserSchema = new mongoose.Schema({
	name:{
		type:String,
		require:true,
		unique:true
	},
	password:{
		type:String,
		require:true
	},
	createTime:{
		type:Date,
		require:true
	},
	lastLoginTime:{
		type:Date,
		require:false
	},
	userType:{
		type:Number,
		require:true,
		default:0
	}
});

exports.UserModel = mongoose.model('User',UserSchema)

