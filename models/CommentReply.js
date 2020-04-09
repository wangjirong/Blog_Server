const mongoose = require('mongoose');
module.exports = CommentReply = mongoose.model("CommentReply", new mongoose.Schema({
    article_id: {
        type: String,
        required: true
    },
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