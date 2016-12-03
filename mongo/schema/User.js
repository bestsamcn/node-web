require('../connect');
var mongoose =  require('mongoose');

//用户信息
var UserSchema = new mongoose.Schema({
	account:{
		type:String,
		require:true,
		unique:true
	},
	password:{
		type:String,
		require:true
	},
	realName:{
		type:String,
		require:false,
		default:''
	},
	mobile:{
		type:String,
		require:false,
		default:'',
	},
	email:{
		type:String,
		require:false,
		default:'',
	},
	gender:{
		type:Number,
		require:true,
		default:1,
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
	},
	lastUpdateTime:{
		type:Date,
		require:false
	}
});

exports.UserModel = mongoose.model('User',UserSchema)

