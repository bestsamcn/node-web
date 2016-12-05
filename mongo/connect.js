var config = {
    mongodb: 'mongodb://10.28.5.197/users',
    database: 'users',
    server: '10.28.5.197'
}
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug',true);

var db = mongoose.connect(config.mongodb);
db.connection.on('error',function(error){
	console.log('数据库连接失败'+error);
});

db.connection.on('open',function(error){
	console.log('数据库连接成功');
});