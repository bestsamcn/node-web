//更新个人信息
var _getMe = function(app){
	app.use(function(req,res,next){
		if (req.session.isLogin) {
	        var UserModel = require('../mongo/schema/User').UserModel;
	        UserModel.findOne({ _id: req.session.user._id }, function(e, d) {
	            if (d) {
	                req.session.user = d;
	                req.session.save();
	                return next()
	            }
	        })
	    }else{
	        next()
	    }
	})
}
exports.getMe = _getMe;