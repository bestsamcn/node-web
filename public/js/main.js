
/**
* commonPage 公共分页组件
* @param {object} config 样式配置目前只有激活后的类和显示多少个页码
* @param {number} page 当前页码
* @param {number} total 总页数
* @return {string} 激活页码后的html字符串
*/
window.commonPage = function (config) {
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
        page = parseInt(page),total = parseInt(total);
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

//alert
window.alertInfo = function(msg){
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

//文字省略
template.helper('textEllipsis', function (str,len) {
    if(!arguments[0]){
        return '暂无'
    }
    if(len <1) return;
    var afterSlice = '';
    if(str.length > len ){
        var afterSlice = str.substring(0,len) + '...';
    }else{
        afterSlice = str;
    }
    return afterSlice;
});

/**
 * 将str中的html符号转义,将转义“'，&，<，"，>”五个字符
 * @method unhtml
 * @param { String } str 需要转义的字符串
 * @return { String } 转义后的字符串
 * @example
 * ```javascript
 * var html = '<body>&</body>';
 *
 * //output: &lt;body&gt;&amp;&lt;/body&gt;
 * console.log( UE.utils.unhtml( html ) );
 *
 * ```
 */
template.helper('unhtml', function (str,reg) {
    return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
        if (b) {
            return a;
        } else {
            return {
                '<':'&lt;',
                '&':'&amp;',
                '"':'&quot;',
                '>':'&gt;',
                "'":'&#39;'
            }[a]
        }

    }) : '';
});

/**
 * 将str中的转义字符还原成html字符
 * @see UE.utils.unhtml(String);
 * @method html
 * @param { String } str 需要逆转义的字符串
 * @return { String } 逆转义后的字符串
 * @example
 * ```javascript
 *
 * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
 *
 * //output: <body>&</body>
 * console.log( UE.utils.html( str ) );
 *
 * ```
 */
template.helper('html', function (str) {
    return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
        return {
            '&lt;':'<',
            '&amp;':'&',
            '&quot;':'"',
            '&gt;':'>',
            '&#39;':"'",
            '&nbsp;':' '
        }[m]
    }) : '';
});

/**
* 获取纯文本
*/
template.helper('getText',function(str){
	var fillChar = '/\u200B/';
	 var reg = new RegExp(fillChar, 'gm');
    //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
    var t = str.replace(reg, '').replace(/\u00a0/g, ' ');
    console.log(t);
    return t ;
	
});


template.config('openTag', '<%');
template.config('closeTag', '%>');

/**
 * dateDesc 时间倒序
 * @param {oldDate} 过去的时间戳
 * @return {string} 计算后的时间差
 */
template.helper('dateDesc', function(oldDate) {
    var now = new Date().getTime(),
        past = !isNaN(oldDate) ? oldDate : new Date(oldDate).getTime(),
        diffValue = now - past,
        res = '',
        s = 1000,
        m = 1000 * 60,
        h = m * 60,
        d = h * 24,
        hm = d * 15,
        mm = d * 30,
        y = mm * 12,
        _y = diffValue / y,
        _mm = diffValue / mm,
        _w = diffValue / (7 * d),
        _d = diffValue / d,
        _h = diffValue / h,
        _m = diffValue / m,
        _s = diffValue / s;
    if (_y >= 1) res = parseInt(_y) + '年前';
    else if (_mm >= 1) res = parseInt(_mm) + '个月前';
    else if (_w >= 1) res = parseInt(_w) + '周前';
    else if (_d >= 1) res = parseInt(_d) + '天前';
    else if (_h >= 1) res = parseInt(_h) + '小时前';
    else if (_m >= 1) res = parseInt(_m) + '分钟前';
    else if (_s >= 1) res = parseInt(_s) + '秒前';
    else res = '刚刚';
    return res;
});




