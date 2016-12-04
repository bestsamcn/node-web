var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cors = require('cors');


var bodyParser = require('body-parser');



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


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

var config = {
    name: 'nsessionid',
    secret: 'node-1',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    sessionStore: {
        host: 'localhost',
        port: '6379',
        db: 1,
        ttl: 60 * 60 * 24,
        logErrors: true
    }
}


app.use(session({
    name: config.name,
    store: new RedisStore(config.sessionStore),
    resave: false,
    saveUninitialized: true,
    cookie: config.cookie,
    secret: config.secret
}));

//跨域
app.use(cors({ credentials: true, origin: true }));


//___dirname最后没有斜杠 ，指定'/public'为静态文件目录后，引入静态文件可以使用'/publick/xxxx'
//指定静态目录后，也会解决了mimetype的问题
app.use('/public', express.static(__dirname + '/public'));

//更新当前用户信息
require('./api/index').getMe(app);

//router
var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
var userRouter = require('./routes/user');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var pictureRouter = require('./routes/picture');
var servicesRouter = require('./routes/services');
app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/user', userRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/picture', pictureRouter);
app.use('/services', servicesRouter);


//api
var userApi = require('./api/user');
var randomApi = require('./api/random');
var messageApi = require('./api/message');
app.use('/api/user', userApi);
app.use('/api/random', randomApi)
app.use('/api/message', messageApi)





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
