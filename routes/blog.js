var express = require('express');
var Router = express.Router();
const multer = require('multer')
const aliOSSUpload = require('../uploads')

const Blog = require('../models/Blog.js')
const Comment = require('../models/Comment')
const CommentReply = require('../models/CommentReply')
const QQUser = require('../models/QQ_User');

const Resource = require('../config/resource')
/* GET users listing. */
Router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//首页三篇文章----置顶推荐
Router.get('/index', function (req, res, next) {
    Blog.find().sort({
        date: -1
    }).limit(3).then(array => {
        res.status(200).send(array);
    }).catch(error => {
        throw error;
    })
});

//博客详情—---根据文章ID唯一标识符---文章阅读量+1
Router.get('/detailBlog', async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.query._id, {
        '$inc': {
            readerNum: +1
        }
    });
    res.status(200).send(blog);
})

//获取所有博客-置顶文章-热门文章-最近访客
Router.get('/allBlog', async (req, res, next) => {
    //查找所有文章，按照时间降序排列
    const allBlogs = await Blog.find();
    //获取top5文章
    const hotTop5 = await getHotTop5Articles();
    //获取置顶推荐3篇文章
    const recommendTop3 = await getTopRecommendedArticles();
    //获取最近登录人
    const recentUser = await getRecentUser();
    if (allBlogs && hotTop5) res.status(200).send({
        allBlogsCount: allBlogs.length,
        hotTop5,
        recommendTop3,
        recentUser
    });

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
Router.post('/addBlog', upload.single('file'), async (req, res, next) => {
    const result = await aliOSSUpload.uploadImage('Blog-Cover-Image/' + req.file.originalname, `static/coverImage/${time}${req.file.originalname}`)
    console.log(result);
    const newBlog = {
        title: req.body.title,
        state: req.body.state,
        classification: req.body.classification,
        type: req.body.type,
        md: req.body.md,
        date: new Date(),
        coverimg: result.url
    }
    //删除本地文件
    await aliOSSUpload.deleteImage(`static/coverImage/${time}${req.file.originalname}`);

    await new Blog(newBlog).save()
    time = '';
    res.status(200).send('success')
})

//删除文章--根据文章唯一标识_id
Router.delete('/deleteBlog', async (req, res, next) => {
    const flag = await deleteBlog(req.body._id);
    if (flag) res.status(200).send("删除成功");
    else res.status(400).send("删除失败");
})

//根据关键词搜索博客文章
Router.get('/searchBlogByKeyword', async (req, res, next) => {
    const keyword = req.query.keyword;
    console.log(keyword);
    const blogArr = await searchBlogByKeyword(keyword);
    console.log(blogArr);

    res.status(200).send(blogArr);

})

//分页功能，根据分页大小和当前页获取数据
Router.get('/getBlogByPageSize_Index', async (req, res, next) => {
    const pageSize = req.query.pageSize;
    const pageIndex = req.query.pageIndex;
    const result = await getBlogsByPage(pageIndex, pageSize);
    if (result) res.status(200).send(result);
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

//根据关键词进行模糊查询文章---作者、标题、描述.......
async function searchBlogByKeyword(keyword) {
    return new Promise(async (resolve, reject) => {
        const regx = new RegExp(keyword, 'i');
        const res = await Blog.find({
            '$or': [{
                    title: {
                        $regex: regx
                    }
                },
                {
                    state: {
                        $regex: regx
                    }
                },
                {
                    classification: {
                        $regex: regx
                    }
                },
            ]
        });
        if (res) resolve(res);
        else reject(new Error());
    })
}

//获取热门HotTop5文章，阅读量最多的5篇
async function getHotTop5Articles() {
    return new Promise((resolve, reject) => {
        Blog.find().sort({
            readNum: -1
        }).limit(5).then(array => {
            resolve(array);
        }).catch(error => {
            reject(error);
        })
    })
}

//获取置顶推荐3篇文章,评论数量最多的三篇
async function getTopRecommendedArticles() {
    return new Promise((resolve, reject) => {
        Blog.find().sort({
            commentNum: -1
        }).limit(3).then(array => {
            resolve(array);
        }).catch(error => {
            reject(error);
        })
    })
}

//获取文章评论数量--根据文章唯一标识_id
async function getCommentCount(id) {
    return new Promise(async (resolve, reject) => {
        const com = await Comment.find({
            article_id: id
        });
        const comReply = await CommentReply.find({
            article_id: id
        });
        if (com && comReply) resolve(com.length + comReply);
        else reject(new Error())
    })
}

//获取最近登录人----头像和名字
async function getRecentUser() {
    return new Promise((resolve, reject) => {
        QQUser.find().sort({
            date: -1
        }).limit(9).then(userArray => {
            const userList = [];
            userArray.forEach(user => {
                userList.push({
                    userAvatar: user.figureurl,
                    userName: user.name
                })
            })
            resolve(userList);
        }).catch(error => {
            reject(error);
        })
    })
}

//分页功能，根据页面大小和当前页动态获取文章
async function getBlogsByPage(pageIndex, pageSize) {
    return new Promise((resolve, reject) => {
        Blog.find().skip((parseInt(pageIndex) - 1) * parseInt(pageSize)).limit(parseInt(pageSize)).then(res => {
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    })
}

module.exports = Router;