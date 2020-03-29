var express = require('express');
var Router = express.Router();
const nodeMailer = require('nodemailer');
const resource = require('../config/resource.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');

/*发送邮件 */
const mailTransporter = nodeMailer.createTransport({
  host: 'smtp.qq.com',
  service: 'qq',
  secureConnection: 'false',
  port: 465,
  auth: {
    user: resource.maril_SMTP_host,
    pass: "sozmxglatmkocagf"
  }
})
/* GET users listing. */
Router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//管理员登录
Router.post('/login', async (req, res, next) => {
  const manager = await Manager.findOne({
    userName: req.body.userName
  });
  const eleToken = "Bearer " + getEleToken(manager);
  if (manager) {
    const isRight = bcrypt.compareSync(req.body.password, manager.password)
    if (isRight) res.status(200).send({
      eleToken
    });
    else res.status(406).send("密码错误")

  } else res.status(404).send("账号错误")
})

//管理员注册
Router.post('/register', async (req, res, next) => {
  const manager = req.body;
  const invitationCode = parseInt(manager.invitationCode);
  if (invitationCode !== resource.InvitationCode) res.status(400).send(new Error("邀请码错误"));
  else {
    const password = manager.password;
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        manager.password = hash;
        const m = new Manager({
          userName: manager.userName,
          password: manager.password,
          email: manager.email,
          cellPhone: manager.cellphone
        }).save();
        if (m) res.status(200).send("注册成功")
        else res.status(406).send("注册失败");
      })
    })

  }
})
Router.post('/email', async (req, res, next) => {
  const email = req.body.email;
  const verificationCode = getVerificationCode()
  const mailOptions = {
    //发送邮件的地址
    from: resource.maril_SMTP_host,
    to: email,
    subject: resource.mail_Subject,
    text: "验证码为:" + verificationCode
  }
  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) res.status(400).send(error.message);
    else {
      res.status(200).send(verificationCode);
    }
  })

})

function getVerificationCode() {
  const letter = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let verificationCode = "";
  for (let i = 0; i < 4; i++) {
    let randomNum = getRandomNumber();
    verificationCode += letter[randomNum];
  }
  return verificationCode;
};

function getRandomNumber() {
  return Math.floor(Math.random() * 36);
};

function getEleToken(manager) {
  return jwt.sign({
    _id: manager._id,
    userName: manager.userName,
    avatar: manager.avatar,
    email: manager.email,
    cellphone: manager.cellphone
  }, resource.TokenPrivateKey, {
    expiresIn: '1h'
  });
}

function getIsRight(password, hash) {
  bcrypt.compareSync(password, hash, (error, right) => {
    if (right) return true;
    return false;
  })
}
module.exports = Router;