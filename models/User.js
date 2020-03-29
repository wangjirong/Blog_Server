const mongoose = require('mongoose');
module.exports = User = mongoose.model('User', new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    id: {
        type: Number
    },
    node_id: {
        type: String
    },
    avatar_url: {
        type: String
    },
    name: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    type:{
        type:String
    }
}))