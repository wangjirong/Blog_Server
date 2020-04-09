const mongoose = require('mongoose');
module.exports = MessageReply = mongoose.model("MessageReply", new mongoose.Schema({
    parentId: {
        type: String,
        required: true
    },
    fromUserId: {
        type: String,
        required: true
    },
    fromUserName: {
        type: String,
        required: true
    },
    fromUserAvatar: {
        type: String,
        required: true
    },
    toUserId: {
        type: String,
        required: true
    },
    toUserName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date()
    },
    adress: {
        type: String,
    },
    browser: {
        type: String
    },
}))