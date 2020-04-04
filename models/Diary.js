const mongoose = require('mongoose');
module.exports = Diary = mongoose.model('diary', new mongoose.Schema({
    text: {
        type: String
    },
    imgList: {
        type: Array,
    },
    date: {
        type: Date,
        default: new Date()
    }
}))
