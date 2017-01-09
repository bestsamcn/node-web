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
	lastEdit:{
		time:{
			type:Number,
			require:false
		},
		editer:{
			type:Schema.ObjectId,
			ref:'User',
			require:false
		}
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
	leadText:{
		type:String,
		require:true
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
    	name:{
    		type:String,
	    	require:true,
	    	default:'三万英尺传媒'
    	},
    	link:{
    		type:String,
	    	require:true,
	    	default:'http://www.swyc.com'
    	}
    }
});


exports.ArticleSchema = ArticleSchema;
exports.ArticleModel = mongoose.model('Article',ArticleSchema);