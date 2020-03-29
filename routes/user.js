const express = require('express');
const Router = express.Router();
const axios = require('axios');

const Resource = require('../config/resource')
const User = require('../models/User');

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})

Router.get('/gitHub_oAuth', async (req, res, next) => {
    const token_uri = 'https://github.com/login/oauth/access_token?' +
        `client_id=${Resource.GitHubClientID}&` +
        `client_secret=${Resource.GitHubClientSecret}&` +
        `code=${req.query.code}`;

    const access_token = await getToken(token_uri);
    const result = await getUser(access_token);
    const user = result.data;
    const isUser = await User.findOne({
        id: user.id
    });
    if (!isUser) {
        const newUser = {
            login: user.login,
            id: user.id,
            node_id: user.node_id,
            avatar_url: user.avatar_url,
            name: user.name,
            type: 'GitHub'
        }
        isUser = await new User(newUser).save();
    }
    res.status(200).send(isUser);
})

function getToken(url) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            headers: {
                accept: 'application/json'
            }
        }).then(res => {
            resolve(res.data.access_token);
        }).catch(error => {
            reject(error);
        })
    })
}

function getUser(token) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: 'https://api.github.com/user',
            headers: {
                accept: 'application/json',
                Authorization: `token ${token}`
            }
        }).then(res => {
            resolve(res);
        }).catch(error => {
            reject(error);
        })
    })
}

function isExisted(id) {
    return
}
module.exports = Router;