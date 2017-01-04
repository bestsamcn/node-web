var ue = UE.getEditor('editor');
SyntaxHighlighter.all()
//添加文章
var addArticle = function(){
	var catecoryType = $('#category'),
		isHot = $('#is-hot'),
		title = $('#title');
	var addBtn = $('#add-article-btn');
	var content = ue;

	var _postInfo = function(){
		var _catecoryTypeVal = parseInt(catecoryType.val());
		var _isHotVal = parseInt(isHot.val());
		var _titleVal = title.val();
		var _contentVal = content.getContent();
		if(_titleVal.length < 2){
			alertInfo('标题不能为空');
			return;
		}
		if(content.getContentTxt().length < 6){
			alertInfo('文章内容不能少于6位');
			return;
		}
		var obj = {
			category:_catecoryTypeVal,
			isHot:_isHotVal,
			title:_titleVal,
			content:_contentVal
		}
		console.log(obj)
		$.ajax({
			type:'post',
			dataType:'json',
			url:'/api/article/addArticle',
			data:obj,
			success:function(res){
				console.log(res);
			},
			error:function(){
				alertInfo('发布失败');
			}
		});
	}
	addBtn.on('click',_postInfo);
}


$(function(){
	addArticle();
});