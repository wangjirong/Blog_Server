const express = require('express');
const Router = express.Router();
const Message = require('../models/Message');
const QQ_User = require('../models/QQ_User');
const MessageReply = require('../models/MessageReply');

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})

//留言
Router.post('/leaveMessage', async (req, res, next) => {
    const message = req.body;
    const user = await getUserByOpenId(message.user_id);
    const newMessage = await new Message({
        user_id: message.user_id,
        userName: user.name,
        userAvatar: user.figureurl,
        date: message.date,
        text: message.text,
        adress: message.adress,
        brower: message.browserType
    }).save();
    if (newMessage) res.status(200).send("success");
})

//获得所有留言
Router.get('/getAllMessages', async (req, res, next) => {
    const messages = await Message.find();
    for (let message of messages) {
        message.replys = await getAllReplyByUserId(message._id);
    }
    res.status(200).send(messages);
})

//回复留言
Router.post('/sendMessageReply', async (req, res, next) => {
    const reply = req.body;
    const fromUser = await getUserByOpenId(reply.fromUserId)
    const toUser = await getUserByOpenId(reply.toUserId)
    const messageReply = await new MessageReply({
        parentId: reply.parentId,
        fromUserId: reply.fromUserId,
        fromUserName: fromUser.name,
        fromUserAvatar: fromUser.figureurl,
        toUserId: reply.toUserId,
        toUserName: toUser.name,
        text: reply.text,
        adress: reply.adress,
        browser: reply.browser
    }).save();
    if (messageReply) res.status(200).send("success");
})

//根据根节点parentId用户id查找该评论下的所有留言回复
function getAllReplyByUserId(parentId) {
    return new Promise((resolve, reject) => {
        MessageReply.find({
            parentId,
        }).then(messageReplys => {
            resolve(messageReplys);
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