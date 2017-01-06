
var NODE = '/api'

var memberListPager = function(index,size){
    var pager = $('#mt-pagination');
    var memberListVm = $('#member-list-vm');
    var _pageIndex = index || 1, _pageSize = size || 10;
    if(!pager[0] || !memberListVm[0]) return;

    $.ajax({
        type:'get',
        dataType:'json',
        data:{pageIndex:_pageIndex,pageSize:_pageSize},
        url:NODE+'/admin/getMemberList',
        success:function(res){
            if(res.retCode ===0 ){

                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                $('#mt-pagination').html(pageStr);
                var html = template('member-list-tpl',{memberList:res.data,userInfo:window.userInfo});
                memberListVm.html(html);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var memberPageClick = function(){
    var pager = $('#mt-pagination')
    pager.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        memberListPager(pageIndex);
    })
}


//添加会员
var addUser = function(){
    if(location.href.indexOf('admin') === -1) return;

    var addBtn = $('#add-btn');
    var addUserForm = $('#add-user-form');
    var account = $('#account'),
        password = $('#password'),
        userType = $('#userType');
    var postInfo = function(){
        if (account.val() === '') {
            account[0].blur();
            account[0].focus();
            alertInfo('用户名不能为空');
            return false;
        }
        if (account.val().length < 2) {
            account[0].blur();
            account[0].focus();
            alertInfo('用户名不能少于2位');
            return false;
        }
        if (password.val() === '') {
            password[0].blur();
            password[0].focus();
            alertInfo('密码不能为空');
            return false;
        }
        if (password.val().length < 6) {
            password[0].blur();
            password[0].focus();
            alertInfo('密码不能少于6位');
            return false;
        }
        console.log(userType.val())
        if (parseInt(userType.val()) >1 || parseInt(userType.val()) < 0) {
            alertInfo('用户角色必填');
            return false;
        }


        $.ajax({
            type: 'post',
            dataType: 'json',
            url: NODE+'/admin/addUser',
            data: addUserForm.serialize(),
            xhrFields:{
                widthGredentials:true
            },
            success: function(res) {
                console.log(res)
                if(res.retCode ===0){
                    addUserForm[0].reset();
                    alertInfo('添加成功');
                    setTimeout(function(){
                        window.location.href='/admin/memberList';
                    },1000)
                    return;
                }
                alertInfo(res.msg || '添加失败');
            },
            error:function(res){
                alertInfo('添加失败');
            }
        });
    }
    addBtn.on('click',postInfo);
}

//删除会员
var delUser = function(userid,userType,callBack){
    if(!userid) return
    var _msg = userType === 1 ? '删除后将转为普通会员，确定删除该管理员' : '确定删除该会员？';
    var _url = userType === 0 ? (NODE+'/admin/delUser') : (NODE+'/admin/delAdmin');
    Modal.confirm({msg: _msg}).on(function(e){
        if(!!e){
            $.ajax({
                type:'get',
                data:{id:userid},
                dataType:'json',
                url:_url,
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除成功');
                        callBack && callBack();
                        return;
                    }
                    alertInfo(res.msg)
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        }
    });
}

//用户列表删除用户
var memberListDelUser = function(){
    var memberListVm= $('#member-list-vm');
    memberListVm.on('click','a.delete-btn',function(){
        var _userid = $(this).attr('data-id');
        var $this = $(this);
        delUser(_userid,0,function(){
            $this.parent().parent().remove();
        });
    });
}

//用户详情删除用户
var profileDelUser = function(){
    var userInput =  $('#userId');
    var delBtn = $('#admin-delete-btn');
    var _userId = userInput.val();
    
    if(!userInput[0] || !delBtn[0] || !_userId) return;
    delBtn.on('click',function(){
        var _userType = parseInt($(this).attr('data-bind'));
        delUser(_userId,_userType,function(){
            setTimeout(function(){
                if(_userType === 1){
                    if(window.userInfo.userType === 2){
                        window.location.href='/admin/adminList';
                    }else{
                        window.location.href='/user';
                    }
                    
                }else{
                    window.location.href='/admin/memberList';
                }
            },1000)
        });
    });
   
}

//修改用户信息
var updateUser = function(){
    var updateBtn = $('#admin-update-btn');
    var updateForm = $('#admin-update-form')[0];
    var adminDeleteBtn = $('#admin-delete-btn');

    var postInfo = function(){
        if(!updateBtn[0] || !updateForm) return;
        if(updateForm.account.value === '' || updateForm.account.value.length < 2){
            updateForm.account.blur();
            updateForm.account.focus();
            alertInfo('用户名格式不正确');
            return;
        }
        if(updateForm.mobile.value != ''){
            var reg = /^1[3-9]{1}[0-9]{9}$/;
            if(!reg.test(updateForm.mobile.value)){
                updateForm.mobile.blur();
                updateForm.mobile.focus();
                alertInfo('手机号码格式错误');
                return false;
            }
        }
        if(updateForm.email.value !== ''){
            //645298225@qq.com
            if(!/^\w+@\w+\.\w+$/g.test(updateForm.email.value)){
                alertInfo('邮箱格式错误');
                updateForm.email.blur();
                updateForm.email.focus();
                return;
            }
        }
        if(updateForm.realName.value !== ''){
            if(updateForm.realName.value.length < 2){
                updateForm.realName.blur();
                updateForm.realName.focus();
                alertInfo('姓名格式不正确');
                return;
            }
        }
        
        if(parseInt(updateForm.userType.value) < 0 || parseInt(updateForm.userType.value) > 1){
            alertInfo('用户类型设置错误');
            return;
        }
        if(parseInt(updateForm.gender.value) < 1 || parseInt(updateForm.gender.value) > 2){
            alertInfo('用户新别设置错误');
            return;
        }

        $.ajax({
            type:'post',
            dataType:'json',
            data:$(updateForm).serialize(),
            url:NODE+'/admin/updateUser',
            success:function(res){
                console.log(res)
                if(res.retCode === 0){
                    alertInfo('更新成功');
                    if(parseInt(updateForm.userType.value) === 0 && window.userInfo.account === updateForm.account.value){
                        setTimeout(function(){
                            window.location.href='/user';
                        },1000);
                    }
                    adminDeleteBtn.attr('data-bind',updateForm.userType.value);
                    return;
                }
                alertInfo('更新失败');
            },
            error:function(){
                alertInfo('更新失败');
            }
        })
    }
    updateBtn.on('click',postInfo);
}

//用户登录日志
var loginPageList = function(index,size){
    var pager = $('#loginlogs-pagination');
    var loginlogVm = $('#user-loginlog-vm');
    var _userId = $('#userId').val();
    if(!_userId){
        loginlogVm.html('无该用户数据');
        return;
    }
    var _pageIndex = index || 1, _pageSize = size || 10;
    if(!pager[0] || !loginlogVm[0]) return;
    $.ajax({
        type:'get',
        dataType:'json',
        data:{userId:_userId,pageIndex:_pageIndex,pageSize:_pageSize},
        url:NODE+'/admin/getUserLoginLogs',
        success:function(res){
            if(res.retCode ===0 ){
                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                $('#loginlogs-pagination').html(pageStr);
                var html = template('user-loginlog-tpl',{loginLogs:res.data});
                loginlogVm.html(html);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var loginPagerClick = function(){
    var pager = $('#loginlogs-pagination')
    pager.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        loginPageList(pageIndex);
    });
}

//删除用户登录日志
var delUserLoginLog = function(){
    var loginlogVm = $('#user-loginlog-vm');
    if(!loginlogVm[0]) return;
    loginlogVm.on('click','a',function(){
        var $this = $(this);
        var _logId = $this.attr('data-logid');
        if(!_logId) return;
        Modal.confirm({msg: '确定删除该登录日志？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:_logId},
                url:NODE+'/admin/delUserLoginLog',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除成功');
                        $this.parent().parent().remove();
                        return;
                    }
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        });
    });
}

//添加管理员
var addAdmin = function(){
    var addAdminForm = $('#add-admin-form');
    if(!addAdminForm[0]) return;
    var postInfo = function(){
        if(addAdminForm[0].account.value.length < 2){
            addAdminForm[0].account.blur();
            addAdminForm[0].account.focus();
            alertInfo('用户帐号不能少于两位');
            return;
        }
        $.ajax({
            type:'post',
            dataType:'json',
            data:{account:addAdminForm[0].account.value},
            url:NODE+'/admin/addAdmin',
            success:function(res){
                if(res.retCode === 0){
                    alertInfo('添加管理员成功');
                    setTimeout(function(){
                        window.location.href='/admin/adminList';
                    },1000);
                    return;
                }
                alertInfo(res.msg);
            },
            error:function(){
                alertInfo('添加管理员失败');
            }
        });
    }
    $('#add-admin-btn').on('click',postInfo);
}

//获取管理员列表
var getAdminList = function(){
    var adminListVm = $('#admin-list-vm');
    if(!adminListVm[0]) return;
    $.ajax({
        type:'get',
        url:NODE+'/admin/getAdminList',
        dataType:'json',
        data:{},
        success:function(res){
            if(res.retCode === 0){
                var html = template('admin-list-tpl',{adminList:res.data,userInfo:userInfo});
                adminListVm.html(html);
            }
        },
        error:function(){
            return
        }
    });
}

//删除管理员
var delAdmin= function(){
    var adminListVm = $('#admin-list-vm');
    if(!adminListVm[0]) return;
    adminListVm.on('click','a',function(){
        var $this = $(this);
        var _adminId = $this.attr('data-bind');
        if(!_adminId) return;
        Modal.confirm({msg: '删除后将转为普通会员，确定删除该管理员？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:_adminId},
                url:NODE+'/admin/delAdmin',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除管理员成功');
                        $this.parent().parent().remove();
                        if(window.userInfo.id === _adminId){
                            setTimeout(function(){
                                window.location.href='/user';
                            },1500)
                        }
                        return;
                    }
                },
                error:function(){
                    alertInfo('删除管理员失败')
                }
            });
        });
    });
}

//留言各种分页
var messageModule = function(){
    if(!window.userInfo || window.userInfo.userType < 1 || !/^\/admin\/messageList$/g.test(window.location.pathname)) return;
    //all vm
    var allMsgVM= $('#message-all-vm');
    var isReadVM = $('#message-isread-vm');
    var noReadVM = $('#message-noread-vm');

    //all page
    var allMsgPage = $('#message-all-pagination');
    var noReadPage = $('#message-noread-pagination');
    var isReadPage = $('#message-isread-pagination');

    //全部留言
    var getAllMsg = function(index,size){
        var _pageIndex = index || 1, _pageSize = size || 5;
        $.ajax({
            type:'get',
            dataType:'json',
            data:{pageIndex:_pageIndex,pageSize:_pageSize},
            url:NODE+'/admin/getMessageList',
            success:function(res){
                if(res.retCode ===0 ){
                    var _totalPage = Math.ceil(res.total/_pageSize);
                    var pageStr = commonPage({
                        active: 'active',
                        //左右显示两个
                        showPage: 2
                        //第1页，
                    })(_pageIndex, _totalPage);
                    allMsgPage.html(pageStr);
                    var html = template('message-all-tpl',{allMsgList:res.data});
                    allMsgVM.html(html);
                    return;
                }
                alertInfo(res.msg || '获取分页失败');
            },
            error:function(){
                alertInfo('获取分页失败');
            }
        });
    }
    getAllMsg(1);
    allMsgPage.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getAllMsg(pageIndex);
    });

    //未查看的
    var getNoreadMsg = function(index,size){
        var _pageIndex = index || 1, _pageSize = size || 5;
        $.ajax({
            type:'get',
            dataType:'json',
            data:{pageIndex:_pageIndex,pageSize:_pageSize,isRead:0},
            url:NODE+'/admin/getMessageList',
            success:function(res){
                if(res.retCode ===0 ){
                    var _totalPage = Math.ceil(res.total/_pageSize);
                    var pageStr = commonPage({
                        active: 'active',
                        //左右显示两个
                        showPage: 2
                        //第1页，
                    })(_pageIndex, _totalPage);
                    noReadPage.html(pageStr);
                    var html = template('message-noread-tpl',{noReadList:res.data});
                    noReadVM.html(html);
                    return;
                }
                alertInfo(res.msg || '获取分页失败');
            },
            error:function(){
                alertInfo('获取分页失败');
            }
        });
    }
    getNoreadMsg(1,5);
    noReadPage.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getNoreadMsg(pageIndex);
    });

    //已经查看的
    var getIsreadMsg = function(index,size){
        var _pageIndex = index || 1, _pageSize = size || 5;
        $.ajax({
            type:'get',
            dataType:'json',
            data:{pageIndex:_pageIndex,pageSize:_pageSize,isRead:1},
            url:NODE+'/admin/getMessageList',
            success:function(res){
                if(res.retCode ===0 ){
                    var _totalPage = Math.ceil(res.total/_pageSize);
                    var pageStr = commonPage({
                        active: 'active',
                        //左右显示两个
                        showPage: 2
                        //第1页，
                    })(_pageIndex, _totalPage);
                    isReadPage.html(pageStr);
                    var html = template('message-isread-tpl',{isReadList:res.data});
                    isReadVM.html(html);
                    return;
                }
                alertInfo(res.msg || '获取分页失败');
            },
            error:function(){
                alertInfo('获取分页失败');
            }
        });
    }
    getIsreadMsg(1,5);
    isReadPage.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getIsreadMsg(pageIndex);
    });

}

