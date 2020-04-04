var express = require('express');
var Router = express.Router();
const multer = require('multer')
const Blog = require('../models/Blog.js')
const Comment = require('../models/Comment')
const CommentReply = require('../models/CommentReply')

const Resource = require('../config/resource')
/* GET users listing. */
Router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//首页三篇文章
Router.get('/index', function (req, res, next) {
    Blog.find().sort({
        date: -1
    }).limit(3).then(array => {
        res.status(200).send(array);
    }).catch(error => {
        throw error;
    })
});

//博客详情—---根据文章ID唯一标识符
Router.get('/detailBlog', (req, res, next) => {
    Blog.findById(req.query._id).then(blog => {
        res.status(200).send(blog);
    }).catch(error => {
        throw error;
    })
})

//获取所有博客
Router.get('/allBlog', (req, res, next) => {
    Blog.find().sort({
        date: -1
    }).then(array => {
        res.status(200).send(array);
    }).catch(error => {
        throw error;
    })
})
let time = '';
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/coverImage');
    },
    filename: (req, file, callback) => {
        time = Date.now() + '-';
        callback(null, time + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

//添加文章
Router.post('/addBlog', upload.single('file'), (req, res, next) => {
    const newBlog = {
        title: req.body.title,
        state: req.body.state,
        classification: req.body.classification,
        type: req.body.type,
        md: req.body.md,
        date:new Date(),
        coverimg: `${Resource.serverRootURL}/static/coverImage/${time}${req.file.originalname}`,
    }
    new Blog(newBlog).save().then(blog => {
        console.log(blog);
    })
    time = '';
    res.status(200).send('success')
})

//删除文章--根据文章唯一标识_id
Router.delete('/deleteBlog', async (req, res, next) => {
    const flag = await deleteBlog(req.body._id);
    if (flag) res.status(200).send("删除成功");
    else res.status(400).send("删除失败");
})
//根据文章id删除博客-评论-回复
async function deleteBlog(id) {
    return new Promise(async (resolve, reject) => {
        let isdelBlog = false;
        Blog.findByIdAndDelete(id, (error, doc) => {
            if (error) reject(error);
            else if (doc) isdelBlog = true;
        })
        const isdelCom = await Comment.deleteMany({
            article_id: id
        });
        const isdelRep = await CommentReply.deleteMany({
            article_id: id
        });
        if (isdelBlog && isdelCom && isdelRep) resolve(true);
        else reject(false)
    })
}
module.exports = Router;