require('../connect');
var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = require('./User').UserSchema;

var MessageSchema = new mongoose.Schema({
	realName:{
		type:String,
		require:true
	},
	email:{
		type:String,
		require:true
	},
	createTime:{
		type:Number,
		require:true
	},
	content:{
		type:String,
		require:true
	},
	isRead:{
		type:Boolean,
		require:true,
		default:false
	},
	readTime:{
		type:Number,
		require:false
	},
	readBody:{
		type:Schema.ObjectId,
		ref:'User',
		require:false,
		default:null
	},
	isMember:{
		type:Boolean,
		require:true,
		default:false,
	},
	member:{
		type:Schema.ObjectId,
		ref:'User',
		require:false,
		default:null
	}
})
exports.MessageSchema = MessageSchema;
exports.MessageModel = mongoose.model('Message',MessageSchema);
