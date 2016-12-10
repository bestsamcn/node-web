var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var $$ = require('../utilTools');
var UserModel = require('../mongo/schema/User').UserModel;
var LoginLogModel = require('../mongo/schema/LoginLog').LoginLogModel;
var MessageModel = require('../mongo/schema/Message').MessageModel;
var globalConfig = require('../config');


//会员列表
router.get('/getMemberList', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
        var _pageSize = parseInt(req.query.pageSize) || 10;
        var _total = 0;
        UserModel.find({
            userType: 0
        }).skip(_pageIndex * _pageSize).limit(_pageSize).sort({
            _id: -1
        }).exec(function(err, data) {
            if (err) {
                res.sendStatus(500);
                res.end();
                return;
            }
            UserModel.find({ userType: 0 }, function(rerr, rdata) {
                if (rerr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                _total = rdata.length || 0;
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
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//添加会员
router.post('/addUser', function(req, res) {
    if (!req.session.isLogin && req.session.user.userType < 1) {
        res.sendStatus(401);
        res.end();
        return;
    }
    var uaccount = req.body.account;
    var upswd = req.body.password;
    var uuserType = parseInt(req.body.userType) || 0;
    if (uuserType > 1) {
        res.json({
            retCode: 401,
            msg: '你的权限不足',
            data: null
        });
        res.end();
        return
    }
    // var uip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    var uip = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0];

    //数据格式验证
    if (uaccount.length < 2 || uaccount.length > 24) {
        res.json({
            retCode: 100002,
            msg: '用户名格式错误',
            data: null
        });
        res.end();
        return;
    }
    if (upswd.length < 6 || upswd.length > 24) {
        res.json({
            retCode: 100003,
            msg: '密码格式错误',
            data: null
        });
        res.end();
        return;
    }

    var createTime = new Date().getTime();
    var md5 = crypto.createHash('md5');
    upswd = md5.update(upswd).digest('hex');

    var UserEntity = new UserModel({
        account: uaccount,
        password: upswd,
        userType: uuserType,
        createLog: {
            createTime: Date.now(),
            createIp: uip
        }
    });
    // $$.getIpInfo(uip,function(err,info){})

    UserModel.findOne({
        account: uaccount
    }, function(e, d) {
        if (d) {
            res.json({
                retCode: 4,
                msg: '用户名已经存在',
                data: null
            });
            res.end();
            return;
        }
        UserEntity.save(function(e) {
            console.log(e)
            if (e) {
                res.send(e.status);
                res.end();
                return
            }
            res.json({
                retCode: 0,
                msg: '注册成功',
                data: null
            });
            res.end();
        });
    });
});

//获取用户信息
router.get('/getUserDetail', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var user_id = req.query.id;
        if (!user_id) {
            res.sendStatus(404);
            res.end();
            return;
        }
        UserModel.findById(user_id, function(err, doc) {
            if (err) {
                res.sendStatus(500);
                res.end();
                return;
            }
            res.json({
                retCode: 0,
                msg: '查询成功',
                data: doc
            });
            res.end();
        })
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//删除用户
router.get('/delUser', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var user_id = req.query.id;
        if (!user_id) {
            res.sendStatus(404);
            res.end();
            return;
        }
        UserModel.findById(user_id, function(err, doc) {
            if (err) {
                res.sendStatus(500);
                res.end();
                return;
            }
            //检测是否是管理员
            if (doc.userType > 0) {
                res.json({
                    retCode: 100016,
                    msg: '管理员不能直接删除',
                    data: null
                });
                res.end();
                return;
            }
            UserModel.remove({_id: user_id}, function(rerr, rdoc) {
                if (rerr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                MessageModel.remove({member:user_id},function(merr,mdoc){
                    if (merr) {
                        res.sendStatus(500);
                        res.end();
                        return;
                    }
                    LoginLogModel.remove({userId:user_id},function(uerr,udoc){
                        if (merr) {
                            res.sendStatus(500);
                            res.end();
                            return;
                        }
                        res.json({
                            retCode: 0,
                            msg: '删除成功',
                            data: doc
                        });
                        res.end();
                    });
                });
            });
        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//修改用户信息
router.post('/updateUser', function(req, res, next) {
    if (!req.body.userId) {
        res.json({
            retCode: 100017,
            msg: '非法请求',
            data: null
        });
        res.end();
        return;
    }
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var user_id = req.body.userId;
        if (req.session.user.userType !== 2 && (req.session.user.userType === 1 && req.session.user._id != user_id)) {
            res.json({
                retCode: 100024,
                msg: '权限不足',
                data: null
            });
            res.end();
            return;
        }

        UserModel.findById(user_id, function(ferr, fdoc) {
            if (ferr) {
                res.json({
                    retCode: 100020,
                    msg: '无该用户信息',
                    data: null
                });
                res.end();
                return;
            }


            var uaccount = req.body.account || fdoc.account;
            var urealName = req.body.realName || fdoc.realName;
            var umobile = req.body.mobile || fdoc.mobile;
            var uemail = req.body.email || fdoc.email;
            var ugender = parseInt(req.body.gender) || fdoc.gender;
            var uuserType = parseInt(req.body.userType);
            var usetAdminTime = null;
            if (uuserType === 1) {
                usetAdminTime = new Date().getTime();
            }

            if (uaccount.length < 2 || uaccount.length > 24) {
                res.json({
                    retCode: 100002,
                    msg: '用户名格式错误',
                    data: null
                });
                res.end();
                return;
            }
            if (uuserType < 0 || uuserType > 1) {
                res.json({
                    retCode: 100018,
                    msg: '用户类型设置错误',
                    data: null
                });
                res.end();
                return;
            }

            if (ugender < 1 || ugender > 2) {
                res.json({
                    retCode: 100019,
                    msg: '用户性别设置错误',
                    data: null
                });
                res.end();
                return;
            }


            if (urealName !== '') {
                if (urealName.length < 2) {
                    res.json({
                        retCode: 100005,
                        msg: '姓名不能少于2位',
                        data: null
                    });
                    res.end();
                    return;
                }
            }

            if (umobile !== '') {
                if (!/^1[3-9]{1}[0-9]{9}$/.test(umobile)) {
                    res.json({
                        retCode: 100006,
                        msg: '手机号码格式错误',
                        data: null
                    });
                    res.end();
                    return;
                }
            }

            if (uemail !== '') {
                //645298225@qq.com
                if (!/^\w+@\w+\.\w+$/g.test(uemail)) {
                    res.json({
                        retCode: 100007,
                        msg: '邮箱格式不正确',
                        data: null
                    });
                    res.end();
                    return;
                }
            }

            UserModel.update({
                _id: user_id
            }, {
                account: uaccount,
                realName: urealName,
                mobile: umobile,
                email: uemail,
                gender: ugender,
                userType: uuserType,
                setAdminTime: usetAdminTime
            }, function(uerr, udoc) {
                //d{ok:boolean,nMoidify:number,n:number}
                console.log(uerr, udoc)
                if (uerr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                if (!udoc.ok) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                res.json({
                    retCode: 0,
                    msg: '更新成功',
                    data: null
                });
                res.end();
                return;
            });
        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//获取用户登录日志分页
router.get('/getUserLoginLogs', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {

        var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
        var _pageSize = parseInt(req.query.pageSize) || 10;
        var _userId = req.query.userId;

        //管理员不用传用户id
        if (!_userId) {
            res.sendStatus(404);
            res.end();
            return;
        }
        var _total = 0;
        LoginLogModel.find({ userId: _userId }).skip(_pageIndex * _pageSize).limit(_pageSize).sort({
            logoutTime: -1
        }).exec(function(err, data) {
            if (err) {
                res.sendStatus(404);
                res.end();
                return;
            }
            LoginLogModel.find({
                userId: _userId
            }, function(rerr, rdata) {
                if (rerr) {
                    res.sendStatus(404);
                    res.end();
                    return;
                }
                _total = rdata.length || 0;
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
    } else {
        res.sendStatus(404);
        res.end();
        return;
    }
});

//获取所有登录日志分页
router.get('/getAllLoginLogs', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {

        var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
        var _pageSize = parseInt(req.query.pageSize) || 10;
        //管理员不用传用户id
        if (req.session.user.userType !== 2) {
            res.sendStatus(404);
            res.end();
            return;
        }
        var _total = 0;
        //查找出所有管理员
        UserModel.find({ userType: { $in: [1, 2] } }, function(err1, col1) {
            // console.log(err1,col1);
            var adminArray = [];
            for (var i = 0; i < col1.length; i++) {
                adminArray.push(col1[i]._id);
            }
            // console.log(adminArray,'管理员id')
            LoginLogModel.find({ userId: { $nin: adminArray } }).populate('userId').skip(_pageIndex * _pageSize).limit(_pageSize).sort({
                logoutTime: -1
            }).exec(function(err, data) {
                if (err) {
                    res.sendStatus(404);
                    res.end();
                    return;
                }
                LoginLogModel.find({ userId: { $nin: adminArray } }, function(rerr, rdata) {
                    if (rerr) {
                        res.sendStatus(404);
                        res.end();
                        return;
                    }
                    _total = rdata.length || 0;
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

    } else {
        res.sendStatus(404);
        res.end();
        return;
    }
});

//删除用户登录日志
router.get('/delUserLoginLog', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var log_id = req.query.id;
        if (!log_id) {
            res.sendStatus(404);
            res.end();
            return;
        }
        LoginLogModel.findById(log_id, function(ferr, fdoc) {
            //ferr -> Object || Null
            //fdoc -> Null || Entity
            if (ferr) {
                res.json({
                    retCode: 100020,
                    msg: '无此条登录日志',
                    data: null
                });
                res.end();
                return;
            }

            LoginLogModel.remove({
                _id: log_id
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
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//获取管理员列表
router.get('/getAdminList', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        UserModel.find({
            userType: {
                $in: [1]
            }
        }, function(ferr, fdoc) {
            if (ferr) {
                res.sendStatus(404);
                res.end();
                return;
            }
            res.json({
                retCode: 0,
                msg: '查询成功',
                data: fdoc
            });
            res.end();
        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//添加管理员
router.post('/addAdmin', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        if (!req.body.account) {
            res.sendStatus(404);
            res.end();
            return;
        }
        var _account = req.body.account;
        UserModel.findOne({
            account: _account
        }, function(ferr, fdoc) {
            if (ferr) {
                res.send(500);
                res.end();
                return;
            }
            if (!fdoc) {
                res.json({
                    retCode: 100021,
                    msg: '无该用户信息',
                    data: fdoc
                });
                res.end();
                return;
            }
            if (fdoc.userType > 0) {
                res.json({
                    retCode: 100022,
                    msg: '该用户已是管理员',
                    data: fdoc
                });
                res.end();
                return;
            }
            UserModel.update({
                _id: fdoc._id
            }, {
                userType: 1,
                setAdminTime: Date.now()
            }, function(uerr, udoc) {
                if (uerr) {
                    res.end(500);
                    res.end();
                    return;
                }
                if (!udoc.ok) {
                    res.end(500);
                    res.end();
                    return;
                }
                res.json({
                    retCode: 0,
                    msg: '添加成功',
                    data: null
                });
                res.end();
            })
        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//删除管理员
router.get('/delAdmin', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var user_id = req.query.id;
        if (!user_id) {
            res.sendStatus(404);
            res.end();
            return;
        }
        //只有超管和管理员自己才能删除管理员
        //req.session.user._id不是字符串类型
  
        if (req.session.user.userType !== 2 && (req.session.user.userType === 1 && req.session.user._id != user_id)) {
            res.json({
                retCode: 100024,
                msg: '权限不足',
                data: null
            });
            res.end();
            return;
        }
        if (user_id === req.session.user._id && req.session.user.userType === 2) {
            res.json({
                retCode: 100025,
                msg: '超级管理员禁止删除',
                data: null
            });
            res.end();
            return;
        }
        UserModel.findById(user_id, function(err, doc) {
            if (err) {
                res.sendStatus(500);
                res.end();
                return;
            }
            //检测是否是管理员
            if (doc.userType < 1) {
                res.json({
                    retCode: 100023,
                    msg: '该用户不是管理员',
                    data: null
                });
                res.end();
                return;
            }
            UserModel.update({
                _id: user_id
            }, {
                userType: 0
            }, function(rerr, rdoc) {
                if (rerr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                res.json({
                    retCode: 0,
                    msg: '删除管理员成功',
                    data: null
                });
                res.end();
            })

        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//获取网站概况（总人数，昨天登录人数数，昨天新增会员数）
router.get('/getWebPreview', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        UserModel.count({
            userType: 0
        }, function(caerr, cacol) {
            var _totalMember = 0;
            var _yesRegMember = 0;
            var _yesLogMember = 0;

            if (caerr) {
                res.sendStatus(500);
                res.end();
                return;
            }

            _totalMember = cacol;

            //获取今天凌晨时间戳
            var nowDate = new Date();
            nowDate.setHours(0)
            nowDate.setMinutes(0)
            nowDate.setSeconds(0)
            nowDate.setMilliseconds(0)
            var todayTime = nowDate.getTime();

            //一天的时间戳长度
            var oneDayTime = 1000 * 60 * 60 * 24;
            //昨天的整天的时间戳范围是(todayTime-oneDayTime)<= yestodayTime < todayTime
            var yestodayTime = todayTime - oneDayTime;
            UserModel.count({
                'createLog.createTime': {
                    $gt: yestodayTime,
                    $lte: todayTime
                },
                userType: {
                    $in: [0]
                }
            }, function(cierr, cicol) {
                if (cierr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                _yesRegMember = cicol;
                //1.匹配loginTime在昨天时间戳范围内。2.以userId为分组合并登录记录。3.总组数即是昨天用户登录个数
                LoginLogModel.aggregate([{
                    $match: {
                        loginTime: {
                            $gt: yestodayTime,
                            $lte: todayTime
                        }
                    }
                }, {
                    $group: {
                        "_id": "$member._id",
                        count: {
                            $sum: 1
                        }
                    }
                }]).exec(function(aerr, acol) {
                    if (aerr) {
                        res.sendStatus(500);
                        res.end();
                        return;
                    }
                    _yesLogMember = acol.length
                    res.json({
                        retCode: 0,
                        msg: '查询成功',
                        data: {
                            totalMember: _totalMember,
                            yesRegMember: _yesRegMember,
                            yesLogMember: _yesLogMember
                        }
                    });
                    res.end();
                    return;
                });
            });

        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//获取留言列表
router.get('/getMessageList', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0;
        var _pageSize = parseInt(req.query.pageSize) || 10;
        var _total = 0;
        var filterObj = {};
        if (req.query.hasOwnProperty('isRead')) {
            console.log(!!parseInt(req.query.isRead))
            filterObj.isRead = !!parseInt(req.query.isRead)
        }
        MessageModel.find(filterObj).skip(_pageIndex * _pageSize).limit(_pageSize).sort({
            _id: -1
        }).exec(function(err, data) {
            if (err) {
                res.sendStatus(500);
                res.end();
                return;
            }
            MessageModel.count(filterObj, function(mcerr, mccol) {
                if (mcerr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                _total = mccol || 0;
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
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//获取留言详情
router.get('/getMessageDetail', function(req, res, next) {
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var msgid = req.query.id;
        if (!msgid) {
            res.sendStatus(404);
            res.end();
            return;
        }
        MessageModel.findById(msgid, function(ferr, fdoc) {
            if (ferr) {
                res.sendStatus(500);
                res.end();
                return;
            }
            MessageModel.update({
                _id: msgid
            }, {
                isRead: true,
                readTime: Date.now()
            }, function(uerr, udoc) {
                if (ferr) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                if (!udoc.ok) {
                    res.sendStatus(500);
                    res.end();
                    return;
                }
                res.json({
                    retCode: 0,
                    msg: '查询成功',
                    data: fdoc
                });
            });
        });
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});

//删除留言
router.get('/delMessage', function(req, res, next) {
    //如果头部没添加authSecret，或者authsecret不等于配置的密钥就返回
    if ((req.get('authSecret') && req.get('authSecret') === globalConfig.authSecret) || (req.session.isLogin && req.session.user.userType > 0)) {
        var msgid = req.query.id;
        if (!msgid) {
            res.sendStatus(404);
            res.end();
            return;
        }
        MessageModel.findById(msgid, function(ferr, fdoc) {
            //ferr -> Object || Null
            //fdoc -> Null || Entity
            if (ferr) {
                res.json({
                    retCode: 100025,
                    msg: '无此条留言',
                    data: null
                });
                res.end();
                return;
            }

            MessageModel.remove({
                _id: msgid
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
    } else {
        res.sendStatus(401);
        res.end();
        return;
    }
});


module.exports = router;
