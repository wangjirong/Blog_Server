const express = require('express');
const Router = express.Router();
const multer = require('multer');
const fs = require('fs');

const Diary = require('../models/Diary.js');
const Resource = require('../config/resource')
const aliOSSUpload = require('../uploads')
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

const upload = multer({
    storage: storage
});

Router.post('/addDiary', upload.array('files'), async (req, res, next) => {
    const fileArray = req.files;
    let filePath = [];
    fileArray.forEach(async img => {
        let path = `${Resource.serverRootURL}/static/diaryImage/${time}${img.originalname}`;
        filePath.push(path);
    })
    // for (let img of fileArray) {
    //     const result = await aliOSSUpload.uploadImage("Diary-Image/" + img.originalname, `static/diaryImage/${time}${img.originalname}`)
    //     filePath.push(result.url);
    //     // await aliOSSUpload.deleteImage(`static/diaryImage${time}${img.originalname}`);
    // }
    await new Diary({
        text: req.body.text,
        imgList: filePath,
        date: new Date()
    }).save();
    res.status(200).send("success");
})
Router.get('/getAllDiary', async (req, res, next) => {
    Diary.find().sort({
        date: -1
    }).then(diaryArray => {
        res.status(200).send(diaryArray);
    }).catch(error => {
        throw error;
    })
})
module.exports = Router;