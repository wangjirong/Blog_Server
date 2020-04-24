const express = require('express');
const Router = express.Router();
const multer =require('multer')


let time = '';
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/songs');
    },
    filename: (req, file, callback) => {
        time = Date.now() + '-';
        callback(null, time + file.originalname);
    }
})

const upload = multer({
    storage: storage
});
Router.post('/uploadSong',upload.array('files',3),async(req,res,next)=>{
    const files = req.files;
    res.send("success")
})

export  default Router