const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

router.post('/register',async(req,res)=>{
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist){
        return res.status(400).send('Email already exist');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name : req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        let savedUser = await user.save();
        res.send(savedUser)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post('/login',async(req,res)=>{
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Email or Password is wrong');
    }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
        return res.status(400).send('Email or Password is wrong')
    }

    // create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token)
   res.send(token)
})
router.post('/test',verify,(req,res)=>{
    res.json({
        posts:{
            title:'title is test',
            description: 'descirpt is some thi'
        }
    })
})
router.get('/test',verify,(req,res)=>{
    res.json('i am testing it');
})
module.exports = router;