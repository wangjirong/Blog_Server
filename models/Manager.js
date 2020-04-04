const mongoose = require('mongoose');
module.exports = Manager = mongoose.model('Manager', new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    cellPhone: {
        type: String,
        required: true
    }
}))