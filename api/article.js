var express = require('express');
var router = express.Router();
var xss = require('xss');
var ueditor = require('ueditor');
var ArticleModel = require('../mongo/schema/Article').ArticleModel;
var allowAdminOnly = require('./index').allowAdminOnly;
var imageSize = require('image-size');
var gm = require('gm');
var crypto = require('crypto');
var Q = require('q');
var globalConfig = require('../config');
var keywordFilter = require('../keywordFilter/lib/index');
var isIncludeSensitive = require('./index').isIncludeSensitive;


/**
* 添加文章 /api/article/addArticle
* 输入 {category [number],isHot [number],author [_id],title [string],content [string]}
* 输出 100030=>内容不能为空, 0=>发布成功
*/
router.post('/addArticle', function(req,res){
	var _category = parseInt(req.body.category),
		_isHot = parseInt(req.body.isHot),
		_title = req.body.title,
		_leadText = req.body.leadText,
		_content = xss(req.body.content);
	if(!_content){
		res.json({ retCode:100030, msg:'文章内容不能为空', data:null });
		res.end();
		return;
	}
	if(!_title){
		res.json({ retCode:100031, msg:'标题不能为空', data:null });
		res.end();
		return;
	}
	if(!_content){
		res.json({ retCode:100032, msg:'导读不能为空', data:null });
		res.end();
		return;
	}
	//敏感字符拦截
	if(isIncludeSensitive(_content, _title, _leadText)){
		res.json({retCode:100027,msg:'不能包含敏感字符',data:null});
		res.end();
		return;
	}

	// var reg = /(<|&lt;)img\s+src=(\"|&quot;)(.*\.(png|jpg|gif|bmp))\2\s+title=(\"|&quot;).*(\"|&quot;)\s+alt=\2(.*\.(png|jpg|gif|bmp))\2\/(>|&gt)/im;
	var reg = /img\s{1}src=(\"|&quot;)\/public\/ueditor\/picture\/(\d{18}\.(gif|jpg|png|bmp))(\"|&quot;)/i;
	//我发现node代码不能使用/开头的绝对路径，node会以磁盘为根目录
	//
	if(!_content.match(reg)){
		res.json({retCode:100038,msg:'必须添加一张图片作为缩略图',data:null});
		res.end();
		return;
	}
	var _thumbnailDir = 'public/ueditor/picture/'+_content.match(reg)[2];


	// var _thumbnailSize = imageSize(_thumbnailDir);
	// console.log(_thumbnailSize.width, _thumbnailSize.height)
	var md5 = crypto.createHash('md5');
	var _thumbnailName = md5.update(globalConfig.imageSecret+Date.now()).digest('hex')+'.png';
	var _thumbnail = 'public/ueditor/picture/'+_thumbnailName;
	gm(_thumbnailDir).thumb(150, 100, _thumbnail, 8, function(terr){

		if(terr){
			res.sendStatus(500);
			res.end();
			return;
		}

		ArticleModel.create({
			author:req.session.user._id,
			deliverTime:Date.now(),
			isHot:_isHot,
			category:_category,
			title:_title,
			content:_content,
			leadText:_leadText,
			thumbnail:_thumbnailName
		},function(cerr){
			if(cerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({ retCode:0, msg:'文章发布成功', data:null });
			res.end();
			return;
		});
	});
});

/**
* 获取文章列表分页 /api/article/addArticle
* 输入 {pageIndex [number],pageSize [number],category [number]}
* 输出 100031=>无分类内容, 0=>发布成功
* 输出 {pageIndex [number],,pageSize [number],category [number],total [number],data [array]}
*/
router.get('/getArticleList',function(req,res){
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
    var _pageSize = parseInt(req.query.pageSize) || 10;
    var _total = 0;
    ArticleModel.find().sort({
    	isHot:-1,
        deliverTime: -1
    }).skip(_pageIndex * _pageSize).limit(_pageSize).exec(function(err, data) {
        if (err) {
            res.sendStatus(500);
            res.end();
            return;
        }
        ArticleModel.count({}, function(mcerr, mccol) {
            if (mcerr) {
                res.sendStatus(500);
                res.end();
                return;
            }
            _total = mccol || 0;
            var tempdata = JSON.stringify(data)
            var filterData = keywordFilter.hasKeyword(tempdata) ? keywordFilter.replaceKeyword(tempdata,'*') : tempdata;
            filterData = JSON.parse(filterData);
            res.json({
                retCode: 0,
                msg: '查询成功',
                data: filterData,
                pageIndex: _pageIndex + 1,
                pageSize: _pageSize,
                total: _total
            });
            res.end()
        });
    });
});

/**
* 添加文章 /api/article/editArticle
* 输入 {category [number],isHot [number],author [_id],title [string],content [string]}
* 输出 100030=>内容不能为空, 0=>修改成功
*/
router.get('/getArticleDetail', function(req, res) {
    var article_id = req.query.id;
    if (!article_id) {
        res.sendStatus(404);
        res.end();
        return;
    }
    //跟update不一样，第二个参数返回更新后的实体
    ArticleModel.findByIdAndUpdate(article_id, { $inc:{ visitTimes: 1 }}, function(uerr,edoc){
    	if(uerr){
    		res.sendStatus(500);
            res.end();
            return;
    	}
        res.json({
            retCode: 0,
            msg: '查询成功',
            data: edoc
        });
        res.end();
	   
    });
});

/**
* 获取文章列表分页 /api/article/editArticle
* 输入 {pageIndex [number],pageSize [number],category [number]}
* 输出 100031=>无分类内容, 0=>发布成功
* 输出 {pageIndex [number],,pageSize [number],category [number],total [number],data [array]}
*/
router.post('/editArticle', function(req, res){
	var _id = req.body.id,
		_category = parseInt(req.body.category),
		_isHot = parseInt(req.body.isHot),
		_title = req.body.title,
		_leadText = req.body.leadText,
		_content = xss(req.body.content);
	if(!_id){
		res.json({ retCode:100033, msg:'文章缺少必要信息', data:null });
		res.end();
		return;
	}
	if(!_content){
		res.json({ retCode:100030, msg:'文章内容不能为空', data:null });
		res.end();
		return;
	}
	if(!_title){
		res.json({ retCode:100031, msg:'标题不能为空', data:null });
		res.end();
		return;
	}
	if(!_content){
		res.json({ retCode:100032, msg:'导读不能为空', data:null });
		res.end();
		return;
	}
	//敏感字符拦截
	if(isIncludeSensitive(_content, _title, _leadText)){
		res.json({retCode:100027,msg:'不能包含敏感字符',data:null});
		res.end();
		return;
	}
	var reg = /img\s{1}src=(\"|&quot;)\/public\/ueditor\/picture\/(\d{18}\.(gif|jpg|png|bmp))(\"|&quot;)/i;
	//我发现node代码不能使用/开头的绝对路径，node会以磁盘为根目录
	var _thumbnailDir = 'public/ueditor/picture/'+_content.match(reg)[2];

	// var _thumbnailSize = imageSize(_thumbnailDir);
	// console.log(_thumbnailSize.width, _thumbnailSize.height)
	var md5 = crypto.createHash('md5');
	var _thumbnailName = md5.update(globalConfig.imageSecret+Date.now()).digest('hex')+'.png';
	var _thumbnail = 'public/ueditor/picture/'+_thumbnailName;
	gm(_thumbnailDir).thumb(150, 100, _thumbnail, 8, function(terr){
		if(terr){
			res.sendStatus(500);
			res.end();
			return;
		}
		ArticleModel.findByIdAndUpdate(_id,{$set:{
			isHot:_isHot,
			category:_category,
			title:_title,
			content:_content,
			leadText:_leadText,
			thumbnail:_thumbnailName,
			lastEdit:{
				time:Date.now(),
				editer:req.session.user._id
			}}
		},function(fuerr, fudoc){
			if(fuerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({ retCode:0, msg:'文章修改成功', data:fudoc });
			res.end();
			return;
		});
	});
});

router.get('/delArticle', allowAdminOnly, function(req, res){
	var _id = req.query.id;
	//无id就结束请求
	if(!_id || _id.length !== 24){
		res.json({ retCode:100033, msg:'文章缺少必要信息', data:null });
		res.end();
		return;
	}
	//通过id查找文章并且删除
	var findByIdAndRemove = function(){
		var defer = Q.defer();
		ArticleModel.findByIdAndRemove(_id, function(frerr,frdoc){
			if(frerr){
				defer.reject();
				res.sendStatus(500);
				res.end();
				return;
			}
			defer.resolve(frdoc);
		});
		return defer.promise;
	}
	//删除成功回调
	var removeSuccess = function(doc){
		res.json({ retCode:0, msg:'文章删除成功', data:doc });
		res.end();
		return;
	}
	//执行
	findByIdAndRemove().then(removeSuccess);
});

module.exports = router;