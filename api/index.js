
var UserModel = require('../mongo/schema/User').UserModel;

//更新个人信息
var _globalConfig = require('../config');
var _getMe = function(app){
	app.use(function(req,res,next){
		app.locals.globalConfig = _globalConfig;
		if (req.session.isLogin) {
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
	});
}

//获取所有管理员id中间件
var _getAllAdmins = function(req,res,next){
    UserModel.find({ userType: {$in:[1,2]}}, function(ferr, fcol) {
    	req.session.adminIdList = [];
        if (ferr) {
            return next()
        }
        for(var i =0 ; i< fcol.length; i++){
        	req.session.adminIdList.push(fcol[i]._id.toString())
        }
        req.session.save();
        next();
    });
};

//登录拦截器
var _loginInterceptor = function(req,res,next){
	if(!req.session.isLogin){
		res.send(404);
		res.end();
		return;
	}
	next();
}

exports.getMe = _getMe;
exports.getAllAdmins = _getAllAdmins;
exports.loginInterceptor = _loginInterceptor;

//初始化会员列表
