var oEditor = document.getElementById('editor');
var ue = !!oEditor && UE.getEditor('editor');

//添加文章
var addArticle = function(){
	if(window.location.href.indexOf('addArticle') === -1) return;
	var catecoryType = $('#category'),
		isHot = $('#is-hot'),
		leadText = $('#lead-text'),
		title = $('#title');
	var addBtn = $('#add-article-btn');
	var content = ue;
    var _reset = function(){
    	catecoryType[0].options[0].selected = true;
    	isHot[0].options[0].selected = true;
    	title.val('');
    	leadText.val('');
    	ue.setContent('');
    	ue.reset();
    }
	var _postInfo = function(){
		var _catecoryTypeVal = parseInt(catecoryType.val());
		var _isHotVal = parseInt(isHot.val());
		var _titleVal = title.val();
		var _leadText = leadText.val();
		var _contentVal = content.getContent();
		if(_titleVal.length < 2){
			alertInfo('标题不能为空');
			return;
		}
		if(_leadText.length < 2){
			alertInfo('导读不能为空');
			return;
		}
		if(content.getContentLength()< 6){
			alertInfo('文章内容不能少于6位');
			return;
		}
		// UE.utils.unhtml(_contentVal)

		var obj = {
			category:_catecoryTypeVal,
			isHot:_isHotVal,
			title:_titleVal,
			leadText:_leadText,
			content:UE.utils.unhtml(_contentVal)
		}
		$.ajax({
			type:'post',
			dataType:'json',
			url:'/api/article/addArticle',
			data:obj,
			success:function(res){
				console.log(res);
				if(res.retCode === 0){
					_reset();
					alertInfo('发布成功');
					return;
				}
				alertInfo(res.msg || '发布失败');
			},
			error:function(){
				alertInfo('发布失败');
			}
		});
	}
	addBtn.on('click',_postInfo);
}

//修改文章
var editArticle = function(){
	if(window.location.href.indexOf('editArticle') === -1) return;
	var _id = window.location.href.slice(-24);
	var categoryType = $('#category'),
		isHot = $('#is-hot'),
		leadText = $('#lead-text'),
		title = $('#title');
	var addBtn = $('#add-article-btn');
	var content = ue;

	//设置内容
	var setArticle = function(data,fn){
		//设置类别
		for(var i = 0 ;i < categoryType[0].options.length;i++){
			if(categoryType[0].options[i].value == data.data.category){
				categoryType[0].options[i].selected = true;
			}
		}
		//设置置顶
		for(var i = 0 ;i < isHot[0].options.length;i++){
			if(isHot[0].options[i].value == data.data.isHot){
				isHot[0].options[i].selected = true;
			}
		}
		//设置标题
		title.val(data.data.title);
		//设置导读
		leadText.val(data.data.leadText);
		//设置ue内容//必须在ready事件后使用setContent
		UE.getEditor('editor').addListener('ready', function () { 
			UE.getEditor('editor').setContent(UE.utils.html(data.data.content));
			fn && fn();
		});
	}

	//提交内容
	var postInfo = function(_id){
		var _categoryTypeVal = parseInt(categoryType.val());
		var _isHotVal = parseInt(isHot.val());
		var _titleVal = title.val();
		var _leadText = leadText.val();
		var _contentVal = content.getContent();
		if(_titleVal.length < 2){
			alertInfo('标题不能为空');
			return;
		}
		if(_leadText.length < 2){
			alertInfo('导读不能为空');
			return;
		}
		if(content.getContentLength()< 6){
			alertInfo('文章内容不能少于6位');
			return;
		}
		// UE.utils.unhtml(_contentVal)

		var obj = {
			id:_id,
			category:_categoryTypeVal,
			isHot:_isHotVal,
			title:_titleVal,
			leadText:_leadText,
			content:UE.utils.unhtml(_contentVal)
		}
		$.ajax({
			type:'post',
			dataType:'json',
			url:'/api/article/editArticle',
			data:obj,
			success:function(res){
				console.log(res);
				if(res.retCode === 0){
					alertInfo('修改成功');
					return;
				}
				alertInfo(res.msg || '修改失败');
			},
			error:function(){
				alertInfo('修改失败');
			}
		});
	}
	$.ajax({
		type:'get',
		dataType:'json',
		url:'/api/article/getArticleDetail',
		data:{id:_id},
		success:function(data){
			console.log(data);
			if(data.retCode !== 0){
				alertInfo('获取文章信息失败');
				return;
			}
			setArticle(data, function(){
				addBtn.on('click', function(){
					postInfo(data.data._id);
				});
			});

		},
		error:function(){
			alertInfo('获取文章信息失败');
		}
	});
}

//删除文章
var delArticle = function(){
	var articleListVm = $('#article-list-vm');
	var postInfo = function(_id,callBack){
		Modal.confirm({msg: '确定删除该文章'}).on(function(e){
	        if(!!e){
	            $.ajax({
	                type:'get',
	                data:{id:_id},
	                dataType:'json',
	                url:'/api/article/delArticle',
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
	articleListVm.on('click','.delete-btn', function(){
		var $this = $(this);
		var _id = $this.attr('data-id');
		if(!_id || _id.length !== 24){
			alertInfo('无关键信息');
			return;
		}
		postInfo(_id,function(){
			$this.parent().parent().remove();
		});
	})
}

$(function(){
	SyntaxHighlighter.all();
	addArticle();
	editArticle();
	delArticle();
});