;
(function() {

	// 'use strict';



	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if (!isMobile.any()) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function() {
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};


	var centerBlock = function() {
		$('.fh5co-section-with-image .fh5co-box').css('margin-top', -($('.fh5co-section-with-image .fh5co-box').outerHeight() / 2));
		$(window).resize(function() {
			$('.fh5co-section-with-image .fh5co-box').css('margin-top', -($('.fh5co-section-with-image .fh5co-box').outerHeight() / 2));
		});
	};

	var responseHeight = function() {
		setTimeout(function() {
			$('.js-responsive > .v-align').css('height', $('.js-responsive > img').height());
		}, 1);

		$(window).resize(function() {
			setTimeout(function() {
				$('.js-responsive > .v-align').css('height', $('.js-responsive > img').height());
			}, 1);
		})
	};


	var mobileMenuOutsideClick = function() {

		$(document).click(function(e) {
			var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {

				if ($('body').hasClass('offcanvas-visible')) {

					$('body').removeClass('offcanvas-visible');
					$('.js-fh5co-nav-toggle').removeClass('active');

				}


			}
		});

	};


	var offcanvasMenu = function() {
		$('body').prepend('<div id="fh5co-offcanvas" />');
		$('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
		$('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');
		$('#fh5co-offcanvas').append($('#fh5co-header nav').clone());
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event) {
			var $this = $(this);

			$('body').toggleClass('fh5co-overflow offcanvas-visible');
			$this.toggleClass('active');
			event.preventDefault();

		});

		$(window).resize(function() {
			if ($('body').hasClass('offcanvas-visible')) {
				$('body').removeClass('offcanvas-visible');
				$('.js-fh5co-nav-toggle').removeClass('active');
			}
		});

		$(window).scroll(function() {
			if ($('body').hasClass('offcanvas-visible')) {
				$('body').removeClass('offcanvas-visible');
				$('.js-fh5co-nav-toggle').removeClass('active');
			}
		});
	};


	var toggleBtnColor = function() {
		if ($('#fh5co-hero').length > 0) {
			$('#fh5co-hero').waypoint(function(direction) {
				if (direction === 'down') {
					$('.fh5co-nav-toggle').addClass('dark');
				}
			}, {
				offset: -$('#fh5co-hero').height()
			});

			$('#fh5co-hero').waypoint(function(direction) {
				if (direction === 'up') {
					$('.fh5co-nav-toggle').removeClass('dark');
				}
			}, {
				offset: function() {
					return -$(this.element).height() + 0;
				}
			});
		}
	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint(function(direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function() {

					$('body .animate-box.item-animate').each(function(k) {
						var el = $(this);
						setTimeout(function() {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						}, k * 200, 'easeInOutExpo');
					});

				}, 100);

			}

		}, {
			offset: '85%'
		});
	};
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



	var JAVA = 'http://10.28.2.62:8080/swycnd/pipes';

	// var NODE = 'http://10.28.5.197:3000/api';
	var NODE = '/api';

	//用户登录
	var userLogin = function() {
		if(location.href.indexOf('login') === -1) return;
		var loginBtn = $('#login-btn');
		var userName = $('#account'),
			password = $('#password'),
			code = $('#code');
		var postInfo = function() {
			if (userName.val() === '') {
				userName[0].blur();
				userName[0].focus();
				alertInfo('用户名不能为空');
				return false;
			}
			if (userName.val().length < 2) {
				userName[0].blur();
				userName[0].focus();
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
			// if(code.val().length !== 4){
			// 	code[0].blur();
			// 	code[0].focus();
			// 	alertInfo('验证码为4位');
			// 	return false;
			// }
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: NODE+'/user/login',
				data: $('#login-form').serialize(),
				xhrFields:{
					widthGredentials:true
				},
				success: function(res) {
					if(res.retCode === 0){
						window.location.href='/';
						return;
					}
					alertInfo(res.msg || '登录失败')
				},
				error:function(){
					alertInfo('登录失败');
				}
			})
		}
		loginBtn.on('click',postInfo);
	}
	//注册
	var userRegister = function(){
		if(location.href.indexOf('register') === -1) return;

		var registerBtn = $('#register-btn');
		var account = $('#account'),
			password = $('#password'),
			repassword = $('#repassword'),
			mobile = $('#mobile'),
			code = $('#code');
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
			if(mobile.val() != ''){
				var reg = /^1[3-9]{1}[0-9]{9}$/;
				if(!reg.test(mobile.val())){
					mobile[0].blur();
					mobile[0].focus();
					alertInfo('手机号码格式错误');
					return false;
				}
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
			if(repassword.val() !== password.val()){
				repassword[0].blur();
				repassword[0].focus();
				alertInfo('两次密码输入不一致');
				return false;
			}
			if(code.val().length !== 4){
				code[0].blur();
				code[0].focus();
				alertInfo('验证码为4位');
				return false;
			}
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: NODE+'/user/register',
				data: $('#register-form').serialize(),
				xhrFields:{
					widthGredentials:true
				},
				success: function(res) {
					console.log(res)
					if(res.retCode ===0){
						alertInfo('注册成功,即将重定向');
						setTimeout(function(){
							window.location.href='/sign/login';
						},1000)
						return;
					}
					alertInfo(res.msg || '注册失败');
				},
				error:function(res){
					alertInfo('注册失败');
				}
			});
		}
		registerBtn.on('click',postInfo);
	}

	//退出
	var logout = function(){
 		var logoutBtn = document.getElementById('logout-btn');
 		if(!logoutBtn) return;
 		logoutBtn.addEventListener('click',function(){
 			alert()
			$.ajax({
				type: 'get',
				dataType: 'json',
				url: NODE+'/user/logout',
				data:{},
				success: function(res) {
					if(res.retCode ===0){
						window.location.href='/';
						return;
					}
					alertInfo(res.msg || '退出失败');
				},
				error:function(res){
					alertInfo('退出失败');
				}
			})
 		},false);
	}

	//更新个人信息
	var updateInfo = function(){
		var oForm = document.getElementById('update-form');
		if(!oForm) return;
		var oGenderValue = oForm.gender.value;
		var oBtn = document.getElementById('update-btn');
		var postInfo = function(e){
			e.preventDefault();
			if(oForm.realName.value !== ''){
				if(oForm.realName.value.length < 2){
					alertInfo('用户名不能少于2位');
					oForm.realName.blur();
					oForm.realName.focus();
					return;
				}
			}
			if(oForm.email.value !== ''){
				//645298225@qq.com
				if(!/^\w+@\w+\.\w+$/g.test(oForm.email.value)){
					alertInfo('邮箱格式错误');
					oForm.email.blur();
					oForm.email.focus();
					return;
				}
			}
			if(oForm.mobile.value !== ''){
				if(!/^1[3-9]{1}[0-9]{9}$/.test(oForm.mobile.value)){
					alertInfo('手机号码格式错误');
					oForm.mobile.blur();
					oForm.mobile.focus();
					return;
				}
			}
			if(!oForm.realName.value && !oForm.email.value && !oForm.mobile.value && oForm.gender.value === oGenderValue){
				alertInfo('请修改后再提交');
				return;
			}
			$.ajax({
				type:'post',
				dataType:'json',
				url:NODE+'/user/update',
				data:$(oForm).serialize(),
				success:function(res){
					if(res.retCode === 0 ){
						alertInfo('更新成功');
						setTimeout(function(){
							window.location.reload();
						},1000)
						return;
					}
					alertInfo(res.msg || '更新失败');
				},
				error:function(){
					alertInfo('更新失败');
				}
			})
		}
		oBtn.addEventListener('click',function(e){
			postInfo(e)
		},false)
	}

	//修改密码
	var modifyPassword = function(){
		var oForm= document.getElementById('modify-password');
		if(!oForm) return;
		var postInfo = function(){
			if(oForm.opassword.value.length < 6){
				alertInfo('密码不能少于6位');
				oForm.opassword.blur();
				oForm.opassword.focus();
				return;
			}
			if(oForm.npassword.value.length < 6){
				alertInfo('密码不能少于6位');
				oForm.npassword.blur();
				oForm.npassword.focus();
				return;
			}
			if(oForm.npassword.value === oForm.opassword.value){
				alertInfo('新旧密码不能相同');
				oForm.npassword.blur();
				oForm.npassword.focus();
				return;
			}
			if(oForm.npassword.value !== oForm.repassword.value){
				alertInfo('新密码两次输入不一致');
				oForm.repassword.blur();
				oForm.repassword.focus();
				return;
			}
			$.ajax({
				type:'post',
				dataType:'json',
				url:NODE+ '/user/modifyPassword',
				data:$(oForm).serialize(),
				success:function(res){
					if(res.retCode === 0 ){
						alertInfo('修改成功,请用新密码登录');
						oForm.reset();
						setTimeout(function(){
							window.location.href='/api/user/logout';
						},1500);
						return;
					}
					alertInfo(res.msg || '修改失败');
				},
				error:function(){
					alertInfo('修改失败');
				}
			})
		}
		var oBtn = document.getElementById('modify-btn');
		if(!oBtn) return;
		$(oBtn).on('click',postInfo)
	}

	//留言
	var postMessage = function(){
		var oForm = document.getElementById('message-form');
		if(!oForm) return;
		var oBtn = document.getElementById('post-btn');
		var postInfo = function(e){
			e.preventDefault();
			
			if(oForm.postName.value.length < 2){
				alertInfo('姓名不能少于2位');
				oForm.postName.blur();
				oForm.postName.focus();
				return;
			}
		
		
			//645298225@qq.com
			if(!/^\w+@\w+\.\w+$/g.test(oForm.postEmail.value)){
				alertInfo('邮箱格式错误');
				oForm.postEmail.blur();
				oForm.postEmail.focus();
				return;
			}
			
			$.ajax({
				type:'post',
				dataType:'json',
				url:NODE+'/message/post',
				data:$(oForm).serialize(),
				success:function(res){
					if(res.retCode === 0 ){
						alertInfo('留言成功');
						oForm.reset();
						return;
					}
					alertInfo(res.msg || '留言失败');
				},
				error:function(){
					alertInfo('留言失败');
				}
			})
		}
		oBtn.addEventListener('click',function(e){
			postInfo(e)
		},false)
	}
