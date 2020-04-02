const mongoose = require('mongoose');
module.exports = User = mongoose.model('User', new mongoose.Schema({
    //用户Id,唯一标识符 qq____openid
    id: {
        type: String,
        required:true
    },
    //用户名
    name: {
        type: String,
        required:true
    },
    //头像地址
    figureurl: {
        type: String,
        required:true
    },
    //大头像地址
    figureurl_qq: {
        type: String,
        required:true
    },
    //性别
    gender:{
        type:String,
        required:true
    },
    //第一次登录时间
    created_at: {
        type: Date,
        default: new Date()
    },
    lastLoginTime:{
        type:Date,
        required:true
    }
}))