//删除留言
var delMessage = function(){
    if(!window.userInfo || window.userInfo.userType < 1 || !/^\/admin\/messageList(.*)$/g.test(window.location.pathname)) return;
    var postInfo = function(id,_this){
        if(!id) return;
        Modal.confirm({msg: '确定删除该留言？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:id},
                url:NODE+'/admin/delMessage',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除留言成功');
                        _this.parent().parent().remove();
                        setTimeout(function(){
                            window.location.reload()
                        },1000)
                        return;
                    }
                    alertInfo(res.msg || '删除失败');
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        });
    }
    var allMsgVM= $('#message-all-vm');
    var isReadVM = $('#message-isread-vm');
    var noReadVM = $('#message-noread-vm');
    allMsgVM.on('click','.admin-delete-message-btn',function(){
        var $this = $(this);
        var _id = $this.attr('data-msgid');
        postInfo(_id,$this)
    });
    isReadVM.on('click','.admin-delete-message-btn',function(){
        var $this = $(this);
        var _id = $this.attr('data-msgid');
        postInfo(_id,$this)
    });
    noReadVM.on('click','.admin-delete-message-btn',function(){
        var $this = $(this);
        var _id = $this.attr('data-msgid');
        postInfo(_id,$this)
    });
    $('#message-delete-btn').on('click',function(){
        var $this = $(this);
        var _id = $this.attr('data-bind');
        if(!_id) return;
        Modal.confirm({msg: '确定删除该留言？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:_id},
                url:NODE+'/admin/delMessage',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除留言成功');
                        setTimeout(function(){
                            window.location.href='/admin/messageList';
                        },1000)
                        return;
                    }
                    alertInfo(res.msg || '删除失败');
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        });
    });
}

