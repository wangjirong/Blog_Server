var express = require('express');
var Router = express.Router();
const multer = require('multer')
const Blog = require('../models/Blog.js')
const Resource = require('../config/resource')
/* GET users listing. */
Router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

Router.get('/index', function (req, res, next) {
    Blog.find().sort({
        date: -1
    }).limit(3).then(array => {
        res.status(200).send(array);
    }).catch(error => {
        throw error;
    })
});

Router.get('/detailBlog', (req, res, next) => {
    Blog.findById(req.query._id).then(blog => {
        res.status(200).send(blog);
    }).catch(error => {
        throw error;
    })
})

Router.get('/allBlog', (req, res, next) => {
    Blog.find().sort({
        id: -1
    }).then(array => {
        res.status(200).send(array);
    }).catch(error => {
        throw error;
    })
})
let time = '';
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/coverImage');
    },
    filename: (req, file, callback) => {
        time = Date.now() + '-';
        callback(null, time + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

Router.post('/addBlog', upload.single('file'), (req, res, next) => {
    const newBlog = {
        title: req.body.title,
        state: req.body.state,
        classification: req.body.classification,
        type: req.body.type,
        md: req.body.md,
        coverimg: `${Resource.serverLocalhostRootURL}/static/coverImage/${time}${req.file.originalname}`,
    }
    new Blog(newBlog).save().then(blog => {
        console.log(blog);
    })
    time = '';
    res.status(200).send('success')
})

Router.delete('/deleteBlog', async (req, res, next) => {
    Blog.deleteOne({
        _id: req.body._id
    }).then(isDel => {
        res.status(200).send("Success");
    }).catch(error => {
        throw error;
    })


})
module.exports = Router;