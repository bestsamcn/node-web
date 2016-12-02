;
(function() {

	'use strict';



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
	var NODE = 'http://10.28.5.197:3000/api';

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
			if(code.val().length !== 4){
				code[0].blur();
				code[0].focus();
				alertInfo('验证码为4位');
				return false;
			}
			$.ajax({
				type: 'post',
				dataType: 'json',
				url: NODE+'/sign/login',
				data: $('#login-form').serialize(),
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
				url: NODE+'/sign/register',
				data: $('#register-form').serialize(),
				xhrFields:{
					widthGredentials:true
				},
				success: function(res) {
					console.log(res)
					if(res.retCode ===0){
						window.location.href='/login';
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
        document.getElementById('logout-btn').onclick = function(){
        	alert()
        }
		$('#logout-btn').on('click',function(){
			alert()
			$.ajax({
				type: 'get',
				dataType: 'json',
				url: NODE+'/sign/logout',
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
		})
		
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
	});


}());