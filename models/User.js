const mongoose = require('mongoose');
module.exports = User = mongoose.model('User', new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    avatar: {
        type: String,
    }
}))