//所有登录日志
var getAllLoginLosList = function(index,size){

    if(!window.userInfo || window.userInfo.userType !==2 || !/^\/admin\/loginLogsList$/g.test(window.location.pathname)) return;
    var pager = $('#loginlogs-pagination');
    var loginlogVm = $('#allloginlogs-list-vm');
    var _pageIndex = index || 1, _pageSize = size || 10;
    if(!pager[0] || !loginlogVm[0]) return;
    $.ajax({
        type:'get',
        dataType:'json',
        data:{pageIndex:_pageIndex,pageSize:_pageSize},
        url:NODE+'/admin/getAllLoginLogs',
        success:function(res){
            if(res.retCode ===0 ){
                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                $('#loginlogs-pagination').html(pageStr);
                var html = template('allloginlogs-list-tpl',{loginLogsList:res.data});
                loginlogVm.html(html);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var allLoginLogsPageClick = function(){
    var pager = $('#loginlogs-pagination')
    pager.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getAllLoginLosList(pageIndex);
    });
}

//删除用户登录日志
var delOneOfAllLoginLogsList = function(){
    var loginlogVm = $('#allloginlogs-list-vm');
    if(!loginlogVm[0]) return;
    loginlogVm.on('click','a',function(){
        var $this = $(this);
        var _logId = $this.attr('data-bind');
        if(!_logId) return;
        Modal.confirm({msg: '确定删除该登录日志？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:_logId},
                url:NODE+'/admin/delUserLoginLog',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除成功');
                        $this.parent().parent().remove();
                        return;
                    }
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        });
    });
}

//添加敏感词汇
var addSensitive = function(){
    if(location.href.indexOf('addSensitive') === -1) return;
    var addBtn = $('#add-sensitive-btn');
    var oForm = $('#add-sensitive-form');
    var keywords = $('#keywords');
    var postInfo = function(){
        if (keywords.val() === '' || keywords.val().replace(/^\s+|\s+$/g,'') === '') {
            keywords[0].blur();
            keywords[0].focus();
            alertInfo('词汇不能为空');
            return false;
        }

        $.ajax({
            type: 'post',
            dataType: 'json',
            url: NODE+'/sensitive/addSensitive',
            data: {keywords:keywords.val()},
            xhrFields:{
                widthGredentials:true
            },
            success: function(res) {
                console.log(res)
                if(res.retCode ===0){
                    oForm[0].reset();
                    alertInfo('添加成功');
                    setTimeout(function(){
                        window.location.href='/admin/sensitiveList';
                    },1000)
                    return;
                }
                alertInfo(res.msg || '添加失败');
            },
            error:function(res){
                alertInfo('添加失败');
            }
        });
    }
    addBtn.on('click',postInfo);
}

//敏感词汇分页
var getSensitiveList = function(index,size){

    // if(!window.userInfo || window.userInfo.userType < 1 || !/^\/sensitive\/getSensitiveList$/g.test(window.location.pathname)) return;
    var pager = $('#sensitive-list-pagination');
    var sesitiveVm = $('#sensitive-list-vm');
    var _pageIndex = index || 1, _pageSize = size || 10;
    if(!pager[0] || !sesitiveVm[0]) return;
    $.ajax({
        type:'get',
        dataType:'json',
        data:{pageIndex:_pageIndex,pageSize:_pageSize},
        url:NODE+'/sensitive/getSensitiveList',
        success:function(res){
            console.log(res)
            if(res.retCode ===0 ){
                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                pager.html(pageStr);
                var html = template('sensitive-list-tpl',{sensitiveList:res.data});
                sesitiveVm.html(html);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var sensitivePageClick = function(){
    var pager = $('#sensitive-list-pagination')
    pager.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getSensitiveList(pageIndex);
    });
}

//更新敏感词汇信息
var updateSensitive = function(){
    var oForm = $('#sensitive-detail-form');
    var keywords = $('#keywords');
    var oBtn = $('#sensitive-detail-btn');
    var senId = $('#sensitiveId');

    var postInfo = function(){
        if (keywords.val() === '' || keywords.val().replace(/^\s+|\s+$/g,'') === '') {
            keywords[0].blur();
            keywords[0].focus();
            alertInfo('词汇不能为空');
            return false;
        }
        if(senId.val() === ''){
            alertInfo('异常');
            return;
        }
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: NODE+'/sensitive/updateSensitive',
            data: {id:senId.val(),keywords:keywords.val()},
            xhrFields:{
                widthGredentials:true
            },
            success: function(res) {
                console.log(res)
                if(res.retCode ===0){
                    alertInfo('更新成功');
                    setTimeout(function(){
                        window.location.href='/admin/sensitiveList';
                    },1000)
                    return;
                }
                alertInfo(res.msg || '更新失败');
            },
            error:function(res){
                alertInfo('更新失败');
            }
        });
    }
    oBtn.on('click',postInfo);
}

//删除敏感词汇
var delSensitive = function(_id){
    if(!_id || _id.length !== 24) return;
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: NODE+'/sensitive/delSensitive',
        data: {id:_id},
        xhrFields:{
            widthGredentials:true
        },
        success: function(res) {
            if(res.retCode ===0){
                alertInfo('删除成功');
                setTimeout(function(){
                    window.location.href='/admin/sensitiveList';
                },1000)
                return;
            }
            alertInfo(res.msg || '删除失败');
        },
        error:function(res){
            alertInfo('删除失败');
        }
    });
}

var sensitiveListDel = function(){
    var sesitiveVm = $('#sensitive-list-vm');
    sesitiveVm.on('click','.delete-sensitive-btn', function(){
        var $this = $(this);
        var _senId = $this.attr('data-senid');
        if(!_senId) return;
        Modal.confirm({msg: '确定删除该敏感词？'}).on(function(e){
            if(!e) return;
            $.ajax({
                type:'get',
                dataType:'json',
                data:{id:_senId},
                url:NODE+'/sensitive/delSensitive',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除成功');
                        $this.parent().parent().remove();
                        return;
                    }
                    alertInfo('删除失败')
                },
                error:function(){
                    alertInfo('删除失败')
                }
            });
        });
    });
}

