var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index'); //首页index
var managersRouter = require('./routes/manager'); //管理员
var usersRouter = require('./routes/user'); //普通用户
var blogsRouter = require('./routes/blog'); //博客
var diaryRouter = require('./routes/diary'); //日志
var messageRouter = require('./routes/message'); //留言
var commentRouter = require('./routes/comment'); //评论


const history = require('connect-history-api-fallback')

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/', express.static(path.join(__dirname, 'static')));

//本地服务使用
app.use('/', indexRouter);
app.use('/manager', managersRouter);
app.use('/user', usersRouter);
app.use('/blog', blogsRouter);
app.use('/diary', diaryRouter);
app.use('/message', messageRouter);
app.use('/comment', commentRouter);

//服务器使用
// app.use('/api/manager', managersRouter);
// app.use('/api/user', usersRouter);
// app.use('/api/blog', blogsRouter);
// app.use('/api/diary', diaryRouter);
// app.use('/api/message', messageRouter);
// app.use('/api/comment', commentRouter);


const ejs = require('ejs')
app.set("views", __dirname + "/views"); //    '/views代表存放视图的目录'

//启动视图引擎，并指定模板文件文件类型：ejs
app.set('view engine', 'ejs')


//模板类型指定为html
app.engine('html', ejs.__express)

//启动视图引擎
app.set('view engine', 'html')


const mongoose = require('mongoose');
const MongoURL = require('./config/resource').ServerMongoDBURLCirev1;

mongoose.connect(MongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err, conn) => {
  if (err) throw err;
  else if (conn) console.log("DataBase is connected in 27017!");
});
module.exports = app;