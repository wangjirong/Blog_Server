const express = require('express');
const Router = express.Router();
const axios = require('axios');

const Resource = require('../config/resource')
const QQ_User = require('../models/QQ_User');

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

    const access_token = await getGitHubToken(token_uri);
    const result = await getGitHubUser(access_token);
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

Router.get('/qq_oAuth', async (req, res, next) => {
    const access_token = req.query.access_token;
    const openId = req.query.openId;
    console.log();
    
    let user = await QQ_User.findOne({
        id: openId
    })
    if (!user) {
        const qq_user = await getUserInfo(access_token, Resource.QQAppId, openId);
        console.log(qq_user);

        user = await new QQ_User({
            id: openId,
            name: qq_user.name,
            figureurl: qq_user.figureurl_2,
            figureurl_qq: qq_user.figureurl_qq_2,
            gender: qq_user.gender,
            lastLoginTime: new Date()
        }).save();
    }
    const qqUser = {
        userName: user.name,
        avatar: user.figureurl,
        id: openId,
    }
    res.status(200).send(qqUser);
})

function getGitHubToken(url) {
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

function getGitHubUser(token) {
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

function getUserInfo(access_token, appId, openId) {
    return new Promise((resolve, reject) => {
        const url = `https://graph.qq.com/user/get_user_info?access_token=${access_token}&oauth_consumer_key=${appId}&openid=${openId}`;
        console.log(url);
        axios.get(url).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
        })
    })
}


module.exports = Router;