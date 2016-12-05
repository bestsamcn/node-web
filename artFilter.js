var template = require('art-template');
template.helper('roleFilter', function (role) {
    console.log(role)
    if(role === 1){
        return '管理员'
    }
    if(role === 2){
        return '超级管理员'
    }
    if(role === 0){
        return '会员'
    }
});

