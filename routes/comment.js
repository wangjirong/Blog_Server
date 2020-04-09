const express = require('express');
const Router = express.Router();
const Comment = require('../models/Comment')
const CommentReply = require('../models/CommentReply')
const Blog = require('../models/Blog')

Router.get('/', (req, res, next) => {
    res.status(200).send("success")
})
//发表评论--评论数量+1
Router.post('/sendComment', async (req, res, next) => {
    const comment = req.body;
    const article_id = req.query.article_id;
    const user = await getUserByOpenId(comment.userId);

    const newComment = await new Comment({
        article_id,
        userId: comment.userId,
        userName: user.name,
        userAvatar: user.figureurl,
        date: new Date(),
        text: comment.text,
    }).save();
    await Blog.update({
        _id: article_id
    }, {
        '$inc': {
            commentNum: +1
        }
    });
    console.log(newComment);
    res.status(200).send("success");
})
//获取全部评论
Router.get('/getAllComments', async (req, res, next) => {
    const article_id = req.query.article_id;
    const comments = await Comment.find({
        article_id,
    }).sort({
        date: -1
    });
    for (let comment of comments) {
        comment.replys = await getAllCommentsReplys(article_id, comment._id);
    }
    console.log(comments);
    res.status(200).send(comments)
})


//发表文章评论回复--评论数量+1
Router.post('/sendCommentReply', async (req, res, next) => {
    const reply = req.body;
    const article_id = req.query.article_id;
    const fromUser = await getUserByOpenId(reply.fromUserId)
    const toUser = await getUserByOpenId(reply.toUserId)
    const messageReply = await new CommentReply({
        article_id,
        parentId: reply.parentId,
        fromUserId: reply.fromUserId,
        fromUserName: fromUser.name,
        fromUserAvatar: fromUser.figureurl,
        toUserId: reply.toUserId,
        toUserName: toUser.name,
        text: reply.text,
        date: new Date(),
        adress: reply.adress,
        browser: reply.browser
    }).save();
    await Blog.update({
        _id: article_id
    }, {
        '$inc': {
            commentNum: +1
        }
    })
    console.log(messageReply);
    res.status(200).send(messageReply);
})

//根据文章ID查找文章评论所有回复
async function getAllCommentsReplys(article_id, parentId) {
    return new Promise((resolve, reject) => {
        console.log(article_id, parentId);

        CommentReply.find({
            article_id,
            parentId,
        }).then(commentsReplys => {
            console.log(commentsReplys);

            resolve(commentsReplys);
        }).catch(error => {
            reject(error);
        })
    })
}

//根据openId查找qq用户
function getUserByOpenId(openId) {
    return new Promise((resolve, reject) => {
        QQ_User.findOne({
            id: openId
        }).then(user => {
            resolve(user)
        }).catch(error => {
            reject(error);
        })
    })
}





module.exports = Router;