// var reader = new FileReader();
// 	reader.readAsDataURL(file)
// 	reader.onload = function(e){
// 		avatarData= e.target.result;
// 		console.log(e)
// 		var jcropImg = logBox.find('.modal-body');
// 		var img = '<img id="haha" src="'+avatarData+'">';
// 	    var jcropApi=null;
//         jcropImg.html(img);   
// 	    logBox.modal('show');
// 	    if(logBox.hasClass('in')){
// 	    	jcropImg.find('img').Jcrop({
// 	    		aspectRatio:1,
// 	    		setSelect:[0,0,100,100],
// 	    		boxWidth:300,
// 	    		touchSupport:true
// 	    	},function(){
//                 jcropApi = this;
// 	    	});
// 	    }
// 	    var sendCoods = function(){
//     		$('#send').off('click',sendCoods);
//     		var coords = {};
//     		var userImgSrc = '';
//     		coords = jcropApi.tellSelect();
//     		console.log(coords)
//     		coords['baseCode'] = avatarData.substring(avatarData.indexOf(',')+1);
// 	    	var request = $.ajax({
//             	type:'post',
//             	dataType:'json',
//                 data:coords,
//                 url:NODE+'/user/uploadBase64Avatar',
//                 success:function(data){
//                 	console.log(data)
//                 	if(data.retCode !== 0){
//                 		logBox.modal('hide');
//                 		alertInfo(data.msg || '上传失败');
//                 	}else{
//                 		alertInfo(data.msg || '上传成功');
//                 		avatarImg[0].src="/public/avatar/"+data.data.avatar;
//                 		logBox.modal('hide');
//                 	}
//                 	jcropImg.html('');   
//                 },
//                 error:function(data){
//                 	return false;
                	
