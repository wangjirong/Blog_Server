const express = require('express');
const Router = express.Router();
const multer = require('multer');
const Diary = require('../models/Diary.js');
const Resource = require('../config/resource')

let time = '';
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/diaryImage');
    },
    filename: (req, file, callback) => {
        time = Date.now() + '-';
        callback(null, time + file.originalname);
    }
})

const upload = multer({ storage: storage });

Router.post('/addDiary', upload.array('files'), async (req, res, next) => {
    const fileArray = req.files;
    let filePath = [];
    fileArray.forEach(img => {
        let path = `${Resource.serverRootURL}/static/diaryImage${time}${img.originalname}`;
        filePath.push(path);
        new Diary({
            text: req.body.text,
            imgList: filePath
        }).save().then(diary => {
        }).catch(error => {
            throw error;
        })
    })
    res.status(200).send("success");
})
Router.get('/getAllDiary', async (req, res, next) => {
    Diary.find().sort({ date: 1 }).then(diaryArray => {
        res.status(200).send(diaryArray);
    }).catch(error => {
        throw error;
    })
})
module.exports = Router;