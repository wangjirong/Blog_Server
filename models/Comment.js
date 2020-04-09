const mongoose = require('mongoose');
module.exports = Comment = mongoose.model("Comment", new mongoose.Schema({
    article_id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userAvatar: {
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
    replys: {

    }
}))