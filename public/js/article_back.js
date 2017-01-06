
var ue = UE.getEditor('editor');
console.log(ue)
SyntaxHighlighter.all()
//添加文章
var addArticle = function(){
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
				alertInf(res.msg || '发布失败');
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