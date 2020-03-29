const express = require('express');
const Router = express.Router();
const User = require('../models/User');

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})
module.exports = Router;