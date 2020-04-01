const express = require('express');
const Router = express.Router();

Router.get('/', async (req, res, next) => {
    res.status(200).send({
        msg: "success"
    });
})
Router.post('/leaveMessage',async(req,res,next)=>{
    const message = req.body;
    console.log(message);
    
    res.status(200).send({msg:"success"});
})

module.exports = Router;