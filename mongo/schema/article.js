require('../connect');
var mongoose =  require('mongoose'),
    Schema = mongoose.Schema;
//文章ID，作者，上传时间，末次修改时间，文章标题 ，文章内容（用fckeditor来维护），主题图片名，关键字，浏览次数。 
var ArticleSchema = new Schema({
	author:{
		type:Schema.ObjectId,
		ref:'User',
		require:true
	},
	uploadTime:{
		type:Number,
		require:true
	},
	lastEditTime:{
		type:Number,
		require:false
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
		require:true
	}],
	browserTimes:{
		type:Number,
		require:true,
		default:0
	}
});


exports.ArticleSchema = ArticleSchema;