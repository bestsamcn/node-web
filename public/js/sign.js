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
	        url: 'http://localhost:3000/api/sign/login',
	        data:postObj,
	        success: function(res) {
	            console.log(res)
	        }
	    })
	});
	//登录
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
