//更新个人信息
var _getMe = function(app){
	app.use(function(req,res,next){
		if (req.session.isLogin) {
	        var UserModel = require('../mongo/schema/User').UserModel;
	        UserModel.findOne({ _id: req.session.user._id }, function(e, d) {
	            if (d) {
	                req.session.user = d;
	                req.session.save();
	                res.locals.session = req.session;
	                return next()
	            }
	        })
	    }else{
	    	//如果用户没登录，需要预留session作为判断，否则res.locals.session = undefined
	    	res.locals.session = req.session;
	        next()
	    }
	})
}

exports.getMe = _getMe;