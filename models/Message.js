const mongoose = require('mongoose');
module.exports = Message = mongoose.model("Message", new mongoose.Schema({
    user_id: {
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
    date: {
        type: String,
        default: Date.now()
    },
    text: {
        type: String,
        required: true
    },
    adress: {
        type: String,
    },
    brower: {
        type: String
    },
    replys: {}
}))