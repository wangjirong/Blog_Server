var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var managersRouter = require('./routes/manager');
var blogsRouter = require('./routes/blog');
var diaryRouter = require('./routes/diary');
const history = require('connect-history-api-fallback')

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/',express.static(path.join(__dirname, 'static')));
app.use('/', indexRouter);
app.use('/manager', managersRouter);
app.use('/blog', blogsRouter);
app.use('/diary', diaryRouter);
app.use(history());

const ejs = require('ejs')
app.set("views", __dirname + "/views");    //    '/views代表存放视图的目录'

//启动视图引擎，并指定模板文件文件类型：ejs
app.set('view engine', 'ejs')
 
 
//模板类型指定为html
app.engine('html',ejs.__express)
 
//启动视图引擎
app.set('view engine','html')


const mongoose = require('mongoose');
const MongoURL = require('./config/resource').MongoDBURL;
mongoose.connect(MongoURL, {
  useNewUrlParser: true
},(err,conn)=>{
  if(err) throw err;
  else if(conn) console.log("DataBase is connected in 27017!");
});
module.exports = app;
