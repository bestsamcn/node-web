require('../connect');
var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = require('./User').UserSchema;

var LoginLogSchema = new Schema({
	userId:{
		type:Schema.ObjectId,
		ref:'User',
		require:true
	},
	loginTime:{
		type:Number,
		require:true
	},
	logoutTime:{
		type:Number,
		require:true
	},
	logIp:{
		type:String,
		require:true
	}
});
exports.LoginLogSchema = LoginLogSchema;
exports.LoginLogModel = mongoose.model('LoginLog',LoginLogSchema);