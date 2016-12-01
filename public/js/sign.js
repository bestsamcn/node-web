$(function(){
	
    //登录
	$('#login-sub').on('click', function(e) {
	    e.preventDefault()
		var name = $('#name').val();
		var password = $('#password').val();
		var postObj = {
			name:name,
			password:password
		}
	    $.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: 'http://10.28.5.197:3000/api/sign/login',
	        data:postObj,
	        xhrFields:{
	        	withCredentials: true
	        },
	        success: function(res) {
	            if(res.retCode === 0){
	            	return
	            	window.location.href='/';
	            	return;
	            }
	            console.log(res.msg)
	        }
	    })
	});
	$('#logout-item').on('click', function(e) {
	    $.ajax({
	        type: 'get',
	        dataType: 'json',
	        url: 'http://localhost:3000/api/sign/logout',
	        xhrFields:{
	        	withCredentials: true
	        },
	        data:{},
	        success: function(res) {
	            if(res.retCode === 0){
	            	window.location.href='/';
	            	return;
	            }
	        }
	    })
	});
	//注册
	$('#register-sub').on('click', function(e) {
	    e.preventDefault()
		var name = $('#name').val();
		var password = $('#password').val();
		var postObj = {
			name:name,
			password:password
		}
	    $.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: 'http://localhost:3000/api/sign/register',
	        data:postObj,
	        success: function(res) {
	            console.log(res)
	        }
	    })
	});
})
