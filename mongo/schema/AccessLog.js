require('../connect');
var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = require('./User').UserSchema;


var AccessLogSchema = new Schema({
	member:{
		type:Schema.ObjectId,
		require:true,
		ref:'User'
	},
	accessTime:{
		type:Number,
		require:true,
		default:Date.now
	},
	accessIp:{
		type:String,
		require:true
	},
	accessUrl:{
		type:String,
		require:true
	}
});

exports.AccessLogSchema = AccessLogSchema;
exports.AccessLogModel = mongoose.model('AccessLog',AccessLogSchema);