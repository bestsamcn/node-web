var userModel = require('../mongo/schema/User')
var _getMe = function(app){
	console.log('asdfasdfadsf')
	app.use(function(req,res,next){
		if (req.session.isLogin) {
	        var UserModel = require('./mongo/schema/User').UserModel;
	        UserModel.findOne({ _id: req.session.user._id }, function(e, d) {
	            if (d) {
	                req.session.user = d;
	            }
	        })
	    }
	    next()
	})
}
exports.getMe = _getMe;