//                 }
//             });
//     	}
// 	    $('#send').on('click',sendCoods);

// 	}
	//头像上传
	var uploadAvatar = function(){
		var avatarInput = $('#upload-avatar');
		var avatarImg = $('#avatar-img');
		var avatarData = '';
		avatarInput.on('change',function(e){
			var file = $(this)[0].files[0];
			
			var logBox = $('#log-box');
			var jropBox = $('#jcrop-box');

			
			if(!/^image\/(png|jpg|gif)/ig.test(file.type)){
				alertInfo('请上传图片类型');
				return;
			}
			var M = 1024*1024*5;
			if(file.size > 5*M){
				alertInfo('图片不能大于5M');
				return;
			}
			var formData = new FormData();
			formData.append('avatar',file);
			$.ajax({
				type:'post',
				data:formData,
				cache:false,
				contentType: false, 
                processData: false,
				url:NODE+'/user/uploadAvatar',
				success:function(res){
					if(res.retCode === 0){
						var jcropImg = logBox.find('.modal-body');
						var img = '<img id="haha" src="/public/avatar/'+res.data.avatarName+'">';
					    var jcropApi=null;
		                jcropImg.html(img);   
					    logBox.modal('show');
					    if(logBox.hasClass('in')){
					    	jcropImg.find('img').Jcrop({
					    		aspectRatio:1,
					    		setSelect:[0,0,100,100],
					    		boxWidth:300,
					    		touchSupport:true
					    	},function(){
		                        jcropApi = this;
					    	});
					    }
					    var sendCoods = function(){
				    		$('#send').off('click',sendCoods);
				    		var coords = {};
				    		var userImgSrc = '';
				    		coords = jcropApi.tellSelect();
				    		console.log(coords)
					    	var request = $.ajax({
		                    	type:'post',
		                    	dataType:'json',
		                        data:coords,
		                        url:NODE+'/user/avatarCrop',
		                        success:function(data){
		                        	console.log(data)
		                        	if(data.retCode !== 0){
		                        		logBox.modal('hide');
		                        		alertInfo(data.msg || '上传失败');
		                        	}else{
		                        		alertInfo(data.msg || '上传成功');
		                        		avatarImg[0].src="/public/avatar/"+data.data.avatarName;
		                        		logBox.modal('hide');
		                        	}
		                        	jcropImg.html('');   
		                        },
		                        error:function(data){
		                        	return false;
		                        	
		                        }
		                    });
				    	}
					    $('#send').on('click',sendCoods);
						return;
					}
					alertInfo('更新失败');
				},
				error:function(){
					alertInfo('更新失败');
				}
			});
		});
	}

	$(function() {
		fullHeight();
		centerBlock();
		responseHeight()
		mobileMenuOutsideClick();
		offcanvasMenu();
		burgerMenu();
		toggleBtnColor();
		contentWayPoint();


		userLogin();
		userRegister();
		logout();
		updateInfo();
		modifyPassword();
		postMessage();
		uploadAvatar();
	});


}());