//访问日志分页
var getAccessLogsList = function(index,size){

    // if(!window.userInfo || window.userInfo.userType < 1 || !/^\/sensitive\/getSensitiveList$/g.test(window.location.pathname)) return;
    var pager = $('#accesslogs-list-pagination');
    var accesslogsVm = $('#accesslogs-list-vm');
    var _pageIndex = index || 1, _pageSize = size || 10;
    if(!pager[0] || !accesslogsVm[0]) return;
    $.ajax({
        type:'get',
        dataType:'json',
        data:{pageIndex:_pageIndex,pageSize:_pageSize},
        url:NODE+'/admin/getAccessLogsList',
        success:function(res){
            console.log(res)
            if(res.retCode ===0 ){
                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                pager.html(pageStr);
                var html = template('accesslogs-list-tpl',{accesslogsList:res.data});
                accesslogsVm.html(html);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var accessLogsPageClick = function(){
    var pager = $('#accesslogs-list-pagination');
    pager.on('click','a',function(){
 
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getAccessLogsList(pageIndex);
    });
}




$(function(){
	memberListPager(1,10);
    memberPageClick();
    addUser();
    memberListDelUser();
    profileDelUser();
    updateUser();
    loginPageList(1);
    loginPagerClick();
    delUserLoginLog();
    addAdmin();
    getAdminList();
    delAdmin();
    messageModule();
    delMessage();
    getAllLoginLosList();
    delUserLoginLog();
    delOneOfAllLoginLogsList();
    allLoginLogsPageClick();
    addSensitive();
    getSensitiveList(1)
    sensitivePageClick();
    updateSensitive();
    sensitiveListDel();
    getAccessLogsList(1);
    accessLogsPageClick();

})