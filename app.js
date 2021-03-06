var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var trainAdd = require('./routes/trainAdd');
var tainGet = require('./routes/trainGet');
var rptGet = require('./routes/rptGet');
var trainBegin = require('./routes/trainBegin');
var trainEnd = require('./routes/trainEnd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({    
  extended: true
}));


//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'chart')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/train/add',trainAdd);
app.use('/train/getall',tainGet);
app.use('/train/getrpt',rptGet);
app.use('/train/begin',trainBegin);
app.use('/train/end',trainEnd);

// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('./db/dbconf');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
