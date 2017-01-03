var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cors = require('cors');
var bodyParser = require('body-parser');
var redis = require('redis');
var reidsdb = redis.createClient();
var app = express();


// view engine setup
//模板是会缓存的，开发环境可以设置不缓存
var template = require('art-template');
template.config('base', '');
template.config('cache', false);
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
//过滤器
require('./artFilter');


//favicon
app.use(favicon(path.join(__dirname, '/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//redis
app.use(cookieParser());
var config = require('./config').redisConfig;
app.use(session({
    name: config.name,
    store: new RedisStore(config.sessionStore),
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: config.cookie,
    secret: config.secret
}));

//跨域
app.use(cors({
    credentials: true,
    origin: true
}));



//指定静态目录后，也会解决了mimetype的问题
app.use('/public', express.static(__dirname + '/public'));

//更新当前用户信息
require('./api/index').getMe(app);

//统计当前网站在线人数,放在路由前面，方便在路由中展示
app.use(function(req, res, next) {
    //以用户浏览器为标准，非会员登录
    var ua = req.headers['user-agent'];
    reidsdb.zadd('online', Date.now(), ua, next);
});

app.use(function(req, res, next) {
    var min = 60 * 1000;
    //上一分钟
    var ago = Date.now() - min;
    reidsdb.zrevrangebyscore('online', '+inf', ago, function(err, users) {
        if (err) return next(err);
        req.online = users;
        app.locals.onlineNumber = users.length
        next();
    });
});

app.use(require('./api/index').sensitiveInterceptor);
app.use(require('./api/index').userAccessLogs);

//api
var userApi = require('./api/user');
var randomApi = require('./api/random');
var messageApi = require('./api/message');
var adminApi = require('./api/admin');
var sensitiveApi = require('./api/sensitive');
app.use('/api/user', userApi);
app.use('/api/random', randomApi);
app.use('/api/message', messageApi);
app.use('/api/admin', adminApi);
app.use('/api/sensitive', sensitiveApi);


//router
var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
var userRouter = require('./routes/user');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var pictureRouter = require('./routes/picture');
var servicesRouter = require('./routes/services');
var mallRouter = require('./routes/mall');
var adminRouter = require('./routes/admin');
app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/user', userRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/picture', pictureRouter);
app.use('/services', servicesRouter);
app.use('/mall', mallRouter);
app.use('/admin', adminRouter);



app.use(function(req, res, next) {
        if (!req.session) {
            return next(new Error('oh no')) // handle error
        }
        next() // otherwise continue
    })
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;