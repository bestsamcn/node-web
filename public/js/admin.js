
/**
* commonPage 公共分页组件
* @param {object} config 样式配置目前只有激活后的类和显示多少个页码
* @param {number} page 当前页码
* @param {number} total 总页数
* @return {string} 激活页码后的html字符串
*/
var commonPage = function (config) {
    var opt = {
        active:'active',
        showPage:3
    }
    for(var i in opt){
        if(config[i] === undefined){
            config[i] = opt[i]
        }
    }
    return function (page, total) {
        //当前页
        var str = '<a href="javascript:;" data-bind="'+page+'" class="'+config.active+'">' + page + '</a>';
        for (var i = 1; i <= config.showPage; i++) {
            //page-i>1证明page>config.showPage,所以page-i,在当前page的左边，循环config.showPage次
            if (page - i > 1) {
                str = '<a href="javascript:;" data-bind="'+(page-i)+'">' + (page - i) + '</a> ' + str;
            }
            //page+i<total证明page+i在total的左边，在page的右边，循环config.showPage次
            if (page + i < total) {
                str = str + ' ' + '<a href="javascript:;" data-bind="'+(page+i)+'">'+(page + i)+'</a>';
            }
        }
        //当前页的左边第config.showPage+1个a出现省略号，因为需求是当前页的左右各显示config.showPage个
        if (page - (config.showPage+1)> 1) {
            str = '<a>...</a> ' + str;
        }
        //当前页page>1时，出现上一张按钮
        if (page > 1) {
            str = '<a href="javascript:;" data-bind="'+(page-1)+'">上一页</a> ' + '<a href="javascript:;" data-bind="1">1</a>' + ' ' + str;
        }
        //当前页的左右边第config.showPage+1个a出现省略号，因为需求是当前页的左右各显示config.showPage个
        if (page + (config.showPage+1) < total) {
            str = str +' '+'<a>...</a>';
        }
        ////当前页page<total时，出现下一张按钮
        if (page < total) {
            str = str + ' ' + '<a href="javascript:;" data-bind="'+total+'">'+total +'</a>'+' '+'<a href="javascript:;" data-bind="'+(parseInt(page)+1)+'">下一页</a>';
        }
        return str;
    }
}
/** 
 * 对日期进行格式化， 
 * @param date 要格式化的日期 
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有： 
 *     y:年, 
 *     M:年中的月份(1-12), 
 *     d:月份中的天(1-31), 
 *     h:小时(0-23), 
 *     m:分(0-59), 
 *     s:秒(0-59), 
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
template.helper('dateFormat', function (date, format) {
    if(!arguments[0]){
        return '暂无'
    }
    date = new Date(date);
    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});
//alert
var alertInfo = function(msg){
    if(!!document.getElementById('alertInfo')) return;
    var oDiv = document.createElement('div');
    oDiv.id = 'alertInfo';
    var divCssText = 'position:fixed;width:100%;height:30px;left:0;bottom:150px;text-align:center;z-index:100;-webkit-transition:all .3s ease-in-out';
    oDiv.style.cssText = divCssText;
    var oSpan = document.createElement('span');
    var spanCssText = 'color:#fff;font-size:14px;background:rgba(0,0,0,0.8);border-radius:20px;%;padding:10px 20px;';
    oSpan.style.cssText = spanCssText;
    oSpan.innerHTML = msg || '未知错误';
    oDiv.appendChild(oSpan);
    var oBody = document.body || document.documentElement;
    oBody.appendChild(oDiv);
    setTimeout(function(){
        oBody.removeChild(oDiv)
    },3000);
}

//modal封装
window.Modal = function () {
    var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
    var alr = $("#ycf-alert");
    var ahtml = alr.html();

    //关闭时恢复 modal html 原样，供下次调用时 replace 用
    //var _init = function () {
    //  alr.on("hidden.bs.modal", function (e) {
    //      $(this).html(ahtml);
    //  });
    //}();

    /* html 复原不在 _init() 里面做了，重复调用时会有问题，直接在 _alert/_confirm 里面做 */


    var _alert = function (options) {
        alr.html(ahtml);    // 复原
        alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
        alr.find('.cancel').hide();
        _dialog(options);

        return {
            on: function (callback) {
                if (callback && callback instanceof Function) {
                    alr.find('.ok').click(function () { callback(true) });
                }
            }
        };
    };

    var _confirm = function (options) {
        alr.html(ahtml); // 复原
        alr.find('.ok').removeClass('btn-primary').addClass('btn-success');
        alr.find('.cancel').show();
        _dialog(options);

        return {
            on: function (callback) {
                if (callback && callback instanceof Function) {
                    alr.find('.ok').click(function () { callback(true) });
                    alr.find('.cancel').click(function () { callback(false) });
                }
            }
        };
    };

    var _dialog = function (options) {
        var ops = {
            msg: "提示内容",
            title: "操作提示",
            btnok: "确定",
            btncl: "取消"
        };

        $.extend(ops, options);

        console.log(alr);

        var html = alr.html().replace(reg, function (node, key) {
            return {
                Title: ops.title,
                Message: ops.msg,
                BtnOk: ops.btnok,
                BtnCancel: ops.btncl
            }[key];
        });
        
        alr.html(html);
        alr.modal({
            width: 500,
            backdrop: 'static'
        });
    }

    return {
        alert: _alert,
        confirm: _confirm
    }

}();

template.config('openTag', '<%');
template.config('closeTag', '%>');
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
var NODE = 'http://10.28.5.197:3000/api'

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
var delUser = function(userid,callBack){
    if(!userid) return
    Modal.confirm({msg: '确定删除该会员？'}).on(function(e){
        if(!!e){
            $.ajax({
                type:'get',
                data:{id:userid},
                dataType:'json',
                url:NODE+'/admin/delUser',
                success:function(res){
                    if(res.retCode === 0){
                        alertInfo('删除成功');
                        callBack && callBack();
                        return;
                    }
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
        delUser(_userid,function(){
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
        delUser(_userId,function(){
            setTimeout(function(){
                window.location.href='/admin/memberList';
            },1000)
        });
    });
   
}

//修改用户信息
var updateUser = function(){
    var updateBtn = $('#admin-update-btn');
    var updateForm = $('#admin-update-form')[0];

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
                alertInfo('添加管理员失败');
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
                        window.location.href='/user'
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
})