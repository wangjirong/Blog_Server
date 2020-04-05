const mongoose = require('mongoose')
module.exports = Blog = mongoose.model('mdfile', new mongoose.Schema({
    //标题
    title:{
        type:String,
        required:true
    },
    //解释
    state:{
        type:String,
        required:true,
    },
    //封面
    coverimg:{
        type:String,
        required:true,
    },
    //博客发布日期
    date:{
        type:Date,
        default:new Date()
    },
    //分类
    classification:{
        type:String,
        required:true
    },
    //阅读人数
    readerNum:{
        type:Number,
        default:0,
    },
    //留言数量
    commentNum:{
        type:Number,
        default: 0
    },
    //类型---原创、转载
    type:{
        type:String,
        required:true
    },
    md:{
        type:String,
        required:true
    }
}))