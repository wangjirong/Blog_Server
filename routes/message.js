const express = require('express');
const Router = express.Router();
const Message = require('../models/Message');
const User = require('../models/QQ_User');
const MessageReply = require('../models/MessageReply');

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})
//留言
Router.post('/leaveMessage', async (req, res, next) => {
    const message = req.body;
    const newMessage = await new Message({
        user_id: message.user_id,
        date: message.date,
        text: message.text,
        adress: message.adress,
        brower: message.browserType
    }).save();
    res.status(200).send(newMessage);
})
//获得所有留言
Router.get('/getAllMessages', async (req, res, next) => {
    const messages = await Message.find();
    for (let message of messages) {
        const user = await getUserByOpenId(message.user_id);
        message.replys = await getAllReplyByUserId(message._id);
    }
    res.status(200).send(messages);
})

//回复留言
Router.post('/sendMessageReply', async (req, res, next) => {
    const reply = req.body;
    console.log(reply);
    const messageReply = await new MessageReply({
        parentId: reply.parentId,
        fromUserId: reply.fromUserId,
        toUserId: reply.toUserId,
        text: reply.text,
        adress: reply.adress,
        browser: reply.browser
    }).save();
    console.log(messageReply);
    res.status(200).send(messageReply);
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
        User.find({
            id: openId
        }).then(user => {
            const p_user = {
                userName: user.userName,
                avatar: user.figureurl,
                id: user.id
            }
            resolve(p_user)
        }).catch(error => {
            reject(error);
        })
    })
}
module.exports = Router;