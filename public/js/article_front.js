


//获取文章列表
var getArticleList = function(index,size){
    var pager = $('#article-list-pagination');
    var artVm = $('#article-list-vm');
    var _pageIndex = index || 1, _pageSize = size || 4;
    if(!pager[0] || !artVm[0]) return;
    $.ajax({
        type:'get',
        dataType:'json',
        data:{pageIndex:_pageIndex,pageSize:_pageSize},
        url:'/api/article/getArticleList',
        success:function(res){
            if(res.retCode ===0 ){
                var _totalPage = Math.ceil(res.total/_pageSize);
                var pageStr = commonPage({
                    active: 'active',
                    //左右显示两个
                    showPage: 2
                    //第1页，
                })(_pageIndex, _totalPage);
                pager.html(pageStr);
                template.config('escape',false);
                var html = template('article-list-tpl',{dataList:res.data});
                artVm.html(html);
                template.config('escape',true);
                return;
            }
            alertInfo('获取分页失败');
        },
        error:function(){
            alertInfo('获取分页失败');
        }
    });
}
var articlePagerClick = function(){
    var pager = $('#article-list-pagination')
    pager.on('click','a',function(){
        var $this = $(this);
        var pageIndex = $this.attr('data-bind');
        if(!pageIndex) return;
        getArticleList(pageIndex);
    });
}



$(function(){
	getArticleList(1);
	articlePagerClick()
});