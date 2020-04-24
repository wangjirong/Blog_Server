const mongoose = require('mongoose');
module.exports = Song = mongoose.model('Song', mongoose.Schema({
    //歌曲名
    name: {
        type: String,
        required: true,
    },
    //专辑
    artist:{
        type:String,
        required:true,
    },
    //播放链接
    src: {
        type: String,
        required: true,
    },
    //封面
    cover: {
        type: String,
        required: true,
    },
    //歌词
    lrc: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default:new Date()
    },
}))