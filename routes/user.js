'use strict'

const express = require('express');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checker = require('../helpers/checker')

/* GET users listing. */
router.post('/register', function(req, res, next){
  let retypepassword = req.body.retypepassword;
  let password = req.body.password;
  let email = req.body.email;

  if(!(email && password && retypepassword)){
  return res.json({success: false, message: 'Authentication failed. Make sure you input the email and password.'});
}else if(password != retypepassword){
    return res.json({success: false, message: 'Authentication failed. Make sure you write the same password.'});
  }
  var user = new User({
  email: email,
  password: password
})
user.save(function(err, user){
      if(err) throw err;
      let token = jwt.sign({id: user._id, email: user.email}, config.secretkey, {
        expiresIn: 86400 //seharian
      })
      res.json({
        data: {id: user._id, email: user.email},
        token: token
      })
    })
})

router.post('/login', function(req, res, next) {
  User.findOne({
    email: req.body.email
  }, function(err, user){
    if(err) throw err;
    if(!user){
      res.json({success: false, message: 'Authentication failed. User is not found.'});
    }else if(user){
      if(user.password != req.body.password){
        res.json({success: false, message: 'Authentication failed. Wrong password.'});
      }else{
        let token = jwt.sign({id: user._id, email: user.email}, config.secretkey, {
          expiresIn: 86400 //seharian
        })
        res.json({
          data: {id: user._id, email: user.email},
          token: token
        })
      }
    }
  })
});

router.get('/:id', checker, function(req, res){
  User.findById(req.params.id, function(err, data){
      if(err){
        console.error(err);
      }
      res.json(data);
  })
})
module.exports = router;
