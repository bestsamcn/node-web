require('../connect');
var mongoose =  require('mongoose');

//用户信息
var SensitiveSchema = new mongoose.Schema({
	keywords:{
		type:String,
		require:true
	},
	setTime:{
		type:Number,
		require:true,
		default:Date.now
	},
	admin:{
		type:mongoose.Schema.ObjectId,
		require:true,
		ref:'User'
	}
});

exports.SensitiveSchema = SensitiveSchema;
exports.SensitiveModel = mongoose.model('Sensitive',SensitiveSchema);

