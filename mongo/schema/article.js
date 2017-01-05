require('../connect');
var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	author:{
		type:Schema.ObjectId,
		ref:'User',
		require:true
	},
	isHot:{
		type:Number,
		require:false,
		default:1
	},
	deliverTime:{
		type:Number,
		require:true
	},
	lastEditTime:{
		type:Number,
		require:false
	},
	category:{
		type:Number,
		require:true,
		default:1
	},
	title:{
		type:String,
		require:true
	},
	content:{
		type:String,
		require:true
	},
	thumbnail:{
		type:String,
		require:false
	},
	keywords:[{
		type:String,
		require:false
	}],
	visitTimes:{
		type:Number,
		require:false,
		default:0
	},
    comeFrom:{
    	type:String,
    	require:false,
    	default:'swyc.com'
    }
});


exports.ArticleSchema = ArticleSchema;
exports.ArticleModel = mongoose.model('Article',ArticleSchema);