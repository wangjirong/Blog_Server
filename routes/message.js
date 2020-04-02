const express = require('express');
const Router = express.Router();
const Message = require('../models/Message');
const User = require('../models/QQ_User');

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})
Router.post('/leaveMessage', async (req, res, next) => {
    const message = req.body;
    const newMessage = await new Message({
        user_id: message.user_id,
        date: message.date,
        text: message.text,
        adress: message.adress,
        brower: message.browerType
    }).save();
    console.log(message);

    res.status(200).send(newMessage);
})
Router.get('/getAllMessages', async (req, res, next) => {
    const messages = await Message.find();
    messages.forEach( async message => {
        message.user = await getUserByOpenId(this.id);
    })
    console.log(messages);
    
    res.status(200).send(messages);
})
Router.post('/reply', async (req, res, next) => {

})

function getUserByOpenId(openId) {
    return Promise((resolve, reject) => {
        User.find({
            id: openId
        }).then(user => {
            resolve(user)
        }).catch(error => {
            reject(error);
        })
    })
}
module.exports = Router;