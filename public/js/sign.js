$(function(){
	var name = $('#name').val();
	var password = $('#password').val();
	var postObj = {
		name:name,
		password:password
	}
	$('#sub').on('click', function(e) {
		console.log(postObj)
	    e.preventDefault()
	    $.ajax({
	        type: 'post',
	        dataType: 'json',
	        url: 'http://127.0.0.1:3000/api/sign/login',
	        data:postObj,
	        success: function(res) {
	            console.log(res)
	        }
	    })
	    return false
	})
})
