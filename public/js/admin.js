
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
            str = str + ' ' + '<a href="javascript:;" data-bind="'+total+'">'+total +'</a>'+' '+'<a href="javascript:;" data-bind="'+(page+1)+'">下一页</a>';
        }
        return str;
    }
}
var memberListPager = function(){
	var pageStr = commonPage({
        active: 'active',
        showPage: 2
    })(1, 5);
    $('#mt-pagination')[0] && ($('#mt-pagination')[0].innerHTML = pageStr)
}




$(function(){
	memberListPager()
})