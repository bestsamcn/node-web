var express = require('express');
var router = express.Router();
var $$ = require('../utilTools');
var globalConfig = require('../config');
var SensitiveModel = require('../mongo/schema/Sensitive').SensitiveModel;
var UserModel = require('../mongo/schema/User').UserModel;

var fs = require('fs')
var rootPath = process.cwd();





/**
* 全局权限控制
*/
router.all('*',function(req,res,next){
	//如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
	if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
	 	next();
	}else{
		res.sendStatus(401);
        res.end();
        return;
	}
});


/**
* /api/sensitive/addSensitive 添加敏感词汇
* 输入 {keywords:{type:String,require:true}}
* 输出 {retCode,msg,data}
*/
router.post('/addSensitive',function(req,res){
	if(!req.body.keywords || $$.stringTrim(req.body.keywords).length < 1){
		res.json({retCode:100026, msg:'敏感词汇不能为空', data:null});
		res.end();
		return;
	}
    SensitiveModel.findOne({keywords:req.body.keywords},function(ferr,fdoc){
        if(ferr){
            res.sendStatus(500);
            res.end();
            return;
        }

        if(fdoc){
            res.json({retCode:100029, msg:'该词汇已存在' ,data:null});
            return;
        }
        SensitiveModel.create({
            keywords:req.body.keywords,
            admin:req.session.user._id
        },function(cerr,cdoc){
            if(cerr){
                res.sendStatus(500);
                res.end();
                return;
            }
            res.json({retCode:0, msg:'添加敏感词汇成功' ,data:null})
        });
    });
	
});



/**
* 方式 get
* /api/sensitive/getSensitiveList 获取铭感词汇列表
* 输入 {pageIndex:Number || 1, pageSize:Number || 10 }
* 输出 {retCode,msg,data,pageIndex,pageSize,total}
*/
router.get('/getSensitiveList',function(req,res){
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
    var _pageSize = parseInt(req.query.pageSize) || 10;
    var _total = 0;
    SensitiveModel.find().populate('admin').skip(_pageIndex * _pageSize).limit(_pageSize).sort({
        setTime: -1
    }).exec(function(err, data) {
        if (err) {
            res.sendStatus(500);
            res.end();
            return;
        }
        SensitiveModel.count(function(rerr, rtotal) {
            if (rerr) {
                res.sendStatus(500);
                res.end();
                return;
            }
            _total = rtotal || 0;
            res.json({
                retCode: 0,
                msg: '查询成功',
                data: data,
                pageIndex: _pageIndex + 1,
                pageSize: _pageSize,
                total: _total
            });
            res.end()
        });
    });
});

/**
* 方式 get
* /api/sensitive/delSensitive 删除敏感词汇
* 输入 {id:ObjectId }
* 输出 {retCode,msg,data:entity}
*/
router.get('/delSensitive', function(req, res, next) {
    var sen_id = req.query.id;
    if (!sen_id) {
        res.sendStatus(404);
        res.end();
        return;
    }
    SensitiveModel.findById(sen_id, function(ferr, fdoc) {
        //ferr -> Object || Null
        //fdoc -> Null || Entity
        if (ferr) {
            res.json({
                retCode: 100020,
                msg: '无此条记录',
                data: null
            });
            res.end();
            return;
        }

        SensitiveModel.remove({
            _id: sen_id
        }, function(rerr, rdoc) {
            //ferr -> Object || Null
            //fdoc -> Null || Entit
            if (rerr) {
                res.sendStatus(500);
                res.end();
                return;
            }
            res.json({
                retCode: 0,
                msg: '删除成功',
                data: rdoc
            });
            res.end();
        });
    });
});

/**
* 方式 get
* /api/sensitive/sensitiveDetail 获取敏感词详情
* 输入 {id:ObjectId }
* 输出 {retCode,msg,data:doc}
*/
router.get('/getSensitiveDetail', function(req, res) {
    var sen_id = req.query.id;
    if (!sen_id) {
        res.sendStatus(404);
        res.end();
        return;
    }
    SensitiveModel.findById(sen_id, function(ferr, fdoc) {
        //ferr -> Object || Null
        //fdoc -> Null || Entity
        if (ferr) {
            res.json({
                retCode: 100020,
                msg: '无此条记录',
                data: null
            });
            res.end();
            return;
        }
        res.json({retCode: 0, msg: '查询成功', data: fdoc});
        res.end();
    });
});

/**
* 方式 post
* /api/sensitive/updateSensitive 更新敏感词汇
* 输入 {id:ObjectId,keywords:String }
* 输出 {retCode,msg,data:null}
*/
router.post('/updateSensitive', function(req, res) {
    var sen_id = req.body.id;
    var _keywords = req.body.keywords;
    if (!sen_id) {
        res.sendStatus(404);
        res.end();
        return;
    }
    if(!_keywords || $$.stringTrim(_keywords) === ''){
    	res.json({retCode:100026, msg:'敏感词汇不能为空', data:null});
		res.end();
		return;
    }
    SensitiveModel.findById(sen_id, function(ferr, fdoc) {
        //ferr -> Object || Null
        //fdoc -> Null || Entity
        if (ferr) {
            res.json({
                retCode: 100020,
                msg: '无此条记录',
                data: null
            });
            res.end();
            return;
        }

        SensitiveModel.update({
            _id: sen_id
        }, {
        	keywords:_keywords
        }, function(rerr, rdoc) {
            //ferr -> Object || Null
            //fdoc -> Null || Entit
            if (rerr || !rdoc.ok) {
                res.sendStatus(500);
                res.end();
                return;
            }
            res.json({
                retCode: 0,
                msg: '更新成功',
                data: rdoc
            });
            res.end();
        });
    });
});





module.exports = router;