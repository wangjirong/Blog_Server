const mongoose = require('mongoose');
module.exports = Update = mongoose.model('Update',new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    date:{
        String:Date,
        default:Date.now()
    }
}))